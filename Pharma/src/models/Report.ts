import mongoose, { Schema, Document } from 'mongoose';

export interface GeneReport {
  gene: string;
  phenotype: string;
  drug: string;
  recommendation: string;
  explanation: string;
  disclaimer: string;
}

export interface IReport extends Document {
  uploadId: string;
  sampleId: string;
  summary: string;
  geneReports: GeneReport[];
  createdAt: Date;
  updatedAt: Date;
}

const GeneReportSchema = new Schema({
  gene: { type: String, required: true },
  phenotype: { type: String, required: true },
  drug: { type: String, required: true },
  recommendation: { type: String, required: true },
  explanation: { type: String, required: true },
  disclaimer: { type: String, required: true },
});

const ReportSchema = new Schema(
  {
    uploadId: { type: String, required: true, unique: true, index: true },
    sampleId: { type: String, required: true },
    summary: { type: String, required: true },
    geneReports: [GeneReportSchema],
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model<IReport>('Report', ReportSchema);
