import express from "express";
// import cors from 'cors';
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import morgan from "morgan";
dotenv.config();

const app = express();

// app.use(cors({ origin: true, credentials: true }));

// 1. FIXED CORS POLICY FOR THE GATEWAY & FRONTEND LAYER
// app.use(cors({
//   origin: ['http://localhost:8080'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin']
// }));

app.use(morgan("dev"));

app.use(express.json());

// 2. Mount it as global middleware BEFORE your routes
app.use("/", authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Auth Service running on port ${PORT}`);
  });
});
