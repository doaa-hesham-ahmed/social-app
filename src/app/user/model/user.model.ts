import {HydratedDocument, model, Schema} from 'mongoose';
import {Gender, Provider} from "../../auth/enum";
import {IUser} from "../interface/user.interface";


// shape or contract User
// export type UserDocument = IUser & Document; = export type UserDocument = HydratedDocument<IUser>;
export type UserDocument = HydratedDocument<IUser>;

const schema = new Schema<IUser>({
    userName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        toLowercase: true
    },
    password: {
        type: String,
        required: function (this) {
            return this.provider === Provider.LOCAL;
        },
        trim: true,
    },
    provider: {
        type: Number,
        default: Provider.LOCAL,
        enum: Provider
    },
    gender: {
        type: Number,
        default: Gender.MAILE,
        enum: Gender
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
        profilePicturePath:{
        type:String,
        },
        twoStepVerification: {
            type: Boolean,
            default: false
        }
},

    {
        timestamps:true,
    });

export const User = model<IUser>('User', schema);