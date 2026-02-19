import mongoose, { Schema, Document } from 'mongoose';

export interface PhenotypeRecord {
  gene: string;
  diplotype: string;
  phenotype: string;
}

export interface PhenotypeDocument extends Document {
  uploadId: string;
  sampleId: string;
  phenotypes: PhenotypeRecord[];
  createdAt: Date;
  updatedAt: Date;
}

const phenotypeRecordSchema = new Schema<PhenotypeRecord>({
  gene: { type: String, required: true },
  diplotype: { type: String, required: true },
  phenotype: { type: String, required: true },
});

const phenotypeSchema = new Schema<PhenotypeDocument>(
  {
    uploadId: { type: String, required: true, index: true },
    sampleId: { type: String, required: true },
    phenotypes: [phenotypeRecordSchema],
  },
  {
    timestamps: true,
  }
);

export const Phenotype = mongoose.model<PhenotypeDocument>(
  'Phenotype',
  phenotypeSchema
);
