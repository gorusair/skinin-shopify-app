import crypto from "crypto";

const SHOPIFY_SHOP_DOMAIN_PATTERN =
  /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/;
const DEFAULT_SHOPIFY_API_KEY = "ad670221e1d6929bc51cf5a88084f53a";

function getShopifyApiKey() {
  return process.env.SHOPIFY_API_KEY || DEFAULT_SHOPIFY_API_KEY;
}

function decodeBase64Url(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function verifyJwtSignature(header, payload, signature) {
  if (!process.env.SHOPIFY_API_SECRET) {
    throw new Error("Missing SHOPIFY_API_SECRET");
  }

  const signedPayload = `${header}.${payload}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
    .update(signedPayload)
    .digest("base64url");

  const expectedBuffer = Buffer.from(expectedSignature);
  const signatureBuffer = Buffer.from(signature);

  return (
    expectedBuffer.length === signatureBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
  );
}

export function logShopifySessionTokenDebug({ authorizationHeader, token }) {
  console.log("/api/session called");
  console.log("authorization header exists:", Boolean(authorizationHeader));
  console.log("bearer token extracted:", Boolean(token));
  console.log("SHOPIFY_API_KEY exists:", Boolean(process.env.SHOPIFY_API_KEY));
  console.log(
    "SHOPIFY_API_SECRET exists:",
    Boolean(process.env.SHOPIFY_API_SECRET),
  );

  try {
    const [encodedHeader, encodedPayload] = token?.split(".") || [];
    const header = encodedHeader ? JSON.parse(decodeBase64Url(encodedHeader)) : {};
    const payload = encodedPayload
      ? JSON.parse(decodeBase64Url(encodedPayload))
      : {};

    console.log("decoded JWT header alg:", header.alg);
    console.log("decoded JWT aud:", payload.aud);
    console.log("decoded JWT dest:", payload.dest);
    console.log("decoded JWT iss:", payload.iss);
    console.log("decoded JWT exp:", payload.exp);
  } catch (error) {
    console.log("decoded JWT header alg:", undefined);
    console.log("decoded JWT aud:", undefined);
    console.log("decoded JWT dest:", undefined);
    console.log("decoded JWT iss:", undefined);
    console.log("decoded JWT exp:", undefined);
    console.log("JWT debug decode error:", error.message);
  }

  console.log("current unix time:", Math.floor(Date.now() / 1000));
}

export function normalizeShopDomain(shop) {
  if (!shop || typeof shop !== "string") {
    throw new Error("Missing shop parameter");
  }

  const normalizedShop = shop.trim().toLowerCase();

  if (!SHOPIFY_SHOP_DOMAIN_PATTERN.test(normalizedShop)) {
    throw new Error("Invalid shop parameter");
  }

  return normalizedShop;
}

export function verifyShopifyHmac(query) {
  const { hmac, signature, ...messageParams } = query;

  if (!hmac || typeof hmac !== "string") {
    return false;
  }

  const message = Object.keys(messageParams)
    .sort()
    .map((key) => {
      const value = messageParams[key];
      return `${key}=${Array.isArray(value) ? value.join(",") : value}`;
    })
    .join("&");

  const generatedHash = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
    .update(message)
    .digest("hex");

  const generatedBuffer = Buffer.from(generatedHash, "utf8");
  const hmacBuffer = Buffer.from(hmac, "utf8");

  if (generatedBuffer.length !== hmacBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(generatedBuffer, hmacBuffer);
}

export function verifyShopifySessionToken(token) {
  if (!token || typeof token !== "string") {
    throw new Error("Missing Shopify session token");
  }

  const [encodedHeader, encodedPayload, signature] = token.split(".");

  if (!encodedHeader || !encodedPayload || !signature) {
    throw new Error("Invalid Shopify session token");
  }

  const header = JSON.parse(decodeBase64Url(encodedHeader));
  const payload = JSON.parse(decodeBase64Url(encodedPayload));

  if (header.alg !== "HS256") {
    throw new Error("Unsupported Shopify session token algorithm");
  }

  if (!verifyJwtSignature(encodedHeader, encodedPayload, signature)) {
    throw new Error("Invalid Shopify session token signature");
  }

  const now = Math.floor(Date.now() / 1000);

  if (payload.nbf && payload.nbf > now) {
    throw new Error("Shopify session token is not valid yet");
  }

  if (!payload.exp || payload.exp <= now) {
    throw new Error("Shopify session token has expired");
  }

  if (payload.aud !== getShopifyApiKey()) {
    throw new Error("Invalid Shopify session token audience");
  }

  const destination = new URL(payload.dest);
  const shop = normalizeShopDomain(destination.hostname);

  return {
    shop,
    subject: payload.sub,
    issuer: payload.iss,
    expiresAt: payload.exp,
  };
}

export async function requestAccessToken(shop, code) {
  const normalizedShop = normalizeShopDomain(shop);

  const response = await fetch(
    `https://${normalizedShop}/admin/oauth/access_token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error_description ||
        data?.error ||
        "Failed to request access token",
    );
  }

  if (!data.access_token) {
    throw new Error("Shopify did not return an access token");
  }

  return data.access_token;
}
