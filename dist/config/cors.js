"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfig = void 0;
exports.corsConfig = {
    credentials: true,
    origin: ["http://localhost:8080", "http://localhost:8081"],
    methods: ["GET", "POST", "PUT"],
};
// https://ppt-app-client.vercel.app
