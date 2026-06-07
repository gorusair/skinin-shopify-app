# Skinin Ingredient Checker

Skinin Ingredient Checker는 Shopify 상품 페이지에서 화장품 성분 목록을 읽고, 성분별 참고 등급과 기능 설명을 보여주는 Shopify 앱입니다. Express 기반 백엔드, Shopify Theme App Extension, Firebase Firestore 저장소로 구성되어 있습니다.

> 이 앱은 성분 검토를 돕는 정보성 도구입니다. 의학적 조언, 진단, 치료, 예방 목적의 정보를 제공하지 않으며, 상품 성분 목록의 정확성과 완전성은 판매자가 관리해야 합니다.

## 주요 기능

- Shopify OAuth 설치 플로우
- Shopify App Bridge 세션 토큰 검증
- Shopify Billing API 기반 구독 확인
- 개발 스토어용 Billing 우회 옵션
- 상품 페이지 Theme App Extension 블록 제공
- 상품 설명 또는 metafield에서 성분 목록 추출
- 내장 성분 룰셋 기반 등급 분류
- 매장별 커스텀 성분 등급 등록 및 저장
- 위젯 버튼 문구, 색상, 모달 문구 커스터마이징
- Firebase Firestore 기반 설치 토큰, 설정, 분석 이력 저장
- Shopify 개인정보 보호 웹훅 처리
- 공개 페이지 제공: 앱 정보, 개인정보 처리방침, 지원 페이지

## 기술 스택

- Runtime: Node.js 20.10 이상
- Backend: Express 4
- Shopify: Shopify CLI, Shopify API, Theme App Extension
- Persistence: Firebase Admin SDK, Firestore
- Validation: Zod
- Security/Middleware: Helmet, CORS, Morgan
- Deployment: Render 설정 포함

## 설치 방법

### 1. 사전 준비

- Node.js `>=20.10.0`
- npm
- Shopify Partners 계정 및 개발 스토어
- Shopify CLI 인증
- Firebase 프로젝트 및 서비스 계정
- 외부에서 접근 가능한 앱 URL

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.example`을 복사해 `.env`를 만들고 값을 채웁니다.

```bash
cp .env.example .env
```

필수 환경 변수:

| 변수 | 설명 |
| --- | --- |
| `PORT` | Express 서버 포트. 기본 서버는 코드상 `10000`을 기본값으로 사용합니다. |
| `APP_URL` | 배포 또는 터널링된 앱의 공개 URL입니다. 예: `https://app.example.com` |
| `SHOPIFY_API_KEY` | Shopify 앱 Client ID/API key |
| `SHOPIFY_API_SECRET` | Shopify 앱 Client secret. OAuth, HMAC, 세션 토큰 검증에 사용됩니다. |
| `SHOPIFY_DEV_STORE_URL` | 개발용 Shopify 스토어 도메인 |
| `FIREBASE_PROJECT_ID` | Firebase 프로젝트 ID |
| `FIREBASE_CLIENT_EMAIL` | Firebase 서비스 계정 이메일 |
| `FIREBASE_PRIVATE_KEY` | Firebase 서비스 계정 private key |

선택 환경 변수:

| 변수 | 설명 |
| --- | --- |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Firebase 서비스 계정을 JSON 문자열 하나로 주입할 때 사용합니다. 설정하면 split env 방식보다 우선합니다. |
| `APPLICATION_URL` | `APP_URL`이 없을 때 대체로 사용하는 공개 URL입니다. |
| `SHOPIFY_SCOPES` | OAuth scope 목록입니다. 미설정 시 `read_products,read_themes`를 사용합니다. |
| `SHOPIFY_API_VERSION` | Shopify Admin API 버전입니다. 미설정 시 `2026-04`를 사용합니다. |
| `SHOPIFY_BILLING_TEST` | Billing test mode 여부입니다. 미설정 시 production이 아니면 test mode로 동작합니다. |
| `BYPASS_BILLING` | `true`이면 Billing 검사를 우회합니다. 개발 스토어에서 유용합니다. |
| `OPEN_BEAUTY_FACTS_BASE_URL` | 현재 분석 로직에서는 사용하지 않는 예비/레거시 값입니다. |

Firebase private key는 줄바꿈을 `\n`으로 이스케이프한 문자열로 넣을 수 있습니다.

### 4. Shopify 앱 연결

Shopify CLI로 앱을 연결하거나 생성합니다.

```bash
npm run dev
```

`shopify.app.toml`에는 현재 다음 값들이 포함되어 있습니다.

