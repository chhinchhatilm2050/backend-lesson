import { Router } from "express";
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from "../controller/postController.js";
import { verifyJWT } from "../middleware/validateJwt.js";
import { checkOwnership } from "../middleware/authorize.js";
import { PostModel } from "../models/post.js";

const postRouter = Router();
postRouter.use(verifyJWT);
postRouter.get('/', getAllPosts);
postRouter.get('/:id', getPostById);
postRouter.post('/', createPost);
postRouter.put('/:id', checkOwnership(PostModel), updatePost);
postRouter.delete('/:id',checkOwnership(PostModel), deletePost);
export {postRouter};