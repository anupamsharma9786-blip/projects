import { Request, Response } from 'express';
import { PipelineService } from '../services/PipelineService';

const pipelineService = new PipelineService();

export class PipelineController {
  /**
   * Execute complete pipeline: VCF → Diplotypes → Phenotypes → Drug Risks → Report (optional)
   * Query param: ?generateReport=true to automatically generate AI report
   */
  async processPipeline(req: Request, res: Response): Promise<void> {
    try {
      const { uploadId } = req.params;
      const generateReport = req.query.generateReport === 'true';

      if (!uploadId) {
        res.status(400).json({ error: 'uploadId is required' });
        return;
      }

      console.log(
        `[PipelineController] Processing complete pipeline for uploadId: ${uploadId}${generateReport ? ' with AI report' : ''}`
      );

      const result = await pipelineService.executePipeline(uploadId, generateReport);

      const message = generateReport
        ? 'Complete pipeline processed successfully (including AI report)'
        : 'Complete pipeline processed successfully';

      res.status(200).json({
        success: true,
        message,
        data: result,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[PipelineController] Pipeline error: ${errorMessage}`);
      res.status(500).json({
        error: 'Failed to process pipeline',
        details: errorMessage,
      });
    }
  }

  /**
   * Get complete pipeline result
   */
  async getPipelineResult(req: Request, res: Response): Promise<void> {
    try {
      const { uploadId } = req.params;

      if (!uploadId) {
        res.status(400).json({ error: 'uploadId is required' });
        return;
      }

      console.log(`[PipelineController] Retrieving pipeline result for uploadId: ${uploadId}`);

      const result = await pipelineService.getPipelineResult(uploadId);

      if (!result) {
        res.status(404).json({
          error: 'No data found for this upload',
          uploadId: uploadId,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[PipelineController] Error retrieving pipeline result: ${errorMessage}`);
      res.status(500).json({
        error: 'Failed to retrieve pipeline result',
        details: errorMessage,
      });
    }
  }

  /**
   * Get pipeline completion status
   */
  async getPipelineStatus(req: Request, res: Response): Promise<void> {
    try {
      const { uploadId } = req.params;

      if (!uploadId) {
        res.status(400).json({ error: 'uploadId is required' });
        return;
      }

      console.log(`[PipelineController] Checking pipeline status for uploadId: ${uploadId}`);

      const status = await pipelineService.getPipelineStatus(uploadId);

      res.status(200).json({
        success: true,
        data: status,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[PipelineController] Error checking pipeline status: ${errorMessage}`);
      res.status(500).json({
        error: 'Failed to check pipeline status',
        details: errorMessage,
      });
    }
  }
}
