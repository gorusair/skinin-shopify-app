import crypto from "crypto";
import { Router } from "express";

const router = Router();

const SHOPIFY_HMAC_HEADER = "x-shopify-hmac-sha256";
const SHOPIFY_TOPIC_HEADER = "x-shopify-topic";
const SHOPIFY_SHOP_HEADER = "x-shopify-shop-domain";

const COMPLIANCE_TOPICS = new Set([
  "customers/data_request",
  "customers/redact",
  "shop/redact",
]);

function getRawBody(req) {
  if (Buffer.isBuffer(req.body)) {
    return req.body;
  }

  if (typeof req.body === "string") {
    return Buffer.from(req.body, "utf8");
  }

  return Buffer.alloc(0);
}

function verifyWebhookHmac(req) {
  const apiSecret = process.env.SHOPIFY_API_SECRET;
  const hmacHeader = req.get(SHOPIFY_HMAC_HEADER);

  if (!apiSecret || !hmacHeader) {
    return false;
  }

  const generatedHmac = crypto
    .createHmac("sha256", apiSecret)
    .update(getRawBody(req))
    .digest("base64");

  const generatedBuffer = Buffer.from(generatedHmac, "utf8");
  const headerBuffer = Buffer.from(hmacHeader, "utf8");

  if (generatedBuffer.length !== headerBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(generatedBuffer, headerBuffer);
}

function handleComplianceWebhook(expectedTopic) {
  return (req, res) => {
    if (!verifyWebhookHmac(req)) {
      return res.sendStatus(401);
    }

    const topic = req.get(SHOPIFY_TOPIC_HEADER) || expectedTopic;

    if (!COMPLIANCE_TOPICS.has(topic) || topic !== expectedTopic) {
      return res.sendStatus(403);
    }

    console.info("[Webhook] Compliance webhook received:", {
      topic,
      shop: req.get(SHOPIFY_SHOP_HEADER) || "unknown",
    });

    return res.sendStatus(200);
  };
}

router.post(
  "/customers/data_request",
  handleComplianceWebhook("customers/data_request"),
);
router.post("/customers/redact", handleComplianceWebhook("customers/redact"));
router.post("/shop/redact", handleComplianceWebhook("shop/redact"));

export default router;
