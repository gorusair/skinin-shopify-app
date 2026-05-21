// Direct safety rating mapping by ingredient
const INGREDIENT_SAFETY = {
  // AVOID
  fragrance: {
    rating: "avoid",
    function: "fragrance",
    reason: "Potential irritant for sensitive skin",
  },
  parfum: {
    rating: "avoid",
    function: "fragrance",
    reason: "Potential irritant for sensitive skin",
  },
  perfume: {
    rating: "avoid",
    function: "fragrance",
    reason: "Potential irritant for sensitive skin",
  },
  formaldehyde: {
    rating: "avoid",
    function: "preservative",
    reason: "Ingredient may be unsuitable for sensitive skin",
  },

  // CAUTION
  "alcohol denat": {
    rating: "caution",
    function: "solvent",
    reason: "May be drying for some skin types",
  },
  "denatured alcohol": {
    rating: "caution",
    function: "solvent",
    reason: "May be drying for some skin types",
  },
  ethanol: {
    rating: "caution",
    function: "solvent",
    reason: "May be drying for some skin types",
  },
  limonene: {
    rating: "caution",
    function: "fragrance",
    reason: "Potential irritant for sensitive skin",
  },
  linalool: {
    rating: "caution",
    function: "fragrance",
    reason: "Potential irritant for sensitive skin",
  },
  citral: {
    rating: "caution",
    function: "fragrance",
    reason: "Potential irritant for sensitive skin",
  },
  geraniol: {
    rating: "caution",
    function: "fragrance",
    reason: "Potential irritant for sensitive skin",
  },
  "essential oil": {
    rating: "caution",
    function: "fragrance",
    reason: "Potential irritant for sensitive skin",
  },
  "peppermint oil": {
    rating: "caution",
    function: "fragrance",
    reason: "Potential irritant for sensitive skin",
  },
  "tea tree oil": {
    rating: "caution",
    function: "fragrance",
    reason: "Potential irritant for sensitive skin",
  },
  "sodium lauryl sulfate": {
    rating: "caution",
    function: "cleansing",
    reason: "May irritate sensitive skin",
  },
  sls: {
    rating: "caution",
    function: "cleansing",
    reason: "May irritate sensitive skin",
  },
  "sodium laureth sulfate": {
    rating: "caution",
    function: "cleansing",
    reason: "Potential irritant",
  },
  phenoxyethanol: {
    rating: "caution",
    function: "preservative",
    reason: "May irritate at high concentrations",
  },
  "benzyl alcohol": {
    rating: "caution",
    function: "preservative",
    reason: "Use with caution on sensitive skin",
  },
  "citric acid": {
    rating: "caution",
    function: "pH adjuster",
    reason: "May irritate at high concentrations",
  },
  retinol: {
    rating: "caution",
    function: "skin-conditioning",
    reason: "Use with caution on sensitive skin",
  },
  "retinyl palmitate": {
    rating: "caution",
    function: "skin-conditioning",
    reason: "Use with caution on sensitive skin",
  },
  "salicylic acid": {
    rating: "caution",
    function: "exfoliating",
    reason: "Use with caution on sensitive skin",
  },
  parabens: {
    rating: "caution",
    function: "preservative",
    reason: "Some shoppers prefer to review this preservative",
  },
  methylparaben: {
    rating: "caution",
    function: "preservative",
    reason: "Some shoppers prefer to review this preservative",
  },
  propylparaben: {
    rating: "caution",
    function: "preservative",
    reason: "Some shoppers prefer to review this preservative",
  },
  oxybenzone: {
    rating: "caution",
    function: "UV filter",
    reason: "Some shoppers prefer to review this UV filter",
  },

  // SAFE
  water: { rating: "safe", function: "solvent", reason: "Common solvent" },
  aqua: { rating: "safe", function: "solvent", reason: "Common solvent" },
  glycerin: {
    rating: "safe",
    function: "moisturizing",
    reason: "Common moisturizer",
  },
  glycerol: {
    rating: "safe",
    function: "moisturizing",
    reason: "Common moisturizer",
  },
  niacinamide: {
    rating: "safe",
    function: "skin-conditioning",
    reason: "Skin-conditioning ingredient",
  },
  panthenol: {
    rating: "safe",
    function: "skin-conditioning",
    reason: "Skin-conditioning ingredient",
  },
  tocopherol: {
    rating: "safe",
    function: "skin-conditioning",
    reason: "Skin-conditioning ingredient",
  },
  "hyaluronic acid": {
    rating: "safe",
    function: "moisturizing",
    reason: "Hydrating ingredient",
  },
  "sodium hyaluronate": {
    rating: "safe",
    function: "moisturizing",
    reason: "Hydrating ingredient",
  },
  "butylene glycol": {
    rating: "safe",
    function: "moisturizing",
    reason: "Common moisturizer",
  },
  "propylene glycol": {
    rating: "safe",
    function: "moisturizing",
    reason: "Common moisturizer",
  },
  "cetyl alcohol": {
    rating: "safe",
    function: "emollient",
    reason: "Skin-conditioning ingredient",
  },
  dimethicone: {
    rating: "safe",
    function: "emollient",
    reason: "Skin-conditioning ingredient",
  },
  "zinc oxide": {
    rating: "safe",
    function: "UV filter",
    reason: "Mineral UV filter",
  },
  "titanium dioxide": {
    rating: "safe",
    function: "UV filter",
    reason: "Mineral UV filter",
  },
  allantoin: {
    rating: "safe",
    function: "soothing",
    reason: "Soothing ingredient",
  },
  "centella asiatica": {
    rating: "safe",
    function: "soothing",
    reason: "Soothing ingredient",
  },
  "centella asiatica extract": {
    rating: "safe",
    function: "soothing",
    reason: "Soothing ingredient",
  },
  "aloe vera": {
    rating: "safe",
    function: "soothing",
    reason: "Soothing ingredient",
  },
  "aloe barbadensis": {
    rating: "safe",
    function: "soothing",
    reason: "Soothing ingredient",
  },
  "aloe barbadensis leaf juice": {
    rating: "safe",
    function: "soothing",
    reason: "Soothing ingredient",
  },
  ceramide: {
    rating: "safe",
    function: "skin-conditioning",
    reason: "Skin-conditioning ingredient",
  },
  "ceramide np": {
    rating: "safe",
    function: "skin-conditioning",
    reason: "Skin-conditioning ingredient",
  },
  adenosine: {
    rating: "safe",
    function: "skin-conditioning",
    reason: "Skin-conditioning ingredient",
  },
  "ascorbic acid": {
    rating: "safe",
    function: "skin-conditioning",
    reason: "Skin-conditioning ingredient",
  },
  "vitamin c": {
    rating: "safe",
    function: "skin-conditioning",
    reason: "Skin-conditioning ingredient",
  },
};

