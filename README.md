# Skinin Ingredient Checker

Shopify app scaffold for checking cosmetic product ingredients with Open Beauty Facts.

## Structure

- `web/`: Node.js and Express backend.
- `extensions/skinin-ingredient-checker/`: Shopify theme app extension with vanilla JavaScript and CSS.
- `web/src/services/firestore.js`: Firebase Firestore persistence.
- `web/src/services/ingredient-analyzer.js`: Open Beauty Facts lookup and ingredient classification.

## First Run

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and fill in Shopify and Firebase values.
3. Link or create the Shopify app with Shopify CLI so `shopify.app.toml` gets real app URLs and client ID values.
4. Run `npm run dev`.

The theme block exposes a `Check Ingredients` button on product pages. Configure its backend URL setting in the theme editor so storefront clicks can call `/api/ingredients/analyze`.

## Theme Extension Regression Note

- Product page button/block: `extensions/skinin-ingredient-checker/blocks/ingredient-checker.liquid`
- Storefront click handling and modal rendering: `extensions/skinin-ingredient-checker/assets/skinin-ingredient-checker.js`
- Storefront button/modal styling: `extensions/skinin-ingredient-checker/assets/skinin-ingredient-checker.css`
- Analyze API route: `web/src/routes/ingredients.js`, mounted by `web/src/server.js` at `/api/ingredients`

## Billing

Shopify Billing API requires public app distribution. Development stores can bypass billing with `BYPASS_BILLING=true`.
