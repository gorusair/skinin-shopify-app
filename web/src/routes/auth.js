  import crypto from "crypto";
  import { Router } from "express";

  import { saveShopToken } from "../services/firestore.js";
  import {
    normalizeShopDomain,
    requestAccessToken,
    verifyShopifyHmac
  } from "../services/shopify.js";

  const router = Router();

  const DEFAULT_SCOPES = ["read_products", "read_themes"];
  const OAUTH_STATE_COOKIE = "shopify_oauth_state";

  function getAppUrl() {
    return (
      process.env.APP_URL ||
      process.env.APPLICATION_URL ||
      "https://skinin-ingredient-checker.onrender.com"
    ).replace(/\/$/, "");
  }

  function getScopes() {
    return process.env.SHOPIFY_SCOPES || DEFAULT_SCOPES.join(",");
  }

  function getShopAdminUrl(shop) {
    return `https://${shop}/admin/apps/${process.env.SHOPIFY_API_KEY}`;
  }

  function getCookieValue(cookieHeader, name) {
    if (!cookieHeader) {
      return null;
    }

    const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
    const targetCookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));

    if (!targetCookie) {
      return null;
    }

    return decodeURIComponent(targetCookie.slice(name.length + 1));
  }

  function clearOAuthStateCookie(res) {
    res.clearCookie(OAUTH_STATE_COOKIE, {
      httpOnly: true,
      sameSite: "none",
      secure: true
    });
  }

  function isAlreadyUsedOAuthCodeError(error) {
    const message = error?.message || "";

    return (
      message.includes("authorization code was not found") ||
      message.includes("already used")
    );
  }

  router.get("/", (req, res, next) => {
    try {
      const shop = normalizeShopDomain(req.query.shop);
      const state = crypto.randomBytes(16).toString("hex");
      const redirectUri = `${getAppUrl()}/auth/callback`;

      const installUrl = new URL(`https://${shop}/admin/oauth/authorize`);
      installUrl.searchParams.set("client_id", process.env.SHOPIFY_API_KEY);
      installUrl.searchParams.set("scope", getScopes());
      installUrl.searchParams.set("redirect_uri", redirectUri);
      installUrl.searchParams.set("state", state);

      res.cookie(OAUTH_STATE_COOKIE, state, {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
        sameSite: "none",
        secure: true
      });

      res.redirect(installUrl.toString());
    } catch (error) {
      next(error);
    }
  });

  router.get("/callback", async (req, res, next) => {
    try {
      const { code, shop } = req.query;
      const normalizedShop = normalizeShopDomain(shop);

      if (!code || typeof code !== "string") {
        return res.status(400).json({ error: "Missing code parameter" });
      }

      const expectedState = getCookieValue(req.headers.cookie, OAUTH_STATE_COOKIE);

      if (!expectedState || req.query.state !== expectedState) {
        return res.status(401).json({ error: "Invalid OAuth state" });
      }

      if (!verifyShopifyHmac(req.query)) {
        return res.status(401).json({ error: "Invalid Shopify HMAC" });
      }

      try {
        const accessToken = await requestAccessToken(normalizedShop, code);
        await saveShopToken(normalizedShop, accessToken);
      } catch (error) {
        if (!isAlreadyUsedOAuthCodeError(error)) {
          throw error;
        }

        console.warn(
          `OAuth code already used for ${normalizedShop}; redirecting to Shopify admin.`
        );
      }

      clearOAuthStateCookie(res);
      return res.redirect(getShopAdminUrl(normalizedShop));
    } catch (error) {
      next(error);
    }
  });

  export default router;
