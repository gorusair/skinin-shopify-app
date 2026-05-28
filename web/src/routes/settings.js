import { Router } from "express";
import { z } from "zod";

import { getShopSettings, saveShopSettings } from "../services/firestore.js";

const router = Router();

const settingsBodySchema = z.object({
  shop: z.string().min(1),
  buttonText: z.string().optional(),
  buttonColor: z.string().optional(),
  modalTitle: z.string().optional(),
  labels: z
    .object({
      low: z.string().optional(),
      mid: z.string().optional(),
      high: z.string().optional(),
    })
    .optional(),
  disclaimerText: z.string().optional(),
  customIngredients: z
    .array(
      z.object({
        name: z.string().min(1),
        rating: z.enum(["safe", "caution", "avoid"]),
        function: z.string().optional(),
        reason: z.string().optional(),
      }),
    )
    .optional(),
});

router.get("/", async (req, res, next) => {
  try {
    const shop = req.query.shop;
    if (!shop) {
      return res.status(400).json({ error: "shop parameter required" });
    }
    const settings = await getShopSettings(String(shop));
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { shop, ...settings } = settingsBodySchema.parse(req.body);
    const saved = await saveShopSettings(shop, settings);
    res.json({ ok: saved });
  } catch (error) {
    next(error);
  }
});

export default router;
