import mongoose, { Document } from 'mongoose';
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
export declare const Diplotype: mongoose.Model<DiplotypeDocument, {}, {}, {}, mongoose.Document<unknown, {}, DiplotypeDocument> & DiplotypeDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=Diplotype.d.ts.map