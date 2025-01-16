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
const http_errors_1 = __importDefault(require("http-errors"));
const presentation_service_1 = __importDefault(require("./presentation.service"));
const create_dto_1 = require("./dto/create.dto");
const updateTitle_1 = require("./dto/updateTitle");
class PresentationController {
    constructor() {
        this.findAll = (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.presentationService.findAll();
                if (!result.success) {
                    throw (0, http_errors_1.default)(500, result.error.message);
                }
                res.status(200).json(result.data);
            }
            catch (err) {
                next(err);
            }
        });
        this.findById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = this.validateId(req);
                const result = yield this.presentationService.findById(id);
                if (!result.success) {
                    throw (0, http_errors_1.default)(500, result.error.message);
                }
                res.status(200).json(result.data);
            }
            catch (err) {
                next(err);
            }
        });
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, success, error } = create_dto_1.createPresentationSchema.safeParse(req.body);
                if (!success) {
                    const firstError = error.errors[0];
                    throw (0, http_errors_1.default)(400, { message: firstError });
                }
                const result = yield this.presentationService.create(data);
                if (!result.success) {
                    throw (0, http_errors_1.default)(500, result.error.message);
                }
                res.status(201).json({
                    message: "Successfully created presentation",
                    data: result.data,
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.updateTitle = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = this.validateId(req);
                const { data, success, error } = updateTitle_1.updateTitleSchema.safeParse(req.body);
                if (!success) {
                    const firstError = error.errors[0];
                    throw (0, http_errors_1.default)(400, { message: firstError });
                }
                const result = yield this.presentationService.updateTitle(id, data.title);
                if (!result.success) {
                    throw (0, http_errors_1.default)(500, result.error.message);
                }
                res
                    .status(200)
                    .json({ message: "Successfully updated presentation title" });
            }
            catch (err) {
                next(err);
            }
        });
        this.presentationService = presentation_service_1.default.getInstance();
    }
    validateId(req) {
        const { id } = req.params;
        if (!id) {
            throw (0, http_errors_1.default)(400, "Presentation id is required");
        }
        return id;
    }
}
exports.default = new PresentationController();
