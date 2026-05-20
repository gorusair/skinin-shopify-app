import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import billingRoutes from "./routes/billing.js";
import ingredientRoutes from "./routes/ingredients.js";
import { getBillingStatus } from "./middleware/billing.js";
import { errorHandler } from "./middleware/error-handler.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    frameguard: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https:"],
        frameAncestors: [
          "'self'",
          "https://admin.shopify.com",
          "https://*.myshopify.com",
        ],
      },
    },
  }),
);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.get("/", async (req, res, next) => {
  try {
    if (req.query.shop) {
      const billingStatus = await getBillingStatus(req.query.shop);

      if (!billingStatus.installed) {
        return res.redirect(
          `/auth?shop=${encodeURIComponent(billingStatus.shop)}`,
        );
      }

      if (!billingStatus.hasActiveSubscription) {
        return res.redirect(
          `/billing/create?shop=${encodeURIComponent(billingStatus.shop)}`,
        );
      }
    }

    res.send(`
      <html>
        <head>
          <title>Skinin Ingredient Checker</title>
        </head>
        <body style="font-family: sans-serif; padding: 24px;">
          <h1>Skinin Ingredient Checker</h1>
          <p>App server is running on Render.</p>
          <p>Use the Shopify theme app extension to check cosmetic ingredients.</p>
        </body>
      </html>
    `);
  } catch (error) {
    next(error);
  }
});
app.get("/health", (_req, res) => {
  res.json({ ok: true, app: "Skinin Ingredient Checker" });
});

app.use("/auth", authRoutes);
app.use("/billing", billingRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Skinin Ingredient Checker listening on port ${port}`);
});
