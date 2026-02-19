import { VariantUploadDocument } from '../models/VariantUpload';
export declare class VariantService {
    /**
     * Saves variant data to MongoDB
     */
    saveVariantUpload(data: {
        filename: string;
        sampleId: string;
        variants: any[];
        selectedDrugs?: string[];
    }): Promise<VariantUploadDocument>;
    /**
     * Retrieves variant upload by ID
     */
    getVariantUpload(uploadId: string): Promise<VariantUploadDocument | null>;
    /**
     * Get all variant uploads (with pagination)
     */
    getAllVariantUploads(page?: number, limit?: number): Promise<{
        data: VariantUploadDocument[];
        total: number;
    }>;
    /**
     * Generates a unique upload ID
     */
    private generateUploadId;
}
//# sourceMappingURL=VariantService.d.ts.map