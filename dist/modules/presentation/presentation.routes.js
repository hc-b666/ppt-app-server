"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const presentation_middleware_1 = require("./presentation.middleware");
const presentation_controller_1 = __importDefault(require("./presentation.controller"));
const router = (0, express_1.Router)();
router.get("/", presentation_controller_1.default.findAll);
router.get("/:id", presentation_controller_1.default.findById);
router.post("/:id/verify-author", presentation_controller_1.default.verifyAuthor);
router.post("/create", presentation_controller_1.default.create);
router.put("/:id/edit-title", presentation_middleware_1.isAuthor, presentation_controller_1.default.updateTitle);
exports.default = router;
