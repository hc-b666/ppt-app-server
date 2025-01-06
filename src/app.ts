import express from "express";
import cors from "cors";
import { corsConfig } from "./config/cors";
import { endpointNotFound, errorMiddleware } from "./utils/error";
import router from "./router";

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cors(corsConfig));
  app.use("/api", router);
  app.use(endpointNotFound);
  app.use(errorMiddleware);

  return app;
};
