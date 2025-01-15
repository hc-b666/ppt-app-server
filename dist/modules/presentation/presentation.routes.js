"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const presentation_controller_1 = __importDefault(require("./presentation.controller"));
const router = (0, express_1.Router)();
router.get("/", presentation_controller_1.default.findAll);
router.get("/:id", presentation_controller_1.default.findById);
router.post("/create", presentation_controller_1.default.create);
exports.default = router;
