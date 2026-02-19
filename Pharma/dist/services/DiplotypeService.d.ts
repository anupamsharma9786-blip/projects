import { Variant } from '../models/VariantUpload';
import { DiplotypeRecord } from '../models/Diplotype';
export declare class DiplotypeService {
    private geneConfig;
    constructor();
    /**
     * Process variants and predict diplotypes for relevant genes
     */
    processDiplotypes(variants: Variant[], sampleId: string): DiplotypeRecord[];
    /**
     * Predict diplotype for a specific gene
     */
    private predictGeneDiplotype;
    /**
     * Find the best matching allele for the given variants
     * For heterozygous SNPs, assign one allele per chromosome
     */
    private findAlleleForVariants;
    /**
     * Format diplotype string
     */
    private formatDiplotype;
    /**
     * Validate gene name
     */
    isValidGene(gene: string): boolean;
    /**
     * Get all supported genes
     */
    getSupportedGenes(): string[];
}
//# sourceMappingURL=DiplotypeService.d.ts.map