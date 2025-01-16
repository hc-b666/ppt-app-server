"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTitleSchema = void 0;
const zod_1 = require("zod");
exports.updateTitleSchema = zod_1.z.object({
    title: zod_1.z.string(),
});
