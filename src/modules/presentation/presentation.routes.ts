import { Router } from "express";
import controller from "./presentation.controller";

const router = Router();

router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.post("/create", controller.create);

export default router;
