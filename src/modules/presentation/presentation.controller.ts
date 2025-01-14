import { RequestHandler } from "express";
import createHttpError from "http-errors";
import PresentationService from "./presentation.service";
import { createPresentationSchema } from "./dto/create.dto";

class PresentationController {
  private presentationService: PresentationService;

  constructor() {
    this.presentationService = PresentationService.getInstance();
  }

  findAll: RequestHandler = async (_req, res, next) => {
    try {
      const result = await this.presentationService.findAll();
      if (!result) {
        throw createHttpError(500, { message: "Could not get presentations" });
      }

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  create: RequestHandler = async (req, res, next) => {
    try {
      const requestBody = createPresentationSchema.safeParse(req.body);
      if (!requestBody.success) {
        const firstError = requestBody.error.errors[0];
        throw createHttpError(400, { message: firstError });
      }

      const result = await this.presentationService.create(requestBody.data);
      if (!result) {
        throw createHttpError(500, {
          message: "Could not create presentation. Try again later",
        });
      }

      res.status(201).json({ message: "Successfully created presentation" });
    } catch (err) {
      next(err);
    }
  };
}

export default new PresentationController();
