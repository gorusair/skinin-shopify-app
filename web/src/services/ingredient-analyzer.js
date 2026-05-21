import axios from "axios";

const DEFAULT_BASE_URL = "https://world.openbeautyfacts.org/api/v2";

// Direct safety rating mapping by ingredient
const INGREDIENT_SAFETY = {
  // AVOID
  "fragrance": { rating: "avoid", function: "fragrance", reason: "Potential irritant for sensitive skin" },
  "perfume": { rating: "avoid", function: "fragrance", reason: "Potential allergen" },
  "alcohol denat": { rating: "avoid", function: "solvent", reason: "Skin irritant" },
  "denatured alcohol": { rating: "avoid", function: "solvent", reason: "Skin irritant" },
  "formaldehyde": { rating: "avoid", function: "preservative", reason: "Potential carcinogen" },
  "parabens": { rating: "avoid", function: "preservative", reason: "Potential hormone disruptor" },
  "methylparaben": { rating: "avoid", function: "preservative", reason: "Potential hormone disruptor" },
  "propylparaben": { rating: "avoid", function: "preservative", reason: "Potential hormone disruptor" },
  "oxybenzone": { rating: "avoid", function: "UV filter", reason: "Potential hormone disruptor" },

  // CAUTION
  "sodium lauryl sulfate": { rating: "caution", function: "cleansing", reason: "May irritate sensitive skin" },
  "sls": { rating: "caution", function: "cleansing", reason: "May irritate sensitive skin" },
  "sodium laureth sulfate": { rating: "caution", function: "cleansing", reason: "Potential irritant" },
  "phenoxyethanol": { rating: "caution", function: "preservative", reason: "May irritate at high concentrations" },
  "benzyl alcohol": { rating: "caution", function: "preservative", reason: "Use with caution on sensitive skin" },
  "citric acid": { rating: "caution", function: "pH adjuster", reason: "May irritate at high concentrations" },
  "retinol": { rating: "caution", function: "anti-aging", reason: "Caution for pregnant women" },
  "salicylic acid": { rating: "caution", function: "exfoliating", reason: "Use with caution on sensitive skin" },

  // SAFE
  "water": { rating: "safe", function: "solvent", reason: "Safe ingredient" },
  "aqua": { rating: "safe", function: "solvent", reason: "Safe ingredient" },
  "glycerin": { rating: "safe", function: "moisturizing", reason: "Safe moisturizer" },
  "glycerol": { rating: "safe", function: "moisturizing", reason: "Safe moisturizer" },
  "niacinamide": { rating: "safe", function: "brightening", reason: "Skin conditioning" },
  "panthenol": { rating: "safe", function: "moisturizing", reason: "Safe moisturizer" },
  "tocopherol": { rating: "safe", function: "antioxidant", reason: "Vitamin E" },
  "hyaluronic acid": { rating: "safe", function: "moisturizing", reason: "Safe moisturizer" },
  "sodium hyaluronate": { rating: "safe", function: "moisturizing", reason: "Safe moisturizer" },
  "butylene glycol": { rating: "safe", function: "moisturizing", reason: "Safe moisturizer" },
  "propylene glycol": { rating: "safe", function: "moisturizing", reason: "Generally safe" },
  "cetyl alcohol": { rating: "safe", function: "emollient", reason: "Safe emulsifier" },
  "dimethicone": { rating: "safe", function: "emollient", reason: "Safe silicone" },
  "zinc oxide": { rating: "safe", function: "UV filter", reason: "Safe UV filter" },
  "titanium dioxide": { rating: "safe", function: "UV filter", reason: "Safe UV filter" },
  "aloe vera": { rating: "safe", function: "soothing", reason: "Soothing effect" },
  "aloe barbadensis": { rating: "safe", function: "soothing", reason: "Soothing effect" },
  "centella asiatica": { rating: "safe", function: "soothing", reason: "Soothing and regenerating" },
  "ceramide": { rating: "safe", function: "barrier", reason: "Strengthens skin barrier" },
  "adenosine": { rating: "safe", function: "anti-aging", reason: "Anti-wrinkle effect" },
  "ascorbic acid": { rating: "safe", function: "brightening", reason: "Vitamin C" },
  "vitamin c": { rating: "safe", function: "brightening", reason: "Vitamin C" },
};

