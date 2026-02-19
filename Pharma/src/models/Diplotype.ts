import mongoose, { Schema, Document } from 'mongoose';

export interface DiplotypeRecord {
  gene: string;
  allele1: string;
  allele2: string;
  diplotype: string;
  matchedVariants?: {
    rsid: string;
    genotype: string;
  }[];
}

export interface DiplotypeDocument extends Document {
  uploadId: string;
  sampleId: string;
  diplotypes: DiplotypeRecord[];
  createdAt: Date;
  updatedAt: Date;
}

const diplotypeRecordSchema = new Schema<DiplotypeRecord>({
  gene: { type: String, required: true },
  allele1: { type: String, required: true },
  allele2: { type: String, required: true },
  diplotype: { type: String, required: true },
  matchedVariants: [
    {
      rsid: { type: String },
      genotype: { type: String },
    },
  ],
});

const diplotypeSchema = new Schema<DiplotypeDocument>(
  {
    uploadId: { type: String, required: true, index: true },
    sampleId: { type: String, required: true },
    diplotypes: [diplotypeRecordSchema],
  },
  {
    timestamps: true,
  }
);

export const Diplotype = mongoose.model<DiplotypeDocument>(
  'Diplotype',
  diplotypeSchema
);
