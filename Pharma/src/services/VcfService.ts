import fs from 'fs';
import path from 'path';
import { Variant } from '../models/VariantUpload';

export class VcfService {
  /**
   * Parses a VCF file and extracts variant information
   */
  async parseVcfFile(filePath: string): Promise<{ sampleId: string; variants: Variant[] }> {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.split('\n');

      let headerLine = '';
      let sampleId = 'unknown';
      const variants: Variant[] = [];

      // Parse VCF file line by line
      for (const line of lines) {
        // Skip empty lines
        if (!line.trim()) continue;

        // Skip metadata lines (starting with ##)
        if (line.startsWith('##')) continue;

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
          } catch (error) {
            console.error(`Error parsing variant line: ${error}`);
            // Continue processing other records
          }
        }
      }

      return { sampleId, variants };
    } catch (error) {
      throw new Error(`Failed to parse VCF file: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Parses a single VCF variant line
   */
  private parseVariantLine(line: string, sampleId: string): Variant | null {
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
  private extractGenotypeFromSample(format: string, sampleData: string): string {
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
    } catch {
      return './.';
    }
  }

  /**
   * Validates if a file is a VCF file
   */
  validateVcfFile(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();
    return ext === '.vcf';
  }

  /**
   * Cleans up uploaded file
   */
  deleteFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`Failed to delete file: ${error}`);
    }
  }
}
