import { Request, Response } from 'express';
import { ReportService } from '../services/ReportService';

const reportService = new ReportService();

export class ReportController {
  /**
   * Generate AI-powered report for drug risks
   * POST /api/generate-report/:uploadId
   */
  async generateReport(req: Request, res: Response): Promise<void> {
    try {
      const { uploadId } = req.params;

      console.log(`[ReportController] Generating report for uploadId: ${uploadId}`);

      const report = await reportService.generateReport(uploadId);

      res.status(200).json({
        success: true,
        message: 'Report generated successfully',
        data: report,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[ReportController] Error generating report: ${errorMessage}`);

      res.status(500).json({
        success: false,
        error: 'Failed to generate report',
        details: errorMessage,
      });
    }
  }

  /**
   * Get existing report
   * GET /api/report/:uploadId
   */
  async getReport(req: Request, res: Response): Promise<void> {
    try {
      const { uploadId } = req.params;

      console.log(`[ReportController] Retrieving report for uploadId: ${uploadId}`);

      const report = await reportService.getReport(uploadId);

      if (!report) {
        res.status(404).json({
          success: false,
          error: 'Report not found',
          details: `No report found for uploadId: ${uploadId}. Generate one using POST /api/generate-report/:uploadId`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[ReportController] Error retrieving report: ${errorMessage}`);

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve report',
        details: errorMessage,
      });
    }
  }
}
