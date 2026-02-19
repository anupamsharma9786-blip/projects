import { VariantUpload } from '../models/VariantUpload';
import { Diplotype } from '../models/Diplotype';
import { Phenotype } from '../models/Phenotype';
import { DrugRiskModel } from '../models/DrugRisk';
import { DiplotypeService } from './DiplotypeService';
import { PhenotypeService } from './PhenotypeService';
import { DrugRiskService } from './DrugRiskService';
import { ReportService } from './ReportService';

export interface PipelineResult {
  uploadId: string;
  sampleId: string;
  variantCount: number;
  diplotypes: any[];
  phenotypes: any[];
  drugRisks: any[];
  report?: any;
  timestamp: Date;
}

export class PipelineService {
  private diplotypeService: DiplotypeService;
  private phenotypeService: PhenotypeService;
  private drugRiskService: DrugRiskService;
  private reportService: ReportService;

  constructor() {
    this.diplotypeService = new DiplotypeService();
    this.phenotypeService = new PhenotypeService();
    this.drugRiskService = new DrugRiskService();
    this.reportService = new ReportService();
  }

  /**
   * Execute full pipeline: Variants → Diplotypes → Phenotypes → Drug Risks → Report (optional)
   * @param uploadId - The upload ID
   * @param generateReport - Whether to generate AI report (default: false)
   */
  async executePipeline(uploadId: string, generateReport: boolean = false): Promise<PipelineResult> {
    console.log(`[PipelineService] Starting full pipeline for uploadId: ${uploadId}`);

    try {
      // Step 1: Get variant upload
      console.log(`[PipelineService] Step 1: Retrieving variant upload...`);
      const variantUpload = await VariantUpload.findOne({ uploadId });
      if (!variantUpload) {
        throw new Error(`Variant upload not found for uploadId: ${uploadId}`);
      }
      console.log(
        `[PipelineService] ✓ Found ${variantUpload.variants.length} variants`
      );

      // Step 2: Process diplotypes
      console.log(`[PipelineService] Step 2: Processing diplotypes...`);
      const diplotypes = this.diplotypeService.processDiplotypes(
        variantUpload.variants,
        variantUpload.sampleId
      );
      console.log(`[PipelineService] ✓ Generated ${diplotypes.length} diplotypes`);

      // Save diplotypes
      let diplotypeRecord = await Diplotype.findOne({ uploadId });
      if (diplotypeRecord) {
        diplotypeRecord.diplotypes = diplotypes;
        await diplotypeRecord.save();
      } else {
        diplotypeRecord = new Diplotype({
          uploadId,
          sampleId: variantUpload.sampleId,
          diplotypes,
        });
        await diplotypeRecord.save();
      }

      // Step 3: Process phenotypes
      console.log(`[PipelineService] Step 3: Processing phenotypes...`);
      const phenotypes = this.phenotypeService.convertDiplotypesToPhenotypes(
        diplotypes
      );
      console.log(`[PipelineService] ✓ Generated ${phenotypes.length} phenotypes`);

      // Save phenotypes
      let phenotypeRecord = await Phenotype.findOne({ uploadId });
      if (phenotypeRecord) {
        phenotypeRecord.phenotypes = phenotypes;
        await phenotypeRecord.save();
      } else {
        phenotypeRecord = new Phenotype({
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
      let drugRiskRecord = await DrugRiskModel.findOne({ uploadId });
      if (drugRiskRecord) {
        drugRiskRecord.geneDrugRisks = geneDrugRisks;
        await drugRiskRecord.save();
      } else {
        drugRiskRecord = new DrugRiskModel({
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
        } catch (reportError) {
          console.error(
            `[PipelineService] Report generation failed (continuing): ${reportError instanceof Error ? reportError.message : String(reportError)}`
          );
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
    } catch (error) {
      console.error(
        `[PipelineService] Pipeline failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  }

  /**
   * Get complete pipeline result for an upload
   */
  async getPipelineResult(uploadId: string): Promise<PipelineResult | null> {
    console.log(`[PipelineService] Retrieving pipeline result for uploadId: ${uploadId}`);

    const variantUpload = await VariantUpload.findOne({ uploadId });
    if (!variantUpload) {
      return null;
    }

    const diplotypes = await Diplotype.findOne({ uploadId });
    const phenotypes = await Phenotype.findOne({ uploadId });
    const drugRisks = await DrugRiskModel.findOne({ uploadId });

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
  async getPipelineStatus(uploadId: string): Promise<{
    uploadId: string;
    variants: { completed: boolean; count: number };
    diplotypes: { completed: boolean; count: number };
    phenotypes: { completed: boolean; count: number };
    drugRisks: { completed: boolean; count: number };
    allComplete: boolean;
  }> {
    const variantUpload = await VariantUpload.findOne({ uploadId });
    const diplotypes = await Diplotype.findOne({ uploadId });
    const phenotypes = await Phenotype.findOne({ uploadId });
    const drugRisks = await DrugRiskModel.findOne({ uploadId });

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
