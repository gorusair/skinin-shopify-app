import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import billingRoutes from "./routes/billing.js";
import ingredientRoutes from "./routes/ingredients.js";
import settingsRoutes from "./routes/settings.js";
import webhookRoutes from "./routes/webhooks.js";
import { getBillingStatus } from "./middleware/billing.js";
import { errorHandler } from "./middleware/error-handler.js";
import {
  logShopifySessionTokenDebug,
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
const PORT = process.env.PORT || 10000;
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

function renderAdminPage({ shop, appUrl }) {
  const escapedShop = shop.replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const escapedAppUrl = appUrl.replace(/"/g, "&quot;");
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Skinin – Customize Widget</title>
        <style>
          :root { color: #111827; background: #f7f8fa; font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif; }
          * { box-sizing: border-box; }
          body { margin: 0; }
          main { margin: 0 auto; max-width: 680px; padding: 48px 20px 64px; }
          h1 { font-size: 26px; margin: 0 0 6px; }
          .subtitle { color: #4b5563; font-size: 15px; margin: 0 0 36px; }
          .form-group { margin-bottom: 20px; }
          label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #374151; }
          input[type="text"], input[type="color"], textarea {
            border: 1px solid #d1d5db; border-radius: 6px; font: inherit; font-size: 14px;
            padding: 9px 12px; width: 100%;
          }
          input[type="color"] { height: 42px; padding: 4px 8px; cursor: pointer; }
          textarea { min-height: 80px; resize: vertical; }
          .color-row { display: flex; gap: 10px; align-items: center; }
          .color-row input[type="text"] { flex: 1; }
          .color-row input[type="color"] { flex: 0 0 50px; }
          fieldset { border: 1px solid #e5e7eb; border-radius: 8px; margin: 0 0 20px; padding: 16px 20px 8px; }
          legend { font-size: 13px; font-weight: 600; color: #374151; padding: 0 6px; }
          .btn-save {
            background: #1f2937; border: none; border-radius: 6px; color: #fff;
            cursor: pointer; font: inherit; font-size: 15px; font-weight: 600;
            padding: 11px 28px;
          }
          .btn-save:hover { background: #374151; }
          .msg { display: none; font-size: 14px; margin-top: 14px; padding: 10px 16px; border-radius: 6px; }
          .msg-ok { background: #d1fae5; color: #065f46; }
          .msg-err { background: #fee2e2; color: #991b1b; }
          .shop-hint { color: #6b7280; font-size: 13px; margin-bottom: 28px; }
        </style>
      </head>
      <body>
        <main>
          <h1>Customize Widget</h1>
          <p class="subtitle">Configure how the ingredient checker appears on your storefront.</p>

          ${escapedShop ? `<p class="shop-hint">Shop: <strong>${escapedShop}</strong></p>` : `
          <div class="form-group">
            <label for="field-shop">Shop domain</label>
            <input type="text" id="field-shop" placeholder="yourstore.myshopify.com">
          </div>`}

          <form id="settings-form" novalidate>
            <div class="form-group">
              <label for="field-buttonText">Button text</label>
              <input type="text" id="field-buttonText" placeholder="Check Ingredients">
            </div>

            <div class="form-group">
              <label>Button color</label>
              <div class="color-row">
                <input type="text" id="field-buttonColorHex" placeholder="#1f2937" maxlength="7">
                <input type="color" id="field-buttonColor" value="#1f2937">
              </div>
            </div>

            <div class="form-group">
              <label for="field-modalTitle">Modal title</label>
              <input type="text" id="field-modalTitle" placeholder="Ingredient Check">
            </div>

            <fieldset>
              <legend>Safety label text</legend>
              <div class="form-group">
                <label for="field-labelLow">Low concern label</label>
                <input type="text" id="field-labelLow" placeholder="Low concern">
              </div>
              <div class="form-group">
                <label for="field-labelMid">Worth noting label</label>
                <input type="text" id="field-labelMid" placeholder="Worth noting">
              </div>
              <div class="form-group">
                <label for="field-labelHigh">Potential sensitivity label</label>
                <input type="text" id="field-labelHigh" placeholder="Potential sensitivity">
              </div>
            </fieldset>

            <div class="form-group">
              <label for="field-disclaimerText">Disclaimer text</label>
              <textarea id="field-disclaimerText" placeholder="Ingredient notes are based on..."></textarea>
            </div>

            <button type="submit" class="btn-save">Save settings</button>
            <div id="msg-ok" class="msg msg-ok">Settings saved.</div>
            <div id="msg-err" class="msg msg-err">Failed to save. Please try again.</div>
          </form>
        </main>

        <script>
          (function () {
            var APP_URL = "${escapedAppUrl}";
            var PRESET_SHOP = "${escapedShop}";

            function getShop() {
              return PRESET_SHOP || document.getElementById("field-shop")?.value.trim() || "";
            }

            function setField(id, value) {
              var el = document.getElementById(id);
              if (el && value !== undefined && value !== null) el.value = value;
            }

            function loadSettings() {
              var shop = getShop();
              if (!shop) return;
              fetch(APP_URL + "/api/settings?shop=" + encodeURIComponent(shop))
                .then(function (r) { return r.ok ? r.json() : null; })
                .then(function (data) {
                  if (!data) return;
                  setField("field-buttonText", data.buttonText);
                  setField("field-buttonColorHex", data.buttonColor);
                  setField("field-buttonColor", data.buttonColor);
                  setField("field-modalTitle", data.modalTitle);
                  setField("field-disclaimerText", data.disclaimerText);
                  if (data.labels) {
                    setField("field-labelLow", data.labels.low);
                    setField("field-labelMid", data.labels.mid);
                    setField("field-labelHigh", data.labels.high);
                  }
                })
                .catch(function () {});
            }

            var colorPicker = document.getElementById("field-buttonColor");
            var colorHex = document.getElementById("field-buttonColorHex");
            colorPicker.addEventListener("input", function () { colorHex.value = colorPicker.value; });
            colorHex.addEventListener("input", function () {
              var v = colorHex.value.trim();
              if (/^#[0-9a-fA-F]{6}$/.test(v)) colorPicker.value = v;
            });

            document.getElementById("settings-form").addEventListener("submit", function (e) {
              e.preventDefault();
              var shop = getShop();
              if (!shop) { alert("Enter a shop domain first."); return; }

              var payload = {
                shop: shop,
                buttonText: document.getElementById("field-buttonText").value.trim() || "Check Ingredients",
                buttonColor: document.getElementById("field-buttonColorHex").value.trim() || "#1f2937",
                modalTitle: document.getElementById("field-modalTitle").value.trim() || "Ingredient Check",
                labels: {
                  low: document.getElementById("field-labelLow").value.trim() || "Low concern",
                  mid: document.getElementById("field-labelMid").value.trim() || "Worth noting",
                  high: document.getElementById("field-labelHigh").value.trim() || "Potential sensitivity"
                },
                disclaimerText: document.getElementById("field-disclaimerText").value.trim() || ""
              };

              fetch(APP_URL + "/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
              })
                .then(function (r) { return r.json(); })
                .then(function (data) {
                  showMsg(data.ok !== false ? "ok" : "err");
                })
                .catch(function () { showMsg("err"); });
            });

            function showMsg(type) {
              var ok = document.getElementById("msg-ok");
              var err = document.getElementById("msg-err");
              ok.style.display = type === "ok" ? "block" : "none";
              err.style.display = type === "err" ? "block" : "none";
              setTimeout(function () { ok.style.display = "none"; err.style.display = "none"; }, 4000);
            }

            loadSettings();
          })();
        </script>
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
app.get("/privacy", (req, res) => {
  if (redirectEmbeddedPublicPageToRoot(req, res)) {
    return;
  }

  res.send(
    renderPrivacyPage({
      apiSessionUrl: getApiSessionUrl(),
      enableEmbeddedSession: false,
      shopifyApiKey: getShopifyApiKey(),
    }),
  );
});
app.get("/support", (req, res) => {
  if (redirectEmbeddedPublicPageToRoot(req, res)) {
    return;
  }

  res.send(
    renderSupportPage({
      apiSessionUrl: getApiSessionUrl(),
      enableEmbeddedSession: false,
      shopifyApiKey: getShopifyApiKey(),
    }),
  );
});
app.get("/app-info", (req, res) => {
  if (redirectEmbeddedPublicPageToRoot(req, res)) {
    return;
  }

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
  console.log("[SESSION DEBUG] /api/session called");

  const authorizationHeader = req.get("authorization") || "";
  const token = getBearerToken(req);

  logShopifySessionTokenDebug({ authorizationHeader, token });

  try {
    const session = verifyShopifySessionToken(token);
    const billingStatus = await getBillingStatus(session.shop);

    return res.json({
      ok: true,
      shop: normalizeShopDomain(session.shop),
      installed: billingStatus.installed,
      hasActiveSubscription: billingStatus.hasActiveSubscription,
    });
  } catch (error) {
    console.log("exact JWT verification error message:", error.message);
    res.set("X-Shopify-Retry-Invalid-Session-Request", "1");
    return res.status(401).json({ error: "invalid_session_token" });
  }
}

app.post("/api/session", handleSessionVerification);
app.get("/api/session", handleSessionVerification);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/settings", settingsRoutes);
app.get("/admin", (req, res) => {
  const shop = String(req.query.shop || "");
  const appUrl = getAppUrl();
  res.send(renderAdminPage({ shop, appUrl }));
});
app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Skinin Ingredient Checker listening on port ${PORT}`);
});
