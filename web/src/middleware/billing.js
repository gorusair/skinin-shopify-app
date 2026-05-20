import { getShopAccessToken } from "../services/firestore.js";
import { normalizeShopDomain } from "../services/shopify.js";

const PLAN_NAME = "Skinin Pro";
const PLAN_PRICE = 29;
const PLAN_INTERVAL = "EVERY_30_DAYS";
const DEFAULT_SHOPIFY_API_VERSION = "2026-04";

function getAppUrl() {
  return (
    process.env.APP_URL ||
    process.env.APPLICATION_URL ||
    "https://skinin-shopify-app-production.up.railway.app"
  ).replace(/\/$/, "");
}

function getShopifyApiVersion() {
  return process.env.SHOPIFY_API_VERSION || DEFAULT_SHOPIFY_API_VERSION;
}

function getBillingTestMode() {
  if (process.env.SHOPIFY_BILLING_TEST !== undefined) {
    return process.env.SHOPIFY_BILLING_TEST === "true";
  }

  return process.env.NODE_ENV !== "production";
}

export function isBillingBypassed() {
  return process.env.BYPASS_BILLING === "true";
}

export function logBillingBypass() {
  console.info(
    "[Billing] BYPASS_BILLING enabled - skipping Shopify Billing API",
  );
}

function getBillingReturnUrl(shop) {
  const returnUrl = new URL(`${getAppUrl()}/billing/callback`);
  returnUrl.searchParams.set("shop", shop);
  return returnUrl.toString();
}

function getShopAdminUrl(shop) {
  return `https://${shop}/admin/apps/${process.env.SHOPIFY_API_KEY}`;
}

async function shopifyGraphql(shop, accessToken, query, variables = {}) {
  const response = await fetch(
    `https://${shop}/admin/api/${getShopifyApiVersion()}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({ query, variables }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.errors?.[0]?.message ||
        `Shopify GraphQL request failed: ${response.status}`,
    );
  }

  if (data.errors?.length) {
    throw new Error(data.errors.map((error) => error.message).join("; "));
  }

  return data.data;
}

export async function checkActiveSubscription(shop, accessToken) {
  const query = `
    query CurrentAppSubscriptions {
      currentAppInstallation {
        activeSubscriptions {
          id
          name
          status
        }
      }
    }
  `;

  const data = await shopifyGraphql(shop, accessToken, query);
  const subscriptions = data?.currentAppInstallation?.activeSubscriptions || [];

  return subscriptions.some(
    (subscription) =>
      subscription.name === PLAN_NAME && subscription.status === "ACTIVE",
  );
}

export async function createSubscription(shop, accessToken) {
  const mutation = `
    mutation AppSubscriptionCreate(
      $name: String!
      $returnUrl: URL!
      $lineItems: [AppSubscriptionLineItemInput!]!
      $test: Boolean
    ) {
      appSubscriptionCreate(
        name: $name
        returnUrl: $returnUrl
        lineItems: $lineItems
        test: $test
      ) {
        userErrors {
          field
          message
        }
        confirmationUrl
        appSubscription {
          id
          status
        }
      }
    }
  `;

  const data = await shopifyGraphql(shop, accessToken, mutation, {
    name: PLAN_NAME,
    returnUrl: getBillingReturnUrl(shop),
    test: getBillingTestMode(),
    lineItems: [
      {
        plan: {
          appRecurringPricingDetails: {
            price: {
              amount: PLAN_PRICE,
              currencyCode: "USD",
            },
            interval: PLAN_INTERVAL,
          },
        },
      },
    ],
  });

  const result = data?.appSubscriptionCreate;
  const userErrors = result?.userErrors || [];

  if (userErrors.length) {
    throw new Error(
      userErrors
        .map(
          (error) => `${error.field?.join(".") || "billing"}: ${error.message}`,
        )
        .join("; "),
    );
  }

  if (!result?.confirmationUrl) {
    throw new Error("Shopify did not return a billing confirmation URL");
  }

  console.info(
    "[Billing] Created subscription confirmation URL for shop:",
    shop,
  );

  return result.confirmationUrl;
}

export async function getBillingStatus(shop) {
  const normalizedShop = normalizeShopDomain(shop);

  if (isBillingBypassed()) {
    logBillingBypass();

    return {
      shop: normalizedShop,
      installed: true,
      hasActiveSubscription: true,
    };
  }

  const accessToken = await getShopAccessToken(normalizedShop);

  if (!accessToken) {
    return {
      shop: normalizedShop,
      installed: false,
      hasActiveSubscription: false,
    };
  }

  const hasActiveSubscription = await checkActiveSubscription(
    normalizedShop,
    accessToken,
  );

  return {
    shop: normalizedShop,
    installed: true,
    hasActiveSubscription,
  };
}

export async function getBillingConfirmationUrl(shop) {
  const normalizedShop = normalizeShopDomain(shop);

  if (isBillingBypassed()) {
    logBillingBypass();
    return `/?shop=${encodeURIComponent(normalizedShop)}`;
  }

  const accessToken = await getShopAccessToken(normalizedShop);

  if (!accessToken) {
    throw new Error("Missing Shopify access token for shop");
  }

  return createSubscription(normalizedShop, accessToken);
}

export async function ensureBilling(req, res, next) {
  const shop = req.body?.shop || req.query?.shop;

  if (isBillingBypassed()) {
    logBillingBypass();
    return next();
  }

  if (!shop) {
    return next();
  }

  try {
    const normalizedShop = normalizeShopDomain(shop);
    const accessToken = await getShopAccessToken(normalizedShop);

    if (!accessToken) {
      return res.status(402).json({
        error: "subscription_required",
        message: "Please install the app through Shopify to use this feature.",
      });
    }

    const hasActiveSubscription = await checkActiveSubscription(
      normalizedShop,
      accessToken,
    );

    if (!hasActiveSubscription) {
      const confirmationUrl = await createSubscription(
        normalizedShop,
        accessToken,
      );

      return res.status(402).json({
        error: "subscription_required",
        confirmationUrl,
        message: "A subscription is required to use this feature.",
      });
    }

    return next();
  } catch (error) {
    console.warn("[Billing] Billing check failed:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    return next(error);
  }
}

export { ensureBilling as checkBilling, getShopAdminUrl };
