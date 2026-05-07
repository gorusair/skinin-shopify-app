import axios from "axios";

const DEFAULT_BASE_URL = "https://world.openbeautyfacts.org/api/v2";

const SAFETY_KEYWORDS = {
  avoid: ["allergen", "irritant", "restricted", "hazard", "toxic"],
  moderate: ["fragrance", "perfume", "preservative", "colorant", "surfactant"]
};

const FUNCTION_KEYWORDS = {
  moisturizing: ["humectant", "emollient", "moistur", "hydrating"],
  preservative: ["preservative", "antimicrobial"],
  fragrance: ["fragrance", "perfume", "aroma"],
  cleansing: ["surfactant", "cleansing", "detergent"],
  colorant: ["colorant", "pigment", "dye"],
  exfoliating: ["exfoliant", "keratolytic", "acid"]
};

export async function analyzeIngredients(ingredients) {
  return Promise.all(ingredients.map((ingredient) => analyzeIngredient(ingredient)));
}

async function analyzeIngredient(name) {
  const normalizedName = name.trim();
  const openBeautyFactsData = await fetchIngredientData(normalizedName);
  const searchText = JSON.stringify(openBeautyFactsData || {}).toLowerCase();

  return {
    name: normalizedName,
    safetyRating: getSafetyRating(searchText),
    function: getIngredientFunction(searchText),
    source: openBeautyFactsData ? "open_beauty_facts" : "fallback"
  };
}

async function fetchIngredientData(name) {
  const baseUrl = process.env.OPEN_BEAUTY_FACTS_BASE_URL || DEFAULT_BASE_URL;

  try {
    const response = await axios.get(`${baseUrl}/search`, {
      params: {
        search_terms: name,
        categories_tags_en: "cosmetics",
        fields:
          "product_name,ingredients_text,ingredients_analysis_tags,ingredients_tags,categories_tags",
        page_size: 5,
        json: 1,
      },
      timeout: 6000,
      headers: {
        "User-Agent": "SkininIngredientChecker/0.1.0",
      },
    });

    return response.data?.products?.[0] || null;
  } catch (error) {
    console.warn(
      `Open Beauty Facts lookup failed for ingredient: ${name}`,
      error.message
    );

    return null;
  }
}

function getSafetyRating(text) {
  if (SAFETY_KEYWORDS.avoid.some((keyword) => text.includes(keyword))) {
    return "avoid";
  }

  if (SAFETY_KEYWORDS.moderate.some((keyword) => text.includes(keyword))) {
    return "moderate";
  }

  return "safe";
}

function getIngredientFunction(text) {
  for (const [label, keywords] of Object.entries(FUNCTION_KEYWORDS)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return label;
    }
  }

  return "cosmetic ingredient";
}
