import mongoose, { Schema, Document } from 'mongoose';

export interface DrugRisk {
  drug: string;
  risk: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  recommendation: string;
}

export interface GeneDrugRisks {
  gene: string;
  phenotype: string;
  drugs: DrugRisk[];
}

export interface DrugRiskDocument extends Document {
  uploadId: string;
  sampleId: string;
  geneDrugRisks: GeneDrugRisks[];
  createdAt: Date;
  updatedAt: Date;
}

const drugRiskSchema = new Schema<DrugRisk>({
  drug: { type: String, required: true },
  risk: { type: String, required: true },
  severity: {
    type: String,
    enum: ['low', 'moderate', 'high', 'critical'],
    required: true,
  },
  recommendation: { type: String, required: true },
});

const geneDrugRisksSchema = new Schema<GeneDrugRisks>({
  gene: { type: String, required: true },
  phenotype: { type: String, required: true },
  drugs: [drugRiskSchema],
});

const drugRiskDocumentSchema = new Schema<DrugRiskDocument>(
  {
    uploadId: { type: String, required: true, index: true },
    sampleId: { type: String, required: true },
    geneDrugRisks: [geneDrugRisksSchema],
  },
  {
    timestamps: true,
  }
);

export const DrugRiskModel = mongoose.model<DrugRiskDocument>(
  'DrugRisk',
  drugRiskDocumentSchema
);
