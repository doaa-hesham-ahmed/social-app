import * as buffer from "node:buffer";

export interface ICloudProvider{
    //updateFile = deleteFile + uploadFile
    uploadFile(file:Express.Multer.File , path:string):Promise<string>;
    deleteFile(key:string):Promise<void>;
    getFile(key:string):Promise<Buffer>;
}