"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrugRiskService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class DrugRiskService {
    constructor() {
        // Load drug rules configuration
        const configPath = path_1.default.join(__dirname, '../config/drugs.json');
        const configContent = fs_1.default.readFileSync(configPath, 'utf-8');
        this.drugRules = JSON.parse(configContent);
        // Index drugs by gene for quick lookup
        this.drugsByGene = new Map();
        for (const drug of this.drugRules) {
            if (!this.drugsByGene.has(drug.gene)) {
                this.drugsByGene.set(drug.gene, []);
            }
            this.drugsByGene.get(drug.gene).push(drug);
        }
    }
    /**
     * Process phenotypes and generate drug risks
     */
    processDrugRisks(phenotypes, selectedDrugs) {
        const geneDrugRisks = [];
        for (const phenotype of phenotypes) {
            const gene = phenotype.gene;
            const phenotypeValue = phenotype.phenotype;
            // Get drugs for this gene
            let drugsForGene = this.drugsByGene.get(gene) || [];
            // Filter by selected drugs if provided
            if (selectedDrugs && selectedDrugs.length > 0) {
                drugsForGene = drugsForGene.filter(drug => selectedDrugs.includes(drug.drug));
            }
            const drugs = [];
            for (const drugConfig of drugsForGene) {
                const drugRisk = this.getDrugRisk(drugConfig, phenotypeValue);
                if (drugRisk) {
                    drugs.push(drugRisk);
                }
            }
            if (drugs.length > 0) {
                geneDrugRisks.push({
                    gene,
                    phenotype: phenotypeValue,
                    drugs,
                });
            }
        }
        return geneDrugRisks;
    }
    /**
     * Get drug risk for a specific phenotype
     */
    getDrugRisk(drugConfig, phenotype) {
        let rule = drugConfig.rules.find((r) => this.matchPhenotype(r.phenotype, phenotype));
        // If no exact match, try normalized phenotype
        if (!rule) {
            const normalizedPhenotype = this.normalizePhenotype(phenotype);
            rule = drugConfig.rules.find((r) => this.matchPhenotype(r.phenotype, normalizedPhenotype));
        }
        // Fall back to Unknown phenotype
        if (!rule) {
            rule = drugConfig.rules.find((r) => r.phenotype === 'Unknown');
        }
        if (!rule) {
            return null;
        }
        return {
            drug: drugConfig.drug,
            risk: rule.risk,
            severity: rule.severity,
            recommendation: rule.recommendation,
        };
    }
    /**
     * Match phenotype string (e.g., "Intermediate Metabolizer" -> "IM")
     */
    matchPhenotype(rulePhenotype, actualPhenotype) {
        const mapping = {
            'PM': ['Poor Metabolizer'],
            'IM': ['Intermediate Metabolizer'],
            'NM': ['Normal Metabolizer'],
            'RM': ['Rapid Metabolizer'],
            'UM': ['Ultra-Rapid Metabolizer'],
            'Low function': ['Low function', 'Reduced Function', 'Impaired Function'],
            'Intermediate function': ['Intermediate Function'],
            'Normal function': ['Normal Function'],
            'Severely Impaired Function': ['Severely Impaired Function'],
        };
        // Direct match
        if (rulePhenotype === actualPhenotype) {
            return true;
        }
        // Check mapping
        const variants = mapping[rulePhenotype];
        if (variants && variants.includes(actualPhenotype)) {
            return true;
        }
        return false;
    }
    /**
     * Normalize phenotype to standard abbreviations
     */
    normalizePhenotype(phenotype) {
        const normalizationMap = {
            'Poor Metabolizer': 'PM',
            'Intermediate Metabolizer': 'IM',
            'Normal Metabolizer': 'NM',
            'Rapid Metabolizer': 'RM',
            'Ultra-Rapid Metabolizer': 'UM',
            'Low function': 'Low function',
            'Intermediate function': 'Intermediate function',
            'Normal function': 'Normal function',
            'Reduced Function': 'Low function',
            'Impaired Function': 'Low function',
            'Severely Impaired Function': 'Severely Impaired Function',
        };
        return normalizationMap[phenotype] || phenotype;
    }
    /**
     * Get all drugs with rules
     */
    getAllDrugs() {
        return this.drugRules.map((d) => d.drug);
    }
    /**
     * Get genes with drug rules
     */
    getSupportedGenesWithDrugs() {
        return Array.from(this.drugsByGene.keys());
    }
    /**
     * Get drugs for a specific gene
     */
    getDrugsForGene(gene) {
        const drugs = this.drugsByGene.get(gene) || [];
        return drugs.map((d) => d.drug);
    }
}
exports.DrugRiskService = DrugRiskService;
//# sourceMappingURL=DrugRiskService.js.map