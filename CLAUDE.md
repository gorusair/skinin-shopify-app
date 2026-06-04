# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Shopify CLI dev server (tunneled, full app)
npm run server:dev   # Express server only via nodemon (no CLI tunnel)
npm start            # Production: node web/src/server.js
npm run start:public # Public-pages-only lightweight server
npm run build        # shopify app build
npm run deploy       # shopify app deploy
npm run lint         # ESLint
npm run format       # Prettier
```

There are no automated tests. Validation is done via `npm run lint` and manual testing against a real Shopify dev store.

## Architecture

This is a Shopify embedded app with two distinct runtime surfaces:

**Backend (Express, Node.js ESM)** at `web/src/`:
- `server.js` — single-file app entry: mounts all routes, renders home (`/`) and admin (`/admin`) pages as inline HTML strings, handles `/api/session` JWT verification, and configures Helmet CSP (embedded in Shopify Admin requires `frameAncestors` for `admin.shopify.com`).
- `routes/` — auth (OAuth flow), billing (Shopify Billing API), ingredients (POST `/api/ingredients/analyze`), settings (GET/POST `/api/settings`), webhooks (HMAC-verified compliance webhooks).
- `services/ingredient-analyzer.js` — exports `INGREDIENT_SAFETY` (500+ ingredient → `{rating, function, reason}` map) and `analyzeIngredients()`. Analysis is fully local; no external API calls.
- `services/firestore.js` — lazy Firestore init; if Firebase fails, the server stays up but Firestore ops are no-ops. Collections: `shopTokens` (access tokens, settings, custom ingredients) and `ingredientChecks` (analysis history).
- `services/shopify.js` — manual JWT verification for Shopify App Bridge session tokens (HS256 HMAC with `SHOPIFY_API_SECRET`), HMAC query verification for OAuth, shop domain normalization/validation.
- `middleware/billing.js` — `getBillingStatus()` checks Firestore for the access token then queries Shopify GraphQL `currentAppInstallation.activeSubscriptions`. `BYPASS_BILLING=true` skips all of this.
- `public-pages.js` / `public-server.js` — standalone HTML pages (app info, privacy, support) that can run as a separate server.

**Theme App Extension** at `extensions/skinin-ingredient-checker/`:
- `blocks/ingredient-checker.liquid` — renders the button DOM, embeds a `<script type="application/json" data-skinin-product>` with product description and metafield ingredients, and contains an IIFE that loads settings and wires the click handler. The inline script and the asset JS (`skinin-ingredient-checker.js`) both exist; the inline script does the actual work; the asset file is declared in the schema but the inline IIFE is what runs.
- `assets/skinin-ingredient-checker.js` — loaded via `defer`; secondary logic (the inline script is the primary). When changing storefront behavior, check both files for overlap.
- Ingredient data sources (in priority order): `product.metafields.skinin.ingredients`, `product.metafields.custom.ingredients`, then text parsed after labels like `Ingredients:`, `Ingredient list:`, `INCI:`, `Full ingredients:` in the product description.

## Key Design Decisions

**No test mode / no mocking**: There is no test harness. All verification happens against a real Shopify dev store.

**Manual JWT, not Shopify SDK**: `services/shopify.js` manually decodes and verifies App Bridge session tokens with `crypto.createHmac`. The `@shopify/shopify-api` package is listed as a dependency but the JWT path does not use it — it uses raw `fetch` for the access token exchange and GraphQL calls.

**Inline HTML rendering**: Home and admin pages are rendered as template literal strings inside `server.js` (not a template engine). Admin page JavaScript is also inline in the same file.

**CSP**: `helmet` is configured with `scriptSrc: ["'unsafe-inline'", "'unsafe-eval'"]` and `scriptSrcAttr: ["'unsafe-inline'"]` to support inline event handlers required by Shopify Admin embedding.

**Firestore resilience**: `getFirestore()` returns `null` if initialization failed; every Firestore call must handle `null` gracefully.

**Billing bypass**: `BYPASS_BILLING=true` makes all billing checks return `{ installed: true, hasActiveSubscription: true }`. Use this for dev stores.

## Environment Variables

Required in production: `PORT`, `APP_URL`, `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, and Firebase credentials (`FIREBASE_SERVICE_ACCOUNT_JSON` or `FIREBASE_PROJECT_ID` + `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY`).

Optional: `BYPASS_BILLING=true` (dev), `SHOPIFY_API_VERSION` (default `2026-04`), `SHOPIFY_BILLING_TEST`.

## Deployment

Deployed to Render. See `render.yaml`. Production URL: `https://app.skinin.kr`. After deploy, confirm `shopify.app.toml` redirect URLs, webhook URLs, and the theme extension's `App backend URL` block setting all point to the live domain.

## Product Guardrails (정책 — 코드에 없어도 반드시 준수)

1. 의료 자문 / 효능 / 안전성 단정 문구 생성 금지. 이 앱은 "안전 판정자"가
   아니라 "정보 제공 도구". 성분 설명은 정보형으로만
   (O "수분 보호막 형성을 돕는 성분" / X "여드름에 효과적" / X "위험 성분").
2. 중립 라벨 유지: Low concern / Worth noting / Potential sensitivity.
   "Avoid / 위험 / Danger" 같은 단정·공포 표현으로 바꾸지 말 것.
3. 스토어프론트 위젯은 vanilla JS 유지. React/외부 프레임워크 추가 금지
   (React+Polaris는 어드민 임베디드 화면에서만).
4. 위젯 번들 경량 유지 — 페이지 로딩 느려지면 즉시 제거당함.
5. 데이터는 Firestore 유지. Supabase 등 새 DB 도입은 별도 결정 — 임의 마이그레이션 금지.

## 협업 방식

- 코드 작성 전 관련 파일을 먼저 읽고 현재 구조를 한국어로 요약해 보여줄 것.
- 큰 변경은 작은 단계로 쪼개고, 각 단계마다 (변경 파일 / 이유)를 요약하고
  멈춰서 확인받을 것. 한 번에 전부 짜지 말 것.
- 설명은 한국어로.

## 현재 제품 우선순위 (PRD 기준)

- 병목은 기능이 아니라 traction(유입·신뢰·검증).
- Phase 0 목표: 실사용 브랜드 3~5곳 + 리뷰 3~5개 + 첫 사용 데이터.
- 개발 1순위: 성분 표시 개선(F-0.1) — 각 성분에 "왜 이 라벨인지" 한 줄 이유 추가.
- 유료화는 리뷰·사용 데이터 쌓인 뒤. 지금 기능 게이팅 금지.
- 새 기능을 진공에서 양산하지 않는다. 작게 내고 실사용 피드백으로 검증.
