"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Presentation = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const SlideObjectSchema = new mongoose_1.Schema({
    id: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    x1: {
        type: Number,
        required: true,
    },
    y1: {
        type: Number,
        required: true,
    },
    x2: {
        type: Number,
        required: true,
    },
    y2: {
        type: Number,
        required: true,
    },
    roughElement: mongoose_1.default.Schema.Types.Mixed,
});
const SlideSchema = new mongoose_1.Schema({
    objects: {
        type: [SlideObjectSchema],
        default: [],
    },
    order: {
        type: Number,
        required: true,
    },
});
const UserSchema = new mongoose_1.Schema({
    nickname: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["viewer", "editor"],
        required: true,
    },
});
const PresentationSchema = new mongoose_1.Schema({
    creator_nickname: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    users: {
        type: [UserSchema],
        default: [],
    },
    slides: {
        type: [SlideSchema],
        default: [],
    },
});
// export const SlideObject = mongoose.model("SlideObjects", SlideObjectSchema);
// export const User = mongoose.model("User", UserSchema);
// export const Slide = mongoose.model("Slide", SlideSchema);
exports.Presentation = mongoose_1.default.model("Presentation", PresentationSchema);
