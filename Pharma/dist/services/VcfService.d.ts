import { Variant } from '../models/VariantUpload';
export declare class VcfService {
    /**
     * Parses a VCF file and extracts variant information
     */
    parseVcfFile(filePath: string): Promise<{
        sampleId: string;
        variants: Variant[];
    }>;
    /**
     * Parses a single VCF variant line
     */
    private parseVariantLine;
    /**
     * Extracts genotype from sample data using FORMAT field
     */
    private extractGenotypeFromSample;
    /**
     * Validates if a file is a VCF file
     */
    validateVcfFile(filename: string): boolean;
    /**
     * Cleans up uploaded file
     */
    deleteFile(filePath: string): void;
}
//# sourceMappingURL=VcfService.d.ts.map