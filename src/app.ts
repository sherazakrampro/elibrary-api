import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
