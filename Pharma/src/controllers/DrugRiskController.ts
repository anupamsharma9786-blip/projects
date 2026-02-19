import { Request, Response } from 'express';
import { DrugRiskService } from '../services/DrugRiskService';
import { Phenotype } from '../models/Phenotype';
import { DrugRiskModel } from '../models/DrugRisk';
import { VariantUpload } from '../models/VariantUpload';

const drugRiskService = new DrugRiskService();

export class DrugRiskController {
  /**
   * Process phenotypes and generate drug risks for a specific upload
   */
  async processDrugRisk(req: Request, res: Response): Promise<void> {
    try {
      const { uploadId } = req.params;

      if (!uploadId) {
        res.status(400).json({ error: 'uploadId is required' });
        return;
      }

      console.log(`[DrugRiskController] Processing drug risks for uploadId: ${uploadId}`);

      // Get the phenotype record
      const phenotypeRecord = await Phenotype.findOne({ uploadId });

      if (!phenotypeRecord) {
        console.error(
          `[DrugRiskController] Phenotype record not found for uploadId: ${uploadId}`
        );
        res.status(404).json({
          error: 'Phenotype record not found',
          uploadId: uploadId,
          hint: 'Please process phenotypes first using POST /api/process-phenotype/:uploadId',
        });
        return;
      }

      console.log(
        `[DrugRiskController] Found phenotype record with ${phenotypeRecord.phenotypes.length} genes`
      );

      // Get selected drugs from variant upload
      const variantUpload = await VariantUpload.findOne({ uploadId });
      const selectedDrugs = variantUpload?.selectedDrugs;
      
      if (selectedDrugs && selectedDrugs.length > 0) {
        console.log(`[DrugRiskController] Filtering for ${selectedDrugs.length} selected drugs:`, selectedDrugs);
      }

      // Process drug risks
      const geneDrugRisks = drugRiskService.processDrugRisks(
        phenotypeRecord.phenotypes,
        selectedDrugs
      );

      // Save drug risks to database
      let drugRiskRecord = await DrugRiskModel.findOne({ uploadId });

      if (drugRiskRecord) {
        // Update existing record
        drugRiskRecord.geneDrugRisks = geneDrugRisks;
        await drugRiskRecord.save();
      } else {
        // Create new record
        drugRiskRecord = new DrugRiskModel({
          uploadId,
          sampleId: phenotypeRecord.sampleId,
          geneDrugRisks,
        });
        await drugRiskRecord.save();
      }

      res.status(200).json({
        success: true,
        message: 'Drug risks processed successfully',
        data: {
          uploadId,
          sampleId: phenotypeRecord.sampleId,
          totalGenes: geneDrugRisks.length,
          totalDrugs: geneDrugRisks.reduce((sum, g) => sum + g.drugs.length, 0),
          geneDrugRisks: geneDrugRisks.map((g) => ({
            gene: g.gene,
            phenotype: g.phenotype,
            drugs: g.drugs.map((d) => ({
              drug: d.drug,
              risk: d.risk,
              severity: d.severity,
            })),
          })),
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[DrugRiskController] Error processing drug risks: ${errorMessage}`);
      res.status(500).json({
        error: 'Failed to process drug risks',
        details: errorMessage,
      });
    }
  }

  /**
   * Get drug risks for a specific upload
   */
  async getDrugRisks(req: Request, res: Response): Promise<void> {
    try {
      const { uploadId } = req.params;

      if (!uploadId) {
        res.status(400).json({ error: 'uploadId is required' });
        return;
      }

      const drugRiskRecord = await DrugRiskModel.findOne({ uploadId });

      if (!drugRiskRecord) {
        res.status(404).json({
          error: 'No drug risk data found for this upload',
          hint: 'Please process drug risks first using POST /api/process-drug-risk/:uploadId',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          uploadId,
          sampleId: drugRiskRecord.sampleId,
          geneDrugRisks: drugRiskRecord.geneDrugRisks,
          createdAt: drugRiskRecord.createdAt,
          updatedAt: drugRiskRecord.updatedAt,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({
        error: 'Failed to retrieve drug risks',
        details: errorMessage,
      });
    }
  }

  /**
   * Get all available drugs and their genes
   */
  async getDrugCatalog(req: Request, res: Response): Promise<void> {
    try {
      const allDrugs = drugRiskService.getAllDrugs();
      const genesWithDrugs = drugRiskService.getSupportedGenesWithDrugs();
      const geneInfo = genesWithDrugs.map((gene) => ({
        gene,
        drugs: drugRiskService.getDrugsForGene(gene),
      }));

      res.status(200).json({
        success: true,
        data: {
          totalDrugs: allDrugs.length,
          allDrugs: allDrugs,
          geneInfo: geneInfo,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({
        error: 'Failed to retrieve drug catalog',
        details: errorMessage,
      });
    }
  }

  /**
   * Get drug risks by severity level
   */
  async getDrugRisksBySeverity(req: Request, res: Response): Promise<void> {
    try {
      const { uploadId } = req.params;
      const { severity } = req.query;

      if (!uploadId) {
        res.status(400).json({ error: 'uploadId is required' });
        return;
      }

      const drugRiskRecord = await DrugRiskModel.findOne({ uploadId });

      if (!drugRiskRecord) {
        res.status(404).json({ error: 'No drug risk data found for this upload' });
        return;
      }

      // Filter by severity if provided
      let filtered = drugRiskRecord.geneDrugRisks;
      if (severity) {
        filtered = filtered.map((g) => ({
          ...g,
          drugs: g.drugs.filter((d) => d.severity === severity),
        })).filter((g) => g.drugs.length > 0);
      }

      res.status(200).json({
        success: true,
        data: {
          uploadId,
          sampleId: drugRiskRecord.sampleId,
          severity: severity || 'all',
          geneDrugRisks: filtered,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({
        error: 'Failed to retrieve drug risks by severity',
        details: errorMessage,
      });
    }
  }
}
