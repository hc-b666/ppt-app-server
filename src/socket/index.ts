import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { corsConfig } from "../config/cors";

export const createSocketServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: corsConfig,
    path: "/socket.io",
    transports: ["websocket", "polling"],
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
