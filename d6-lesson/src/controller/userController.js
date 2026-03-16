import { UserModel } from "../models/user.js";
import asyncHandler from 'express-async-handler'
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await UserModel.find({}).populate('posts').populate('postCount');
    return res.json(users);
})

export const getUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    return res.json(user);
});

export const createUser = asyncHandler(async (req, res) => {
    const {firstName, lastName, dateOfBirth, username, age} = req.body;
    const user = new UserModel({
        firstName,
        lastName,
        dateOfBirth,
        username,
        age
    })
    await user.save();
    res.status(201).json({
        success: true,
        data: user,
        message: 'user created successfully'
    });
})

export const updateUser = asyncHandler(async (req, res) => {
    const user = await UserModel.findByIdAndUpdate(
        req.params.id,
        req.body, 
        {
            new: true,
            runValidators: true
        }
    )
    if(!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        })
    }
    res.status(200).json({
        success: true,
        data: user,
        message: 'User updated successfully'
    })  
})

export const deleteUser = asyncHandler(async (req, res) => {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if(!user) {
        return res.status(404).json({
            success: false,
            error: 'user not found'
        });
    }
    res.status(200).json({
        success: true,
        data: {},
        message: 'user deleted successfully'
    });
})