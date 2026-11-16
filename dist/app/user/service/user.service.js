"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../../../lib/cloud/init");
const user_repository_1 = __importDefault(require("../repository/user.repository"));
class UserService {
    cloudProvider = init_1.s3CloudProvider;
    userRepository = user_repository_1.default;
    uploadProfilePicture = async (file, userId) => {
        const key = await this.cloudProvider.uploadFile(file, `users ${userId}`);
        await user_repository_1.default.update({ _id: userId }, { profilePicturePath: key });
    };
}
exports.default = new UserService();
