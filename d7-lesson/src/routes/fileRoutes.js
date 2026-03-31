import { Router } from "express";
import {uploadFile, getFile} from '../controller/fileController.js';
import { uploadS3 } from "../middleware/upoload.js";
const fileRouter = Router();
fileRouter.post('/uploads-s3', uploadS3.single('file'), uploadFile);
fileRouter.get('/file', getFile);

export default fileRouter;