export declare class ReportService {
    private openai;
    constructor();
    /**
     * Get or initialize OpenAI client
     */
    private getOpenAIClient;
    /**
     * Generate AI-powered report for drug risks
     */
    generateReport(uploadId: string): Promise<any>;
    /**
     * Get risk label from severity and recommendation
     */
    private getRiskLabel;
    /**
     * Generate dosage adjustment suggestions based on phenotype
     */
    private generateDosageSuggestion;
    /**
     * Analyze phenotype and calculate risk score
     */
    private analyzePhenotypeRisk;
    /**
     * Generate explanation for a single drug-gene interaction
     */
    private generateExplanation;
    /**
     * Generate overall summary of the report
     */
    private generateSummary;
    /**
     * Get existing report
     */
    getReport(uploadId: string): Promise<any | null>;
}
//# sourceMappingURL=ReportService.d.ts.map