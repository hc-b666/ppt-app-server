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
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ppts = yield this.prisma.presentation.findMany();
                return ppts;
            }
            catch (err) {
                console.log("PresentationService.findAll()", err);
                return false;
            }
        });
    }
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prisma.presentation.create({
                    data: {
                        author: dto.author,
                        title: dto.title,
                        description: dto.description,
                    },
                });
                return true;
            }
            catch (err) {
                console.log("PresentationService.create()", err);
                return false;
            }
        });
    }
}
exports.default = PresentationService;
