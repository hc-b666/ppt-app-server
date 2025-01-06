import express from "express";
import cors from "cors";
import { corsConfig } from "./config/cors";

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cors(corsConfig));

  return app;
};
