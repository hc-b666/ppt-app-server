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
exports.isAuthor = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const presentation_service_1 = __importDefault(require("./presentation.service"));
const isAuthor = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorToken } = req.query;
        if (!authorToken || typeof authorToken !== "string") {
            throw (0, http_errors_1.default)(400, "Author token is required");
        }
        const { id } = req.params;
        if (!id) {
            throw (0, http_errors_1.default)(400, "Presentation Id is required");
        }
        const pptService = presentation_service_1.default.getInstance();
        const result = yield pptService.isAuthor(authorToken, id);
        if (!result.success || !result.data) {
            throw (0, http_errors_1.default)(401, "Incorrect author token. Not allowed");
        }
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.isAuthor = isAuthor;
