import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

import webhookRoutes from "./routes/webhooks.js";
import {
  renderAppInfoPage,
  renderPrivacyPage,
  renderSupportPage,
} from "./public-pages.js";
import {
  normalizeShopDomain,
  verifyShopifySessionToken,
} from "./services/shopify.js";

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
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.shopify.com"],
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
app.use(
  "/webhooks",
  express.raw({ type: "application/json", limit: "1mb" }),
  webhookRoutes,
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

function getShopifyApiKey() {
  return process.env.SHOPIFY_API_KEY || "";
}

function getAppUrl() {
  return (
    process.env.APP_URL ||
    process.env.APPLICATION_URL ||
    "https://skinin-ingredient-checker.onrender.com"
  ).replace(/\/$/, "");
}

function getApiSessionUrl() {
  return `${getAppUrl()}/api/session`;
}

function getEmbeddedPageOptions() {
  return {
    apiSessionUrl: getApiSessionUrl(),
    shopifyApiKey: getShopifyApiKey(),
  };
}

function getBearerToken(req) {
  const authorizationHeader = req.get("authorization") || "";
  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme?.toLowerCase() !== "bearer") {
    return null;
  }

  return token;
}

app.get("/", (_req, res) => {
  res.redirect("/privacy");
});
app.get("/privacy", (_req, res) => {
  res.send(renderPrivacyPage(getEmbeddedPageOptions()));
});
app.get("/support", (_req, res) => {
  res.send(renderSupportPage(getEmbeddedPageOptions()));
});
app.get("/app-info", (_req, res) => {
  res.send(renderAppInfoPage(getEmbeddedPageOptions()));
});
app.get("/health", (_req, res) => {
  res.json({ ok: true, app: "Skinin Ingredient Checker Public Pages" });
});
app.post("/api/session", (req, res) => {
  try {
    const session = verifyShopifySessionToken(getBearerToken(req));

    return res.json({
      ok: true,
      shop: normalizeShopDomain(session.shop),
    });
  } catch (error) {
    res.set("X-Shopify-Retry-Invalid-Session-Request", "1");
    return res.status(401).json({ error: "invalid_session_token" });
  }
});

app.listen(port, () => {
  console.log(`Skinin public pages listening on port ${port}`);
});