export async function analyzeIngredients(ingredients) {
  return Promise.all(
    ingredients.map((ingredient) => analyzeIngredient(ingredient)),
  );
}

async function analyzeIngredient(name) {
  const cleanName = cleanIngredientName(name);
  const normalizedName = normalizeIngredientName(cleanName);

  // 1. Search the direct DB first
  const directMatch = findIngredientMatch(normalizedName);
  if (directMatch) {
    return {
      name: cleanName,
      safetyRating: directMatch.rating,
      function: directMatch.function,
      category: directMatch.function,
      reason: directMatch.reason,
      source: "ingredient_db",
    };
  }

  return {
    name: cleanName,
    safetyRating: "caution",
    function: "unknown",
    category: "unknown",
    reason: "Ingredient information is limited",
    source: "fallback",
  };
}

function cleanIngredientName(name) {
  return String(name)
    .trim()
    .replace(/[.,;:]+$/g, "")
    .trim();
}

function normalizeIngredientName(name) {
  return cleanIngredientName(name).toLowerCase().replace(/\s+/g, " ");
}

function findIngredientMatch(name) {
  // Exact match
  if (INGREDIENT_SAFETY[name]) return INGREDIENT_SAFETY[name];

  // Phrase match for common variants, for example "lavender essential oil".
  for (const [key, value] of Object.entries(INGREDIENT_SAFETY)) {
    if (containsIngredientPhrase(name, key)) {
      return value;
    }
  }
  return null;
}

function containsIngredientPhrase(name, phrase) {
  const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escapedPhrase}([^a-z0-9]|$)`).test(name);
}
