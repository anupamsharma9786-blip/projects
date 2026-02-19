import { Request, Response } from 'express';
import { DiplotypeService } from '../services/DiplotypeService';
import { VariantUpload } from '../models/VariantUpload';
import { Diplotype } from '../models/Diplotype';
import { log } from 'console';

const diplotypeService = new DiplotypeService();

export class DiplotypeController {
  /**
   * Process variants and generate diplotypes for a specific upload
   */
  async processDiplotype(req: Request, res: Response): Promise<void> {
    try {
      const uploadId = req.params.uploadId;

      if (!uploadId) {
        res.status(400).json({ error: 'uploadId is required' });
        return;
      }

      console.log(`[DiplotypeController] Processing diplotypes for uploadId: ${uploadId}`);

      // Get the variant upload record
      const variantUpload = await VariantUpload.findOne({ uploadId });

      if (!variantUpload) {
        console.error(`[DiplotypeController] Upload record not found for uploadId: ${uploadId}`);
        res.status(404).json({ 
          error: 'Upload record not found',
          uploadId: uploadId,
          hint: 'Make sure you uploaded a VCF file first and got a valid uploadId. Check /api/uploads to see all available uploads.'
        });
        return;
      }

      console.log(`[DiplotypeController] Found upload record with ${variantUpload.variants.length} variants`);

      // Process diplotypes
      const diplotypes = diplotypeService.processDiplotypes(
        variantUpload.variants,
        variantUpload.sampleId
      );

      // Save diplotypes to database
      let diplotypeRecord = await Diplotype.findOne({ uploadId });

      if (diplotypeRecord) {
        // Update existing record
        diplotypeRecord.diplotypes = diplotypes;
        await diplotypeRecord.save();
      } else {
        // Create new record
        diplotypeRecord = new Diplotype({
          uploadId,
          sampleId: variantUpload.sampleId,
          diplotypes,
        });
        await diplotypeRecord.save();
      }

      res.status(200).json({
        success: true,
        message: 'Diplotypes processed successfully',
        data: {
          uploadId,
          sampleId: variantUpload.sampleId,
          variantCount: variantUpload.variants.length,
          diplotypes: diplotypes.map((d) => ({
            gene: d.gene,
            allele1: d.allele1,
            allele2: d.allele2,
            diplotype: d.diplotype,
            matchedVariants: d.matchedVariants?.length || 0,
          })),
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[DiplotypeController] Error processing diplotypes: ${errorMessage}`);
      res.status(500).json({
        error: 'Failed to process diplotypes',
        details: errorMessage,
      });
    }
  }

  /**
   * Get diplotypes for a specific upload
   */
  async getDiplotypes(req: Request, res: Response): Promise<void> {
    try {
      const { uploadId } = req.params;

      if (!uploadId) {
        res.status(400).json({ error: 'uploadId is required' });
        return;
      }

      const diplotypeRecord = await Diplotype.findOne({ uploadId });

      if (!diplotypeRecord) {
        res.status(404).json({ error: 'No diplotype data found for this upload' });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          uploadId,
          sampleId: diplotypeRecord.sampleId,
          diplotypes: diplotypeRecord.diplotypes.map((d) => ({
            gene: d.gene,
            allele1: d.allele1,
            allele2: d.allele2,
            diplotype: d.diplotype,
            matchedVariants: d.matchedVariants || [],
          })),
          createdAt: diplotypeRecord.createdAt,
          updatedAt: diplotypeRecord.updatedAt,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({
        error: 'Failed to retrieve diplotypes',
        details: errorMessage,
      });
    }
  }

  /**
   * Get supported genes for diplotype prediction
   */
  async getSupportedGenes(req: Request, res: Response): Promise<void> {
    try {
      const genes = diplotypeService.getSupportedGenes();

      res.status(200).json({
        success: true,
        data: {
          supportedGenes: genes,
          total: genes.length,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({
        error: 'Failed to retrieve supported genes',
        details: errorMessage,
      });
    }
  }
}
