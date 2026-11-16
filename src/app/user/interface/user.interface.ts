import {Gender, Provider} from "../../auth/enum";

export interface IUser {
    userName: string;
    email: string;
    password: string;
    provider: Provider;
    gender: Gender;
    phoneNumber?: string;
    isVerified:boolean;
    isDeleted:boolean;
    profilePicturePath?:string;
    twoStepVerification: boolean;

}