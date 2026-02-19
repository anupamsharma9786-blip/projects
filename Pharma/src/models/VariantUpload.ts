import mongoose, { Schema, Document } from 'mongoose';

export interface Variant {
  rsid: string;
  chromosome: string;
  position: number;
  ref: string;
  alt: string;
  genotype: string;
}

export interface VariantUploadDocument extends Document {
  uploadId: string;
  filename: string;
  uploadDate: Date;
  sampleId: string;
  variants: Variant[];
  selectedDrugs?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const variantSchema = new Schema<Variant>({
  rsid: { type: String, required: true },
  chromosome: { type: String, required: true },
  position: { type: Number, required: true },
  ref: { type: String, required: true },
  alt: { type: String, required: true },
  genotype: { type: String, required: true },
});

const variantUploadSchema = new Schema<VariantUploadDocument>(
  {
    uploadId: { type: String, required: true, unique: true, index: true },
    filename: { type: String, required: true },
    uploadDate: { type: Date, required: true, default: Date.now },
    sampleId: { type: String, required: true },
    variants: [variantSchema],
    selectedDrugs: { type: [String], required: false },
  },
  {
    timestamps: true,
  }
);

export const VariantUpload = mongoose.model<VariantUploadDocument>(
  'VariantUpload',
  variantUploadSchema
);
