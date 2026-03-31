import { uploadToS3 } from '../service/uploadService.js';
import FileModel from '../models/file.js';
import asyncHandler from "express-async-handler"

export const uploadFile = asyncHandler(async (req, res, next) => {
  const file = req.file;
  const {profileId} = req.body;
  console.log(profileId)
  if(!file) {
    return res.status(400).json({ error: "No file uploaded!" });
  }
  const { key, url } = await uploadToS3(file);

  const fileData = new FileModel({
    profileId,
    originalName: file.originalname,
    type: file.mimetype,
    size: file.size,
    key: key,
    url: url,
  });
  await fileData.save();
  res.status(200).json({
    message: "Upload successful",
    file: fileData      
  });
}); 

export const getFile = asyncHandler (async(req, res) => {
  const getUserFile = await FileModel.find({}).populate('profileId', 'nickname url');
  if(!getUserFile) {
    return res.status(404).json({
      status: false,
      message: 'file not found'
    })
  }
  res.status(200).json({
    success: true,
    data: getUserFile
  })
});