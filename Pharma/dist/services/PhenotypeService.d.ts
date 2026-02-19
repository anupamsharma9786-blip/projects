import { PhenotypeRecord } from '../models/Phenotype';
export declare class PhenotypeService {
    private phenotypeMapping;
    constructor();
    /**
     * Convert diplotypes to phenotypes
     */
    convertDiplotypesToPhenotypes(diplotypes: any[]): PhenotypeRecord[];
    /**
     * Get phenotype for a specific gene and diplotype
     */
    private getPhenotype;
    /**
     * Reverse diplotype alleles (e.g., *2/*1 -> *1/*2)
     */
    private reverseDiplotype;
    /**
     * Get all supported genes for phenotype mapping
     */
    getSupportedGenes(): string[];
    /**
     * Check if a gene is supported
     */
    isGeneSupported(gene: string): boolean;
    /**
     * Get all phenotype values for a gene
     */
    getPhenotypesForGene(gene: string): string[];
}
//# sourceMappingURL=PhenotypeService.d.ts.map