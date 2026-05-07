import axios from "axios";

const DEFAULT_BASE_URL = "https://world.openbeautyfacts.org/api/v2";

// 성분별 직접 안전등급 매핑
const INGREDIENT_SAFETY = {
  // AVOID
  "fragrance": { rating: "avoid", function: "fragrance", reason: "알레르기 유발 가능성" },
  "perfume": { rating: "avoid", function: "fragrance", reason: "알레르기 유발 가능성" },
  "alcohol denat": { rating: "avoid", function: "solvent", reason: "피부 자극" },
  "denatured alcohol": { rating: "avoid", function: "solvent", reason: "피부 자극" },
  "formaldehyde": { rating: "avoid", function: "preservative", reason: "발암 가능 물질" },
  "parabens": { rating: "avoid", function: "preservative", reason: "호르몬 교란 가능성" },
  "methylparaben": { rating: "avoid", function: "preservative", reason: "호르몬 교란 가능성" },
  "propylparaben": { rating: "avoid", function: "preservative", reason: "호르몬 교란 가능성" },
  "oxybenzone": { rating: "avoid", function: "UV filter", reason: "호르몬 교란 가능성" },

  // CAUTION
  "sodium lauryl sulfate": { rating: "caution", function: "cleansing", reason: "민감성 피부 자극 가능" },
  "sls": { rating: "caution", function: "cleansing", reason: "민감성 피부 자극 가능" },
  "sodium laureth sulfate": { rating: "caution", function: "cleansing", reason: "자극 가능성" },
  "phenoxyethanol": { rating: "caution", function: "preservative", reason: "고농도 시 자극 가능" },
  "benzyl alcohol": { rating: "caution", function: "preservative", reason: "민감성 피부 주의" },
  "citric acid": { rating: "caution", function: "pH adjuster", reason: "고농도 시 자극 가능" },
  "retinol": { rating: "caution", function: "anti-aging", reason: "임산부 주의" },
  "salicylic acid": { rating: "caution", function: "exfoliating", reason: "민감성 피부 주의" },

  // SAFE
  "water": { rating: "safe", function: "solvent", reason: "안전한 성분" },
  "aqua": { rating: "safe", function: "solvent", reason: "안전한 성분" },
  "glycerin": { rating: "safe", function: "moisturizing", reason: "안전한 보습제" },
  "glycerol": { rating: "safe", function: "moisturizing", reason: "안전한 보습제" },
  "niacinamide": { rating: "safe", function: "brightening", reason: "피부 개선 효과" },
  "panthenol": { rating: "safe", function: "moisturizing", reason: "안전한 보습제" },
  "tocopherol": { rating: "safe", function: "antioxidant", reason: "비타민 E" },
  "hyaluronic acid": { rating: "safe", function: "moisturizing", reason: "안전한 보습제" },
  "sodium hyaluronate": { rating: "safe", function: "moisturizing", reason: "안전한 보습제" },
  "butylene glycol": { rating: "safe", function: "moisturizing", reason: "안전한 보습제" },
  "propylene glycol": { rating: "safe", function: "moisturizing", reason: "일반적으로 안전" },
  "cetyl alcohol": { rating: "safe", function: "emollient", reason: "안전한 유화제" },
  "dimethicone": { rating: "safe", function: "emollient", reason: "안전한 실리콘" },
  "zinc oxide": { rating: "safe", function: "UV filter", reason: "안전한 자외선 차단제" },
  "titanium dioxide": { rating: "safe", function: "UV filter", reason: "안전한 자외선 차단제" },
  "aloe vera": { rating: "safe", function: "soothing", reason: "진정 효과" },
  "aloe barbadensis": { rating: "safe", function: "soothing", reason: "진정 효과" },
  "centella asiatica": { rating: "safe", function: "soothing", reason: "진정 및 재생 효과" },
  "ceramide": { rating: "safe", function: "barrier", reason: "피부 장벽 강화" },
  "adenosine": { rating: "safe", function: "anti-aging", reason: "주름 개선 효과" },
  "ascorbic acid": { rating: "safe", function: "brightening", reason: "비타민 C" },
  "vitamin c": { rating: "safe", function: "brightening", reason: "비타민 C" },
};

export async function analyzeIngredients(ingredients) {
  return Promise.all(ingredients.map((ingredient) => analyzeIngredient(ingredient)));
}

async function analyzeIngredient(name) {
  const normalizedName = name.trim().toLowerCase();
  
  // 1. 직접 DB에서 먼저 검색
  const directMatch = findIngredientMatch(normalizedName);
  if (directMatch) {
    return {
      name: name.trim(),
      safetyRating: directMatch.rating,
      function: directMatch.function,
      reason: directMatch.reason,
      source: "ingredient_db"
    };
  }

  // 2. DB에 없으면 Open Beauty Facts API 시도
  const openBeautyFactsData = await fetchIngredientData(normalizedName);
  const searchText = JSON.stringify(openBeautyFactsData || {}).toLowerCase();

  return {
    name: name.trim(),
    safetyRating: getSafetyRating(searchText),
    function: getIngredientFunction(searchText),
    reason: "API 데이터 기반",
    source: openBeautyFactsData ? "open_beauty_facts" : "fallback"
  };
}

function findIngredientMatch(name) {
  // 정확히 일치
  if (INGREDIENT_SAFETY[name]) return INGREDIENT_SAFETY[name];
  
  // 부분 일치 (예: "fragrance." → "fragrance")
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