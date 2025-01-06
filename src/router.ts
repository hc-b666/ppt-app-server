import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({ status: "we got your request" });
});

export default router;
