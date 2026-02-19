"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiplotypeService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class DiplotypeService {
    constructor() {
        // Load gene configuration
        const configPath = path_1.default.join(__dirname, '../config/genes.json');
        const configContent = fs_1.default.readFileSync(configPath, 'utf-8');
        this.geneConfig = JSON.parse(configContent);
    }
    /**
     * Process variants and predict diplotypes for relevant genes
     */
    processDiplotypes(variants, sampleId) {
        const diplotypes = [];
        const relevantGenes = Object.keys(this.geneConfig);
        // Process each gene
        for (const gene of relevantGenes) {
            const geneDiplotype = this.predictGeneDiplotype(gene, variants);
            if (geneDiplotype) {
                diplotypes.push(geneDiplotype);
            }
        }
        return diplotypes;
    }
    /**
     * Predict diplotype for a specific gene
     */
    predictGeneDiplotype(gene, variants) {
        const geneAlleles = this.geneConfig[gene];
        if (!geneAlleles) {
            return null;
        }
        // Get all relevant SNPs for this gene
        const allRelevantRsids = new Set();
        const alleleToRsids = {};
        for (const [allele, rsids] of Object.entries(geneAlleles)) {
            alleleToRsids[allele] = rsids;
            rsids.forEach((rsid) => allRelevantRsids.add(rsid));
        }
        // Filter variants relevant to this gene
        const relevantVariants = variants.filter((v) => allRelevantRsids.has(v.rsid));
        // If no relevant variants, both alleles are wild-type (*1)
        if (relevantVariants.length === 0) {
            return {
                gene,
                allele1: '*1',
                allele2: '*1',
                diplotype: '*1/*1',
                matchedVariants: [],
            };
        }
        // Match variants to alleles
        const allele1 = this.findAlleleForVariants(geneAlleles, relevantVariants, 'first');
        const allele2 = this.findAlleleForVariants(geneAlleles, relevantVariants, 'second');
        const diplotype = this.formatDiplotype(allele1, allele2);
        return {
            gene,
            allele1,
            allele2,
            diplotype,
            matchedVariants: relevantVariants.map((v) => ({
                rsid: v.rsid,
                genotype: v.genotype,
            })),
        };
    }
    /**
     * Find the best matching allele for the given variants
     * For heterozygous SNPs, assign one allele per chromosome
     */
    findAlleleForVariants(geneAlleles, variants, position) {
        // Build a map of SNP to alleles that carry it
        const snpToAlleles = {};
        for (const [allele, snps] of Object.entries(geneAlleles)) {
            for (const snp of snps) {
                if (!snpToAlleles[snp]) {
                    snpToAlleles[snp] = [];
                }
                snpToAlleles[snp].push(allele);
            }
        }
        // Score each allele based on variant matches
        const alleleScores = {};
        for (const [allele] of Object.entries(geneAlleles)) {
            alleleScores[allele] = 0;
        }
        // Process each variant
        for (let i = 0; i < variants.length; i++) {
            const variant = variants[i];
            const genotype = variant.genotype;
            // Parse genotype (e.g., "0/1", "1/1", "./.")
            const gtParts = genotype.split('/');
            if (gtParts.length !== 2)
                continue;
            const gt1 = gtParts[0];
            const gt2 = gtParts[1];
            // Find which alleles carry this variant
            const carriingAlleles = snpToAlleles[variant.rsid] || [];
            if (carriingAlleles.length === 0)
                continue;
            // For first chromosome copy
            if (position === 'first') {
                if (gt1 !== '.' && gt1 !== '0') {
                    // Variant is present on first chromosome
                    for (const allele of carriingAlleles) {
                        alleleScores[allele]++;
                    }
                }
            }
            // For second chromosome copy
            else {
                if (gt2 !== '.' && gt2 !== '0') {
                    // Variant is present on second chromosome
                    for (const allele of carriingAlleles) {
                        alleleScores[allele]++;
                    }
                }
                else if (gt2 === '0' &&
                    (gt1 === '.' || gt1 === '0')) {
                    // No variant on second chromosome
                    alleleScores['*1']++;
                }
            }
        }
        // Find the allele with the highest score
        let bestAllele = '*1';
        let maxScore = 0;
        for (const [allele, score] of Object.entries(alleleScores)) {
            if (score > maxScore) {
                maxScore = score;
                bestAllele = allele;
            }
        }
        return bestAllele;
    }
    /**
     * Format diplotype string
     */
    formatDiplotype(allele1, allele2) {
        // Sort alleles for consistent representation (e.g., *1/*2 not *2/*1)
        const alleles = [allele1, allele2].sort();
        return `${alleles[0]}/${alleles[1]}`;
    }
    /**
     * Validate gene name
     */
    isValidGene(gene) {
        return gene in this.geneConfig;
    }
    /**
     * Get all supported genes
     */
    getSupportedGenes() {
        return Object.keys(this.geneConfig);
    }
}
exports.DiplotypeService = DiplotypeService;
//# sourceMappingURL=DiplotypeService.js.map