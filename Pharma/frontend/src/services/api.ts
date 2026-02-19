import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    uploadId: string;
    filename: string;
    uploadDate: string;
    sampleId: string;
    variantCount: number;
  };
}

export interface DiplotypeResult {
  gene: string;
  diplotype: string;
  alleles: string[];
}

export interface PhenotypeResult {
  gene: string;
  phenotype: string;
  activityScore?: number;
}

export interface DrugRisk {
  drug: string;
  gene: string;
  recommendation: string;
  level: string;
  implications?: string;
}

export interface GeneReport {
  gene: string;
  phenotype: string;
  drug: string;
  recommendation: string;
  explanation: string;
  disclaimer: string;
}

export interface DetailedDrugReport {
  patient_id: string;
  drug: string;
  timestamp: string;
  risk_assessment: {
    risk_label: string;
    confidence_score: number;
    severity: string;
  };
  pharmacogenomic_profile: {
    primary_gene: string;
    diplotype: string;
    phenotype: string;
    detected_variants: Array<{
      rsid: string;
      genotype: string;
    }>;
  };
  clinical_recommendation: {
    recommendation: string;
    risk_description: string;
    dosage_adjustment?: string;
  };
  llm_generated_explanation: {
    summary: string;
    disclaimer: string;
  };
  quality_metrics: {
    vcf_parsing_success: boolean;
    variant_count: number;
    genes_analyzed: number;
  };
}

export interface Report {
  uploadId: string;
  sampleId?: string;
  summary?: string;
  selectedDrugs?: string[];
  geneReports?: GeneReport[];
  detailedReports?: DetailedDrugReport[];
  diplotypes?: DiplotypeResult[];
  phenotypes?: PhenotypeResult[];
  drugRisks?: DrugRisk[];
  explanation?: string;
  timestamp?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Upload VCF file
export const uploadVcf = async (file: File, selectedDrugs?: string[]): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Add selected drugs as JSON string if provided
  if (selectedDrugs && selectedDrugs.length > 0) {
    formData.append('selectedDrugs', JSON.stringify(selectedDrugs));
  }

  const response = await apiClient.post<UploadResponse>('/api/upload-vcf', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Trigger diplotype analysis
export const analyzeDiplotype = async (uploadId: string): Promise<DiplotypeResult[]> => {
  const response = await apiClient.post<DiplotypeResult[]>(`/api/process-diplotype/${uploadId}`);
  return response.data;
};

// Trigger phenotype analysis
export const analyzePhenotype = async (uploadId: string): Promise<PhenotypeResult[]> => {
  const response = await apiClient.post<PhenotypeResult[]>(`/api/process-phenotype/${uploadId}`);
  return response.data;
};

// Trigger drug risk analysis
export const analyzeDrugRisk = async (uploadId: string): Promise<DrugRisk[]> => {
  const response = await apiClient.post<DrugRisk[]>(`/api/process-drug-risk/${uploadId}`);
  return response.data;
};

// Generate report
export const generateReport = async (uploadId: string): Promise<Report> => {
  const response = await apiClient.post<{ success: boolean; data: Report }>(`/api/generate-report/${uploadId}`);
  return response.data.data;
};

// Get drug catalog
export const getDrugCatalog = async (): Promise<string[]> => {
  const response = await apiClient.get<{ success: boolean; data: { totalDrugs: number; allDrugs: string[]; geneInfo: any[] } }>('/api/drug-catalog');
  return response.data.data.allDrugs;
};

export default apiClient;
