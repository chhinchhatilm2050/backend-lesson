import {PutObjectCommand } from '@aws-sdk/client-s3';
import {s3} from '../config/s3.js'
import path from 'path'

export const uploadToS3 = async (file) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `uploads/${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  console.log(params.Key)

  const command = new PutObjectCommand(params);
  await s3.send(command);
  const url = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
  return { key: params.Key, url };
};