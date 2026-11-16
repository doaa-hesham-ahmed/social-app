"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const node_http_1 = __importDefault(require("node:http"));
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB_1 = require("./lib/db/connectDB");
const app = (0, app_1.createApp)();
const server = node_http_1.default.createServer();
(0, connectDB_1.connectDB)();
server.listen(3000, () => {
    console.log(`server is running on PORT ${3000}`);
});
async function shutdown() {
    await mongoose_1.default.disconnect();
    server.close();
    process.exit(0);
}
;
process.on("SIGINT", shutdown);
process.on("SIGALRM", shutdown);
