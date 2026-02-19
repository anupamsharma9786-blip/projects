"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhenotypeService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class PhenotypeService {
    constructor() {
        // Load phenotype mapping configuration
        const configPath = path_1.default.join(__dirname, '../config/phenotypes.json');
        const configContent = fs_1.default.readFileSync(configPath, 'utf-8');
        this.phenotypeMapping = JSON.parse(configContent);
    }
    /**
     * Convert diplotypes to phenotypes
     */
    convertDiplotypesToPhenotypes(diplotypes) {
        const phenotypes = [];
        for (const diplotype of diplotypes) {
            const gene = diplotype.gene;
            const diplotypeStr = diplotype.diplotype;
            // Look up phenotype in mapping
            const phenotype = this.getPhenotype(gene, diplotypeStr);
            phenotypes.push({
                gene,
                diplotype: diplotypeStr,
                phenotype: phenotype || 'Unknown Metabolizer',
            });
        }
        return phenotypes;
    }
    /**
     * Get phenotype for a specific gene and diplotype
     */
    getPhenotype(gene, diplotype) {
        if (!this.phenotypeMapping[gene]) {
            return null;
        }
        // Try exact match
        if (this.phenotypeMapping[gene][diplotype]) {
            return this.phenotypeMapping[gene][diplotype];
        }
        // Try reverse match (e.g., *2/*1 -> *1/*2)
        const reversedDiplotype = this.reverseDiplotype(diplotype);
        if (this.phenotypeMapping[gene][reversedDiplotype]) {
            return this.phenotypeMapping[gene][reversedDiplotype];
        }
        return null;
    }
    /**
     * Reverse diplotype alleles (e.g., *2/*1 -> *1/*2)
     */
    reverseDiplotype(diplotype) {
        const parts = diplotype.split('/');
        if (parts.length !== 2) {
            return diplotype;
        }
        // Sort to get canonical form
        const sorted = [parts[0], parts[1]].sort();
        return `${sorted[0]}/${sorted[1]}`;
    }
    /**
     * Get all supported genes for phenotype mapping
     */
    getSupportedGenes() {
        return Object.keys(this.phenotypeMapping);
    }
    /**
     * Check if a gene is supported
     */
    isGeneSupported(gene) {
        return gene in this.phenotypeMapping;
    }
    /**
     * Get all phenotype values for a gene
     */
    getPhenotypesForGene(gene) {
        if (!this.phenotypeMapping[gene]) {
            return [];
        }
        const phenotypes = new Set(Object.values(this.phenotypeMapping[gene]));
        return Array.from(phenotypes);
    }
}
exports.PhenotypeService = PhenotypeService;
//# sourceMappingURL=PhenotypeService.js.map