import { Request, Response } from 'express';
import { VcfService } from '../services/VcfService';
import { VariantService } from '../services/VariantService';
import { PipelineService } from '../services/PipelineService';

const vcfService = new VcfService();
const variantService = new VariantService();
const pipelineService = new PipelineService();

export class VcfController {
  /**
   * Handles VCF file upload (automatically processes full pipeline by default)
   * Query params: 
   *   ?skipPipeline=true to only upload without processing
   *   ?generateReport=true to automatically generate AI report after pipeline
   */
  async uploadVcf(req: Request, res: Response): Promise<void> {
    try {
      // Check if file exists
      if (!req.file) {
        res.status(400).json({ error: 'No file provided' });
        return;
      }

      const file = req.file;
      // Pipeline runs automatically by default, unless explicitly disabled
      const skipPipeline = req.query.skipPipeline === 'true';
      const generateReport = req.query.generateReport === 'true';
      
      // Parse selected drugs from form data if provided
      let selectedDrugs: string[] | undefined;
      if (req.body.selectedDrugs) {
        try {
          selectedDrugs = JSON.parse(req.body.selectedDrugs);
        } catch (e) {
          console.warn('[VcfController] Failed to parse selectedDrugs, ignoring filter');
        }
      }

      // Validate file extension
      if (!vcfService.validateVcfFile(file.originalname)) {
        vcfService.deleteFile(file.path);
        res.status(400).json({ error: 'Only .vcf files are accepted' });
        return;
      }

      // Parse VCF file
      const { sampleId, variants } = await vcfService.parseVcfFile(file.path);

      // Save to database
      const uploadRecord = await variantService.saveVariantUpload({
        filename: file.originalname,
        sampleId,
        variants,
        selectedDrugs,
      });

      // Delete temporary file
      vcfService.deleteFile(file.path);

      // Execute full pipeline automatically (unless explicitly skipped)
      if (!skipPipeline) {
        console.log(
          `[VcfController] Executing full pipeline automatically for uploadId: ${uploadRecord.uploadId}${generateReport ? ' with AI report' : ''}`
        );
        try {
          const pipelineResult = await pipelineService.executePipeline(
            uploadRecord.uploadId,
            generateReport
          );

          const message = generateReport
            ? 'VCF file uploaded and full pipeline processed successfully (diplotypes → phenotypes → drug risks → AI report)'
            : 'VCF file uploaded and full pipeline processed successfully (diplotypes → phenotypes → drug risks)';

          res.status(201).json({
            success: true,
            message,
            data: {
              uploadId: uploadRecord.uploadId,
              filename: uploadRecord.filename,
              uploadDate: uploadRecord.uploadDate,
              sampleId: uploadRecord.sampleId,
              variantCount: uploadRecord.variants.length,
              pipelineResult: pipelineResult,
            },
          });
          return;
        } catch (pipelineError) {
          const errorMessage =
            pipelineError instanceof Error ? pipelineError.message : 'Unknown error';
          console.error(
            `[VcfController] Pipeline execution failed: ${errorMessage}`
          );

          res.status(201).json({
            success: true,
            message: 'VCF file uploaded but pipeline processing failed',
            data: {
              uploadId: uploadRecord.uploadId,
              filename: uploadRecord.filename,
              uploadDate: uploadRecord.uploadDate,
              sampleId: uploadRecord.sampleId,
              variantCount: uploadRecord.variants.length,
            },
            warning: {
              pipelineError: errorMessage,
              hint: 'You can retry pipeline processing using POST /api/process-all/:uploadId',
            },
          });
          return;
        }
      }

      // Response when pipeline is skipped
      res.status(201).json({
        success: true,
        message: 'VCF file uploaded (pipeline skipped)',
        data: {
          uploadId: uploadRecord.uploadId,
          filename: uploadRecord.filename,
          uploadDate: uploadRecord.uploadDate,
          sampleId: uploadRecord.sampleId,
          variantCount: uploadRecord.variants.length,
        },
        hint: 'Pipeline was skipped. To process later, use POST /api/process-all/:uploadId',
      });
    } catch (error) {
      // Clean up file on error
      if (req.file) {
        vcfService.deleteFile(req.file.path);
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({
        error: 'Failed to process VCF file',
        details: errorMessage,
      });
    }
  }

  /**
   * Retrieves variants by upload ID
   */
  async getVariants(req: Request, res: Response): Promise<void> {
    try {
      const { uploadId } = req.params;

      if (!uploadId) {
        res.status(400).json({ error: 'uploadId is required' });
        return;
      }

      const uploadRecord = await variantService.getVariantUpload(uploadId);

      if (!uploadRecord) {
        res.status(404).json({ error: 'Upload record not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          uploadId: uploadRecord.uploadId,
          filename: uploadRecord.filename,
          uploadDate: uploadRecord.uploadDate,
          sampleId: uploadRecord.sampleId,
          variants: uploadRecord.variants,
          variantCount: uploadRecord.variants.length,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({
        error: 'Failed to retrieve variants',
        details: errorMessage,
      });
    }
  }

  /**
   * Get all uploaded files (for debugging)
   */
  async getAllUploads(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      const { data, total } = await variantService.getAllVariantUploads(page, limit);

      res.status(200).json({
        success: true,
        data: {
          totalRecords: total,
          currentPage: page,
          pageSize: data.length,
          uploads: data.map((upload) => ({
            uploadId: upload.uploadId,
            filename: upload.filename,
            uploadDate: upload.uploadDate,
            sampleId: upload.sampleId,
            variantCount: upload.variants.length,
          })),
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({
        error: 'Failed to retrieve uploads',
        details: errorMessage,
      });
    }
  }}