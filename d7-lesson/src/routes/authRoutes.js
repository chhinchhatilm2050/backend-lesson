import { Router } from "express";
import { login } from "../controller/authControllers.js";
const authRouter = Router();
authRouter.post('/login', login);

export {authRouter};