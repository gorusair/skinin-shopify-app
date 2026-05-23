// Placeholder support email until the production support mailbox is configured.
const SUPPORT_EMAIL = "support@skinin.app";
const DEFAULT_SHOPIFY_API_KEY = "ad670221e1d6929bc51cf5a88084f53a";
const DEFAULT_API_SESSION_URL =
  "https://skinin-ingredient-checker.onrender.com/api/session";

export function renderEmbeddedSessionScript({ apiSessionUrl }) {
  return `
        <script>
          function verifyEmbeddedShopifySession() {
            const sessionMessage = document.getElementById("session-message");

            function updateSessionMessage(message) {
              if (sessionMessage) {
                sessionMessage.textContent = message;
              }
            }

            function preserveEmbeddedQueryParams() {
              if (!window.location.search) {
                return;
              }

              document.querySelectorAll('a[href^="/"]').forEach((link) => {
                const url = new URL(link.getAttribute("href"), window.location.origin);

                new URLSearchParams(window.location.search).forEach((value, key) => {
                  if (!url.searchParams.has(key)) {
                    url.searchParams.set(key, value);
                  }
                });

                link.href = url.pathname + url.search;
              });
            }

            async function waitForShopifySessionTokenApi() {
              for (let attempt = 0; attempt < 50; attempt += 1) {
                if (window.shopify && typeof window.shopify.idToken === "function") {
                  return window.shopify;
                }

                await new Promise((resolve) => setTimeout(resolve, 100));
              }

              throw new Error("Shopify App Bridge idToken API is unavailable");
            }

            (async () => {
              try {
              preserveEmbeddedQueryParams();
              console.log("Requesting session token");

              const shopify = await waitForShopifySessionTokenApi();
              const token = await shopify.idToken();

              console.log("Sending /api/session");
              const response = await fetch("${apiSessionUrl}", {
                method: "POST",
                headers: {
                  Authorization: "Bearer " + token,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  host: new URLSearchParams(window.location.search).get("host"),
                  path: window.location.pathname,
                }),
              });

              const data = await response.json().catch(() => ({}));

              if (!response.ok) {
                throw new Error(data.error || "Session verification failed with status " + response.status);
              }

              console.log("Session token verified");
              updateSessionMessage("Session token verified");
              } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                console.error(message);
                updateSessionMessage("Embedded session could not be verified. Reopen the app from Shopify Admin.");
              }
            })();
          }

          if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", verifyEmbeddedShopifySession, { once: true });
          } else {
            verifyEmbeddedShopifySession();
          }
        </script>
  `;
}

function renderShopifyShopMetaScript() {
  return `
        <script>
          const shopParam = new URLSearchParams(window.location.search).get("shop") || "";
          console.log("shop param:", shopParam);

          if (shopParam) {
            const shopMeta = document.createElement("meta");
            shopMeta.name = "shopify-shop";
            shopMeta.content = shopParam;
            document.head.appendChild(shopMeta);
          }
        </script>
  `;
}

