import crypto from "crypto";

  const SHOPIFY_SHOP_DOMAIN_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/;

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

  export async function requestAccessToken(shop, code) {
    const normalizedShop = normalizeShopDomain(shop);

    const response = await fetch(
      `https://${normalizedShop}/admin/oauth/access_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          client_id: process.env.SHOPIFY_API_KEY,
          client_secret: process.env.SHOPIFY_API_SECRET,
          code
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error_description || data?.error || "Failed to request access token"
      );
    }

    if (!data.access_token) {
      throw new Error("Shopify did not return an access token");
    }

    return data.access_token;
  }
