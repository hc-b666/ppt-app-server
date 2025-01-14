import { Router } from "express";
import { presentationRoutes } from "./modules/presentation";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({ status: "we got your request" });
});

router.use("/presentations", presentationRoutes);

export default router;
