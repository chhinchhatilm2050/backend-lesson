import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controller/userController.js';
import { Router } from 'express';
import { verifyJWT } from '../middleware/validateJwt.js';
const userRouter = Router();
userRouter.get('/', verifyJWT, getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', createUser);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser)
export {userRouter};