import { Router } from "express";
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from "../controller/postController.js";
const postRouter = Router();
postRouter.get('/', getAllPosts);
postRouter.get('/:id', getPostById);
postRouter.post('/', createPost);
postRouter.put('/:id', updatePost);
postRouter.delete('/:id', deletePost);
export {postRouter};