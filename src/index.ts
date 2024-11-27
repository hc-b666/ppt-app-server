import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dbConnection from "./models/db";
import { Presentation } from "./models/Models";
import mongoose from "mongoose";

const corsConfig = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST"],
};

const app = express();

app.use(cors(corsConfig));

const server = createServer(app);

const io = new Server(server, {
  cors: corsConfig,
});

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on("createPresentation", async (nickname) => {
    try {
      const newPresentation = new Presentation({
        creator_nickname: nickname,
        users: [],
        slides: [],
      });
      await newPresentation.save();
      socket.emit("presentationCreated", {
        success: true,
        presentation: newPresentation,
      });
    } catch (err) {
      console.error("Error creating presentation:", err);
      socket.emit("presentationCreated", { success: false, err });
    }
  });

  socket.on("joinPresentation", async (presentationId, nickname) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(presentationId)) {
        socket.emit("presentationJoined", {
          success: false,
          error: "Invalid presentation ID",
        });
        return;
      }

      const ppt = await Presentation.findById(presentationId);

      if (!ppt) {
        socket.emit("presentationJoined", {
          success: false,
          error: "Presentation not found",
        });
      }

      let user = ppt?.users.find((u) => u.nickname === nickname);

      if (!user) {
        const u = {
          nickname,
          role: "viewer",
        };
        ppt?.users.push(u);
        await ppt?.save();
      }

      socket.emit("presentationJoined", { success: true, presentation: ppt });

      socket.join(presentationId);
    } catch (err) {
      console.error("Error joining presentation:", err);
      socket.emit("presentationJoined", { success: false, error: err });
    }
  });

  socket.on("getPresentation", async (presentationId) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(presentationId)) {
        socket.emit("presentationJoined", {
          success: false,
          error: "Invalid presentation ID",
        });
        return;
      }

      const ppt = await Presentation.findById(presentationId);

      if (!ppt) {
        socket.emit("presentationJoined", {
          success: false,
          error: "Presentation not found",
        });
      }

      socket.emit("presentationJoined", { success: true, presentation: ppt });
    } catch (err) {
      console.error("Error getting presentation:", err);
      socket.emit("presentationJoined", { success: false, error: err });
    }
  });

  socket.on("addSlide", async (presentationId) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(presentationId)) {
        socket.emit("slideAdded", {
          success: false,
          error: "Invalid presentation ID",
        });
        return;
      }

      const ppt = await Presentation.findById(presentationId);

      if (!ppt) {
        socket.emit("slideAdded", {
          success: false,
          error: "Presentation not found",
        });
        return;
      }

      const newSlide = {
        objects: [],
        order: ppt.slides.length + 1,
      };

      ppt.slides.push(newSlide);
      await ppt.save();

      io.emit("slideAdded", { success: true, presentation: ppt });
    } catch (err) {
      console.error("Error adding slide:", err);
      socket.emit("slideAdded", { success: false, error: err });
    }
  });

  socket.on("addObject", async (presentationId, slideIndex, object) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(presentationId)) {
        socket.emit("objectAdded", {
          success: false,
          error: "Invalid presentation ID",
        });
        return;
      }

      const ppt = await Presentation.findById(presentationId);

      if (!ppt) {
        socket.emit("objectAdded", {
          success: false,
          error: "Presentation not found",
        });
        return;
      }

      const slide = ppt.slides.find((s) => s._id.toString() === slideIndex);

      if (!slide) {
        socket.emit("objectAdded", {
          success: false,
          error: "Slide not found",
        });
        return;
      }

      slide.objects.push(object);

      await ppt.save();

      io.emit("objectAdded", { success: true, presentation: ppt });
    } catch (err) {
      console.error("Error adding object:", err);
      socket.emit("objectAdded", { success: false, error: err });
    }
  });

  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.id}`);
  });
});

dbConnection();

server.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
