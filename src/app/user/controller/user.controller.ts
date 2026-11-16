import {Request,Response,NextFunction} from "express";
import userService from "../service/user.service";

class UserController{
    private readonly userService=userService;
    uploadProfilePicture = async (req:Request,res:Response,next:NextFunction)=>{
        try {
            console.log({file:req.file});
            await this.userService.uploadProfilePicture(req.file as Express.Multer.File,req.user?.id)
            res.json({
                message:"Profile picture Uploaded",
                success:true,
            })
        }catch (error){
            next(error)
        }
    }
}
export default new UserController();