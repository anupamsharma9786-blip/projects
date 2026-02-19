import { VariantUpload, VariantUploadDocument } from '../models/VariantUpload';
import { randomBytes } from 'crypto';

export class VariantService {
  /**
   * Saves variant data to MongoDB
   */
  async saveVariantUpload(data: {
    filename: string;
    sampleId: string;
    variants: any[];
    selectedDrugs?: string[];
  }): Promise<VariantUploadDocument> {
    const uploadId = this.generateUploadId();

    const uploadDocument = new VariantUpload({
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
  async getVariantUpload(uploadId: string): Promise<VariantUploadDocument | null> {
    return await VariantUpload.findOne({ uploadId });
  }

  /**
   * Get all variant uploads (with pagination)
   */
  async getAllVariantUploads(
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: VariantUploadDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const data = await VariantUpload.find()
      .sort({ uploadDate: -1 })
      .skip(skip)
      .limit(limit);
    const total = await VariantUpload.countDocuments();
    return { data, total };
  }

  /**
   * Generates a unique upload ID
   */
  private generateUploadId(): string {
    return `upload_${randomBytes(12).toString('hex')}`;
  }
}
