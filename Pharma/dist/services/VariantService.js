"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariantService = void 0;
const VariantUpload_1 = require("../models/VariantUpload");
const crypto_1 = require("crypto");
class VariantService {
    /**
     * Saves variant data to MongoDB
     */
    async saveVariantUpload(data) {
        const uploadId = this.generateUploadId();
        const uploadDocument = new VariantUpload_1.VariantUpload({
            uploadId,
            filename: data.filename,
            uploadDate: new Date(),
            sampleId: data.sampleId,
            variants: data.variants,
            selectedDrugs: data.selectedDrugs,
        });
        return await uploadDocument.save();
    }
    /**
     * Retrieves variant upload by ID
     */
    async getVariantUpload(uploadId) {
        return await VariantUpload_1.VariantUpload.findOne({ uploadId });
    }
    /**
     * Get all variant uploads (with pagination)
     */
    async getAllVariantUploads(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const data = await VariantUpload_1.VariantUpload.find()
            .sort({ uploadDate: -1 })
            .skip(skip)
            .limit(limit);
        const total = await VariantUpload_1.VariantUpload.countDocuments();
        return { data, total };
    }
    /**
     * Generates a unique upload ID
     */
    generateUploadId() {
        return `upload_${(0, crypto_1.randomBytes)(12).toString('hex')}`;
    }
}
exports.VariantService = VariantService;
//# sourceMappingURL=VariantService.js.map