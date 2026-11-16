"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../service/user.service"));
class UserController {
    userService = user_service_1.default;
    uploadProfilePicture = async (req, res, next) => {
        try {
            console.log({ file: req.file });
            await this.userService.uploadProfilePicture(req.file, req.user?.id);
            res.json({
                message: "Profile picture Uploaded",
                success: true,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = new UserController();
