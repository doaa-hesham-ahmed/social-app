export class AppError extends Error {
    //message;
    //stack;
    //name;
    //cause;
   public statusCode:number;
   public isOperational:boolean;
    constructor(message:string,statusCode:number,isOperational:boolean=true){
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this,this.constructor)
    }
}

// const error = new AppError("message",404);