import mongoose, { Document } from 'mongoose';
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
export declare const Phenotype: mongoose.Model<PhenotypeDocument, {}, {}, {}, mongoose.Document<unknown, {}, PhenotypeDocument> & PhenotypeDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=Phenotype.d.ts.map