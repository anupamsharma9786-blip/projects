import { Request, Response } from 'express';
export declare class ReportController {
    /**
     * Generate AI-powered report for drug risks
     * POST /api/generate-report/:uploadId
     */
    generateReport(req: Request, res: Response): Promise<void>;
    /**
     * Get existing report
     * GET /api/report/:uploadId
     */
    getReport(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=ReportController.d.ts.map