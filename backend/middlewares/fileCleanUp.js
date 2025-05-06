import fs from 'fs';
import path from 'path';

export const cleanupUploads = (req, res, next) => {
  if (req.file) {
    const filePath = path.join('uploads', req.file.filename);
    res.on('finish', () => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  }
  next();
};