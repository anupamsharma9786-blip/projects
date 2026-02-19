import mongoose, { Document } from 'mongoose';
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
export declare const VariantUpload: mongoose.Model<VariantUploadDocument, {}, {}, {}, mongoose.Document<unknown, {}, VariantUploadDocument> & VariantUploadDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=VariantUpload.d.ts.map