"use strict";
// import { logger } from "../../pkg/logger/logger.js";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = globalErrorHandler;
function globalErrorHandler(err, req, res, _next) {
    // Log the real error for debugging
    // logger.error(err.message, {
    //     stack: err.stack,
    //     name: err.name,
    //     code: err.code,
    //     correlationId: req.correlatioId
    // });
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            // stack: err.stack,
            // correlatioId: req.correlatioId,
            message: err.message,
            success: false
        });
    }
    return res.status(500).json({
        message: "Internal Server Error",
        // correlatioId: req.correlatioId,
        success: false
    });
}
