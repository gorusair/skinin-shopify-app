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

function renderHomePage({ billingStatus, billingBypassed }) {
  const shopConnected = billingStatus?.installed === true;
  const billingMode = billingBypassed
    ? "Development bypass"
    : "Active subscription";
  const tokenStatus = shopConnected ? "Firestore token saved" : "Connect shop";
  const shopStatus = shopConnected ? "Shop connected" : "Shop not connected";

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Skinin Ingredient Checker</title>
        <style>
          :root {
            color: #111827;
            background: #f6f7f9;
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
            max-width: 960px;
            padding: 40px 20px 56px;
          }
          .hero {
            margin-bottom: 28px;
          }
          h1 {
            font-size: 32px;
            line-height: 1.15;
            margin: 0 0 10px;
          }
          .subtitle {
            color: #4b5563;
            font-size: 16px;
            line-height: 1.6;
            margin: 0;
            max-width: 680px;
          }
          .grid {
            display: grid;
            gap: 18px;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          section {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 22px;
          }
          .wide {
            grid-column: 1 / -1;
          }
          h2 {
            font-size: 18px;
            line-height: 1.3;
            margin: 0 0 16px;
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
          .status-list {
            display: grid;
            gap: 10px;
            list-style: none;
            padding: 0;
          }
          .status-list li {
            align-items: center;
            display: flex;
            gap: 10px;
            margin: 0;
          }
          .dot {
            background: #16a34a;
            border-radius: 999px;
            flex: 0 0 auto;
            height: 9px;
            width: 9px;
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
          .status-value {
            color: #374151;
            font-weight: 600;
          }
          @media (max-width: 760px) {
            main {
              padding-top: 28px;
            }
            .grid {
              grid-template-columns: 1fr;
            }
          }
        </style>
      </head>
      <body>
        <main>
          <div class="hero">
            <h1>Skinin Ingredient Checker</h1>
            <p class="subtitle">Set up the product page app block, add ingredient lists to your product descriptions, and let shoppers check cosmetic ingredients directly on the storefront.</p>
          </div>

          <div class="grid">
            <section>
              <h2>Installation Status</h2>
              <ul class="status-list">
                <li><span class="dot"></span><span>App installed successfully</span></li>
                <li><span class="dot"></span><span>Theme app extension available</span></li>
                ${
                  billingBypassed
                    ? '<li><span class="dot"></span><span>Development billing bypass enabled</span></li>'
                    : '<li><span class="dot"></span><span>Billing active</span></li>'
                }
              </ul>
            </section>

            <section>
              <h2>Status</h2>
              <ul class="status-list">
                <li><span class="dot"></span><span class="status-value">${shopStatus}</span></li>
                <li><span class="dot"></span><span class="status-value">${tokenStatus}</span></li>
                <li><span class="dot"></span><span class="status-value">Billing mode: ${billingMode}</span></li>
              </ul>
            </section>

            <section class="wide">
              <h2>Setup Guide</h2>
              <ol>
                <li>Open Online Store &gt; Themes &gt; Customize.</li>
                <li>Go to a product page template.</li>
                <li>Add the Skinin Ingredient Checker app block.</li>
                <li>Add ingredients to product descriptions.</li>
                <li>Preview and test the Check Ingredients button.</li>
              </ol>
            </section>

            <section class="wide">
              <h2>Example Ingredient Format</h2>
              <p class="example">Ingredients: Water, Glycerin, Niacinamide, Panthenol, Fragrance</p>
            </section>
          </div>
        </main>
      </body>
    </html>
  `;
}

app.get("/", async (req, res, next) => {
  try {
    let billingStatus = null;
    const billingBypassed = process.env.BYPASS_BILLING === "true";

    if (req.query.shop) {
      billingStatus = await getBillingStatus(req.query.shop);

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

    res.send(renderHomePage({ billingStatus, billingBypassed }));
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
