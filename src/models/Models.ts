import mongoose, { Schema } from "mongoose";

const SlideObjectSchema = new Schema({
  tool: {
    type: String,
    required: true,
  },
  x1: {
    type: Number,
    required: true,
  },
  y1: {
    type: Number,
    required: true,
  },
  x2: {
    type: Number,
    required: true,
  },
  y2: {
    type: Number,
    required: true,
  },
  // slideId: {
  //   type: String,
  //   required: true,
  // }
  roughElement: mongoose.Schema.Types.Mixed,
});

const SlideSchema = new Schema({
  objects: {
    type: [SlideObjectSchema],
    default: [],
  },
  order: {
    type: Number,
    required: true,
  },
});

const UserSchema = new Schema({
  nickname: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["viewer", "editor"],
    required: true,
  },
});

const PresentationSchema = new Schema({
  creator_nickname: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  users: {
    type: [UserSchema],
    default: [],
  },
  slides: {
    type: [SlideSchema],
    default: [],
  },
});

// export const SlideObject = mongoose.model("SlideObjects", SlideObjectSchema);
// export const User = mongoose.model("User", UserSchema);
// export const Slide = mongoose.model("Slide", SlideSchema);
export const Presentation = mongoose.model("Presentation", PresentationSchema);
