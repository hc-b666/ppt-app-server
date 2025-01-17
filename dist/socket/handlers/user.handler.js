"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userHandler = userHandler;
const presentation_service_1 = __importDefault(require("../../modules/presentation/presentation.service"));
const rooms = new Map();
function verifyAuthor(socket, newUser) {
    return __awaiter(this, void 0, void 0, function* () {
        const { pptId, role, authorToken } = newUser;
        const presentationService = presentation_service_1.default.getInstance();
        let finalRole = role;
        if (role === "author" && authorToken) {
            try {
                const result = yield presentationService.isAuthor(authorToken, pptId);
                if (!result.success || !result.data) {
                    finalRole = "viewer";
                    console.log(`User claimed to be author but verification failed, downgraded to viewer: ${socket.id}`);
                }
            }
            catch (error) {
                finalRole = "viewer";
                console.log(`Error during author verification, defaulting to viewer: ${socket.id}`, error);
            }
        }
        else if (role === "author" && !authorToken) {
            finalRole = "viewer";
            console.log(`User claimed to be author but no token provided, defaulted to viewer: ${socket.id}`);
        }
        return finalRole;
    });
}
function userHandler(io, socket) {
    socket.on("join-ppt", (newUser) => __awaiter(this, void 0, void 0, function* () {
        const { pptId, nickname } = newUser;
        const roomId = `ppt-${pptId}`;
        let finalRole = yield verifyAuthor(socket, newUser);
        socket.join(roomId);
        if (!rooms.has(roomId)) {
            rooms.set(roomId, new Map());
        }
        const users = rooms.get(roomId);
        if (!users) {
            console.log("There is no room with this Id");
            return;
        }
        users.set(socket.id, { socketId: socket.id, nickname, role: finalRole });
        io.to(roomId).emit("new-user-joined", {
            users: Array.from(users.values()),
        });
    }));
    socket.on("leave-ppt", (pptId) => {
        const roomId = `ppt-${pptId}`;
        const users = rooms.get(roomId);
        if (users) {
            const leavingUser = users.get(socket.id);
            users.delete(socket.id);
            if (users.size === 0) {
                rooms.delete(roomId);
            }
            socket.leave(roomId);
            if (leavingUser) {
                io.to(roomId).emit("user-left", {
                    users: Array.from(users.values()),
                });
            }
        }
    });
    socket.on("disconnect", () => {
        for (const [roomId, users] of rooms.entries()) {
            if (users.has(socket.id)) {
                const leavingUser = users.get(socket.id);
                users.delete(socket.id);
                if (users.size === 0) {
                    rooms.delete(roomId);
                }
                if (leavingUser) {
                    io.to(roomId).emit("user-left", {
                        users: Array.from(users.values()),
                        leftUser: leavingUser,
                    });
                }
            }
        }
    });
}
