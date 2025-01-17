"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const slide_controller_1 = __importDefault(require("./slide.controller"));
const presentation_middleware_1 = require("../presentation/presentation.middleware");
const router = (0, express_1.Router)();
router.get("/:id", slide_controller_1.default.findAll);
router.post("/:id/create", presentation_middleware_1.isAuthor, slide_controller_1.default.create);
exports.default = router;
