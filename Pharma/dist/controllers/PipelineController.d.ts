import { Request, Response } from 'express';
export declare class PipelineController {
    /**
     * Execute complete pipeline: VCF → Diplotypes → Phenotypes → Drug Risks → Report (optional)
     * Query param: ?generateReport=true to automatically generate AI report
     */
    processPipeline(req: Request, res: Response): Promise<void>;
    /**
     * Get complete pipeline result
     */
    getPipelineResult(req: Request, res: Response): Promise<void>;
    /**
     * Get pipeline completion status
     */
    getPipelineStatus(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=PipelineController.d.ts.map