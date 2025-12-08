import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true },
    source: { type: String, default: "portfolio" }
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
