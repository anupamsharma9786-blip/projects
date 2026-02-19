# Pharma VCF Backend

A Node.js + Express backend built with TypeScript for uploading and parsing VCF (Variant Call Format) files. The application stores genomic variant data in MongoDB.

## Features

- **VCF File Upload**: Upload .vcf files via HTTP
- **VCF Parsing**: Parse VCF files and extract variant information
- **Diplotype Prediction**: Rule-based star allele prediction for 7 pharmacogenetic genes
- **Phenotype Classification**: Convert diplotypes to metabolizer phenotypes
- **Drug Risk Assessment**: Assess drug-gene interactions using CPIC guidelines (6 drugs)
- **Automated Pipeline**: Automatic processing from variants to drug risks in one upload
- **AI-Powered Reports**: Generate patient-friendly explanations using OpenAI (optional)
- **MongoDB Integration**: Store variant data, reports, and analysis results
- **File Validation**: Validates file type and size
- **Error Handling**: Comprehensive error handling and logging
- **RESTful API**: Clean API endpoints for upload and retrieval
- **TypeScript**: Full type safety with TypeScript

## Project Structure

```
src/
├── config/           # Configuration management
├── controllers/      # Request handlers
├── middleware/       # Multer & error handling
├── models/          # MongoDB schemas
├── routes/          # API routes
├── services/        # Business logic
└── index.ts         # Application entry point
```

## Prerequisites

- Node.js 16+
- MongoDB (local or cloud)
- npm or yarn

## Installation

1. Clone the repository
```bash
cd Pharma
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string and OpenAI API key:
```
MONGODB_URI=mongodb://localhost:27017/pharma-vcf
PORT=3000
NODE_ENV=development
MAX_FILE_SIZE=52428800
OPENAI_API_KEY=your_openai_api_key_here
```

**Note:** The `OPENAI_API_KEY` is required only if you want to use the AI-powered report generation feature (POST `/api/generate-report/:uploadId`). The rest of the application will work without it.

## Running the Application

### Development Mode
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Production Mode
```bash
npm run start
```

### Watch Mode (for development)
```bash
npm run watch
```

## API Endpoints

### 1. Upload VCF File
**POST** `/api/upload-vcf`

Upload a VCF file for parsing and storage.

**Request:**
- Form data with `file` field containing the .vcf file
- Optional query parameter: `autoPipeline=true` to automatically process the pipeline (generates diplotypes, phenotypes, and drug risks in one operation)
- Maximum file size: 50MB

**Response:**
```json
{
  "success": true,
  "message": "VCF file uploaded and parsed successfully",
  "data": {
    "uploadId": "upload_abc123def456",
    "filename": "sample.vcf",
    "uploadDate": "2024-01-15T10:30:00Z",
    "sampleId": "SAMPLE_001",
    "variantCount": 156
  },
  "pipelineWarning": null
}
```

**Examples:**
```bash
# Upload VCF without automatic pipeline processing
curl -X POST -F "file=@sample.vcf" http://localhost:3000/api/upload-vcf

# Upload VCF with automatic full pipeline processing (recommended)
curl -X POST -F "file=@sample.vcf" "http://localhost:3000/api/upload-vcf?autoPipeline=true"
```

**Note on autoPipeline:** When you include `?autoPipeline=true`, the system will automatically:
1. Parse the VCF file
2. Generate diplotypes for all supported genes
3. Convert diplotypes to phenotypes
4. Assess drug-gene interaction risks

This allows you to retrieve complete results using the [Pipeline Result](#14-get-pipeline-result) endpoint immediately after upload.

### 2. Get Variants
**GET** `/api/variants/:uploadId`

Retrieve stored variants for a specific upload.

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadId": "upload_abc123def456",
    "filename": "sample.vcf",
    "uploadDate": "2024-01-15T10:30:00Z",
    "sampleId": "SAMPLE_001",
    "variantCount": 156,
    "variants": [
      {
        "rsid": "rs1234567",
        "chromosome": "1",
        "position": 100000,
        "ref": "A",
        "alt": "G",
        "genotype": "0/1"
      }
    ]
  }
}
```

**Example:**
```bash
curl http://localhost:3000/api/variants/upload_abc123def456
```

### 3. Health Check
**GET** `/health`

