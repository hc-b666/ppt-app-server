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
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
class PresentationService {
    constructor() {
        this.prisma = prisma_1.default;
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new PresentationService();
        }
        return this.instance;
    }
    isAuthor(authorToken, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ppt = yield this.prisma.presentation.findUnique({
                    where: {
                        id,
                        authorToken,
                    },
                });
                if (!ppt) {
                    return {
                        success: false,
                        error: new Error("Presentation not found"),
                    };
                }
                return { success: true, data: true };
            }
            catch (err) {
                console.log("PresentationService.isAuthor()", err);
                return {
                    success: false,
                    error: err instanceof Error ? err : new Error("Unexpected error occured!"),
                };
            }
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ppts = yield this.prisma.presentation.findMany({
                    select: {
                        id: true,
                        author: true,
                        title: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                });
                return { success: true, data: ppts };
            }
            catch (err) {
                console.log("PresentationService.findAll()", err);
                return {
                    success: false,
                    error: err instanceof Error ? err : new Error("Unexpected error occured!"),
                };
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ppt = yield this.prisma.presentation.findUnique({
                    select: {
                        id: true,
                        author: true,
                        title: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                    where: {
                        id,
                    },
                });
                if (!ppt) {
                    return {
                        success: false,
                        error: new Error("Presentation not found"),
                    };
                }
                return { success: true, data: ppt };
            }
            catch (err) {
                console.log("Presentation.findById()", err);
                return {
                    success: false,
                    error: err instanceof Error ? err : new Error("Unexpected error occured!"),
                };
            }
        });
    }
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authorToken = crypto_1.default.randomUUID();
                const ppt = yield this.prisma.presentation.create({
                    data: {
                        author: dto.author,
                        authorToken,
                        title: dto.title,
                        description: dto.description,
                    },
                });
                return {
                    success: true,
                    data: { presentationId: ppt.id, authorToken },
                };
            }
            catch (err) {
                console.log("PresentationService.create()", err);
                return {
                    success: false,
                    error: err instanceof Error ? err : new Error("Unexpected error occured"),
                };
            }
        });
    }
    updateTitle(id, title) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ppt = yield this.prisma.presentation.findUnique({
                    where: {
                        id,
                    },
                });
                if (!ppt) {
                    return {
                        success: false,
                        error: new Error("Presentation not found"),
                    };
                }
                yield this.prisma.presentation.update({
                    data: {
                        title,
                    },
                    where: {
                        id,
                    },
                });
                return { success: true, data: true };
            }
            catch (err) {
                console.log("PresentationService.updateTitle()", err);
                return {
                    success: false,
                    error: err instanceof Error ? err : new Error("Unexpected error occured"),
                };
            }
        });
    }
}
exports.default = PresentationService;
