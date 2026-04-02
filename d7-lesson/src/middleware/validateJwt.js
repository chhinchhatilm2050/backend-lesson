import jwt from 'jsonwebtoken';
export const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return res.status(400).json({
            success: false,
            message: 'authHeader is required'
        })
    }
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
        return res.status(400).json({
            success: false,
            message: "Invalid Token"
        })
    }
    req.user = payload;
    next();
}