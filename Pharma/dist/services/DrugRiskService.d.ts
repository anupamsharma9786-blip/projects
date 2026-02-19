import { GeneDrugRisks } from '../models/DrugRisk';
export declare class DrugRiskService {
    private drugRules;
    private drugsByGene;
    constructor();
    /**
     * Process phenotypes and generate drug risks
     */
    processDrugRisks(phenotypes: any[], selectedDrugs?: string[]): GeneDrugRisks[];
    /**
     * Get drug risk for a specific phenotype
     */
    private getDrugRisk;
    /**
     * Match phenotype string (e.g., "Intermediate Metabolizer" -> "IM")
     */
    private matchPhenotype;
    /**
     * Normalize phenotype to standard abbreviations
     */
    private normalizePhenotype;
    /**
     * Get all drugs with rules
     */
    getAllDrugs(): string[];
    /**
     * Get genes with drug rules
     */
    getSupportedGenesWithDrugs(): string[];
    /**
     * Get drugs for a specific gene
     */
    getDrugsForGene(gene: string): string[];
}
//# sourceMappingURL=DrugRiskService.d.ts.map