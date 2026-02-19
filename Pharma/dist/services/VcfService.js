"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VcfService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class VcfService {
    /**
     * Parses a VCF file and extracts variant information
     */
    async parseVcfFile(filePath) {
        try {
            const fileContent = fs_1.default.readFileSync(filePath, 'utf-8');
            const lines = fileContent.split('\n');
            let headerLine = '';
            let sampleId = 'unknown';
            const variants = [];
            // Parse VCF file line by line
            for (const line of lines) {
                // Skip empty lines
                if (!line.trim())
                    continue;
                // Skip metadata lines (starting with ##)
                if (line.startsWith('##'))
                    continue;
                // Parse header line (starting with #CHROM)
                if (line.startsWith('#CHROM')) {
                    headerLine = line;
                    const columns = line.split('\t');
                    // Sample ID is typically the last column (or 10th column in standard VCF)
                    if (columns.length > 9) {
                        sampleId = columns[9];
                    }
                    continue;
                }
                // Parse variant lines
                if (!line.startsWith('#') && headerLine) {
                    try {
                        const variantData = this.parseVariantLine(line, sampleId);
                        if (variantData) {
                            variants.push(variantData);
                        }
                    }
                    catch (error) {
                        console.error(`Error parsing variant line: ${error}`);
                        // Continue processing other records
                    }
                }
            }
            return { sampleId, variants };
        }
        catch (error) {
            throw new Error(`Failed to parse VCF file: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Parses a single VCF variant line
     */
    parseVariantLine(line, sampleId) {
        const columns = line.split('\t');
        // VCF format: CHROM POS ID REF ALT QUAL FILTER INFO FORMAT [SAMPLE...]
        if (columns.length < 5) {
            return null;
        }
        const chrom = columns[0];
        const pos = parseInt(columns[1], 10);
        const id = columns[2] !== '.' ? columns[2] : 'rs.';
        const ref = columns[3];
        const alt = columns[4];
        const format = columns[8];
        const sampleData = columns[9] || '';
        // Extract genotype from sample data
        const genotype = this.extractGenotypeFromSample(format, sampleData);
        return {
            rsid: id,
            chromosome: chrom,
            position: pos,
            ref: ref,
            alt: alt,
            genotype: genotype,
        };
    }
    /**
     * Extracts genotype from sample data using FORMAT field
     */
    extractGenotypeFromSample(format, sampleData) {
        try {
            if (!format || !sampleData) {
                return './.';
            }
            const formatFields = format.split(':');
            const sampleValues = sampleData.split(':');
            // GT (genotype) is typically the first field
            const gtIndex = formatFields.indexOf('GT');
            if (gtIndex >= 0 && gtIndex < sampleValues.length) {
                return sampleValues[gtIndex];
            }
            return './.';
        }
        catch {
            return './.';
        }
    }
    /**
     * Validates if a file is a VCF file
     */
    validateVcfFile(filename) {
        const ext = path_1.default.extname(filename).toLowerCase();
        return ext === '.vcf';
    }
    /**
     * Cleans up uploaded file
     */
    deleteFile(filePath) {
        try {
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
        }
        catch (error) {
            console.error(`Failed to delete file: ${error}`);
        }
    }
}
exports.VcfService = VcfService;
//# sourceMappingURL=VcfService.js.map