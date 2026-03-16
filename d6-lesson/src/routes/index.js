import { Router } from "express";
import { userRouter } from "./userRoutes.js";
import { postRouter } from "./postRouters.js";
import { profileRouter } from "./profileRoutes.js";
const router = Router();
router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/profiles', profileRouter);
export {router};