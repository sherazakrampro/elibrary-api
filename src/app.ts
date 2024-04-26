import express from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./routes/userRouter";
import bookRouter from "./routes/bookRouter";
import { config } from "./config/config";

const app = express();

// cors
app.use(
  cors({
    origin: config.frontendDomain,
  })
);

// Middlewares
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to E-Library API",
  });
});

// Other Routes
app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
