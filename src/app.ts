import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./routes/userRouter";

const app = express();

// middlewares
app.use(express.json());

// home route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to E-Library API",
  });
});

// user routes
app.use("/api/users", userRouter);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
