import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();
const app = express();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PORT from Railway
const PORT = process.env.PORT || 5000;

// CLIENT URL (Vercel)
const CLIENT_URL =
  process.env.CLIENT_URL || "https://portfolio-frontend-cyan-sigma.vercel.app";

// ------------ MIDDLEWARE -------------
app.use(express.json());

// CORS — allow frontend
app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:5173"],
    methods: ["GET", "POST"],
  })
);

// ------------ STATIC RESUME FILES -------------
app.use(
  "/resume",
  express.static(path.join(__dirname, "resume"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".pdf")) res.setHeader("Content-Type", "application/pdf");
      if (filePath.endsWith(".docx"))
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
    },
  })
);

// ------------ API ROUTES ------------
app.use("/api/messages", messageRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Somnath portfolio backend running",
    environment: process.env.NODE_ENV || "development",
  });
});

// ------------ CONNECT TO MONGO + START SERVER ------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
