import {Schema, model, Types, HydratedDocument} from "mongoose";
import {IUser} from "../../user/interface/user.interface";
export type CommentDocument = HydratedDocument<IComment>;

export interface IComment {
    content: String;
    userId: Types.ObjectId;
    postId:Types.ObjectId;
    parentId:Types.ObjectId;
    reactionsCounts:number;
};

const schema=  new Schema<IComment>({
    content:{
        type:String,
        required:true,
        trim :true,
        minLength:1,
        maxLength:200,
    },
    userId:{
        type:Types.ObjectId,
        ref:"User",
        trim:true,
    },
    postId:{
        type:Types.ObjectId,
        ref:"Post",
        trim:true,
    },
    parentId:{
        type:Types.ObjectId,
        ref:"Comment",
        trim:true,
    },
    reactionsCounts:{
        type:Number,
        default:0,
    }
}, {
    timestamps:true,
    }
)

export const Comment = model<IComment>("Comment",schema);