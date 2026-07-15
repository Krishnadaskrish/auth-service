import express from "express";
import cors from "cors";
import { initDb } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  res.json({ service: "auth-service", status: "up" });
});

app.use("/auth", authRoutes);

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`[AUTH-SVC] Auth Service running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("[AUTH-SVC] Failed to initialize DB:", err.message);
  process.exit(1);
});
