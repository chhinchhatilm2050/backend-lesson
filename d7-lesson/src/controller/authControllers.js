import asyncHandler from 'express-async-handler';
import { UserModel } from '../models/user.js';
import jwt from 'jsonwebtoken';
export const login = asyncHandler (async(req, res, next) => {
    const {email, password} = req.body;
    const user = await UserModel.findOne({email: email}).select('password email');
    if(!user) {
        return res.status(400).json({
            success: false,
            message: 'User or password incroorct'
        });
    }
    if(!(await user.isMatch(password))) {
        return res.status(400).json({
            success: false,
            message: 'User or password incroorct'
        })
    };
    const token = jwt.sign(
        {
            sub: user._id,
            email: user.email

        }, process.env.JWT_SECRET,
        {
            issuer: 'ChhatServer',
            expiresIn: '10m'
        }
    );
    const { password: pwd, ...userWithoutPassword } = user.toObject()
    return res.json({token, user: userWithoutPassword});
    
})