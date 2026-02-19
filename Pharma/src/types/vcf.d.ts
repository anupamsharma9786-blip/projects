declare module 'vcf' {
  class VCF {
    readVCF(vcfString: string): void;
    getVariants(): any[];
    samples: string[];
    [key: string]: any;
  }
  export default VCF;
}
