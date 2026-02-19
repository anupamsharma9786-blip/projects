import fs from 'fs';
import path from 'path';
import { Variant } from '../models/VariantUpload';
import { DiplotypeRecord } from '../models/Diplotype';

interface GeneConfig {
  [gene: string]: {
    [allele: string]: string[];
  };
}

export class DiplotypeService {
  private geneConfig: GeneConfig;

  constructor() {
    // Load gene configuration
    const configPath = path.join(__dirname, '../config/genes.json');
    const configContent = fs.readFileSync(configPath, 'utf-8');
    this.geneConfig = JSON.parse(configContent);
  }

  /**
   * Process variants and predict diplotypes for relevant genes
   */
  processDiplotypes(
    variants: Variant[],
    sampleId: string
  ): DiplotypeRecord[] {
    const diplotypes: DiplotypeRecord[] = [];
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
  private predictGeneDiplotype(gene: string, variants: Variant[]): DiplotypeRecord | null {
    const geneAlleles = this.geneConfig[gene];
    if (!geneAlleles) {
      return null;
    }

    // Get all relevant SNPs for this gene
    const allRelevantRsids = new Set<string>();
    const alleleToRsids: { [key: string]: string[] } = {};

    for (const [allele, rsids] of Object.entries(geneAlleles)) {
      alleleToRsids[allele] = rsids;
      rsids.forEach((rsid) => allRelevantRsids.add(rsid));
    }

    // Filter variants relevant to this gene
    const relevantVariants = variants.filter((v) =>
      allRelevantRsids.has(v.rsid)
    );

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
    const allele1 = this.findAlleleForVariants(
      geneAlleles,
      relevantVariants,
      'first'
    );
    const allele2 = this.findAlleleForVariants(
      geneAlleles,
      relevantVariants,
      'second'
    );

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
  private findAlleleForVariants(
    geneAlleles: { [key: string]: string[] },
    variants: Variant[],
    position: 'first' | 'second'
  ): string {
    // Build a map of SNP to alleles that carry it
    const snpToAlleles: { [snp: string]: string[] } = {};
    for (const [allele, snps] of Object.entries(geneAlleles)) {
      for (const snp of snps) {
        if (!snpToAlleles[snp]) {
          snpToAlleles[snp] = [];
        }
        snpToAlleles[snp].push(allele);
      }
    }

    // Score each allele based on variant matches
    const alleleScores: { [allele: string]: number } = {};
    for (const [allele] of Object.entries(geneAlleles)) {
      alleleScores[allele] = 0;
    }

    // Process each variant
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      const genotype = variant.genotype;

      // Parse genotype (e.g., "0/1", "1/1", "./.")
      const gtParts = genotype.split('/');
      if (gtParts.length !== 2) continue;

      const gt1 = gtParts[0];
      const gt2 = gtParts[1];

      // Find which alleles carry this variant
      const carriingAlleles = snpToAlleles[variant.rsid] || [];

      if (carriingAlleles.length === 0) continue;

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
        } else if (
          gt2 === '0' &&
          (gt1 === '.' || gt1 === '0')
        ) {
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
  private formatDiplotype(allele1: string, allele2: string): string {
    // Sort alleles for consistent representation (e.g., *1/*2 not *2/*1)
    const alleles = [allele1, allele2].sort();
    return `${alleles[0]}/${alleles[1]}`;
  }

  /**
   * Validate gene name
   */
  isValidGene(gene: string): boolean {
    return gene in this.geneConfig;
  }

  /**
   * Get all supported genes
   */
  getSupportedGenes(): string[] {
    return Object.keys(this.geneConfig);
  }
}