- 앱 이름: `Skinin Ingredient Checker`
- Embedded app: `true`
- 기본 Application URL: `https://app.skinin.kr`
- OAuth callback: `/auth/callback`
- Theme extension: `extensions/skinin-ingredient-checker`
- 개인정보 보호 웹훅: `/webhooks/customers/data_request`, `/webhooks/customers/redact`, `/webhooks/shop/redact`

개발 중 Shopify CLI가 생성하는 터널 URL을 사용한다면 `APP_URL`, `application_url`, redirect URL, 웹훅 URL이 같은 공개 URL을 바라보도록 맞춰야 합니다.

### 5. 로컬 서버 실행

Shopify CLI와 함께 개발하려면:

```bash
npm run dev
```

Express 서버만 실행하려면:

```bash
npm run server:dev
```

프로덕션 방식으로 실행하려면:

```bash
npm start
```

공개 페이지만 별도 서버로 실행하려면:

```bash
npm run start:public
```

### 6. Theme App Extension 설정

1. Shopify Admin에서 `Online Store > Themes > Customize`로 이동합니다.
2. 상품 페이지 템플릿을 엽니다.
3. `Ingredient checker` 앱 블록을 추가합니다.
4. 블록 설정의 `App backend URL`에 `APP_URL` 값을 입력합니다.
5. 상품 설명 또는 metafield에 성분 목록을 추가합니다.

지원하는 상품 데이터:

- `product.metafields.skinin.ingredients`
- `product.metafields.custom.ingredients`
- 상품 설명 내 `Ingredients:`, `Ingredient list:`, `INCI:`, `Full ingredients:` 라벨 뒤의 쉼표 구분 목록

예시:

```text
Ingredients: Water, Glycerin, Niacinamide, Panthenol, Fragrance
```

성분 목록으로 판단할 수 없는 텍스트는 분석하지 않고 빈 상태 메시지를 표시합니다.

## 사용 가능한 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | Shopify CLI 개발 서버 실행 |
| `npm run build` | Shopify 앱 빌드 |
| `npm run deploy` | Shopify 앱 배포 |
| `npm start` | `web/src/server.js` 실행 |
| `npm run start:public` | `web/src/public-server.js` 실행 |
| `npm run server:dev` | nodemon으로 Express 서버 실행 |
| `npm run lint` | ESLint 실행 |
| `npm run format` | Prettier 포맷 적용 |

## API 개요

| Method | Path | 설명 |
| --- | --- | --- |
| `GET` | `/` | 앱 홈 및 설정 안내 페이지 |
| `GET` | `/admin?shop={shop}` | 위젯 설정 및 커스텀 성분 관리 화면 |
| `GET` | `/health` | 서버 상태 확인 |
| `GET` | `/auth?shop={shop}` | Shopify OAuth 시작 |
| `GET` | `/auth/callback` | Shopify OAuth callback |
| `GET` | `/billing/create?shop={shop}` | Shopify 구독 생성 플로우 시작 |
| `GET` | `/billing/callback` | Shopify Billing callback |
| `POST` | `/api/session` | Shopify App Bridge session token 검증 |
| `POST` | `/api/ingredients/analyze` | 성분 목록 분석 |
| `GET` | `/api/settings?shop={shop}` | 매장별 위젯 설정 조회 |
| `POST` | `/api/settings` | 매장별 위젯 설정 저장 |
| `POST` | `/webhooks/customers/data_request` | Shopify 고객 데이터 요청 웹훅 |
| `POST` | `/webhooks/customers/redact` | Shopify 고객 데이터 삭제 웹훅 |
| `POST` | `/webhooks/shop/redact` | Shopify 스토어 데이터 삭제 웹훅 |

성분 분석 요청 예시:

```json
{
  "shop": "example.myshopify.com",
  "productId": "123456789",
  "productTitle": "Hydrating Serum",
  "ingredients": ["Water", "Glycerin", "Niacinamide", "Fragrance"]
}
```

## 프로젝트 구조

```text
.
├── README.md
├── package.json
├── package-lock.json
├── shopify.app.toml
├── render.yaml
├── public/
│   └── index.json
├── web/
│   ├── shopify.web.toml
│   └── src/
│       ├── server.js
│       ├── public-server.js
│       ├── public-pages.js
│       ├── middleware/
│       │   ├── billing.js
│       │   └── error-handler.js
│       ├── routes/
│       │   ├── auth.js
│       │   ├── billing.js
│       │   ├── ingredients.js
│       │   ├── settings.js
│       │   └── webhooks.js
│       └── services/
│           ├── firestore.js
│           ├── ingredient-analyzer.js
│           └── shopify.js
└── extensions/
    └── skinin-ingredient-checker/
        ├── shopify.extension.toml
        ├── assets/
        │   ├── skinin-ingredient-checker.css
        │   └── skinin-ingredient-checker.js
        ├── blocks/
        │   └── ingredient-checker.liquid
        └── locales/
            └── en.default.json
```

