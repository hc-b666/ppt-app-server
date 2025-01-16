import { Router } from "express";
import { isAuthor } from "./presentation.middleware";
import controller from "./presentation.controller";

const router = Router();

router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.post("/create", controller.create);
router.put("/edit-title/:id", isAuthor, controller.updateTitle);

export default router;
