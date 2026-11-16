import {Router} from "express";
import userController from "./controller/user.controller";
import { uploadSingleFile} from "../../lib/media/multer";

export const userRouter = Router();

userRouter.post('/upload-profile-pic',uploadSingleFile('pp'),userController.uploadProfilePicture);