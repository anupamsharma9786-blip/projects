import dotenv from 'dotenv';

dotenv.config();

export const config = {
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pharma-vcf',
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800', 10), // 50MB default
};
