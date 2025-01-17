import { Router } from "express";
import controller from "./slide.controller";
import { isAuthor } from "../presentation/presentation.middleware";

const router = Router();

router.get("/:id", controller.findAll);
router.post("/:id/create", isAuthor, controller.create);

export default router;
