"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const enum_1 = require("../../auth/enum");
const schema = new mongoose_1.Schema({
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
        required: function () {
            return this.provider === enum_1.Provider.LOCAL;
        },
        trim: true,
    },
    provider: {
        type: Number,
        default: enum_1.Provider.LOCAL,
        enum: enum_1.Provider
    },
    gender: {
        type: Number,
        default: enum_1.Gender.MAILE,
        enum: enum_1.Gender
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
    profilePicturePath: {
        type: String,
    }
}, {
    timestamps: true,
});
exports.User = (0, mongoose_1.model)('User', schema);