Check server status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 4. Process Diplotypes
**POST** `/api/process-diplotype/:uploadId`

Process variants and generate pharmacogenomic diplotypes for CYP2C19 and CYP2D6 genes.

**Parameters:**
- `uploadId` (URL parameter): The upload ID from a previous VCF upload

**Response:**
```json
{
  "success": true,
  "message": "Diplotypes processed successfully",
  "data": {
    "uploadId": "upload_abc123def456",
    "sampleId": "SAMPLE_001",
    "variantCount": 156,
    "diplotypes": [
      {
        "gene": "CYP2C19",
        "allele1": "*1",
        "allele2": "*2",
        "diplotype": "*1/*2",
        "matchedVariants": 1
      },
      {
        "gene": "CYP2D6",
        "allele1": "*1",
        "allele2": "*1",
        "diplotype": "*1/*1",
        "matchedVariants": 0
      }
    ]
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/process-diplotype/upload_abc123def456
```

### 5. Get Diplotypes
**GET** `/api/diplotypes/:uploadId`

Retrieve previously processed diplotypes for a specific upload.

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadId": "upload_abc123def456",
    "sampleId": "SAMPLE_001",
    "diplotypes": [
      {
        "gene": "CYP2C19",
        "allele1": "*1",
        "allele2": "*2",
        "diplotype": "*1/*2",
        "matchedVariants": [
          {
            "rsid": "rs4244285",
            "genotype": "0/1"
          }
        ]
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Example:**
```bash
curl http://localhost:3000/api/diplotypes/upload_abc123def456
```

### 6. Supported Genes
**GET** `/api/supported-genes`

Get list of genes supported for diplotype prediction.

**Response:**
```json
{
  "success": true,
  "data": {
    "supportedGenes": ["CYP2C19", "CYP2D6"],
    "total": 2
  }
}
```

**Example:**
```bash
curl http://localhost:3000/api/supported-genes
```

### 7. Process Phenotypes
**POST** `/api/process-phenotype/:uploadId`

Process diplotypes and generate phenotypes (metabolizer classifications) for CYP2C19 and CYP2D6 genes.

**Parameters:**
- `uploadId` (URL parameter): The upload ID from a previous VCF upload

**Response:**
```json
{
  "success": true,
  "message": "Phenotypes processed successfully",
  "data": {
    "uploadId": "upload_abc123def456",
    "sampleId": "SAMPLE_001",
    "phenotypes": [
      {
        "gene": "CYP2C19",
        "diplotype": "*1/*2",
        "phenotype": "Intermediate Metabolizer"
      },
      {
        "gene": "CYP2D6",
        "diplotype": "*1/*1",
        "phenotype": "Normal Metabolizer"
      }
    ]
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/process-phenotype/upload_abc123def456
```

### 8. Get Phenotypes
**GET** `/api/phenotypes/:uploadId`

Retrieve previously processed phenotypes for a specific upload.

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadId": "upload_abc123def456",
    "sampleId": "SAMPLE_001",
    "phenotypes": [
      {
        "gene": "CYP2C19",
        "diplotype": "*1/*2",
        "phenotype": "Intermediate Metabolizer"
      },
      {
        "gene": "CYP2D6",
        "diplotype": "*1/*1",
        "phenotype": "Normal Metabolizer"
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Example:**
```bash
curl http://localhost:3000/api/phenotypes/upload_abc123def456
```

### 9. Get Phenotype Gene Reference
**GET** `/api/phenotype-genes`

Get list of genes supported for phenotype prediction with their classifications.

**Response:**
```json
{
  "success": true,
  "data": {
    "supportedGenes": [
      {
        "gene": "CYP2C19",
        "phenotypes": [
          "Normal Metabolizer",
          "Intermediate Metabolizer",
          "Poor Metabolizer",
          "Rapid Metabolizer"
        ]
      },
      {
        "gene": "CYP2D6",
        "phenotypes": [
          "Normal Metabolizer",
          "Intermediate Metabolizer",
          "Poor Metabolizer"
        ]
      }
    ],
    "total": 2
  }
}
```

**Example:**
```bash
curl http://localhost:3000/api/phenotype-genes
```

### 10. Process Drug Risks
**POST** `/api/process-drug-risk/:uploadId`

Process phenotypes and generate drug-gene interaction risks using CPIC (Clinical Pharmacogenetics Implementation Consortium) guidelines.

**Parameters:**
- `uploadId` (URL parameter): The upload ID from a previous VCF upload

**Response:**
```json
{
  "success": true,
  "message": "Drug risks processed successfully",
  "data": {
    "uploadId": "upload_abc123def456",
    "sampleId": "SAMPLE_001",
    "totalGenes": 2,
    "totalDrugs": 3,
    "geneDrugRisks": [
      {
        "gene": "CYP2C19",
        "phenotype": "Poor Metabolizer",
        "drugs": [
          {
            "drug": "CLOPIDOGREL",
            "risk": "Ineffective",
            "severity": "high"
          }
        ]
      }
    ]
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/process-drug-risk/upload_abc123def456
```

### 11. Get Drug Risks
**GET** `/api/drug-risks/:uploadId`

Retrieve previously processed drug risks for a specific upload.

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadId": "upload_abc123def456",
    "sampleId": "SAMPLE_001",
    "geneDrugRisks": [
      {
        "gene": "CYP2C19",
        "phenotype": "Poor Metabolizer",
        "drugs": [
          {
            "drug": "CLOPIDOGREL",
            "risk": "Ineffective",
            "severity": "high",
            "recommendation": "Use alternative antiplatelet (e.g., prasugrel or ticagrelor)"
          }
        ]
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Example:**
```bash
curl http://localhost:3000/api/drug-risks/upload_abc123def456
```

### 12. Get Drug Risks by Severity
**GET** `/api/drug-risks/:uploadId/severity?severity=critical`

Retrieve drug risks filtered by severity level (critical, high, moderate, low).

**Query Parameters:**
- `severity` (optional): Filter by severity level (critical, high, moderate, or low)

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadId": "upload_abc123def456",
    "sampleId": "SAMPLE_001",
    "severity": "critical",
    "geneDrugRisks": [
      {
        "gene": "CYP2D6",
        "phenotype": "Ultra-Rapid Metabolizer",
        "drugs": [
          {
            "drug": "CODEINE",
            "risk": "Toxic",
            "severity": "critical",
            "recommendation": "Avoid codeine due to morphine toxicity risk"
          }
        ]
      }
    ]
  }
}
```

**Examples:**
```bash
# Get only critical severity drugs
curl http://localhost:3000/api/drug-risks/upload_abc123def456/severity?severity=critical

# Get all drugs (no filter)
curl http://localhost:3000/api/drug-risks/upload_abc123def456/severity
```

### 13. Get Drug Catalog
**GET** `/api/drug-catalog`

Get complete catalog of all available drugs and their associated genes.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDrugs": 6,
    "allDrugs": [
      "CLOPIDOGREL",
      "CODEINE",
      "SIMVASTATIN",
      "AZATHIOPRINE",
      "FLUOROURACIL",
      "WARFARIN"
    ],
    "geneInfo": [
      {
        "gene": "CYP2C19",
        "drugs": ["CLOPIDOGREL", "WARFARIN"]
      },
      {
        "gene": "CYP2D6",
        "drugs": ["CODEINE"]
      },
      {
        "gene": "SLCO1B1",
        "drugs": ["SIMVASTATIN"]
      },
      {
        "gene": "TPMT",
        "drugs": ["AZATHIOPRINE"]
      },
      {
        "gene": "DPYD",
        "drugs": ["FLUOROURACIL"]
      }
    ]
  }
}
```

**Example:**
```bash
curl http://localhost:3000/api/drug-catalog
```

### 14. Process Full Pipeline
**POST** `/api/process-all/:uploadId`

Process all stages of the pharmacogenomics pipeline in one operation: parse variants → generate diplotypes → classify phenotypes → assess drug risks. This is useful if you uploaded the VCF file without `autoPipeline=true` and want to process it later.

**Parameters:**
- `uploadId` (URL parameter): The upload ID from a previous VCF upload

**Response:**
```json
{
  "success": true,
  "message": "Pipeline executed successfully",
  "data": {
    "uploadId": "upload_abc123def456",
    "sampleId": "SAMPLE_001",
    "variantCount": 156,
    "diplotypes": [
      {
        "gene": "CYP2C19",
        "diplotype": "*1/*2",
        "matchedVariants": 1
      }
    ],
    "phenotypes": [
      {
        "gene": "CYP2C19",
        "diplotype": "*1/*2",
        "phenotype": "Intermediate Metabolizer"
      }
    ],
    "drugRisks": [
      {
        "gene": "CYP2C19",
        "phenotype": "Intermediate Metabolizer",
        "drugs": [
          {
            "drug": "CLOPIDOGREL",
            "risk": "Reduced efficacy",
            "severity": "high",
            "recommendation": "Consider alternative antiplatelet agent"
          }
        ]
      }
    ],
    "timestamp": "2024-01-15T10:35:00Z"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/process-all/upload_abc123def456
```

### 15. Get Pipeline Result
**GET** `/api/pipeline-result/:uploadId`

Retrieve the complete unified result from a pipeline execution. This combines diplotypes, phenotypes, and drug risks in a single response.

**Parameters:**
- `uploadId` (URL parameter): The upload ID from a previous VCF upload and pipeline processing

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadId": "upload_abc123def456",
    "sampleId": "SAMPLE_001",
    "variantCount": 156,
    "diplotypes": [
      {
        "gene": "CYP2C19",
        "allele1": "*1",
        "allele2": "*2",
        "diplotype": "*1/*2",
        "matchedVariants": [
          {
            "rsid": "rs4244285",
            "genotype": "0/1"
          }
        ]
      },
      {
        "gene": "CYP2D6",
        "allele1": "*1",
        "allele2": "*1",
        "diplotype": "*1/*1",
        "matchedVariants": []
      }
    ],
    "phenotypes": [
      {
        "gene": "CYP2C19",
        "diplotype": "*1/*2",
        "phenotype": "Intermediate Metabolizer"
      },
      {
        "gene": "CYP2D6",
        "diplotype": "*1/*1",
        "phenotype": "Normal Metabolizer"
      }
    ],
    "geneDrugRisks": [
      {
        "gene": "CYP2C19",
        "phenotype": "Intermediate Metabolizer",
        "drugs": [
          {
            "drug": "CLOPIDOGREL",
            "risk": "Reduced efficacy",
            "severity": "high",
            "recommendation": "Consider alternative antiplatelet agent (e.g., prasugrel or ticagrelor)"
          }
        ]
      },
      {
        "gene": "CYP2D6",
        "phenotype": "Normal Metabolizer",
        "drugs": [
          {
            "drug": "CODEINE",
            "risk": "Safe",
            "severity": "low",
            "recommendation": "Standard dosing appropriate"
          }
        ]
      }
    ],
    "timestamp": "2024-01-15T10:35:00Z"
  }
}
```

**Example:**
```bash
curl http://localhost:3000/api/pipeline-result/upload_abc123def456
```

### 16. Get Pipeline Status
**GET** `/api/pipeline-status/:uploadId`

Check the processing status of the pipeline. Returns the count of processed records at each stage to verify that all steps have been completed.

**Parameters:**
- `uploadId` (URL parameter): The upload ID from a previous VCF upload

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadId": "upload_abc123def456",
    "sampleId": "SAMPLE_001",
    "status": {
      "variantsProcessed": 156,
      "diplotypesGenerated": 6,
      "phenotypesConverted": 6,
      "drugRisksAssessed": 6
    },
    "pipelineComplete": true,
    "timestamp": "2024-01-15T10:35:00Z"
  }
}
```

**Example:**
```bash
curl http://localhost:3000/api/pipeline-status/upload_abc123def456
```

### 17. Generate AI Report
**POST** `/api/generate-report/:uploadId`

Generate an AI-powered pharmacogenomics report with patient-friendly explanations for each drug-gene interaction using OpenAI.

**Prerequisites:**
- VCF file must be uploaded and pipeline processed (drug risks must exist)
- OPENAI_API_KEY must be configured in environment variables

**Parameters:**
- `uploadId` (URL parameter): The upload ID from a previous VCF upload

**Response:**
```json
{
  "success": true,
  "message": "Report generated successfully",
  "data": {
    "uploadId": "upload_abc123def456",
    "sampleId": "SAMPLE_001",
    "summary": "Your pharmacogenomics analysis covers 6 drug-gene interactions. Based on your genetic profile, most medications can be used safely with standard dosing. However, there are important considerations for certain medications that your healthcare provider should review with you.",
    "geneReports": [
      {
        "gene": "CYP2C19",
        "phenotype": "Intermediate Metabolizer",
        "drug": "CLOPIDOGREL",
        "recommendation": "Consider alternative therapy",
        "explanation": "Your genetic variant results in reduced enzyme activity, which means clopidogrel may not be converted effectively to its active form. This could reduce the drug's effectiveness in preventing blood clots.",
        "disclaimer": "This is not medical advice. Always consult your healthcare provider before making any changes to your medication."
      },
      {
        "gene": "DPYD",
        "phenotype": "Poor Metabolizer",
        "drug": "FLUOROURACIL",
        "recommendation": "Avoid fluorouracil",
        "explanation": "Your genetic profile indicates significantly reduced ability to break down this chemotherapy drug, which could lead to severe toxic side effects. Alternative treatments should be strongly considered.",
        "disclaimer": "This is not medical advice. Always consult your healthcare provider before making any changes to your medication."
      }
    ],
    "createdAt": "2024-01-15T10:40:00Z",
    "updatedAt": "2024-01-15T10:40:00Z"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/generate-report/upload_abc123def456
```

**Note:** This endpoint uses OpenAI's GPT-4o-mini model to generate explanations. Ensure your `OPENAI_API_KEY` is set in the `.env` file.

### 18. Get AI Report
**GET** `/api/report/:uploadId`

Retrieve a previously generated AI-powered pharmacogenomics report.

**Parameters:**
- `uploadId` (URL parameter): The upload ID from a previous VCF upload

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadId": "upload_abc123def456",
    "sampleId": "SAMPLE_001",
    "summary": "Your pharmacogenomics analysis covers 6 drug-gene interactions...",
    "geneReports": [
      {
        "gene": "CYP2C19",
        "phenotype": "Intermediate Metabolizer",
        "drug": "CLOPIDOGREL",
        "recommendation": "Consider alternative therapy",
        "explanation": "Your genetic variant results in reduced enzyme activity...",
        "disclaimer": "This is not medical advice. Always consult your healthcare provider..."
      }
    ],
    "createdAt": "2024-01-15T10:40:00Z",
    "updatedAt": "2024-01-15T10:40:00Z"
  }
}
```

**Error Response (if report not found):**
```json
{
  "success": false,
  "error": "Report not found",
  "details": "No report found for uploadId: upload_abc123def456. Generate one using POST /api/generate-report/:uploadId"
}
```

**Example:**
```bash
curl http://localhost:3000/api/report/upload_abc123def456
```

## Automated Pipeline Workflow

The system now supports a complete automated workflow for pharmacogenomics analysis:

### Workflow Overview

```
Step 1: Upload VCF           → POST /api/upload-vcf (automatic pipeline by default)
        ↓
