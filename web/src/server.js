import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import billingRoutes from "./routes/billing.js";
import ingredientRoutes from "./routes/ingredients.js";
import webhookRoutes from "./routes/webhooks.js";
import { getBillingStatus } from "./middleware/billing.js";
import { errorHandler } from "./middleware/error-handler.js";
import {
  normalizeShopDomain,
  verifyShopifySessionToken,
} from "./services/shopify.js";
import {
  renderEmbeddedSessionScript,
  renderAppInfoPage,
  renderPrivacyPage,
  renderSupportPage,
} from "./public-pages.js";

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
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://cdn.shopify.com",
        ],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: [
          "'self'",
          "https:",
          "https://admin.shopify.com",
          "https://*.myshopify.com",
        ],
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

function getBearerToken(req) {
  const authorizationHeader = req.get("authorization") || "";
  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme?.toLowerCase() !== "bearer") {
    return null;
  }

  return token;
}

function renderHomePage({ billingStatus, billingBypassed }) {
  const shopConnected = billingStatus?.installed === true;
  const appInstalled = billingStatus ? billingStatus.installed : true;
  const billingMode = billingBypassed
    ? "Development bypass"
    : "Active subscription";
  const appStatus = appInstalled ? "Installed" : "Needs setup";
  const storeStatus = shopConnected ? "Connected" : "Connect store";
  const appDotClass = appInstalled ? "dot" : "dot dot-pending";
  const storeDotClass = shopConnected ? "dot" : "dot dot-pending";

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="shopify-api-key" content="${getShopifyApiKey()}">
        <title>Skinin Ingredient Checker</title>
        <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
        <style>
          :root {
            color: #111827;
            background: #f7f8fa;
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
          }
          main {
            margin: 0 auto;
            max-width: 1040px;
            padding: 48px 20px 64px;
          }
          .hero {
            margin-bottom: 30px;
            max-width: 720px;
          }
          h1 {
            font-size: 34px;
            line-height: 1.15;
            margin: 0 0 12px;
          }
          .subtitle {
            color: #4b5563;
            font-size: 16px;
            line-height: 1.6;
            margin: 0;
            max-width: 680px;
          }
          .page-stack {
            display: grid;
            gap: 20px;
          }
          section {
            padding: 0;
          }
          .status-grid {
            display: grid;
            gap: 14px;
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
          .status-card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 18px;
          }
          h2 {
            font-size: 18px;
            line-height: 1.3;
            margin: 0 0 16px;
          }
          h3 {
            color: #374151;
            font-size: 13px;
            font-weight: 600;
            line-height: 1.4;
            margin: 0 0 8px;
          }
          ul,
          ol {
            margin: 0;
            padding-left: 22px;
          }
          li {
            line-height: 1.55;
            margin: 8px 0;
          }
          .status-value {
            align-items: center;
            display: flex;
            gap: 10px;
            color: #111827;
            font-weight: 700;
            margin: 0;
          }
          .dot {
            background: #16a34a;
            border-radius: 999px;
            flex: 0 0 auto;
            height: 9px;
            width: 9px;
          }
          .dot-pending {
            background: #d97706;
          }
          .content-grid {
            display: grid;
            gap: 20px;
            grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.8fr);
          }
          .content-section {
            border-top: 1px solid #e5e7eb;
            padding-top: 24px;
          }
          .example {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            color: #1f2937;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
            line-height: 1.55;
            margin: 0;
            overflow-wrap: anywhere;
            padding: 14px 16px;
          }
          .section-note {
            color: #6b7280;
            font-size: 13px;
            line-height: 1.5;
            margin: 12px 0 0;
          }
          .session-message {
            color: #6b7280;
            font-size: 13px;
            line-height: 1.5;
            margin: 10px 0 0;
          }
          @media (max-width: 760px) {
            main {
              padding-top: 28px;
            }
            .status-grid,
            .content-grid {
              grid-template-columns: 1fr;
            }
          }
        </style>
      </head>
      <body>
        <main>
          <div class="hero">
            <h1>Skinin Ingredient Checker</h1>
            <p class="subtitle">Help shoppers review cosmetic ingredients directly on product pages.</p>
          </div>

          <div class="page-stack">
            <section aria-labelledby="status-heading">
              <h2 id="status-heading">Setup Status</h2>
              <div class="status-grid">
                <div class="status-card">
                  <h3>App installed</h3>
                  <p class="status-value"><span class="${appDotClass}"></span>${appStatus}</p>
                </div>
                <div class="status-card">
                  <h3>Store connected</h3>
                  <p class="status-value"><span class="${storeDotClass}"></span>${storeStatus}</p>
                </div>
                <div class="status-card">
                  <h3>Theme app extension ready</h3>
                  <p class="status-value"><span class="dot"></span>Ready</p>
                </div>
                <div class="status-card">
                  <h3>Billing mode</h3>
                  <p class="status-value"><span class="dot"></span>${billingMode}</p>
                </div>
              </div>
            </section>

            <div class="content-grid">
              <section class="content-section">
                <h2>Setup Guide</h2>
                <ol>
                  <li>Go to Online Store &gt; Themes &gt; Customize.</li>
                  <li>Open a product page template.</li>
                  <li>Add the Skinin Ingredient Checker app block.</li>
                  <li>Add ingredients to product descriptions.</li>
                  <li>Preview the product page and click Check Ingredients.</li>
                </ol>
              </section>

              <section class="content-section">
                <h2>Best Practices</h2>
                <ul>
                  <li>Start ingredient lists with "Ingredients:"</li>
                  <li>Separate ingredients with commas.</li>
                  <li>Keep product descriptions clear.</li>
                  <li>Avoid unsupported medical claims.</li>
                </ul>
              </section>
            </div>

            <section class="content-section">
              <h2>Example Ingredient Format</h2>
              <p class="example">Ingredients: Water, Glycerin, Niacinamide, Panthenol, Fragrance</p>
              <p class="section-note">Use this format in product descriptions so the storefront checker can find the ingredient list reliably.</p>
              <p class="session-message" id="session-message">Checking embedded Shopify session.</p>
            </section>
          </div>
        </main>
        ${renderEmbeddedSessionScript({ apiSessionUrl: getApiSessionUrl() })}
      </body>
    </html>
  `;
}

app.get("/", async (req, res, next) => {
  try {
    let billingStatus = null;
    const billingBypassed = process.env.BYPASS_BILLING === "true";
    const isEmbeddedRequest = req.query.embedded === "1" || req.query.host;

    if (req.query.shop) {
      billingStatus = await getBillingStatus(req.query.shop);

      if (!isEmbeddedRequest && !billingStatus.installed) {
        return res.redirect(
          `/auth?shop=${encodeURIComponent(billingStatus.shop)}`,
        );
      }

      if (!isEmbeddedRequest && !billingStatus.hasActiveSubscription) {
        return res.redirect(
          `/billing/create?shop=${encodeURIComponent(billingStatus.shop)}`,
        );
      }
    }

    res.send(renderHomePage({ billingStatus, billingBypassed }));
  } catch (error) {
    next(error);
  }
});
app.get("/privacy", (_req, res) => {
  res.send(
    renderPrivacyPage({
      apiSessionUrl: getApiSessionUrl(),
      enableEmbeddedSession: false,
      shopifyApiKey: getShopifyApiKey(),
    }),
  );
});
app.get("/support", (_req, res) => {
  res.send(
    renderSupportPage({
      apiSessionUrl: getApiSessionUrl(),
      enableEmbeddedSession: false,
      shopifyApiKey: getShopifyApiKey(),
    }),
  );
});
app.get("/app-info", (_req, res) => {
  res.send(
    renderAppInfoPage({
      apiSessionUrl: getApiSessionUrl(),
      enableEmbeddedSession: false,
      shopifyApiKey: getShopifyApiKey(),
    }),
  );
});
app.get("/health", (_req, res) => {
  res.json({ ok: true, app: "Skinin Ingredient Checker" });
});

app.use("/auth", authRoutes);
app.use("/billing", billingRoutes);
async function handleSessionVerification(req, res) {
  try {
    const session = verifyShopifySessionToken(getBearerToken(req));
    const billingStatus = await getBillingStatus(session.shop);

    return res.json({
      ok: true,
      shop: normalizeShopDomain(session.shop),
      installed: billingStatus.installed,
      hasActiveSubscription: billingStatus.hasActiveSubscription,
    });
  } catch (error) {
    res.set("X-Shopify-Retry-Invalid-Session-Request", "1");
    return res.status(401).json({ error: "invalid_session_token" });
  }
}

app.post("/api/session", handleSessionVerification);
app.get("/api/session", handleSessionVerification);
app.use("/api/ingredients", ingredientRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Skinin Ingredient Checker listening on port ${port}`);
});
