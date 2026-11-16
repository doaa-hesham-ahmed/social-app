"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
;
const schema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 200,
    },
    userId: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        trim: true,
    },
    postId: {
        type: mongoose_1.Types.ObjectId,
        ref: "Post",
        trim: true,
    },
    parentId: {
        type: mongoose_1.Types.ObjectId,
        ref: "Comment",
        trim: true,
    },
    reactionsCounts: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});
exports.Comment = (0, mongoose_1.model)("Comment", schema);
