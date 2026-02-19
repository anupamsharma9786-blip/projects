import { Request, Response } from 'express';
export declare class PhenotypeController {
    /**
     * Process diplotypes and generate phenotypes for a specific upload
     */
    processPhenotype(req: Request, res: Response): Promise<void>;
    /**
     * Get phenotypes for a specific upload
     */
    getPhenotypes(req: Request, res: Response): Promise<void>;
    /**
     * Get supported genes and their phenotype values
     */
    getSupportedGenesWithPhenotypes(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=PhenotypeController.d.ts.map