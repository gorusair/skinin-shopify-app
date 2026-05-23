import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import webhookRoutes from "./routes/webhooks.js";
import {
  renderAppInfoPage,
  renderPrivacyPage,
  renderSupportPage,
} from "./public-pages.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    frameguard: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.shopify.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        frameAncestors: [
          "'self'",
          "https://admin.shopify.com",
          "https://*.myshopify.com",
        ],
      },
    },
  }),
);
app.use(
  "/webhooks",
  express.raw({ type: "application/json", limit: "1mb" }),
  webhookRoutes,
);
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.redirect("/privacy");
});
app.get("/privacy", (_req, res) => {
  res.send(renderPrivacyPage());
});
app.get("/support", (_req, res) => {
  res.send(renderSupportPage());
});
app.get("/app-info", (_req, res) => {
  res.send(renderAppInfoPage());
});
app.get("/health", (_req, res) => {
  res.json({ ok: true, app: "Skinin Ingredient Checker Public Pages" });
});

app.listen(port, () => {
  console.log(`Skinin public pages listening on port ${port}`);
});
