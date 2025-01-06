"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocketServer = void 0;
const socket_io_1 = require("socket.io");
const cors_1 = require("../config/cors");
const createSocketServer = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: cors_1.corsConfig,
        path: "/socket.io/",
        addTrailingSlash: false,
        transports: ["polling"],
        allowEIO3: true,
    });
    io.on("connection", (socket) => {
        console.log("A user connected");
        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });
    return io;
};
exports.createSocketServer = createSocketServer;
