import multer from 'multer';
import path from 'path';
import { config } from '../config';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: config.maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() === '.vcf') {
      cb(null, true);
    } else {
      cb(new Error('Only .vcf files are allowed'));
    }
  },
});
