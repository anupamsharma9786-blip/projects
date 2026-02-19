import { Request, Response } from 'express';
export declare class DiplotypeController {
    /**
     * Process variants and generate diplotypes for a specific upload
     */
    processDiplotype(req: Request, res: Response): Promise<void>;
    /**
     * Get diplotypes for a specific upload
     */
    getDiplotypes(req: Request, res: Response): Promise<void>;
    /**
     * Get supported genes for diplotype prediction
     */
    getSupportedGenes(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=DiplotypeController.d.ts.map