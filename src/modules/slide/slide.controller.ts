import { Request, RequestHandler } from "express";
import SlideService from "./slide.service";
import createHttpError from "http-errors";

class SlideController {
  private slideService: SlideService;

  constructor() {
    this.slideService = SlideService.getInstance();
  }

  private validateId(req: Request) {
    const { id } = req.params;
    if (!id) {
      throw createHttpError(400, "Presentation id is required");
    }
    return id;
  }

  findAll: RequestHandler = async (req, res, next) => {
    try {
      const id = this.validateId(req);

      const result = await this.slideService.findAll(id);
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
      const id = this.validateId(req);

      const result = await this.slideService.create(id);
      if (!result.success) {
        throw createHttpError(500, result.error.message);
      }

      res.status(201).json({ message: "Successfully added new slide" });
    } catch (err) {
      next(err);
    }
  };
}

export default new SlideController();
