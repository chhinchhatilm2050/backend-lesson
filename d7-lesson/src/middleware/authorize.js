import asyncHandler from 'express-async-handler'
export const authorize = (...role) => {
    return (req, res, next) => {
        if(!role.includes(req.user.role)) {
            throw Error(`Role '${req.user.role}' is not authorized to access this route`);
        }
        next();
    }
};

export const checkOwnership = (Model) => {
    return asyncHandler(async(req, res, next) => {
        const resource = await Model.findById(req.params.id);
        if(!resource) {
            throw  Error('Resource not found');
        }
        const isOwner = resource.author.toString() === req.user.sub.toString();
        const isAdmin = req.user.role === 'admin';
    
        if(!isOwner && !isAdmin) {
            throw  Error('You do not have permission to modify this resource');
        }
    
        req.resource = resource;
        next();
    });

}