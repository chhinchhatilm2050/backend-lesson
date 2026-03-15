import express from 'express';
const router = express.Router();
import userRouter from './user.js';
import postRouter from './post.js';


router.use('/users', userRouter);
router.use('/posts', postRouter);

export default router;