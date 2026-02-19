"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const openai_1 = __importDefault(require("openai"));
const Report_1 = require("../models/Report");
const DrugRisk_1 = require("../models/DrugRisk");
const VariantUpload_1 = require("../models/VariantUpload");
const Diplotype_1 = require("../models/Diplotype");
class ReportService {
    constructor() {
        this.openai = null;
        // Initialize OpenAI client lazily when needed
    }
    /**
     * Get or initialize OpenAI client
     */
    getOpenAIClient() {
        if (!this.openai) {
            const apiKey = process.env.OPENAI_API_KEY;
            if (!apiKey) {
                throw new Error('OPENAI_API_KEY environment variable is not set. Please add it to your .env file.');
            }
            this.openai = new openai_1.default({ apiKey });
        }
        return this.openai;
    }
    /**
     * Generate AI-powered report for drug risks
     */
    async generateReport(uploadId) {
        console.log(`[ReportService] Generating report for uploadId: ${uploadId}`);
        // Get variant upload
        const variantUpload = await VariantUpload_1.VariantUpload.findOne({ uploadId });
        if (!variantUpload) {
            throw new Error(`Variant upload not found for uploadId: ${uploadId}`);
        }
        // Get drug risks
        const drugRisks = await DrugRisk_1.DrugRiskModel.findOne({ uploadId });
        if (!drugRisks) {
            throw new Error(`Drug risks not found for uploadId: ${uploadId}. Process pipeline first.`);
        }
        // Get diplotypes
        const diplotypeData = await Diplotype_1.Diplotype.findOne({ uploadId });
        console.log(`[ReportService] Found ${drugRisks.geneDrugRisks.length} gene-drug risk groups`);
        // Generate detailed report in new format
        const detailedReports = [];
        for (const geneDrugRisk of drugRisks.geneDrugRisks) {
            // Find diplotype for this gene
            const diplotype = diplotypeData?.diplotypes.find(d => d.gene === geneDrugRisk.gene);
            for (const drug of geneDrugRisk.drugs) {
                console.log(`[ReportService] Generating report for ${drug.drug} (${geneDrugRisk.gene})`);
                // Generate explanation
                const explanation = await this.generateExplanation(geneDrugRisk.gene, geneDrugRisk.phenotype, drug.drug, drug.recommendation, drug.risk, drug.severity);
                // Generate dosage adjustment suggestions based on phenotype
                const dosageAdjustment = this.generateDosageSuggestion(geneDrugRisk.phenotype, drug.drug, drug.recommendation);
                // Analyze phenotype risk and get enhanced severity assessment
                const riskAnalysis = this.analyzePhenotypeRisk(geneDrugRisk.phenotype, drug.severity, drug.risk);
                // Build detailed report entry
                const detailedReport = {
                    patient_id: variantUpload.sampleId,
                    drug: drug.drug,
                    timestamp: new Date().toISOString(),
                    risk_assessment: {
                        risk_label: this.getRiskLabel(riskAnalysis.analyzedSeverity, drug.recommendation),
                        confidence_score: riskAnalysis.confidenceScore,
                        severity: riskAnalysis.analyzedSeverity
                    },
                    pharmacogenomic_profile: {
                        primary_gene: geneDrugRisk.gene,
                        diplotype: diplotype?.diplotype || 'Unknown',
                        phenotype: geneDrugRisk.phenotype,
                        detected_variants: diplotype?.matchedVariants || []
                    },
                    clinical_recommendation: {
                        recommendation: drug.recommendation,
                        risk_description: drug.risk,
                        dosage_adjustment: dosageAdjustment
                    },
                    llm_generated_explanation: {
                        summary: explanation.explanation,
                        disclaimer: explanation.disclaimer
                    },
                    quality_metrics: {
                        vcf_parsing_success: true,
                        variant_count: variantUpload.variants.length,
                        genes_analyzed: drugRisks.geneDrugRisks.length
                    }
                };
                detailedReports.push(detailedReport);
            }
        }
        // Also generate the legacy format for compatibility
        const geneReports = [];
        for (const geneDrugRisk of drugRisks.geneDrugRisks) {
            for (const drug of geneDrugRisk.drugs) {
                const explanation = await this.generateExplanation(geneDrugRisk.gene, geneDrugRisk.phenotype, drug.drug, drug.recommendation, drug.risk, drug.severity);
                geneReports.push({
                    gene: geneDrugRisk.gene,
                    phenotype: geneDrugRisk.phenotype,
                    drug: drug.drug,
                    recommendation: drug.recommendation,
                    explanation: explanation.explanation,
                    disclaimer: explanation.disclaimer,
                });
            }
        }
        // Generate overall summary
        console.log(`[ReportService] Generating overall summary`);
        const summary = await this.generateSummary(geneReports);
        // Save report to database (legacy format)
        let report = await Report_1.Report.findOne({ uploadId });
        if (report) {
            report.summary = summary;
            report.geneReports = geneReports;
            await report.save();
        }
        else {
            report = new Report_1.Report({
                uploadId,
                sampleId: variantUpload.sampleId,
                summary,
                geneReports,
            });
            await report.save();
        }
        console.log(`[ReportService] ✓ Report generated and saved`);
        // Return both formats
        return {
            uploadId,
            sampleId: variantUpload.sampleId,
            summary,
            geneReports,
            detailedReports, // New format
            createdAt: report.createdAt,
            updatedAt: report.updatedAt,
        };
    }
    /**
     * Get risk label from severity and recommendation
     */
    getRiskLabel(severity, recommendation) {
        const rec = recommendation.toLowerCase();
        const sev = severity.toLowerCase();
        if (sev === 'critical' || rec.includes('avoid') || rec.includes('contraindicated') || rec.includes('not recommended')) {
            return 'Toxic/Avoid';
        }
        else if (sev === 'high' || rec.includes('reduce') || rec.includes('adjust')) {
            return 'Adjust Dosage';
        }
        else if (sev === 'moderate' || rec.includes('monitor') || rec.includes('caution') || rec.includes('consider')) {
            return 'Use with Caution';
        }
        else if (sev === 'low' || rec.includes('standard')) {
            return 'Safe';
        }
        return 'Evaluate';
    }
    /**
     * Generate dosage adjustment suggestions based on phenotype
     */
    generateDosageSuggestion(phenotype, drug, recommendation) {
        const phenotypeLower = phenotype.toLowerCase();
        const recLower = recommendation.toLowerCase();
        // Check if recommendation already suggests avoidance
        if (recLower.includes('avoid') || recLower.includes('contraindicated') || recLower.includes('not recommended')) {
            return `${drug} should be AVOIDED or used only with extreme caution and close medical supervision. Consider alternative medications.`;
        }
        // Generate dosage suggestions based on phenotype
        let dosageSuggestion = '';
        if (phenotypeLower.includes('poor')) {
            // Poor metabolizers accumulate the drug - reduce dose significantly
            dosageSuggestion = `For Poor Metabolizers: ${drug} metabolism is severely impaired. Standard dosing may lead to dangerous drug accumulation. \n• Recommended: Reduce dose by 50-75% of standard dose, or use alternative medication\n• Monitoring: Frequent plasma concentration monitoring is essential\n• Frequency: May require less frequent dosing`;
        }
        else if (phenotypeLower.includes('intermediate')) {
            // Intermediate metabolizers have reduced metabolism - slight dose reduction
            dosageSuggestion = `For Intermediate Metabolizers: ${drug} metabolism is reduced. \n• Recommended: Consider 25-50% dose reduction from standard dose\n• Monitoring: Therapeutic drug monitoring recommended\n• Frequency: Standard frequency may be appropriate, monitor response`;
        }
        else if (phenotypeLower.includes('ultra-rapid')) {
            // Ultra-rapid metabolizers - significantly increase dose
            dosageSuggestion = `For Ultra-Rapid Metabolizers: ${drug} is metabolized very quickly. Standard dosing may be ineffective. \n• Recommended: Increase dose by 50-100% above standard dose, or increase dosing frequency\n• Monitoring: Watch for inadequate therapeutic response\n• Frequency: May require more frequent dosing`;
        }
        else if (phenotypeLower.includes('rapid')) {
            // Rapid metabolizers - slight dose increase
            dosageSuggestion = `For Rapid Metabolizers: ${drug} is metabolized faster than average. \n• Recommended: Consider 25-50% dose increase from standard dose\n• Monitoring: Ensure adequate therapeutic response\n• Frequency: May benefit from more frequent dosing`;
        }
        else if (phenotypeLower.includes('normal')) {
            // Normal metabolizers - standard dosing
            dosageSuggestion = `For Normal Metabolizers: ${drug} can be dosed according to standard clinical guidelines. \n• Recommended: Standard dose as per prescribing information\n• Monitoring: Monitor for therapeutic response and side effects\n• Frequency: Standard dosing frequency`;
        }
        else if (phenotypeLower.includes('unknown')) {
            // Unknown phenotype - caution
            dosageSuggestion = `Phenotype is Unknown: ${drug} metabolism cannot be predicted. \n• Recommended: Start with standard dose and carefully monitor response\n• Monitoring: Close clinical and laboratory monitoring essential\n• Adjustment: Be prepared to adjust dose based on individual response`;
        }
        return dosageSuggestion || `Standard dosing recommended for ${drug}. Monitor for therapeutic response and side effects.`;
    }
    /**
     * Analyze phenotype and calculate risk score
     */
    analyzePhenotypeRisk(phenotype, severity, risk) {
        const phenotypeLower = phenotype.toLowerCase();
        const riskLower = risk.toLowerCase();
        // Assess phenotype severity
        let phenotypeSeverity = 0; // 0-100 scale
        if (phenotypeLower.includes('poor')) {
            phenotypeSeverity = 90; // High risk - poor metabolizer
        }
        else if (phenotypeLower.includes('ultra-rapid')) {
            phenotypeSeverity = 85; // High risk - ultra-rapid metabolizer
        }
        else if (phenotypeLower.includes('intermediate')) {
            phenotypeSeverity = 60; // Moderate risk - intermediate metabolizer
        }
        else if (phenotypeLower.includes('rapid')) {
            phenotypeSeverity = 55; // Moderate risk - rapid metabolizer
        }
        else if (phenotypeLower.includes('normal')) {
            phenotypeSeverity = 20; // Low risk - normal metabolizer
        }
        else if (phenotypeLower.includes('unknown') || phenotypeLower.includes('indeterminate')) {
            phenotypeSeverity = 40; // Moderate risk - unknown phenotype
        }
        // Check risk description for severity keywords
        let riskModifier = 0;
        if (riskLower.includes('contraindicated') || riskLower.includes('avoid')) {
            riskModifier = 40;
        }
        else if (riskLower.includes('significant') || riskLower.includes('increased') || riskLower.includes('decreased')) {
            riskModifier = 25;
        }
        else if (riskLower.includes('potential')) {
            riskModifier = 10;
        }
        // Combine scores
        const combinedScore = phenotypeSeverity + riskModifier;
        let analyzedSeverity = severity;
        let confidence = 0.75;
        // Override severity based on combined analysis
        if (combinedScore >= 80) {
            analyzedSeverity = 'critical';
            confidence = 0.95;
        }
        else if (combinedScore >= 60) {
            analyzedSeverity = 'high';
            confidence = 0.90;
        }
        else if (combinedScore >= 40) {
            analyzedSeverity = 'moderate';
            confidence = 0.85;
        }
        else {
            analyzedSeverity = 'low';
            confidence = 0.70;
        }
        return {
            analyzedSeverity,
            confidenceScore: confidence
        };
    }
    /**
     * Generate explanation for a single drug-gene interaction
     */
    async generateExplanation(gene, phenotype, drug, recommendation, risk, severity) {
        const prompt = `You are a pharmacogenomics expert. Provide a simple, patient-friendly explanation for the following drug-gene interaction:

Gene: ${gene}
Phenotype: ${phenotype}
Drug: ${drug}
Risk: ${risk}
Severity: ${severity}
Recommendation: ${recommendation}

Provide:
1. A clear, simple explanation (2-3 sentences) of why this matters for the patient
2. A brief medical disclaimer (1 sentence)

Format your response as JSON:
{
  "explanation": "...",
  "disclaimer": "..."
}`;
        try {
            const openai = this.getOpenAIClient();
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 300,
            });
            const content = completion.choices[0]?.message?.content;
            if (!content) {
                throw new Error('No response from OpenAI');
            }
            // Parse JSON response
            const parsed = JSON.parse(content);
            return {
                explanation: parsed.explanation || 'No explanation available',
                disclaimer: parsed.disclaimer || 'This is not medical advice. Consult your healthcare provider.',
            };
        }
        catch (error) {
            console.error(`[ReportService] OpenAI error: ${error instanceof Error ? error.message : String(error)}`);
            // Fallback response
            return {
                explanation: `Your genetic variant in ${gene} (${phenotype}) may affect how you respond to ${drug}. ${recommendation}`,
                disclaimer: 'This is not medical advice. Always consult your healthcare provider before making any changes to your medication.',
            };
        }
    }
    /**
     * Generate overall summary of the report
     */
    async generateSummary(geneReports) {
        const criticalDrugs = geneReports.filter(r => r.recommendation.toLowerCase().includes('avoid') || r.recommendation.toLowerCase().includes('toxic'));
        const highRiskDrugs = geneReports.filter(r => r.recommendation.toLowerCase().includes('reduce') || r.recommendation.toLowerCase().includes('adjust'));
        const summaryPrompt = `You are a pharmacogenomics expert. Generate a brief summary (3-4 sentences) of the following pharmacogenomics analysis for a patient:

Total drugs analyzed: ${geneReports.length}
Critical/high-risk drugs: ${criticalDrugs.length + highRiskDrugs.length}

Drugs to avoid or use with extreme caution:
${criticalDrugs.map(r => `- ${r.drug} (${r.gene}): ${r.recommendation}`).join('\n')}

Drugs requiring dose adjustment:
${highRiskDrugs.map(r => `- ${r.drug} (${r.gene}): ${r.recommendation}`).join('\n')}

Provide a patient-friendly summary that highlights key findings without being alarmist.`;
        try {
            const openai = this.getOpenAIClient();
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: summaryPrompt }],
                temperature: 0.7,
                max_tokens: 200,
            });
            return completion.choices[0]?.message?.content || 'Pharmacogenomics report generated. Please review individual drug recommendations with your healthcare provider.';
        }
        catch (error) {
            console.error(`[ReportService] OpenAI summary error: ${error instanceof Error ? error.message : String(error)}`);
            // Fallback summary
            return `Your pharmacogenomics analysis covers ${geneReports.length} drug-gene interactions. ${criticalDrugs.length > 0 ? `Important: ${criticalDrugs.length} drug(s) may require special consideration.` : ''} Please review these results with your healthcare provider to optimize your medication plan.`;
        }
    }
    /**
     * Get existing report
     */
    async getReport(uploadId) {
        const report = await Report_1.Report.findOne({ uploadId });
        if (!report) {
            return null;
        }
        // Get selectedDrugs from variant upload
        const variantUpload = await VariantUpload_1.VariantUpload.findOne({ uploadId });
        return {
            uploadId: report.uploadId,
            sampleId: report.sampleId,
            selectedDrugs: variantUpload?.selectedDrugs,
            summary: report.summary,
            geneReports: report.geneReports,
            createdAt: report.createdAt,
            updatedAt: report.updatedAt,
        };
    }
}
exports.ReportService = ReportService;
//# sourceMappingURL=ReportService.js.map