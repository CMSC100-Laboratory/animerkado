import express from 'express';
import mongoose from 'mongoose';
import router from './router.js';
import cors from "cors";
import path from "path"

const app = express();
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

//middleware: give authorization
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

router(app);
const startServer = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/animerkado");
    console.log("Connected to the database...");

    app.listen(5000, () => {
      console.log("Server started at port 5000");
    });

  } catch (err) {
    console.error("DB connection failed:", err);
  }
};

startServer();