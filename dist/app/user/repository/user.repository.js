"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_model_1 = require("../model/user.model");
const abstract_repository_1 = require("../../../lib/db/abstract.repository");
class UserRepository extends abstract_repository_1.AbstractRepository {
    constructor() {
        super(user_model_1.User);
    }
    //HydratedDocument take anythineg of IUser and added it document(same "_id,__v,createdAt,updatedAt,....")
    async findByEmail(email) {
        return this.findOne({ email });
    }
}
exports.UserRepository = UserRepository;
exports.default = new UserRepository();
