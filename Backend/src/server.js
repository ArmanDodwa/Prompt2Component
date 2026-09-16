import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import componentRoutes from "./routes/component.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import morgan from "morgan";
dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin']
}));

app.use(morgan("dev"));

app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/components", componentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Auth Service running on port ${PORT}`);
  });
});
