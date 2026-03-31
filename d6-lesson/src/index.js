import express from 'express';
import 'dotenv/config'
import { router } from './routes/index.js';
import { connectDB } from "./config/database.js";
import Multer from 'multer';
import path from 'path'
import { v2 as cloudinary } from 'cloudinary' // ✅ fixed import

await connectDB()
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// ✅ Multer memory storage
const storage = Multer.memoryStorage();

// ✅ File filters
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

const videoFilter = (req, file, cb) => {
  const allowedMimetypes = /^video\/(mp4|mov|avi|mkv)$/;
  const allowedExts = /\.(mp4|mov|avi|mkv)$/;
  const mimetype = allowedMimetypes.test(file.mimetype);
  const extname = allowedExts.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only video files (mp4, mov, avi, mkv) are allowed!'));
  }
};

const pdfFilter = (req, file, cb) => {
  const allowedMimetypes = /^application\/pdf$/;
  const allowedExts = /\.pdf$/;
  const mimetype = allowedMimetypes.test(file.mimetype);
  const extname = allowedExts.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'));
  }
};

// ✅ Multer instances for each file type
const uploadImage = Multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imageFilter });
const uploadVideo = Multer({ storage, limits: { fileSize: 50 * 1024 * 1024 }, fileFilter: videoFilter });
const uploadPDF   = Multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: pdfFilter });

// ✅ Helper function
const uploadToCloudinary = async (file, folder, resourceType) => {
  const b64 = Buffer.from(file.buffer).toString("base64");
  const dataURI = "data:" + file.mimetype + ";base64," + b64;
  return await cloudinary.uploader.upload(dataURI, {
    folder: folder,
    resource_type: resourceType
  });
};

// ✅ Upload IMAGE → images folder
app.post('/upload/images', uploadImage.single('file'), async (req, res) => {
  try {
    const result = await uploadToCloudinary(req.file, 'images', 'image');
    res.status(200).json({
      success: true,
      url: result.secure_url,        
      public_id: result.public_id,  
      filename: result.original_filename, 
      format: result.format,              
      size: result.bytes,                
      resource_type: result.resource_type, 
      width: result.width,         
      height: result.height,         
      createdAt: result.created_at,  
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Upload VIDEO → video folder
app.post('/upload/video', uploadVideo.single('file'), async (req, res) => {
  try {
    const result = await uploadToCloudinary(req.file, 'video', 'video');
    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Upload PDF → pdfs folder
app.post('/upload/pdfs', uploadPDF.single('file'), async (req, res) => {
  try {
    const result = await uploadToCloudinary(req.file, 'pdfs', 'raw');
    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Delete file from Cloudinary
app.delete('/delete/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok') {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    res.status(200).json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.use('/api', router);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, statusCode, message });
});

app.listen(PORT, () => {
  console.log(`Application listen on port ${PORT}`);
});