import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import ingredientRoutes from "./routes/ingredients.js";
import { errorHandler } from "./middleware/error-handler.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ ok: true, app: "Skinin Ingredient Checker" });
});

app.use("/api/ingredients", ingredientRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Skinin Ingredient Checker listening on port ${port}`);
});