Step 2: Automatic Processing → Variants → Diplotypes → Phenotypes → Drug Risks
        ↓
Step 3: Generate AI Report   → POST /api/generate-report/:uploadId (optional)
        ↓
Step 4: Retrieve Results     → GET /api/pipeline-result/:uploadId or /api/report/:uploadId
```

### Example Complete Workflow (with AI Report)

```bash
# Step 1: Upload VCF (automatic pipeline runs by default)
RESPONSE=$(curl -X POST -F "file=@sample.vcf" http://localhost:3000/api/upload-vcf)
UPLOAD_ID=$(echo $RESPONSE | jq -r '.data.uploadId')

# Step 2: Check pipeline status (optional)
curl http://localhost:3000/api/pipeline-status/$UPLOAD_ID

# Step 3: Generate AI-powered report with patient-friendly explanations
curl -X POST http://localhost:3000/api/generate-report/$UPLOAD_ID

# Step 4: Get AI report with explanations
curl http://localhost:3000/api/report/$UPLOAD_ID
```

### Example Complete Workflow (without AI Report)

```bash
# Step 1: Upload VCF (automatic pipeline runs by default)
RESPONSE=$(curl -X POST -F "file=@sample.vcf" http://localhost:3000/api/upload-vcf)
UPLOAD_ID=$(echo $RESPONSE | jq -r '.data.uploadId')

# Step 2: Get complete results (raw data without AI explanations)
curl http://localhost:3000/api/pipeline-result/$UPLOAD_ID
```

### Alternative Workflow (Manual Two-Step)

If you need more control, upload first without autoPipeline, then process later:

```bash
# Step 1: Upload VCF without automatic processing
RESPONSE=$(curl -X POST -F "file=@sample.vcf" http://localhost:3000/api/upload-vcf)
UPLOAD_ID=$(echo $RESPONSE | jq -r '.data.uploadId')

# ... perform other operations ...

# Step 2: Process the pipeline when ready
curl -X POST http://localhost:3000/api/process-all/$UPLOAD_ID

# Step 3: Retrieve results
curl http://localhost:3000/api/pipeline-result/$UPLOAD_ID
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Successfully created
- `400` - Bad request (invalid file type, missing file)
- `404` - Not found
- `413` - File too large
- `500` - Internal server error

Error responses include details:
```json
{
  "error": "Failed to process VCF file",
  "details": "Invalid VCF format"
}
```

## VCF File Format

The VCF parser expects standard VCF files with:
- Header lines starting with `##`
- Column header line starting with `#CHROM`
- Variant records with required fields: CHROM, POS, REF, ALT
- Optional: ID field for rsID

Example:
```vcf
##fileformat=VCFv4.2
##fileDate=20240115
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	SAMPLE_001
1	100000	rs1234567	A	G	.	PASS	.	GT	0/1
1	200000	rs7654321	C	T	.	PASS	.	GT	1/1
```

## Diplotype Prediction

The diplotype prediction engine uses rule-based logic to match variants to pharmacogenomic star alleles without AI or phasing:

### Algorithm

1. **Load Gene Configuration**: Load SNP-to-allele mappings from `src/config/genes.json`
2. **Filter Variants**: Extract only variants relevant to the target gene (CYP2C19, CYP2D6)
3. **Match Alleles**: For each chromosome copy:
   - Score each allele based on matching variants
   - If heterozygous (0/1), assign one variant allele and one reference allele
   - If homozygous (1/1), assign the same variant allele to both copies
   - If no variants, default to wild-type allele (*1)
4. **Format Diplotype**: Sort alleles (e.g., *1/*2 not *2/*1) for consistent representation

### Supported Genes

- **CYP2C19**: 19 allele variants (covers *1 through *19)
- **CYP2D6**: 41 allele variants (covers *1 through *41)

### Assumption

- Heterozygous genotypes (0/1) = one variant allele on one chromosome, wild-type on the other
- Homozygous genotypes (1/1) = variant allele on both chromosomes
- Missing variants = wild-type allele (*1)

## Phenotype Classification

The phenotype engine maps star allele diplotypes to metabolizer phenotypes based on drug metabolism capability:

### Algorithm

1. **Load Phenotype Mappings**: Load diplotype-to-phenotype mappings from `src/config/phenotypes.json`
2. **Retrieve Diplotypes**: Get previously processed diplotypes from the Diplotype collection
3. **Match Phenotypes**: For each gene:
   - Look up the diplotype in the phenotype mapping
   - Handle reserved diplotypes (e.g., *2/*1 → *1/*2)
   - Assign metabolizer classification or "Unknown Metabolizer" if not found
4. **Store Results**: Save phenotype data to the Phenotype collection

### Phenotype Classifications

- **Normal Metabolizer**: Standard drug metabolism
- **Intermediate Metabolizer**: Reduced drug metabolism
- **Poor Metabolizer**: Significantly reduced or absent drug metabolism
- **Rapid Metabolizer**: Increased drug metabolism
- **Unknown Metabolizer**: Phenotype mapping not available

### Supported Genes and Phenotypes

**CYP2C19:** (Antidepressant, antiplatelet, and proton pump inhibitor metabolism)
- Normal Metabolizer (*1/*1, *1/*10, *10/*10)
- Intermediate Metabolizer (*1/*2-*9, *1/*17, *2/*10)
- Poor Metabolizer (*2/*2-*9 combinations)
- Rapid Metabolizer (*1/*17, *10/*17, *17/*17)

**CYP2D6:** (Antidepressant, antiarrhythmic, and antipsychotic metabolism)
- Normal Metabolizer (*1/*1, *1/*2, *2/*2)
- Intermediate Metabolizer (*1/*4-*5, *2/*4-*5, *1/*10, *2/*10, *10/*10)
- Poor Metabolizer (*4/*4, *4/*5, *5/*5)

**CYP2C9:** (Warfarin and NSAID metabolism)
- Normal Metabolizer (*1/*1)
- Intermediate Metabolizer (*1/*2, *1/*3, *1/*4)
- Poor Metabolizer (*2/*2, *2/*3, *2/*4, *3/*3, *3/*4, *4/*4)

**CYP3A4:** (Substrate metabolism and drug interactions)
- Normal Metabolizer (*1/*1)
- Increased Metabolizer (*1/*2, *1/*3)
- Ultra-Rapid Metabolizer (*2/*2, *2/*3, *3/*3)

**SLCO1B1:** (Statin and pravastatin transporter)
- Normal Function (*1a/*1a, *1a/*1f, *1f/*1f)
- Intermediate Function (*1a/*1b, *1a/*1c, *1b/*1b, *1b/*1c, *1c/*1c, *1c/*1f)
- Reduced Function (*1a/*2, *1a/*4, *1b/*2, *1b/*4, *1c/*2, *1c/*4, *1f/*2, *1f/*4, *2/*2, *2/*4, *4/*4)
- Impaired Function (*1a/*3, *1a/*5-6, *1b/*3-6, *1c/*3-6, *1f/*3-6, *2/*3-6, *3/*3-6, *4/*5-6)
- Severely Impaired Function (*3/*5-6, *5/*5-6, *6/*6)

**TPMT:** (Thiopurine drug metabolism - critical for cancer therapy)
- Normal Metabolizer (*1/*1)
- Intermediate Metabolizer (*1 with any variant allele)
- Poor Metabolizer (variant/variant combinations)

**DPYD:** (5-FU chemotherapy metabolism - critical for toxicity)
- Normal Metabolizer (*1/*1)
- Intermediate Metabolizer (*1 with variant alleles)
- Poor Metabolizer (variant/variant combinations, high toxicity risk)

## Drug-Gene Interaction Rules

The backend uses CPIC (Clinical Pharmacogenetics Implementation Consortium) guidelines to match phenotypes with drug-gene interactions:

### Supported Drugs

- **CLOPIDOGREL** (Gene: CYP2C19) - Antiplatelet therapy for cardiovascular events
  - PM: Ineffective - Use alternative (prasugrel/ticagrelor)
  - IM: Reduced efficacy - Consider alternative
  - NM/RM: Safe - Standard dosing

- **CODEINE** (Gene: CYP2D6) - Opioid analgesic
  - PM: Ineffective - Use non-opioid alternative
  - IM: Reduced efficacy - Alternative analgesic
  - NM: Safe - Standard dosing
  - UM: Toxic - Avoid due to morphine toxicity risk

- **SIMVASTATIN** (Gene: SLCO1B1) - Statin for cholesterol
  - Severely Impaired: Toxic - Avoid or use alternative
  - Impaired: High risk - Use lower dose
  - Reduced: Moderate risk - Consider reduced dose
  - Normal: Safe - Standard dosing

- **AZATHIOPRINE** (Gene: TPMT) - Immunosuppressant/cancer therapy
  - PM: Toxic (critical) - Avoid or drastically reduce
  - IM: High risk - Start with reduced dose
  - NM: Safe - Standard dosing

- **FLUOROURACIL** (Gene: DPYD) - Chemotherapy agent
  - PM: Toxic (critical) - Avoid completely
  - IM: High risk - Use reduced starting dose
  - NM: Safe - Standard dosing

- **WARFARIN** (Gene: CYP2C9) - Anticoagulant
  - PM: High toxicity risk - Lower starting dose, close INR monitoring
  - IM: Moderate risk - Consider lower dose
  - NM: Safe - Standard dosing

### Severity Levels

- **Critical**: Life-threatening toxicity or complete treatment failure - Clinical intervention required
- **High**: Significant risk of adverse outcomes - Dose adjustment or alternative recommended
- **Moderate**: Noticeable but manageable effects - Monitoring or dose adjustment suggested
- **Low**: Minimal clinical impact - Standard dosing safe

For each variant, the following fields are extracted:

- **rsid**: Variant ID (from VCF ID column)
- **chromosome**: Chromosome number
- **position**: Genomic position
- **ref**: Reference allele
- **alt**: Alternate allele
- **genotype**: Sample genotype

## Database Schema

### VariantUpload Collection

```typescript
{
  uploadId: string,           // Unique identifier
  filename: string,           // Original filename
  uploadDate: Date,          // Upload timestamp
  sampleId: string,          // Sample identifier
  variants: [
    {
      rsid: string,
      chromosome: string,
      position: number,
      ref: string,
      alt: string,
      genotype: string
    }
  ],
  createdAt: Date,           // Document creation time
  updatedAt: Date            // Last update time
}
```

### Diplotype Collection

```typescript
{
  uploadId: string,           // Reference to upload ID
  sampleId: string,          // Sample identifier
  diplotypes: [
    {
      gene: string,          // Gene name (e.g., "CYP2C19", "CYP2D6")
      allele1: string,       // First allele (e.g., "*1", "*2")
      allele2: string,       // Second allele (e.g., "*1", "*2")
      diplotype: string,     // Formatted diplotype (e.g., "*1/*2")
      matchedVariants: [
        {
          rsid: string,      // dbSNP ID
          genotype: string   // Sample genotype
        }
      ]
    }
  ],
  createdAt: Date,           // Document creation time
  updatedAt: Date            // Last update time
}
```

### Phenotype Collection

```typescript
{
  uploadId: string,           // Reference to upload ID
  sampleId: string,          // Sample identifier
  phenotypes: [
    {
      gene: string,          // Gene name (e.g., "CYP2C19", "CYP2D6")
      diplotype: string,     // Star allele diplotype (e.g., "*1/*2")
      phenotype: string      // Metabolizer classification (e.g., "Intermediate Metabolizer")
    }
  ],
  createdAt: Date,           // Document creation time
  updatedAt: Date            // Last update time
}
```

### DrugRisk Collection

```typescript
{
  uploadId: string,           // Reference to upload ID
  sampleId: string,          // Sample identifier
  geneDrugRisks: [
    {
      gene: string,          // Gene name (e.g., "CYP2C19", "CYP2D6")
      phenotype: string,     // Metabolizer phenotype (e.g., "Poor Metabolizer")
      drugs: [
        {
          drug: string,      // Drug name (e.g., "CLOPIDOGREL")
          risk: string,      // Risk level (e.g., "Ineffective", "Toxic", "Safe")
          severity: string,  // Severity (critical, high, moderate, low)
          recommendation: string // Clinical recommendation
        }
      ]
    }
  ],
  createdAt: Date,           // Document creation time
  updatedAt: Date            // Last update time
}
```

### Report Collection

```typescript
{
  uploadId: string,           // Reference to upload ID
  sampleId: string,          // Sample identifier
  summary: string,           // Overall AI-generated summary
  geneReports: [
    {
      gene: string,          // Gene name (e.g., "CYP2C19", "CYP2D6")
      phenotype: string,     // Metabolizer phenotype (e.g., "Poor Metabolizer")
      drug: string,          // Drug name (e.g., "CLOPIDOGREL")
      recommendation: string,// Clinical recommendation
      explanation: string,   // AI-generated patient-friendly explanation
      disclaimer: string     // Medical disclaimer
    }
  ],
  createdAt: Date,           // Document creation time
  updatedAt: Date            // Last update time
}
```

## Performance Considerations

- Files are temporarily stored in the `uploads/` directory and deleted after processing
- MongoDB indexes are created on `uploadId` for fast retrieval
- File size limit is configurable via environment variables
- Variants are bulk inserted into MongoDB

## Security Notes

- File uploads are validated for type (.vcf) and size
- File path traversal is prevented by multer's diskStorage
- Environment variables should never be committed to version control
- Use `.env.local` for local development overrides

## Dependencies

- **express**: Web framework
- **multer**: File upload handling
- **mongoose**: MongoDB ODM
- **openai**: OpenAI API client for AI-powered report generation
- **dotenv**: Environment variable management
- **TypeScript**: Type-safe development
- **ts-node**: TypeScript execution for development

## License

ISC

## Support

For issues or questions, please check the logs and ensure:
1. MongoDB is running and accessible
2. `.env` file is properly configured
3. Node.js version is compatible (16+)
4. Port 3000 is not in use (or configure different port)
