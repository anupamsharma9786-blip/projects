import { Request, Response } from 'express';
export declare class VcfController {
    /**
     * Handles VCF file upload (automatically processes full pipeline by default)
     * Query params:
     *   ?skipPipeline=true to only upload without processing
     *   ?generateReport=true to automatically generate AI report after pipeline
     */
    uploadVcf(req: Request, res: Response): Promise<void>;
    /**
     * Retrieves variants by upload ID
     */
    getVariants(req: Request, res: Response): Promise<void>;
    /**
     * Get all uploaded files (for debugging)
     */
    getAllUploads(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=VcfController.d.ts.map