import {ICloudProvider} from "../../../pkg/cloud/cloud.interface";
import {s3CloudProvider} from "../../../lib/cloud/init";
import userRepository from "../repository/user.repository";

class UserService{
    private readonly cloudProvider:ICloudProvider=s3CloudProvider;
    private readonly userRepository=userRepository
     uploadProfilePicture=async (file:Express.Multer.File,userId:string)=>{
       const key = await this.cloudProvider.uploadFile(file ,`users ${userId}`);
       await userRepository.update({_id:userId},{profilePicturePath:key});
    }
}
export default new UserService();