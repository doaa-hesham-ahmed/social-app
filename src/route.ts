import {Router} from 'express';
import {authRouter} from "./app/auth/route";

export const router = Router();

 router.use ('/auth',authRouter);
// router.use ('/user',);
// router.use ('/comment',);
// router.use ('/post',);