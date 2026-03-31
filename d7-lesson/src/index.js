import 'dotenv/config'
import express from 'express';
import { router } from './routes/index.js';
import { connectDB } from "./config/database.js";
// import Multer from 'multer';
// import path from 'path';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';


await connectDB()
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
//   }
// });
// const uploadS3 = Multer({
//   storage: Multer.memoryStorage()
// });

// app.post('/uploads-s3', uploadS3.single('file'), async (req, res) => {
//   try {
//     const file = req.file;
//     if (!file) {
//       return res.status(400).json({ error: "No file uploaded!" });
//     }

//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const params = {
//       Bucket: process.env.AWS_S3_BUCKET,
//       Key: `uploads/${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     };

//     const command = new PutObjectCommand(params); 
//     await s3.send(command);
//     const { buffer, ...rest } = req.file;
//     const newFile = rest;

//     const url = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`; 
//     res.status(200).json({
//       message: "Upload successful",
//       key: params.Key,
//       url: url,
//       file: newFile
//     });

//   } catch (err) {
//     return res.status(500).json({ error: 'Uploads fail' });
//   }
// });




app.use('/api', router);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, statusCode, message });
});

app.listen(PORT, () => {
  console.log(`Application listen on port ${PORT}`);
});