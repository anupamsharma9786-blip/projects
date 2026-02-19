export interface PipelineResult {
    uploadId: string;
    sampleId: string;
    variantCount: number;
    diplotypes: any[];
    phenotypes: any[];
    drugRisks: any[];
    report?: any;
    timestamp: Date;
}
export declare class PipelineService {
    private diplotypeService;
    private phenotypeService;
    private drugRiskService;
    private reportService;
    constructor();
    /**
     * Execute full pipeline: Variants → Diplotypes → Phenotypes → Drug Risks → Report (optional)
     * @param uploadId - The upload ID
     * @param generateReport - Whether to generate AI report (default: false)
     */
    executePipeline(uploadId: string, generateReport?: boolean): Promise<PipelineResult>;
    /**
     * Get complete pipeline result for an upload
     */
    getPipelineResult(uploadId: string): Promise<PipelineResult | null>;
    /**
     * Check pipeline completion status
     */
    getPipelineStatus(uploadId: string): Promise<{
        uploadId: string;
        variants: {
            completed: boolean;
            count: number;
        };
        diplotypes: {
            completed: boolean;
            count: number;
        };
        phenotypes: {
            completed: boolean;
            count: number;
        };
        drugRisks: {
            completed: boolean;
            count: number;
        };
        allComplete: boolean;
    }>;
}
//# sourceMappingURL=PipelineService.d.ts.map