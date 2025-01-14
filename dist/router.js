"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const presentation_1 = require("./modules/presentation");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.status(200).json({ status: "we got your request" });
});
router.use("/presentations", presentation_1.presentationRoutes);
exports.default = router;
