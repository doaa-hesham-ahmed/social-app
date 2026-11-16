import {User, UserDocument} from "../model/user.model";
import {AbstractRepository} from "../../../lib/db/abstract.repository";
import {IUser} from "../interface/user.interface";
import {HydratedDocument} from "mongoose";

export class UserRepository extends AbstractRepository<IUser> {

    constructor() {
        super(User);
    }
    //HydratedDocument take anythineg of IUser and added it document(same "_id,__v,createdAt,updatedAt,....")
    async findByEmail(email:string):Promise<UserDocument | null> {
        return this.findOne({ email });
    }
}

export default new UserRepository();