### 핵심 파일 설명

| 파일 | 역할 |
| --- | --- |
| `web/src/server.js` | 메인 Express 앱입니다. 앱 홈, 관리자 화면, API, OAuth, Billing, Webhook을 마운트합니다. |
| `web/src/public-server.js` | 앱 정보/개인정보/지원 페이지 전용 경량 서버입니다. |
| `web/src/routes/auth.js` | Shopify OAuth 시작 및 callback 처리입니다. |
| `web/src/routes/billing.js` | 구독 생성과 Billing callback 처리입니다. |
| `web/src/routes/ingredients.js` | storefront에서 호출하는 성분 분석 API입니다. |
| `web/src/routes/settings.js` | 매장별 위젯 설정과 커스텀 성분 저장 API입니다. |
| `web/src/routes/webhooks.js` | Shopify compliance webhook HMAC 검증 및 응답 처리입니다. |
| `web/src/middleware/billing.js` | 구독 상태 조회, 구독 생성, API 접근 제어 로직입니다. |
| `web/src/services/firestore.js` | Firestore 초기화, 토큰/설정/분석 이력 저장 로직입니다. |
| `web/src/services/ingredient-analyzer.js` | 내장 성분 데이터와 룰 기반 분류 로직입니다. |
| `web/src/services/shopify.js` | Shopify shop domain 정규화, HMAC 검증, 세션 토큰 검증, access token 요청 로직입니다. |
| `extensions/skinin-ingredient-checker/blocks/ingredient-checker.liquid` | 상품 페이지에 삽입되는 앱 블록입니다. |
| `extensions/skinin-ingredient-checker/assets/skinin-ingredient-checker.js` | storefront 버튼 클릭, 성분 추출, API 호출, 모달 렌더링 로직입니다. |
| `extensions/skinin-ingredient-checker/assets/skinin-ingredient-checker.css` | storefront 위젯과 모달 스타일입니다. |

## 데이터 저장

Firestore 컬렉션:

- `shopTokens`: Shopify access token, 설치 정보, 위젯 설정, 커스텀 성분 목록
- `ingredientChecks`: 상품별 성분 분석 이력

Firebase 초기화에 실패하면 서버는 즉시 종료하지 않고 Firestore 기능을 비활성 상태로 처리합니다. 이 경우 설정 저장, 커스텀 성분, 분석 이력 저장은 정상 동작하지 않을 수 있습니다.

## Billing

기본 플랜은 `Skinin Pro`이며 월 `29 USD` 구독으로 설정되어 있습니다.

개발 중 Billing을 우회하려면 `.env`에 다음 값을 추가합니다.

```bash
BYPASS_BILLING=true
```

실제 Shopify Billing API를 사용하려면 앱이 공개 배포 요건을 만족해야 하며, 설치된 매장의 access token이 Firestore에 저장되어 있어야 합니다.

## 배포

`render.yaml`에는 Render Web Service 설정이 포함되어 있습니다.

- Build command: `npm install`
- Start command: `npm run start`
- Node version: `22`

배포 환경에서는 최소한 다음 값을 설정해야 합니다.

- `APP_URL`
- `SHOPIFY_API_KEY`
- `SHOPIFY_API_SECRET`
- Firebase 서비스 계정 환경 변수
- 필요한 경우 `SHOPIFY_API_VERSION`, `SHOPIFY_BILLING_TEST`, `BYPASS_BILLING`

배포 후 Shopify 앱 설정의 Application URL, Redirect URL, Webhook URL, Theme App Extension의 backend URL이 모두 배포 도메인을 가리키는지 확인합니다.

## 개발 참고 사항

- 분석 엔진은 현재 외부 API를 호출하지 않고 로컬 내장 데이터와 매장별 커스텀 성분을 사용합니다.
- Theme extension에는 Liquid 블록 내부 inline script와 asset JavaScript가 함께 존재합니다. storefront 동작 변경 시 둘의 역할 중복 여부를 함께 확인해야 합니다.
- 상품 설명 전체를 무조건 분석하지 않습니다. `Ingredients:` 같은 라벨과 쉼표로 구분된 성분 목록이 있어야 분석합니다.
- 현재 `package.json`에는 테스트 스크립트가 정의되어 있지 않습니다. 변경 검증은 `npm run lint`와 실제 Shopify 개발 스토어 테스트를 기준으로 수행합니다.
