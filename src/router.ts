import { Router } from "express";
import { presentationRoutes } from "./modules/presentation";
import { slideRoutes } from "./modules/slide";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({ status: "we got your request" });
});

router.use("/presentations", presentationRoutes);
router.use("/slides", slideRoutes);

export default router;