export async function analyzeIngredients(ingredients) {
  return Promise.all(ingredients.map((ingredient) => analyzeIngredient(ingredient)));
}

async function analyzeIngredient(name) {
  const cleanName = cleanIngredientName(name);
  const normalizedName = cleanName.toLowerCase();

  // 1. Search the direct DB first
  const directMatch = findIngredientMatch(normalizedName);
  if (directMatch) {
    return {
      name: cleanName,
      safetyRating: directMatch.rating,
      function: directMatch.function,
      reason: directMatch.reason,
      source: "ingredient_db"
    };
  }

  // 2. Try the Open Beauty Facts API if not found in the DB
  const openBeautyFactsData = await fetchIngredientData(normalizedName);
  const searchText = JSON.stringify(openBeautyFactsData || {}).toLowerCase();

  return {
    name: cleanName,
    safetyRating: getSafetyRating(searchText),
    function: getIngredientFunction(searchText),
    reason: "Based on API data",
    source: openBeautyFactsData ? "open_beauty_facts" : "fallback"
  };
}

function cleanIngredientName(name) {
  return String(name)
    .trim()
    .replace(/[.,;:]+$/g, "")
    .trim();
}

function findIngredientMatch(name) {
  // Exact match
  if (INGREDIENT_SAFETY[name]) return INGREDIENT_SAFETY[name];
  
  // Partial match (for example, "fragrance." -> "fragrance")
  for (const [key, value] of Object.entries(INGREDIENT_SAFETY)) {
    if (name.includes(key) || key.includes(name)) {
      return value;
    }
  }
  return null;
}

async function fetchIngredientData(name) {
  const baseUrl = process.env.OPEN_BEAUTY_FACTS_BASE_URL || DEFAULT_BASE_URL;
  try {
    const response = await axios.get(`${baseUrl}/search`, {
      params: {
        search_terms: name,
        categories_tags_en: "cosmetics",
        fields: "product_name,ingredients_text,ingredients_analysis_tags,ingredients_tags,categories_tags",
        page_size: 5,
        json: 1,
      },
      timeout: 6000,
      headers: { "User-Agent": "SkininIngredientChecker/0.1.0" },
    });
    return response.data?.products?.[0] || null;
  } catch (error) {
    console.warn(`Open Beauty Facts lookup failed for: ${name}`, error.message);
    return null;
  }
}

function getSafetyRating(text) {
  const SAFETY_KEYWORDS = {
    avoid: ["allergen", "irritant", "restricted", "hazard", "toxic"],
    caution: ["fragrance", "perfume", "preservative", "surfactant"],
  };
  if (SAFETY_KEYWORDS.avoid.some((k) => text.includes(k))) return "avoid";
  if (SAFETY_KEYWORDS.caution.some((k) => text.includes(k))) return "caution";
  return "safe";
}

function getIngredientFunction(text) {
  const FUNCTION_KEYWORDS = {
    moisturizing: ["humectant", "emollient", "moistur", "hydrating"],
    preservative: ["preservative", "antimicrobial"],
    fragrance: ["fragrance", "perfume", "aroma"],
    cleansing: ["surfactant", "cleansing", "detergent"],
    colorant: ["colorant", "pigment", "dye"],
    exfoliating: ["exfoliant", "keratolytic", "acid"],
  };
  for (const [label, keywords] of Object.entries(FUNCTION_KEYWORDS)) {
    if (keywords.some((k) => text.includes(k))) return label;
  }
  return "cosmetic ingredient";
}
