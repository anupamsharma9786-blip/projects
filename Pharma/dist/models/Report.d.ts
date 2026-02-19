import mongoose, { Document } from 'mongoose';
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
export declare const Report: mongoose.Model<IReport, {}, {}, {}, mongoose.Document<unknown, {}, IReport> & IReport & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=Report.d.ts.map