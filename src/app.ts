import  express , {Request,Response,NextFunction} from 'express'
import {router} from "./route";

export function createApp() {
    const app = express();
    app.use(express.json());
    app.use('/api', router);
    app.use((error:Error,req:Request, res:Response, next:NextFunction) => {
        res.json({message: error.message, success: false})
    });
    return app;
}