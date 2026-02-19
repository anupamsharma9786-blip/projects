## Diplotype Processing - Quick Test Guide

### Step 1: Upload VCF File
```bash
curl -X POST -F "file=@sample.vcf" http://localhost:3000/api/upload-vcf
```

Response will include `uploadId`. Save this value.

### Step 2: Check Supported Genes
```bash
curl http://localhost:3000/api/supported-genes
```

Should return: CYP2C19 and CYP2D6

### Step 3: Process Diplotypes
```bash
curl -X POST http://localhost:3000/api/process-diplotype/{uploadId}
```

Replace `{uploadId}` with the ID from Step 1.

Response includes:
- Gene name
- Star alleles (*1, *2, etc.)
- Diplotype (e.g., *1/*2)
- Count of matched variants

### Step 4: Retrieve Stored Diplotypes
```bash
curl http://localhost:3000/api/diplotypes/{uploadId}
```

Shows previously processed diplotypes with full variant details.

### Gene Configuration

Gene mappings are stored in: `src/config/genes.json`

Format:
```json
{
  "GENE_NAME": {
    "*1": [],                    // Wild-type (no variants)
    "*2": ["rs1234567"],        // Single variant
    "*3": ["rs1234567", "rs...]  // Multiple variants
  }
}
```

### Diplotype Rules

1. No relevant variants → *1/*1
2. One variant (0/1) → *1/star_allele
3. Homozygous variants (1/1) → star_allele/star_allele
4. Multiple variants → Match to best-scoring allele

### Example VCF Format

```vcf
##fileformat=VCFv4.2
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	SAMPLE_001
1	100000	rs4244285	A	G	.	PASS	.	GT	0/1
1	200000	rs4986893	C	T	.	PASS	.	GT	0/0
```

### Database Collections

**VariantUpload**: Stores uploaded VCF data
**Diplotype**: Stores processed star alleles and diplotypes
