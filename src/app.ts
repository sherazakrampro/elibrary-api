import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./routes/userRouter";
import bookRouter from "./routes/bookRouter";

const app = express();

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
