import { ProfileModel } from "../models/profile.js";
import { UserModel } from "../models/user.js";
import asyncHanler from 'express-async-handler'
export const createProfile = asyncHanler( async(req, res) => {
    const { nickname, userId } = req.body;
    const user = await UserModel.findById(userId);
    if (!user) {
        return res.status(404).json({
        success: false,
        error: "User not found"
        });
    }
    const profile = new ProfileModel({
        nickname,
        userId
    });
    await profile.save();
    user.profile = profile._id;
    await user.save();
    res.status(201).json({
        success: true,
        data: profile
    })
});
export const getAllProfiles = asyncHanler( async(req, res) => {
    const profiles = await ProfileModel.find({}).populate('userId', 'email').populate('file')
    res.json(profiles)
})