import { Request, Response } from 'express';
export declare class DrugRiskController {
    /**
     * Process phenotypes and generate drug risks for a specific upload
     */
    processDrugRisk(req: Request, res: Response): Promise<void>;
    /**
     * Get drug risks for a specific upload
     */
    getDrugRisks(req: Request, res: Response): Promise<void>;
    /**
     * Get all available drugs and their genes
     */
    getDrugCatalog(req: Request, res: Response): Promise<void>;
    /**
     * Get drug risks by severity level
     */
    getDrugRisksBySeverity(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=DrugRiskController.d.ts.map