import mongoose, { Document } from 'mongoose';
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
export declare const DrugRiskModel: mongoose.Model<DrugRiskDocument, {}, {}, {}, mongoose.Document<unknown, {}, DrugRiskDocument> & DrugRiskDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=DrugRisk.d.ts.map