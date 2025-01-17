"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const presentation_1 = require("./modules/presentation");
const slide_1 = require("./modules/slide");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.status(200).json({ status: "we got your request" });
});
router.use("/presentations", presentation_1.presentationRoutes);
router.use("/slides", slide_1.slideRoutes);
exports.default = router;
