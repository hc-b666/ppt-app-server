import { Router } from "express";
import { isAuthor } from "./presentation.middleware";
import controller from "./presentation.controller";

const router = Router();

router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.post("/:id/verify-author", controller.verifyAuthor);
router.post("/create", controller.create);
router.put("/:id/edit-title", isAuthor, controller.updateTitle);

export default router;