function renderPublicPage({ title, subtitle, children, shopifyApiKey, apiSessionUrl }) {
  const resolvedShopifyApiKey = shopifyApiKey || DEFAULT_SHOPIFY_API_KEY;
  const resolvedApiSessionUrl = apiSessionUrl || DEFAULT_API_SESSION_URL;

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="shopify-api-key" content="${resolvedShopifyApiKey}">
        <title>${title} | Skinin Ingredient Checker</title>
        ${renderShopifyShopMetaScript()}
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
            max-width: 960px;
            padding: 48px 20px 64px;
          }
          nav {
            display: flex;
            flex-wrap: wrap;
            gap: 14px;
            margin-bottom: 32px;
          }
          nav a {
            color: #374151;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
          }
          nav a:hover {
            color: #111827;
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
            gap: 24px;
          }
          section {
            border-top: 1px solid #e5e7eb;
            padding-top: 24px;
          }
          h2 {
            font-size: 18px;
            line-height: 1.3;
            margin: 0 0 14px;
          }
          h3 {
            color: #374151;
            font-size: 15px;
            line-height: 1.4;
            margin: 18px 0 8px;
          }
          p {
            color: #374151;
            line-height: 1.65;
            margin: 0 0 12px;
          }
          ul,
          ol {
            margin: 0;
            padding-left: 22px;
          }
          li {
            color: #374151;
            line-height: 1.6;
            margin: 8px 0;
          }
          .example {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            color: #1f2937;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
            line-height: 1.55;
            margin: 0;
            overflow-wrap: anywhere;
            padding: 14px 16px;
          }
          .muted {
            color: #6b7280;
            font-size: 13px;
          }
          .session-message {
            color: #6b7280;
            font-size: 13px;
            line-height: 1.5;
            margin: 18px 0 0;
          }
          @media (max-width: 760px) {
            main {
              padding-top: 28px;
            }
          }
        </style>
      </head>
      <body>
        <main>
          <nav aria-label="Public pages">
            <a href="/app-info">App Info</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/support">Support</a>
          </nav>
          <div class="hero">
            <h1>${title}</h1>
            <p class="subtitle">${subtitle}</p>
          </div>
          <div class="page-stack">
            ${children}
          </div>
          <p class="session-message" id="session-message">Checking embedded Shopify session.</p>
        </main>
        ${renderEmbeddedSessionScript({ apiSessionUrl: resolvedApiSessionUrl })}
      </body>
    </html>
  `;
}

export function renderPrivacyPage(options = {}) {
  return renderPublicPage({
    ...options,
    title: "Privacy Policy",
    subtitle:
      "How Skinin Ingredient Checker handles app, shop, and product information.",
    children: `
      <section>
        <h2>Overview</h2>
        <p>Skinin Ingredient Checker helps merchants add an ingredient review experience to Shopify product pages. This policy explains what information the app uses to install, operate, and provide ingredient review functionality.</p>
      </section>

      <section>
        <h2>Information We Use</h2>
        <ul>
          <li>Shop information needed for installation and operation, such as the shop domain.</li>
          <li>Shop installation data, including an access token required for app functionality.</li>
          <li>Product information needed to identify ingredient lists, such as product title and product description.</li>
          <li>Ingredient text provided by merchants in product descriptions or supported product fields.</li>
        </ul>
      </section>

      <section>
        <h2>How Information Is Used</h2>
        <p>Shop installation data is used to keep the app connected to the merchant store and to support app features. Product title, product description, and ingredient text may be used to identify ingredient lists and return ingredient review results on the storefront.</p>
      </section>

      <section>
        <h2>Customer Health Information</h2>
        <p>Skinin Ingredient Checker does not collect customer health information. The app is designed to review ingredient text supplied by merchants and does not ask shoppers to provide health details.</p>
      </section>

      <section>
        <h2>Informational Use Only</h2>
        <p>Skinin Ingredient Checker is an ingredient review aid. It does not provide medical advice and does not diagnose, treat, cure, or prevent any condition. Results are based on the ingredient information available in the product description and are for informational purposes only.</p>
        <p>The app does not guarantee product safety. Merchants are responsible for providing accurate and complete ingredient lists in product descriptions.</p>
      </section>

      <section>
        <h2>Contact and Support</h2>
        <p>For privacy or support questions, contact <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.</p>
      </section>
    `,
  });
}

export function renderSupportPage(options = {}) {
  return renderPublicPage({
    ...options,
    title: "Support",
    subtitle: "Setup help and troubleshooting for Skinin Ingredient Checker.",
    children: `
      <section>
        <h2>Basic Setup Steps</h2>
        <ol>
          <li>Install Skinin Ingredient Checker in your Shopify store.</li>
          <li>Go to Online Store &gt; Themes &gt; Customize.</li>
          <li>Open a product page template.</li>
          <li>Add the Skinin Ingredient Checker app block.</li>
          <li>Place the block near the product description, ingredients section, or below purchase buttons.</li>
          <li>Add ingredients to product descriptions.</li>
          <li>Preview the product page and click Check Ingredients.</li>
        </ol>
      </section>

      <section>
        <h2>Recommended Ingredient Format</h2>
        <p class="example">Ingredients: Water, Glycerin, Niacinamide, Panthenol, Fragrance</p>
        <p class="muted">Start ingredient lists with "Ingredients:" and separate ingredients with commas.</p>
      </section>

      <section>
        <h2>Troubleshooting</h2>
        <h3>Check Ingredients Button Does Not Appear</h3>
        <ul>
          <li>Confirm the Skinin Ingredient Checker app block was added to the active product page template.</li>
          <li>Confirm you are previewing a product that uses the template where the block was added.</li>
          <li>Move the block near the product description or below purchase buttons for better visibility.</li>
        </ul>

        <h3>No Ingredient Data Found</h3>
        <ul>
          <li>Confirm the product description includes an ingredient list.</li>
          <li>Start the list with "Ingredients:" so the app can identify it reliably.</li>
          <li>Separate ingredients with commas, semicolons, or line breaks.</li>
        </ul>

        <h3>Ingredient Results Look Unexpected</h3>
        <ul>
          <li>Check spelling and punctuation in the ingredient list.</li>
          <li>Use common INCI-style ingredient names when available.</li>
          <li>Review unknown ingredients manually. Unknown ingredients show "Ingredient information is limited."</li>
        </ul>
      </section>

      <section>
        <h2>Contact</h2>
        <p>For support, contact <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.</p>
      </section>
    `,
  });
}

export function renderAppInfoPage(options = {}) {
  return renderPublicPage({
    ...options,
    title: "Skinin Ingredient Checker",
    subtitle:
      "Help shoppers review cosmetic ingredients directly on product pages.",
    children: `
      <section>
        <h2>App Store Listing Copy</h2>
        <h3>Tagline</h3>
        <p>Help shoppers review cosmetic ingredients directly on product pages.</p>

        <h3>Short Description</h3>
        <p>Skinin Ingredient Checker adds a simple ingredient review button to product pages, helping shoppers understand cosmetic ingredient lists with clear SAFE, CAUTION, and AVOID labels.</p>

        <h3>Long Description</h3>
        <p>Skinin Ingredient Checker helps beauty and skincare merchants make ingredient information easier for shoppers to review directly on product pages.</p>
        <p>Add the theme app block to your product template, include an ingredient list in the product description, and shoppers can click Check Ingredients to view a clean ingredient breakdown. The app highlights common cosmetic ingredients with simple SAFE, CAUTION, and AVOID labels, along with careful explanations such as "Common moisturizer," "Hydrating ingredient," or "Potential irritant for sensitive skin."</p>
        <p>Skinin Ingredient Checker is designed as an ingredient review aid. It does not provide medical advice and does not diagnose, treat, cure, or prevent any condition. Merchants are responsible for providing accurate ingredient lists in product descriptions.</p>
      </section>

      <section>
        <h2>Key Benefits</h2>
        <ul>
          <li>Add ingredient review functionality directly to product pages.</li>
          <li>Help shoppers scan ingredient lists more easily.</li>
          <li>Use simple SAFE, CAUTION, and AVOID labels.</li>
          <li>Show careful, non-medical explanations for common cosmetic ingredients.</li>
          <li>Support clear ingredient formatting in product descriptions.</li>
          <li>Add the storefront feature through a Shopify theme app extension.</li>
          <li>Keep setup simple with no theme code editing required.</li>
        </ul>
      </section>

      <section>
        <h2>Setup Instructions</h2>
        <ol>
          <li>Go to Online Store &gt; Themes &gt; Customize.</li>
          <li>Open a product page template.</li>
          <li>Add the Skinin Ingredient Checker app block.</li>
          <li>Place the block near the product description, ingredients section, or below purchase buttons.</li>
          <li>Add ingredients to product descriptions.</li>
          <li>Preview the product page and click Check Ingredients.</li>
        </ol>
      </section>

      <section>
        <h2>Recommended Ingredient Format</h2>
        <p class="example">Ingredients: Water, Glycerin, Niacinamide, Panthenol, Fragrance</p>
      </section>

      <section>
        <h2>Informational Disclaimer</h2>
        <p>Results are based on the ingredient information available in the product description and are for informational purposes only. Skinin Ingredient Checker does not provide medical advice and does not guarantee product safety.</p>
      </section>

      <section>
        <h2>FAQ</h2>
        <h3>What does Skinin Ingredient Checker do?</h3>
        <p>It lets shoppers click Check Ingredients on product pages to review cosmetic ingredients with simple labels and explanations.</p>

        <h3>Does the app provide medical advice?</h3>
        <p>No. The app is an ingredient review aid only. It does not diagnose, treat, cure, or prevent any condition.</p>

        <h3>Where does the app get ingredient data?</h3>
        <p>The app checks product description ingredient lists against a built-in classification system for common cosmetic ingredients.</p>

        <h3>What happens if a product has no ingredient list?</h3>
        <p>The app shows "No ingredient data found" and asks the merchant to add ingredients to the product description.</p>

        <h3>How should I format ingredients?</h3>
        <p>Use a clear list that starts with "Ingredients:" and separates each ingredient with commas.</p>

        <h3>Who is responsible for ingredient accuracy?</h3>
        <p>Merchants are responsible for providing accurate, complete ingredient lists in product descriptions.</p>
      </section>

      <section>
        <h2>Screenshot Checklist</h2>
        <ol>
          <li>Merchant onboarding home screen.</li>
          <li>Theme editor with the Skinin Ingredient Checker app block added to a product template.</li>
          <li>Product page showing the Check Ingredients button below purchase buttons.</li>
          <li>Ingredient results modal with SAFE, CAUTION, and AVOID examples.</li>
          <li>No ingredient data state.</li>
          <li>Product description showing the recommended ingredient format.</li>
        </ol>
        <p class="muted">Use actual app UI screenshots. Avoid logo-only images, duplicate screenshots, pricing text inside images, unsupported claims, and medical or disease-related language.</p>
      </section>
    `,
  });
}
