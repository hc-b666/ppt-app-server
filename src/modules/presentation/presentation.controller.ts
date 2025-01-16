import { Request, RequestHandler } from "express";
import createHttpError from "http-errors";
import PresentationService from "./presentation.service";
import { createPresentationSchema } from "./dto/create.dto";
import { updateTitleSchema } from "./dto/updateTitle";

class PresentationController {
  private presentationService: PresentationService;

  constructor() {
    this.presentationService = PresentationService.getInstance();
  }

  private validateId(req: Request) {
    const { id } = req.params;
    if (!id) {
      throw createHttpError(400, "Presentation id is required");
    }
    return id;
  }

  findAll: RequestHandler = async (_req, res, next) => {
    try {
      const result = await this.presentationService.findAll();
      if (!result.success) {
        throw createHttpError(500, result.error.message);
      }

      res.status(200).json(result.data);
    } catch (err) {
      next(err);
    }
  };

  findById: RequestHandler = async (req, res, next) => {
    try {
      const id = this.validateId(req);

      const result = await this.presentationService.findById(id);
      if (!result.success) {
        throw createHttpError(500, result.error.message);
      }

      res.status(200).json(result.data);
    } catch (err) {
      next(err);
    }
  };

  create: RequestHandler = async (req, res, next) => {
    try {
      const { data, success, error } = createPresentationSchema.safeParse(
        req.body
      );
      if (!success) {
        const firstError = error.errors[0];
        throw createHttpError(400, { message: firstError });
      }

      const result = await this.presentationService.create(data);
      if (!result.success) {
        throw createHttpError(500, result.error.message);
      }

      res.status(201).json({
        message: "Successfully created presentation",
        data: result.data,
      });
    } catch (err) {
      next(err);
    }
  };

  updateTitle: RequestHandler = async (req, res, next) => {
    try {
      const id = this.validateId(req);
      const { data, success, error } = updateTitleSchema.safeParse(req.body);
      if (!success) {
        const firstError = error.errors[0];
        throw createHttpError(400, { message: firstError });
      }

      const result = await this.presentationService.updateTitle(id, data.title);
      if (!result.success) {
        throw createHttpError(500, result.error.message);
      }

      res
        .status(200)
        .json({ message: "Successfully updated presentation title" });
    } catch (err) {
      next(err);
    }
  };
}

export default new PresentationController();
