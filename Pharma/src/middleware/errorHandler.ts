import { Express, Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  if (err.message.includes('File too large') || err.message.includes('LIMIT_FILE_SIZE')) {
    res.status(413).json({
      error: 'File size exceeds the maximum limit',
      details: `Maximum file size is 50MB`,
    });
    return;
  }

  if (err.message.includes('.vcf')) {
    res.status(400).json({
      error: 'Invalid file type',
      details: 'Only .vcf files are allowed',
    });
    return;
  }

  res.status(500).json({
    error: 'Internal server error',
    details: err.message,
  });
};
