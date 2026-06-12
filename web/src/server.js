import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { INGREDIENT_SAFETY } from "./services/ingredient-analyzer.js";
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

const defaultRatingsJson = JSON.stringify(
  Object.fromEntries(Object.entries(INGREDIENT_SAFETY).map(([k, v]) => [k, v.rating])),
);

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
        scriptSrcAttr: ["'unsafe-inline'"],
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

function renderHomePage({ billingStatus, billingBypassed, shop }) {
  const appInstalled = billingStatus ? billingStatus.installed : true;
  const shopConnected = billingStatus?.installed === true;
  const resolvedShop = shop || billingStatus?.shop || "";
  const adminUrl = resolvedShop
    ? `/admin?shop=${encodeURIComponent(resolvedShop)}`
    : "/admin";
  const storeUrl = resolvedShop ? `https://${resolvedShop}` : null;
  const appDotClass = appInstalled ? "dot dot-green" : "dot dot-amber";
  const storeDotClass = shopConnected ? "dot dot-green" : "dot dot-amber";
  const billingMode = billingBypassed ? "Development bypass" : "Active subscription";

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
          :root { color: #111827; background: #f7f8fa; font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif; }
          * { box-sizing: border-box; }
          body { margin: 0; }
          main { margin: 0 auto; max-width: 960px; padding: 48px 24px 80px; }
          h1 { font-size: 28px; font-weight: 700; line-height: 1.2; margin: 0 0 8px; }
          h2 { font-size: 16px; font-weight: 600; margin: 0 0 14px; }
          h3 { font-size: 12px; font-weight: 600; color: #6b7280; letter-spacing: .04em; margin: 0 0 6px; text-transform: uppercase; }
          p { margin: 0; }
          ul, ol { margin: 0; padding-left: 20px; }
          li { line-height: 1.6; margin: 6px 0; font-size: 14px; }

          .hero { margin-bottom: 36px; }
          .hero-desc { color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 24px; max-width: 560px; }
          .btn-row { display: flex; gap: 10px; flex-wrap: wrap; }
          .btn-primary {
            align-items: center; background: #1f2937; border: none; border-radius: 7px;
            color: #fff; cursor: pointer; display: inline-flex; font: inherit; font-size: 14px;
            font-weight: 600; gap: 6px; padding: 10px 20px; text-decoration: none;
          }
          .btn-primary:hover { background: #374151; }
          .btn-secondary {
            align-items: center; background: #fff; border: 1px solid #d1d5db; border-radius: 7px;
            color: #374151; cursor: pointer; display: inline-flex; font: inherit; font-size: 14px;
            font-weight: 600; gap: 6px; padding: 10px 20px; text-decoration: none;
          }
          .btn-secondary:hover { background: #f9fafb; }

          .grid-3 { display: grid; gap: 14px; grid-template-columns: repeat(3, 1fr); margin-bottom: 28px; }
          .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; }
          .card-value { align-items: center; display: flex; gap: 8px; font-size: 15px; font-weight: 700; margin-top: 4px; }
          .dot { border-radius: 999px; flex-shrink: 0; height: 8px; width: 8px; }
          .dot-green { background: #16a34a; }
          .dot-amber { background: #d97706; }

          .two-col { display: grid; gap: 20px; grid-template-columns: 1.4fr 1fr; }
          .panel { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 22px 24px; }
          .example-block {
            background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px;
            font-family: ui-monospace, Menlo, Monaco, monospace; font-size: 13px;
            line-height: 1.6; margin: 10px 0 0; padding: 12px 14px; overflow-wrap: anywhere;
          }
          .muted { color: #6b7280; font-size: 13px; margin-top: 10px; line-height: 1.5; }
          #session-message { color: #9ca3af; font-size: 12px; margin-top: 16px; }

          @media (max-width: 680px) {
            .grid-3, .two-col { grid-template-columns: 1fr; }
            h1 { font-size: 22px; }
          }
        </style>
      </head>
      <body>
        <main>
          <div class="hero">
            <h1>Skinin Ingredient Checker</h1>
            <p class="hero-desc">Help shoppers understand cosmetic ingredients directly on your product pages.</p>
            <div class="btn-row">
              <a href="${adminUrl}" class="btn-primary">
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5H6a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-5"/><path d="M17 3l-9 9M13 3h4v4"/></svg>
                Customize Widget
              </a>
              ${storeUrl ? `<a href="${storeUrl}" target="_blank" rel="noopener" class="btn-secondary">
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 3H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-5"/><path d="M15 3h2v2M10 10l7-7"/></svg>
                View on Store
              </a>` : ""}
            </div>
          </div>

          <div class="grid-3">
            <div class="card">
              <h3>App</h3>
              <div class="card-value"><span class="${appDotClass}"></span>${appInstalled ? "Installed" : "Needs setup"}</div>
            </div>
            <div class="card">
              <h3>Store</h3>
              <div class="card-value"><span class="${storeDotClass}"></span>${shopConnected ? "Connected" : "Not connected"}</div>
            </div>
            <div class="card">
              <h3>Billing</h3>
              <div class="card-value"><span class="dot dot-green"></span>${billingMode}</div>
            </div>
          </div>

          <div class="two-col">
            <div class="panel">
              <h2>Setup Guide</h2>
              <ol>
                <li>Go to <strong>Online Store › Themes › Customize</strong>.</li>
                <li>Open a product page template.</li>
                <li>Add the <strong>Skinin Ingredient Checker</strong> app block.</li>
                <li>Add ingredients to product descriptions.</li>
                <li>Preview a product page and click <strong>Check Ingredients</strong>.</li>
              </ol>
              <div class="example-block">Ingredients: Water, Glycerin, Niacinamide, Panthenol, Fragrance</div>
              <p class="muted">Start the ingredient list with "Ingredients:" and separate items with commas.</p>
              <p id="session-message"></p>
            </div>
            <div class="panel">
              <h2>Tips</h2>
              <ul>
                <li>Use <strong>Customize Widget</strong> to change button text, color, and labels.</li>
                <li>Add custom ingredients to override or extend the default database.</li>
                <li>Ingredient notes are informational only — not medical advice.</li>
              </ul>
            </div>
          </div>
        </main>
        ${renderEmbeddedSessionScript({ apiSessionUrl: getApiSessionUrl() })}
      </body>
    </html>
  `;
}

function renderAdminPage({ shop, appUrl, defaultRatingsJson }) {
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
          input[type="text"], input[type="color"], textarea, select {
            border: 1px solid #d1d5db; border-radius: 6px; font: inherit; font-size: 14px;
            padding: 9px 12px; width: 100%;
          }
          input[type="color"] { height: 42px; padding: 4px 8px; cursor: pointer; }
          textarea { min-height: 80px; resize: vertical; }
          #ci-paste { min-height: 100px; }
          .color-row { display: flex; gap: 10px; align-items: center; }
          .color-row input[type="text"] { flex: 1; }
          .color-row input[type="color"] { flex: 0 0 50px; }
          fieldset { border: 1px solid #e5e7eb; border-radius: 8px; margin: 0 0 20px; padding: 16px 20px 8px; }
          legend { font-size: 13px; font-weight: 600; color: #374151; padding: 0 6px; }
          .btn-save {
            background: #1f2937; border: none; border-radius: 6px; color: #fff;
            cursor: pointer; font: inherit; font-size: 15px; font-weight: 600;
            padding: 11px 28px; width: 100%;
          }
          .btn-save:hover { background: #374151; }
          .msg { display: none; font-size: 14px; margin-top: 14px; padding: 10px 16px; border-radius: 6px; }
          .msg-ok { background: #d1fae5; color: #065f46; }
          .msg-err { background: #fee2e2; color: #991b1b; }
          .shop-hint { color: #6b7280; font-size: 13px; margin-bottom: 28px; }
          .section-divider { border-top: 1px solid #e5e7eb; margin: 36px 0 28px; }
          .ci-section h2 { font-size: 18px; margin: 0 0 6px; }
          .ci-section > p { color: #4b5563; font-size: 14px; margin: 0 0 20px; }
          .ci-paste-wrap { margin-bottom: 20px; }
          .ci-table { border-collapse: collapse; margin-bottom: 20px; width: 100%; }
          .ci-table th { background: #f9fafb; color: #374151; font-size: 12px; font-weight: 600; padding: 9px 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
          .ci-table td { border-bottom: 1px solid #f3f4f6; font-size: 13px; padding: 8px 12px; vertical-align: middle; }
          .ci-table tr:last-child td { border-bottom: none; }
          .ci-table select { font-size: 13px; padding: 5px 8px; }
          .ci-empty { color: #9ca3af; font-size: 13px; padding: 12px 0 20px; }
          .ci-divider { border: none; border-top: 1px dashed #e5e7eb; margin: 24px 0; }
          .ci-add-form { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }
          .btn-add { background: #fff; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font: inherit; font-size: 14px; font-weight: 600; padding: 10px; width: 100%; }
          .btn-add:hover { background: #f9fafb; }
          .btn-delete { background: none; border: none; color: #dc2626; cursor: pointer; font-size: 13px; padding: 0; white-space: nowrap; }
          .btn-delete:hover { text-decoration: underline; }
          .ci-single-label { font-size: 13px; color: #6b7280; margin: 0 0 14px; }
        </style>
      </head>
      <body>
        <main>
          <h1>Customize Widget</h1>
          <p class="subtitle">Configure how the ingredient checker appears on your storefront.</p>

          ${escapedShop
            ? `<p class="shop-hint">Shop: <strong>${escapedShop}</strong></p>`
            : `<div class="form-group"><label for="field-shop">Shop domain</label><input type="text" id="field-shop" placeholder="yourstore.myshopify.com"></div>`
          }

          <form id="settings-form">
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

          <div class="section-divider"></div>
          <div class="ci-section">
            <h2>Custom Ingredients</h2>
            <p>Override or extend the default ingredient database for your store.</p>

            <div class="ci-paste-wrap">
              <label for="ci-paste">Paste ingredient list</label>
              <textarea id="ci-paste" placeholder="Paste your ingredient list here, e.g. Water, Glycerin, Retinol, Niacinamide, Fragrance"></textarea>
              <button type="button" id="parse-btn" class="btn-add" style="margin-top:8px">Parse ingredients</button>
            </div>

            <div id="ci-table-wrap"><p class="ci-empty">No custom ingredients yet. Paste a list above or add one below.</p></div>

            <hr class="ci-divider">
            <p class="ci-single-label">Or add a single ingredient:</p>
            <div class="ci-add-form">
              <div>
                <label for="ci-name">Ingredient name</label>
                <input type="text" id="ci-name" placeholder="e.g. Retinol">
              </div>
              <div>
                <label for="ci-rating">Label</label>
                <select id="ci-rating">
                  <option value="safe">Low concern</option>
                  <option value="caution" selected>Worth noting</option>
                  <option value="avoid">Potential sensitivity</option>
                </select>
              </div>
              <div>
                <label for="ci-function">Function (optional)</label>
                <input type="text" id="ci-function" placeholder="e.g. anti-aging">
              </div>
              <div>
                <label for="ci-reason">Description (optional)</label>
                <input type="text" id="ci-reason" placeholder="e.g. May cause sensitivity">
              </div>
              <button type="button" id="ci-add-btn" class="btn-add">Add ingredient</button>
            </div>

            <button type="button" id="ci-save-btn" class="btn-save">Save custom ingredients</button>
            <div id="ci-msg-ok" class="msg msg-ok">Custom ingredients saved.</div>
            <div id="ci-msg-err" class="msg msg-err">Failed to save. Please try again.</div>
          </div>
        </main>

        <script>
          var ADMIN_APP_URL = "${escapedAppUrl}";
          var ADMIN_SHOP = "${escapedShop}";
          var adminIngredients = [];
          var DEFAULT_RATINGS = ${defaultRatingsJson};

          function adminGetShop() {
            var el = document.getElementById("field-shop");
            return ADMIN_SHOP || (el ? el.value.trim() : "");
          }
          function adminGetVal(id, fallback) {
            var el = document.getElementById(id);
            return (el && el.value.trim()) ? el.value.trim() : fallback;
          }
          function adminBuildPayload() {
            return {
              shop: adminGetShop(),
              buttonText: adminGetVal("field-buttonText", "Check Ingredients"),
              buttonColor: adminGetVal("field-buttonColorHex", "#1f2937"),
              modalTitle: adminGetVal("field-modalTitle", "Ingredient Check"),
              labels: {
                low: adminGetVal("field-labelLow", "Low concern"),
                mid: adminGetVal("field-labelMid", "Worth noting"),
                high: adminGetVal("field-labelHigh", "Potential sensitivity")
              },
              disclaimerText: adminGetVal("field-disclaimerText", ""),
              customIngredients: adminIngredients
            };
          }
          function adminEsc(s) {
            return String(s || "").replace(/[&<>"']/g, function(c) {
              return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c];
            });
          }
          function adminGetDefaultRating(name) {
            var key = String(name || "").trim().toLowerCase().replace(/\\s+/g, " ");
            return DEFAULT_RATINGS[key] || "safe";
          }
          function adminRenderTable() {
            var wrap = document.getElementById("ci-table-wrap");
            if (!wrap) return;
            if (!adminIngredients.length) {
              wrap.innerHTML = "<p class=\\"ci-empty\\">No custom ingredients yet. Paste a list above or add one below.</p>";
              return;
            }
            var html = "<table class=\\"ci-table\\"><thead><tr><th>Name</th><th>Label</th><th></th></tr></thead><tbody>";
            for (var i = 0; i < adminIngredients.length; i++) {
              var ci = adminIngredients[i];
              var r = ci.rating || "safe";
              html += "<tr>" +
                "<td>" + adminEsc(ci.name) + "</td>" +
                "<td><select data-idx=\\"" + i + "\\">" +
                  "<option value=\\"safe\\"" + (r === "safe" ? " selected" : "") + ">Low concern</option>" +
                  "<option value=\\"caution\\"" + (r === "caution" ? " selected" : "") + ">Worth noting</option>" +
                  "<option value=\\"avoid\\"" + (r === "avoid" ? " selected" : "") + ">Potential sensitivity</option>" +
                "</select></td>" +
                "<td><button type=\\"button\\" class=\\"btn-delete\\" data-idx=\\"" + i + "\\">Delete</button></td>" +
                "</tr>";
            }
            html += "</tbody></table>";
            wrap.innerHTML = html;
          }
          function adminParseIngredients() {
            var pasteEl = document.getElementById("ci-paste");
            var text = pasteEl ? pasteEl.value.trim() : "";
            if (!text) return;
            var names = text.split(",").map(function(n) {
              return n.trim().replace(/[.,;:]+$/, "");
            }).filter(function(n) { return n.length > 0; });
            if (!names.length) return;
            adminIngredients = names.map(function(name) {
              return { name: name, rating: adminGetDefaultRating(name), "function": "", reason: "" };
            });
            pasteEl.value = "";
            adminRenderTable();
          }
          function adminAddIngredient() {
            var nameEl = document.getElementById("ci-name");
            var name = nameEl ? nameEl.value.trim() : "";
            if (!name) { if (nameEl) nameEl.focus(); return; }
            adminIngredients.push({
              name: name,
              rating: document.getElementById("ci-rating").value,
              "function": document.getElementById("ci-function").value.trim(),
              reason: document.getElementById("ci-reason").value.trim()
            });
            document.getElementById("ci-name").value = "";
            document.getElementById("ci-function").value = "";
            document.getElementById("ci-reason").value = "";
            adminRenderTable();
          }
          function adminSaveIngredients() {
            var shop = adminGetShop();
            if (!shop) { alert("Enter a shop domain first."); return; }
            fetch(ADMIN_APP_URL + "/api/settings", {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify(adminBuildPayload())
            })
              .then(function(r) { return r.json(); })
              .then(function(d) { adminShowCiMsg(d.ok !== false ? "ok" : "err"); })
              .catch(function() { adminShowCiMsg("err"); });
          }
          function adminSaveSettings(e) {
            e.preventDefault();
            var shop = adminGetShop();
            if (!shop) { alert("Enter a shop domain first."); return; }
            fetch(ADMIN_APP_URL + "/api/settings", {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify(adminBuildPayload())
            })
              .then(function(r) { return r.json(); })
              .then(function(d) { adminShowMsg(d.ok !== false ? "ok" : "err"); })
              .catch(function() { adminShowMsg("err"); });
          }
          function adminShowMsg(type) {
            var ok = document.getElementById("msg-ok");
            var err = document.getElementById("msg-err");
            ok.style.display = type === "ok" ? "block" : "none";
            err.style.display = type === "err" ? "block" : "none";
            setTimeout(function() { ok.style.display = "none"; err.style.display = "none"; }, 4000);
          }
          function adminShowCiMsg(type) {
            var ok = document.getElementById("ci-msg-ok");
            var err = document.getElementById("ci-msg-err");
            ok.style.display = type === "ok" ? "block" : "none";
            err.style.display = type === "err" ? "block" : "none";
            setTimeout(function() { ok.style.display = "none"; err.style.display = "none"; }, 4000);
          }

          // Attach event listeners — DOM is ready (script is at end of body)
          document.getElementById("parse-btn").addEventListener("click", adminParseIngredients);
          document.getElementById("ci-add-btn").addEventListener("click", adminAddIngredient);
          document.getElementById("ci-save-btn").addEventListener("click", adminSaveIngredients);
          document.getElementById("settings-form").addEventListener("submit", adminSaveSettings);
          document.getElementById("field-buttonColor").addEventListener("input", function() {
            var hex = document.getElementById("field-buttonColorHex");
            if (hex) hex.value = this.value;
          });
          document.getElementById("field-buttonColorHex").addEventListener("input", function() {
            var v = this.value.trim();
            if (/^#[0-9a-fA-F]{6}$/.test(v)) {
              var p = document.getElementById("field-buttonColor");
              if (p) p.value = v;
            }
          });

          // Event delegation on table wrapper — survives innerHTML re-renders
          var _tw = document.getElementById("ci-table-wrap");
          _tw.addEventListener("click", function(e) {
            if (e.target.classList.contains("btn-delete")) {
              var idx = parseInt(e.target.getAttribute("data-idx"), 10);
              adminIngredients.splice(idx, 1);
              adminRenderTable();
            }
          });
          _tw.addEventListener("change", function(e) {
            if (e.target.tagName === "SELECT") {
              var idx = parseInt(e.target.getAttribute("data-idx"), 10);
              if (!isNaN(idx) && adminIngredients[idx]) {
                adminIngredients[idx].rating = e.target.value;
              }
            }
          });

          // Load saved settings and custom ingredients on page load
          var _sh = adminGetShop();
          if (_sh) {
            fetch(ADMIN_APP_URL + "/api/settings?shop=" + encodeURIComponent(_sh))
              .then(function(r) { return r.ok ? r.json() : null; })
              .then(function(data) {
                if (!data) { adminRenderTable(); return; }
                var sf = function(id, v) { var el = document.getElementById(id); if (el && v) el.value = v; };
                sf("field-buttonText", data.buttonText);
                sf("field-buttonColorHex", data.buttonColor);
                sf("field-buttonColor", data.buttonColor);
                sf("field-modalTitle", data.modalTitle);
                sf("field-disclaimerText", data.disclaimerText);
                if (data.labels) {
                  sf("field-labelLow", data.labels.low);
                  sf("field-labelMid", data.labels.mid);
                  sf("field-labelHigh", data.labels.high);
                }
                adminIngredients = Array.isArray(data.customIngredients) ? data.customIngredients : [];
                adminRenderTable();
              })
              .catch(function() { adminRenderTable(); });
          } else {
            adminRenderTable();
          }
        </script>
      </body>
    </html>
  `;
}

app.get("/", async (req, res, next) => {
  try {
    // OAuth install flow: shop present but not yet embedded → start OAuth
    if (req.query.shop && !req.query.embedded) {
      return res.redirect(`/auth?shop=${encodeURIComponent(req.query.shop)}`);
    }

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

    const shop = billingStatus?.shop || String(req.query.shop || "");
    res.send(renderHomePage({ billingStatus, billingBypassed, shop }));
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
  res.send(renderAdminPage({ shop, appUrl, defaultRatingsJson }));
});
app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Skinin Ingredient Checker listening on port ${PORT}`);
});
