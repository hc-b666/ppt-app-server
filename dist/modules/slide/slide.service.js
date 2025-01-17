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
const prisma_1 = __importDefault(require("../../utils/prisma"));
class SlideService {
    constructor() {
        this.prisma = prisma_1.default;
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new SlideService();
        }
        return this.instance;
    }
    findAll(pptId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ppt = yield this.prisma.presentation.findUnique({
                    select: {
                        slides: {
                            select: {
                                id: true,
                                order: true,
                            },
                        },
                    },
                    where: { id: pptId },
                });
                if (!ppt) {
                    return {
                        success: false,
                        error: new Error("Presentation not found"),
                    };
                }
                return { success: true, data: ppt.slides };
            }
            catch (err) {
                console.log("SlideService.findAll()", err);
                return {
                    success: false,
                    error: err instanceof Error ? err : new Error("Unexpected error occured"),
                };
            }
        });
    }
    create(pptId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ppt = yield this.prisma.presentation.findUnique({
                    include: {
                        slides: true,
                    },
                    where: { id: pptId },
                });
                if (!ppt) {
                    return {
                        success: false,
                        error: new Error("Presentation not found"),
                    };
                }
                const nextSlideOrder = ppt.slides.length + 1;
                yield this.prisma.slide.create({
                    data: {
                        presentationId: pptId,
                        order: nextSlideOrder,
                    },
                });
                return { success: true, data: true };
            }
            catch (err) {
                console.log("SlideService.create()", err);
                return {
                    success: false,
                    error: err instanceof Error ? err : new Error("Unexpected error occured"),
                };
            }
        });
    }
}
exports.default = SlideService;
