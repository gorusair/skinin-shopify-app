import { Router } from "express";
import { z } from "zod";

import { analyzeIngredients } from "../services/ingredient-analyzer.js";
import { saveIngredientCheck } from "../services/firestore.js";

const router = Router();

const analyzeRequestSchema = z.object({
  shop: z.string().min(1),
  productId: z.string().min(1),
  productTitle: z.string().optional(),
  ingredients: z.array(z.string().min(1)).min(1)
});

router.post("/analyze", async (req, res, next) => {
  try {
    const payload = analyzeRequestSchema.parse(req.body);
    const analysis = await analyzeIngredients(payload.ingredients);

    try {
      await saveIngredientCheck({
        shop: payload.shop,
        productId: payload.productId,
        productTitle: payload.productTitle,
        ingredients: analysis
      });
    } catch (saveError) {
      console.warn("Failed to save ingredient check", saveError.message);
    }

    res.json({ ingredients: analysis });
  } catch (error) {
    next(error);
  }
});

export default router;
