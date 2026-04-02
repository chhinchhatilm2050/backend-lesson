import asyncHandler from 'express-async-handler';
import { UserModel } from '../models/user.js';
import jwt from 'jsonwebtoken';

const generateToken = (userId, payload, secret, expire) => {
    return jwt.sign({ sub: userId, ...payload }, secret, {
        issuer: 'ChatServer',
        expiresIn: expire
    });
};
const generateRefreshToken = (userId, secret, expire) => {
    return jwt.sign({ sub: userId }, secret, {
        issuer: 'ChatServer',
        expiresIn: expire
    });
};

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).select('password email refreshToken role');

    if (!user || !(await user.isMatch(password))) {
        return res.status(400).json({
            success: false,
            message: 'User or password incorrect',
        });
    }

    const token = generateToken(
        user._id, 
        {
            email: user.email,
            role: user.role,
            username: user.username
        } ,
        process.env.JWT_SECRET,
        process.env.JWT_EXPIRE_IN
    );
    const refreshToken = generateRefreshToken(
        user._id, 
        process.env.JWT_REFRESH_SECRET, 
        process.env.JWT_REFRESH_EXPIRE_IN
    ); 

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _pwd, ...userWithoutPassword } = user.toObject();
    return res.json({ token, user: userWithoutPassword });
});

export const refresh = asyncHandler(async (req, res) => {
    
    const token = req.cookies?.refreshToken;
    console.log(token)
    

    if (!token) {
        return res.status(401).json({ success: false, message: 'No refresh token' }); 
    }

    const decode = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await UserModel.findById(decode.sub).select('refreshToken email role username');

    if (!user || user.refreshToken !== token) {
        return res.status(401).json({ success: false, message: 'Invalid refresh token' }); 
    }
    console.log(process.env.JWT_EXPIRE_IN)
    const accessToken = generateToken(
        user._id,
        {
            email: user.email,
            role: user.role,
            username: user.username
        },
        process.env.JWT_SECRET,
        process.env.JWT_EXPIRE_IN  
    );
    return res.json({ success: true, accessToken });
});


export const logout = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken;

    if (!token) {
        return res.status(401).json({ success: false, message: 'No refresh token' }); 
    }

    const user = await UserModel.findOne({ refreshToken: token }).select('refreshToken');

    if (!user) {
        return res.status(401).json({ success: false, message: 'No user found' }); 
    }

    user.refreshToken = null; 
    await user.save();

    res.clearCookie('refreshToken');
    return res.json({ success: true, message: 'Logout successfully' }); 
});