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

const pptUsers = new Map<string, Set<{ nickname: string, socketId: string }>>();

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on("createPresentation", async (nickname) => {
    try {
      const newPpt = new Presentation({
        creator_nickname: nickname,
        users: [],
        slides: [],
      });
      const newSlide = {
        objects: [],
        order: newPpt.slides.length + 1,
      };

      newPpt.slides.push(newSlide);
      await newPpt.save();

      pptUsers.set(newPpt._id.toString(), new Set());

      socket.emit("presentationCreated", {
        success: true,
        presentation: newPpt,
      });
    } catch (err) {
      console.error("Error creating presentation:", err);
      socket.emit("presentationCreated", { success: false, err });
    }
  });

  socket.on("joinPresentation", async (presentationId: string, nickname: string) => {
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

      pptUsers.get(presentationId)?.add({ nickname, socketId: socket.id });

      socket.emit("presentationJoined", { success: true, presentation: ppt });

      socket.join(presentationId);
    } catch (err) {
      console.error("Error joining presentation:", err);
      socket.emit("presentationJoined", { success: false, error: err });
    }
  });

  socket.on("getPresentation", async (pptId: string, nickname: string) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(pptId)) {
        socket.emit("presentationReceived", {
          success: false,
          error: "Invalid presentation ID",
        });
        return;
      }
    
      const ppt = await Presentation.findById(pptId);

      if (!ppt) {
        socket.emit("presentationReceived", {
          success: false,
          error: "Presentation not found",
        });
      }

      if (ppt?.creator_nickname === nickname.trim()) {
        socket.emit("presentationReceived", { success: true, presentation: ppt, pptUsers: pptUsers.get(pptId) });
      } else { 
        socket.emit("presentationReceived", { success: true, presentation: ppt });
      }
    } catch (err) {
      console.error("Error getting presentation:", err);
      socket.emit("presentationReceived", { success: false, error: err });
    }
  });

  socket.on("addSlide", async (pptId: string, nickname: string) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(pptId)) {
        socket.emit("slideAdded", {
          success: false,
          error: "Invalid presentation ID",
        });
        return;
      }

      const ppt = await Presentation.findById(pptId);

      if (!ppt) {
        socket.emit("slideAdded", {
          success: false,
          error: "Presentation not found",
        });
        return;
      }

      if (ppt.creator_nickname !== nickname) {
        socket.emit("slideAdded", {
          success: false,
          error: "You are not the creator of this presentation",
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

  socket.on("updateElements", async (pptId: string, currSlide: number, elements) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(pptId)) {
        socket.emit("elementsUpdated", {
          success: false,
          error: "Invalid presentation ID",
        });
        return;
      }
      
      const ppt = await Presentation.findById(pptId);
      if (!ppt) {
        socket.emit("elementsUpdated", {
          success: false,
          error: "Presentation not found",
        });
        return;
      }
      
      ppt.slides[currSlide - 1].objects = elements;

      await ppt.save();
      console.log("Elements updated successfully");

      io.to(pptId).emit("elementsUpdated", { success: true, presentation: ppt });
    } catch (err) {
      console.error("Error updating elements:", err);
      socket.emit("elementsUpdated", { success: false, error: err });
    }
  });

  socket.on("disconnect", (pptId: string, nickname: string) => {
    console.log(`user disconnected: ${socket.id}`);

    if (!pptUsers.has(pptId)) {
      return;
    }

    pptUsers.get(pptId)?.delete({ nickname, socketId: socket.id });
  });
});

dbConnection();

server.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
