require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const taskRoutes = require("./src/routes/taskRoutes");

connectDB();

const app = express();

// Middlewares
app.use(express.json()); // to Request body parse
app.use(cookieParser()); // To read HTTP-only cookies read

// CORS setup (Security point of view to proper configure )
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local development
      /\.vercel\.app$/, // Any Vercel deployment URL
    ],
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Basic test route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "Server is running, let's rock!" });
});

// Port setup
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
});
