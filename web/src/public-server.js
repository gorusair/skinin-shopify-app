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
  logShopifySessionTokenDebug,
  normalizeShopDomain,
  verifyShopifySessionToken,
} from "./services/shopify.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const DEFAULT_SHOPIFY_API_KEY = "ad670221e1d6929bc51cf5a88084f53a";

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
  return process.env.SHOPIFY_API_KEY || DEFAULT_SHOPIFY_API_KEY;
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
    enableEmbeddedSession: true,
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

function isEmbeddedShopifyAdminRequest(req) {
  const referer = req.get("referer") || "";

  return (
    req.query.embedded === "1" ||
    Boolean(req.query.host) ||
    Boolean(req.query.shop) ||
    referer.includes("https://admin.shopify.com/")
  );
}

function redirectEmbeddedPublicPageToRoot(req, res) {
  if (!isEmbeddedShopifyAdminRequest(req)) {
    return false;
  }

  const queryString = req.originalUrl.includes("?")
    ? req.originalUrl.slice(req.originalUrl.indexOf("?"))
    : "";

  res.redirect(`/${queryString}`);
  return true;
}

app.get("/", (_req, res) => {
  res.send(renderAppInfoPage(getEmbeddedPageOptions()));
});
app.get("/privacy", (_req, res) => {
  if (redirectEmbeddedPublicPageToRoot(_req, res)) {
    return;
  }

  res.send(renderPrivacyPage());
});
app.get("/support", (_req, res) => {
  if (redirectEmbeddedPublicPageToRoot(_req, res)) {
    return;
  }

  res.send(renderSupportPage());
});
app.get("/app-info", (_req, res) => {
  if (redirectEmbeddedPublicPageToRoot(_req, res)) {
    return;
  }

  res.send(renderAppInfoPage());
});
app.get("/health", (_req, res) => {
  res.json({ ok: true, app: "Skinin Ingredient Checker Public Pages" });
});
app.post("/api/session", (req, res) => {
  console.log("[SESSION DEBUG] /api/session called");

  const authorizationHeader = req.get("authorization") || "";
  const token = getBearerToken(req);

  logShopifySessionTokenDebug({ authorizationHeader, token });

  try {
    const session = verifyShopifySessionToken(token);

    return res.json({
      ok: true,
      shop: normalizeShopDomain(session.shop),
    });
  } catch (error) {
    console.log("exact JWT verification error message:", error.message);
    res.set("X-Shopify-Retry-Invalid-Session-Request", "1");
    return res.status(401).json({ error: "invalid_session_token" });
  }
});

app.listen(port, () => {
  console.log(`Skinin public pages listening on port ${port}`);
});
