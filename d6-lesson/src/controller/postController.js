import { PostModel } from "../models/post.js";
import asyncHandler from "express-async-handler";
export const getAllPosts = asyncHandler( async(req, res) => {
    const posts =  await PostModel.find({}).populate({
        path: 'author',
        select: 'firstName lastName age',
        populate: {
            path: 'profile',
            select: "nickname photo"
        }
    });
    res.json({
        success: true,
        data: posts
    })
});

export const getPostById = asyncHandler( async(req, res) => {
    const postId = req.params.id;
    const post = await PostModel.findById(postId);
    res.json(post)
});

export const createPost = asyncHandler( async(req, res) => {
    const { text, title, author } = req.body;
    const post = new PostModel({
        text,
        title,
        author
    });
    await post.save();
    res.status(201).json({
        success: true,
        data: post,
        message: 'Post create successfully'
    })

})

export const updatePost = asyncHandler( async(req, res) => {
    const post = await PostModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new : true,
            runValidators: true
        }
    )
        if(!post) {
        return res.status(404).json({
            success: false,
            error: 'Post not found'
        })
    }
    res.status(200).json({
        success: true,
        data: post,
        message: 'Post updated successfully'
    })  
})

export const deletePost = asyncHandler( async(req, res) => {
    const post = await PostModel.findByIdAndDelete(req.params.id);
    if(!post) {
        return res.status(404).json({
            success: false,
            error: 'Post not found'
        });
    }
    res.status(200).json({
        success: true,
        data: {},
        message: 'Post deleted successfully'
    })
})