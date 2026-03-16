import { Router } from "express";
import { createProfile, getAllProfiles } from "../controller/profileController.js";
const profileRouter = Router();
profileRouter.post('/', createProfile);
profileRouter.get('/', getAllProfiles);
export {profileRouter};