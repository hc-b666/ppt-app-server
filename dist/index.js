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
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./models/db"));
const Models_1 = require("./models/Models");
const mongoose_1 = __importDefault(require("mongoose"));
const corsConfig = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
};
const app = (0, express_1.default)();
app.use((0, cors_1.default)(corsConfig));
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: corsConfig,
});
const pptUsers = new Map();
io.on("connection", (socket) => {
    console.log(`user connected: ${socket.id}`);
    socket.on("createPresentation", (nickname) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newPpt = new Models_1.Presentation({
                creator_nickname: nickname,
                users: [],
                slides: [],
            });
            const newSlide = {
                objects: [],
                order: newPpt.slides.length + 1,
            };
            newPpt.slides.push(newSlide);
            yield newPpt.save();
            pptUsers.set(newPpt._id.toString(), new Set());
            socket.emit("presentationCreated", {
                success: true,
                presentation: newPpt,
            });
        }
        catch (err) {
            console.error("Error creating presentation:", err);
            socket.emit("presentationCreated", { success: false, err });
        }
    }));
    socket.on("joinPresentation", (presentationId, nickname) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(presentationId)) {
                socket.emit("presentationJoined", {
                    success: false,
                    error: "Invalid presentation ID",
                });
                return;
            }
            const ppt = yield Models_1.Presentation.findById(presentationId);
            if (!ppt) {
                socket.emit("presentationJoined", {
                    success: false,
                    error: "Presentation not found",
                });
            }
            (_a = pptUsers.get(presentationId)) === null || _a === void 0 ? void 0 : _a.add({ nickname, socketId: socket.id });
            socket.emit("presentationJoined", { success: true, presentation: ppt });
            socket.join(presentationId);
        }
        catch (err) {
            console.error("Error joining presentation:", err);
            socket.emit("presentationJoined", { success: false, error: err });
        }
    }));
    socket.on("getPresentation", (pptId, nickname) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(pptId)) {
                socket.emit("presentationReceived", {
                    success: false,
                    error: "Invalid presentation ID",
                });
                return;
            }
            const ppt = yield Models_1.Presentation.findById(pptId);
            if (!ppt) {
                socket.emit("presentationReceived", {
                    success: false,
                    error: "Presentation not found",
                });
            }
            if ((ppt === null || ppt === void 0 ? void 0 : ppt.creator_nickname) === nickname.trim()) {
                socket.emit("presentationReceived", { success: true, presentation: ppt, pptUsers: pptUsers.get(pptId) });
            }
            else {
                socket.emit("presentationReceived", { success: true, presentation: ppt });
            }
        }
        catch (err) {
            console.error("Error getting presentation:", err);
            socket.emit("presentationReceived", { success: false, error: err });
        }
    }));
    socket.on("addSlide", (pptId, nickname) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(pptId)) {
                socket.emit("slideAdded", {
                    success: false,
                    error: "Invalid presentation ID",
                });
                return;
            }
            const ppt = yield Models_1.Presentation.findById(pptId);
            if (!ppt) {
                socket.emit("slideAdded", {
                    success: false,
                    error: "Presentation not found",
                });
                return;
            }
            if (ppt.creator_nickname !== nickname) {
                socket.emit("slideAdded", {
                    success: false,
                    error: "You are not the creator of this presentation",
                });
                return;
            }
            const newSlide = {
                objects: [],
                order: ppt.slides.length + 1,
            };
            ppt.slides.push(newSlide);
            yield ppt.save();
            io.emit("slideAdded", { success: true, presentation: ppt });
        }
        catch (err) {
            console.error("Error adding slide:", err);
            socket.emit("slideAdded", { success: false, error: err });
        }
    }));
    socket.on("updateElements", (pptId, currSlide, elements) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(pptId)) {
                socket.emit("elementsUpdated", {
                    success: false,
                    error: "Invalid presentation ID",
                });
                return;
            }
            const ppt = yield Models_1.Presentation.findById(pptId);
            if (!ppt) {
                socket.emit("elementsUpdated", {
                    success: false,
                    error: "Presentation not found",
                });
                return;
            }
            ppt.slides[currSlide - 1].objects = elements;
            yield ppt.save();
            console.log("Elements updated successfully");
            io.to(pptId).emit("elementsUpdated", { success: true, presentation: ppt });
        }
        catch (err) {
            console.error("Error updating elements:", err);
            socket.emit("elementsUpdated", { success: false, error: err });
        }
    }));
    socket.on("disconnect", (pptId, nickname) => {
        var _a;
        console.log(`user disconnected: ${socket.id}`);
        if (!pptUsers.has(pptId)) {
            return;
        }
        (_a = pptUsers.get(pptId)) === null || _a === void 0 ? void 0 : _a.delete({ nickname, socketId: socket.id });
    });
});
(0, db_1.default)();
server.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
