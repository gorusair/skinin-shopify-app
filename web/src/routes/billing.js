import { Router } from "express";

import {
  getBillingConfirmationUrl,
  getBillingStatus,
  getShopAdminUrl,
  isBillingBypassed,
  logBillingBypass,
} from "../middleware/billing.js";
import { normalizeShopDomain } from "../services/shopify.js";

const router = Router();

router.get("/create", async (req, res, next) => {
  try {
    const shop = normalizeShopDomain(req.query.shop);

    if (isBillingBypassed()) {
      logBillingBypass();
      return res.redirect(`/?shop=${encodeURIComponent(shop)}`);
    }

    const confirmationUrl = await getBillingConfirmationUrl(shop);

    return res.redirect(confirmationUrl);
  } catch (error) {
    console.warn("[Billing] Failed to create subscription:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    return next(error);
  }
});

router.get("/callback", async (req, res, next) => {
  try {
    const shop = normalizeShopDomain(req.query.shop);
    const billingStatus = await getBillingStatus(shop);

    if (!billingStatus.hasActiveSubscription) {
      return res.redirect(`/billing/create?shop=${encodeURIComponent(shop)}`);
    }

    console.info("[Billing] Subscription active for shop:", shop);

    return res.redirect(getShopAdminUrl(shop));
  } catch (error) {
    console.warn("[Billing] Billing callback failed:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    return next(error);
  }
});

export default router;
