import Multer from 'multer';
import path from 'path'

const imageFilter = (req, file, cb) => {
  const allowedMimetypes = /^image\/(jpeg|png|gif|webp)$/;
  const allowedExts = /\.(jpeg|jpg|png|gif|webp)$/;
  const mimetype = allowedMimetypes.test(file.mimetype);
  const extname = allowedExts.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed!'));
  }
};

export const uploadS3 = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024  
  },
  fileFilter: imageFilter
});