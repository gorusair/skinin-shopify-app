import { shopifyApi, ApiVersion } from "@shopify/shopify-api";

const PLAN_NAME = "Pro Plan";
const PLAN_PRICE = 29.0;
const TRIAL_DAYS = 7;

export async function checkBilling(req, res, next) {
  const shop = req.body?.shop || req.query?.shop;
  
  if (!shop) {
    return next();
  }

  try {
    const accessToken = await getAccessToken(shop);
    
    if (!accessToken) {
      return res.status(402).json({
        error: "subscription_required",
        message: "Please install the app through Shopify to use this feature.",
      });
    }

    const hasSubscription = await checkActiveSubscription(shop, accessToken);

    if (!hasSubscription) {
      const confirmationUrl = await createSubscription(shop, accessToken);
      return res.status(402).json({
        error: "subscription_required",
        confirmationUrl,
        message: "A subscription is required to use this feature.",
      });
    }

    next();
  } catch (error) {
    console.warn("Billing check failed:", error.message);
    next(); // 에러 시 일단 통과 (사용자 경험 보호)
  }
}

async function getAccessToken(shop) {
  // Firebase 또는 환경변수에서 액세스 토큰 가져오기
  // 지금은 환경변수로 처리
  return process.env.SHOPIFY_ACCESS_TOKEN || null;
}

async function checkActiveSubscription(shop, accessToken) {
  const query = `{
    currentAppInstallation {
      activeSubscriptions {
        name
        status
        trialDays
      }
    }
  }`;

  const response = await fetch(
    `https://${shop}/admin/api/2026-04/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({ query }),
    }
  );

  const data = await response.json();
  const subscriptions = data?.data?.currentAppInstallation?.activeSubscriptions || [];
  
  return subscriptions.some(
    (sub) => sub.name === PLAN_NAME && sub.status === "ACTIVE"
  );
}

async function createSubscription(shop, accessToken) {
  const appUrl = process.env.APPLICATION_URL || "https://skinin-shopify-app-production.up.railway.app";
  
  const mutation = `
    mutation {
      appSubscriptionCreate(
        name: "${PLAN_NAME}"
        returnUrl: "${appUrl}"
        trialDays: ${TRIAL_DAYS}
        lineItems: [{
          plan: {
            appRecurringPricingDetails: {
              price: { amount: ${PLAN_PRICE}, currencyCode: USD }
              interval: EVERY_30_DAYS
            }
          }
        }]
      ) {
        appSubscription { id status }
        confirmationUrl
        userErrors { field message }
      }
    }
  `;

  const response = await fetch(
    `https://${shop}/admin/api/2026-04/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({ query: mutation }),
    }
  );

  const data = await response.json();
  return data?.data?.appSubscriptionCreate?.confirmationUrl;
}