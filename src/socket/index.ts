import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { corsConfig } from "../config/cors";
import { userHandler } from "./handlers/user.handler";

export const createSocketServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: corsConfig,
    path: "/socket.io/",
    addTrailingSlash: false,
    transports: ["polling"],
    allowEIO3: true,
  });

  io.on("connection", (socket: Socket) => {
    userHandler(io, socket);
  });

  return io;
};
