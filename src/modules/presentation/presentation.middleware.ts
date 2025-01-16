import { RequestHandler } from "express";
import createHttpError from "http-errors";
import PresentationService from "./presentation.service";

export const isAuthor: RequestHandler = async (req, _res, next) => {
  try {
    const { authorToken } = req.query;
    if (!authorToken || typeof authorToken !== "string") {
      throw createHttpError(400, "Author token is required");
    }

    const { id } = req.params;
    if (!id) {
      throw createHttpError(400, "Presentation Id is required");
    }

    const pptService = PresentationService.getInstance();
    const result = await pptService.isAuthor(authorToken, id);
    if (!result.success || !result.data) {
      throw createHttpError(401, "Incorrect author token. Not allowed");
    }

    next();
  } catch (err) {
    next(err);
  }
};
