"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineService = void 0;
const VariantUpload_1 = require("../models/VariantUpload");
const Diplotype_1 = require("../models/Diplotype");
const Phenotype_1 = require("../models/Phenotype");
const DrugRisk_1 = require("../models/DrugRisk");
const DiplotypeService_1 = require("./DiplotypeService");
const PhenotypeService_1 = require("./PhenotypeService");
const DrugRiskService_1 = require("./DrugRiskService");
const ReportService_1 = require("./ReportService");
class PipelineService {
    constructor() {
        this.diplotypeService = new DiplotypeService_1.DiplotypeService();
        this.phenotypeService = new PhenotypeService_1.PhenotypeService();
        this.drugRiskService = new DrugRiskService_1.DrugRiskService();
        this.reportService = new ReportService_1.ReportService();
    }
    /**
     * Execute full pipeline: Variants → Diplotypes → Phenotypes → Drug Risks → Report (optional)
     * @param uploadId - The upload ID
     * @param generateReport - Whether to generate AI report (default: false)
     */
    async executePipeline(uploadId, generateReport = false) {
        console.log(`[PipelineService] Starting full pipeline for uploadId: ${uploadId}`);
        try {
            // Step 1: Get variant upload
            console.log(`[PipelineService] Step 1: Retrieving variant upload...`);
            const variantUpload = await VariantUpload_1.VariantUpload.findOne({ uploadId });
            if (!variantUpload) {
                throw new Error(`Variant upload not found for uploadId: ${uploadId}`);
            }
            console.log(`[PipelineService] ✓ Found ${variantUpload.variants.length} variants`);
            // Step 2: Process diplotypes
            console.log(`[PipelineService] Step 2: Processing diplotypes...`);
            const diplotypes = this.diplotypeService.processDiplotypes(variantUpload.variants, variantUpload.sampleId);
            console.log(`[PipelineService] ✓ Generated ${diplotypes.length} diplotypes`);
            // Save diplotypes
            let diplotypeRecord = await Diplotype_1.Diplotype.findOne({ uploadId });
            if (diplotypeRecord) {
                diplotypeRecord.diplotypes = diplotypes;
                await diplotypeRecord.save();
            }
            else {
                diplotypeRecord = new Diplotype_1.Diplotype({
                    uploadId,
                    sampleId: variantUpload.sampleId,
                    diplotypes,
                });
                await diplotypeRecord.save();
            }
            // Step 3: Process phenotypes
            console.log(`[PipelineService] Step 3: Processing phenotypes...`);
            const phenotypes = this.phenotypeService.convertDiplotypesToPhenotypes(diplotypes);
            console.log(`[PipelineService] ✓ Generated ${phenotypes.length} phenotypes`);
            // Save phenotypes
            let phenotypeRecord = await Phenotype_1.Phenotype.findOne({ uploadId });
            if (phenotypeRecord) {
                phenotypeRecord.phenotypes = phenotypes;
                await phenotypeRecord.save();
            }
            else {
                phenotypeRecord = new Phenotype_1.Phenotype({
                    uploadId,
                    sampleId: variantUpload.sampleId,
                    phenotypes,
                });
                await phenotypeRecord.save();
            }
            // Step 4: Process drug risks
            console.log(`[PipelineService] Step 4: Processing drug risks...`);
            const selectedDrugs = variantUpload.selectedDrugs;
            if (selectedDrugs && selectedDrugs.length > 0) {
                console.log(`[PipelineService] Filtering for ${selectedDrugs.length} selected drugs: ${selectedDrugs.join(', ')}`);
            }
            const geneDrugRisks = this.drugRiskService.processDrugRisks(phenotypes, selectedDrugs);
            console.log(`[PipelineService] ✓ Generated ${geneDrugRisks.length} gene-drug risk groups`);
            // Save drug risks
            let drugRiskRecord = await DrugRisk_1.DrugRiskModel.findOne({ uploadId });
            if (drugRiskRecord) {
                drugRiskRecord.geneDrugRisks = geneDrugRisks;
                await drugRiskRecord.save();
            }
            else {
                drugRiskRecord = new DrugRisk_1.DrugRiskModel({
                    uploadId,
                    sampleId: variantUpload.sampleId,
                    geneDrugRisks,
                });
                await drugRiskRecord.save();
            }
            // Step 5: Generate AI report (optional)
            let report = undefined;
            if (generateReport) {
                console.log(`[PipelineService] Step 5: Generating AI report...`);
                try {
                    report = await this.reportService.generateReport(uploadId);
                    console.log(`[PipelineService] ✓ AI report generated successfully`);
                }
                catch (reportError) {
                    console.error(`[PipelineService] Report generation failed (continuing): ${reportError instanceof Error ? reportError.message : String(reportError)}`);
                    // Don't fail the entire pipeline if report generation fails
                }
            }
            console.log(`[PipelineService] ✓ Pipeline completed successfully`);
            // Return unified result
            return {
                uploadId,
                sampleId: variantUpload.sampleId,
                variantCount: variantUpload.variants.length,
                diplotypes: diplotypes.map((d) => ({
                    gene: d.gene,
                    allele1: d.allele1,
                    allele2: d.allele2,
                    diplotype: d.diplotype,
                })),
                phenotypes: phenotypes.map((p) => ({
                    gene: p.gene,
                    diplotype: p.diplotype,
                    phenotype: p.phenotype,
                })),
                drugRisks: geneDrugRisks.map((g) => ({
                    gene: g.gene,
                    phenotype: g.phenotype,
                    drugs: g.drugs.map((d) => ({
                        drug: d.drug,
                        risk: d.risk,
                        severity: d.severity,
                        recommendation: d.recommendation,
                    })),
                })),
                report,
                timestamp: new Date(),
            };
        }
        catch (error) {
            console.error(`[PipelineService] Pipeline failed: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
    /**
     * Get complete pipeline result for an upload
     */
    async getPipelineResult(uploadId) {
        console.log(`[PipelineService] Retrieving pipeline result for uploadId: ${uploadId}`);
        const variantUpload = await VariantUpload_1.VariantUpload.findOne({ uploadId });
        if (!variantUpload) {
            return null;
        }
        const diplotypes = await Diplotype_1.Diplotype.findOne({ uploadId });
        const phenotypes = await Phenotype_1.Phenotype.findOne({ uploadId });
        const drugRisks = await DrugRisk_1.DrugRiskModel.findOne({ uploadId });
        return {
            uploadId,
            sampleId: variantUpload.sampleId,
            variantCount: variantUpload.variants.length,
            diplotypes: diplotypes?.diplotypes || [],
            phenotypes: phenotypes?.phenotypes || [],
            drugRisks: drugRisks?.geneDrugRisks || [],
            timestamp: new Date(),
        };
    }
    /**
     * Check pipeline completion status
     */
    async getPipelineStatus(uploadId) {
        const variantUpload = await VariantUpload_1.VariantUpload.findOne({ uploadId });
        const diplotypes = await Diplotype_1.Diplotype.findOne({ uploadId });
        const phenotypes = await Phenotype_1.Phenotype.findOne({ uploadId });
        const drugRisks = await DrugRisk_1.DrugRiskModel.findOne({ uploadId });
        const status = {
            uploadId,
            variants: {
                completed: !!variantUpload,
                count: variantUpload?.variants.length || 0,
            },
            diplotypes: {
                completed: !!diplotypes,
                count: diplotypes?.diplotypes.length || 0,
            },
            phenotypes: {
                completed: !!phenotypes,
                count: phenotypes?.phenotypes.length || 0,
            },
            drugRisks: {
                completed: !!drugRisks,
                count: drugRisks?.geneDrugRisks.length || 0,
            },
            allComplete: !!(variantUpload && diplotypes && phenotypes && drugRisks),
        };
        return status;
    }
}
exports.PipelineService = PipelineService;
//# sourceMappingURL=PipelineService.js.map