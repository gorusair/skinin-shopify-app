// Direct safety rating mapping by ingredient
export const INGREDIENT_SAFETY = {
  // AVOID
  fragrance: {
    rating: "avoid",
    function: "fragrance",
    reason: "Potential irritant for sensitive skin",
    reason_ko: "향기 성분; 민감한 피부에 자극을 줄 수 있음",
  },
  parfum: {
    rating: "avoid",
    function: "fragrance",
    reason: "Potential irritant for sensitive skin",
    reason_ko: "향기 성분; 민감한 피부에 자극을 줄 수 있음",
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
    reason_ko: "피부를 건조하게 만들 수 있는 변성 알코올",
  },
  "denatured alcohol": {
    rating: "caution",
    function: "solvent",
    reason: "May be drying for some skin types",
    reason_ko: "피부를 건조하게 만들 수 있는 변성 알코올",
  },
  ethanol: {
    rating: "caution",
    function: "solvent",
    reason: "May be drying for some skin types",
    reason_ko: "피부를 건조하게 만들 수 있는 알코올 성분",
  },
  limonene: {
    rating: "caution",
    function: "fragrance",
    reason: "Potential irritant for sensitive skin",
    reason_ko: "천연 향기 성분; 민감한 피부에 알레르기 반응 가능성",
  },
  linalool: {
    rating: "caution",
    function: "fragrance",
    reason: "Potential irritant for sensitive skin",
    reason_ko: "천연 향기 성분; 민감한 피부에 알레르기 반응 가능성",
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
    reason_ko: "강력한 계면활성제; 민감 피부에 자극 가능성",
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
    reason_ko: "방부 성분; 고농도에서 자극 가능성",
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
    reason_ko: "세포 재생을 촉진하는 비타민 A 성분; 민감 피부는 주의",
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
    reason_ko: "모공을 정리하는 각질 용해 성분; 민감 피부는 주의",
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
    reason_ko: "파라벤 계열 방부 성분; 일부 소비자가 성분 확인을 선호",
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
  water: { rating: "safe", function: "solvent", reason: "Common solvent", reason_ko: "제형의 기본 용매" },
  aqua: { rating: "safe", function: "solvent", reason: "Common solvent", reason_ko: "제형의 기본 용매" },
  glycerin: {
    rating: "safe",
    function: "moisturizing",
    reason: "Common moisturizer",
    reason_ko: "피부 수분을 붙잡아 주는 보습 성분",
  },
  glycerol: {
    rating: "safe",
    function: "moisturizing",
    reason: "Common moisturizer",
    reason_ko: "피부 수분을 붙잡아 주는 보습 성분",
  },
  niacinamide: {
    rating: "safe",
    function: "skin-conditioning",
    reason: "Skin-conditioning ingredient",
    reason_ko: "피부 결을 고르게 하고 장벽을 강화하는 비타민 B3",
  },
  panthenol: {
    rating: "safe",
    function: "skin-conditioning",
    reason: "Skin-conditioning ingredient",
    reason_ko: "피부 장벽을 강화하는 프로비타민 B5 성분",
  },
  tocopherol: {
    rating: "safe",
    function: "skin-conditioning",
    reason: "Skin-conditioning ingredient",
    reason_ko: "피부를 보호하는 항산화 비타민 E 성분",
  },
  "hyaluronic acid": {
    rating: "safe",
    function: "moisturizing",
    reason: "Hydrating ingredient",
    reason_ko: "수분을 끌어당겨 피부를 촉촉하게 유지하는 성분",
  },
  "sodium hyaluronate": {
    rating: "safe",
    function: "moisturizing",
    reason: "Hydrating ingredient",
    reason_ko: "히알루론산 나트륨 염; 피부 깊숙이 수분을 공급",
  },
  "butylene glycol": {
    rating: "safe",
    function: "moisturizing",
    reason: "Common moisturizer",
    reason_ko: "수분을 잡아주는 흡습제이자 제형 보조 성분",
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
    reason_ko: "피부를 부드럽게 해주는 식물 유래 지방 알코올",
  },
  dimethicone: {
    rating: "safe",
    function: "emollient",
    reason: "Skin-conditioning ingredient",
    reason_ko: "피부 표면에 보호막을 형성해 수분 증발을 막는 실리콘 성분",
  },
  "zinc oxide": {
    rating: "safe",
    function: "UV filter",
    reason: "Mineral UV filter",
    reason_ko: "자외선을 물리적으로 차단하는 미네랄 성분",
  },
  "titanium dioxide": {
    rating: "safe",
    function: "UV filter",
    reason: "Mineral UV filter",
    reason_ko: "자외선을 물리적으로 차단하는 미네랄 성분",
  },
  allantoin: {
    rating: "safe",
    function: "soothing",
    reason: "Soothing ingredient",
    reason_ko: "피부를 진정시키고 재생을 돕는 성분",
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
    reason_ko: "강력한 진정 및 항염 효과를 가진 병풀 추출물",
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
    reason_ko: "피부를 시원하게 진정시키는 알로에 성분",
  },
  ceramide: {
    rating: "safe",
    function: "skin-conditioning",
    reason: "Skin-conditioning ingredient",
    reason_ko: "피부 장벽 기능에 필수적인 지질 성분",
  },
  "ceramide np": {
    rating: "safe",
    function: "skin-conditioning",
    reason: "Skin-conditioning ingredient",
    reason_ko: "피부 장벽을 구성하는 핵심 세라마이드 성분",
  },
  adenosine: {
    rating: "safe",
    function: "skin-conditioning",
    reason: "Skin-conditioning ingredient",
    reason_ko: "피부 탄력을 높이고 주름 개선을 돕는 성분",
  },
  "ascorbic acid": {
    rating: "safe",
    function: "skin-conditioning",
    reason: "Skin-conditioning ingredient",
    reason_ko: "피부 밝기를 높여주는 항산화 비타민 C 성분",
  },
  "vitamin c": {
    rating: "safe",
    function: "skin-conditioning",
    reason: "Skin-conditioning ingredient",
    reason_ko: "피부 밝기를 높여주는 항산화 비타민 C 성분",
  },

  // Additional Humectants/Moisturizers
  sorbitol: { rating: "safe", function: "moisturizing", reason: "Gentle humectant" },
  "sorbitol solution": { rating: "safe", function: "moisturizing", reason: "Gentle humectant" },
  urea: { rating: "caution", function: "moisturizing", reason: "Effective humectant; may irritate at high concentrations" },
  betaine: { rating: "safe", function: "moisturizing", reason: "Gentle humectant with soothing properties", reason_ko: "식물 유래 보습 성분; 자극이 적어 민감 피부에도 적합" },
  trehalose: { rating: "safe", function: "moisturizing", reason: "Gentle humectant" },
  erythritol: { rating: "safe", function: "moisturizing", reason: "Gentle humectant" },
  "sodium pca": { rating: "safe", function: "moisturizing", reason: "Natural moisturizing factor component" },
  "hydroxyethyl urea": { rating: "safe", function: "moisturizing", reason: "Gentle humectant" },
  inositol: { rating: "safe", function: "skin-conditioning", reason: "Skin-conditioning ingredient" },
  "pentylene glycol": { rating: "safe", function: "moisturizing", reason: "Humectant and preservative booster" },
  "caprylyl glycol": { rating: "safe", function: "moisturizing", reason: "Humectant and antimicrobial" },
  "1,2-hexanediol": { rating: "safe", function: "moisturizing", reason: "Humectant and preservative booster" },
  "hexylene glycol": { rating: "caution", function: "moisturizing", reason: "May cause irritation at high concentrations" },
  "dipropylene glycol": { rating: "safe", function: "moisturizing", reason: "Gentle solvent and humectant" },
  "polyglutamic acid": { rating: "safe", function: "moisturizing", reason: "Highly effective humectant" },
  "saccharide isomerate": { rating: "safe", function: "moisturizing", reason: "Biomimetic humectant that bonds to keratin" },
  "hyaluronate crosspolymer": { rating: "safe", function: "moisturizing", reason: "Crosslinked hyaluronic acid for long-lasting hydration" },
  "sodium acetylated hyaluronate": { rating: "safe", function: "moisturizing", reason: "Modified hyaluronic acid with enhanced skin affinity" },
  "hydrolyzed hyaluronic acid": { rating: "safe", function: "moisturizing", reason: "Low molecular weight HA for deeper penetration" },

  // Emollients/Oils
  "jojoba oil": { rating: "safe", function: "emollient", reason: "Non-comedogenic emollient closely resembling skin sebum", reason_ko: "피지와 유사한 구조의 가벼운 보습 오일" },
  "simmondsia chinensis seed oil": { rating: "safe", function: "emollient", reason: "Non-comedogenic emollient closely resembling skin sebum" },
  "argan oil": { rating: "safe", function: "emollient", reason: "Nourishing emollient rich in vitamin E" },
  "argania spinosa kernel oil": { rating: "safe", function: "emollient", reason: "Nourishing emollient rich in vitamin E" },
  "rosehip oil": { rating: "safe", function: "emollient", reason: "Rich in vitamins A and C; beneficial for skin repair" },
  "rosa canina fruit oil": { rating: "safe", function: "emollient", reason: "Rich in vitamins A and C; beneficial for skin repair" },
  squalane: { rating: "safe", function: "emollient", reason: "Lightweight, non-comedogenic emollient", reason_ko: "가볍고 모공을 막지 않는 피부 친화적 보습 성분" },
  squalene: { rating: "caution", function: "emollient", reason: "Unstable form; may oxidize and clog pores" },
  "shea butter": { rating: "safe", function: "emollient", reason: "Rich, nourishing emollient", reason_ko: "영양감 풍부한 보습 에몰리언트" },
  "butyrospermum parkii butter": { rating: "safe", function: "emollient", reason: "Rich, nourishing emollient" },
  "cocoa butter": { rating: "caution", function: "emollient", reason: "Rich emollient; may be comedogenic" },
  "theobroma cacao seed butter": { rating: "caution", function: "emollient", reason: "Rich emollient; may be comedogenic" },
  "coconut oil": { rating: "caution", function: "emollient", reason: "Moisturizing but may be comedogenic for some skin types" },
  "cocos nucifera oil": { rating: "caution", function: "emollient", reason: "Moisturizing but may be comedogenic for some skin types" },
  "sweet almond oil": { rating: "safe", function: "emollient", reason: "Gentle, nourishing emollient" },
  "prunus amygdalus dulcis oil": { rating: "safe", function: "emollient", reason: "Gentle, nourishing emollient" },
  "marula oil": { rating: "safe", function: "emollient", reason: "Lightweight, fast-absorbing emollient" },
  "sclerocarya birrea seed oil": { rating: "safe", function: "emollient", reason: "Lightweight, fast-absorbing emollient" },
  "sea buckthorn oil": { rating: "caution", function: "emollient", reason: "Potent but may stain; use diluted" },
  "hippophae rhamnoides oil": { rating: "caution", function: "emollient", reason: "Potent but may stain; use diluted" },
  "sunflower seed oil": { rating: "safe", function: "emollient", reason: "Lightweight emollient rich in linoleic acid" },
  "helianthus annuus seed oil": { rating: "safe", function: "emollient", reason: "Lightweight emollient rich in linoleic acid" },
  "olive oil": { rating: "safe", function: "emollient", reason: "Nourishing emollient" },
  "olea europaea fruit oil": { rating: "safe", function: "emollient", reason: "Nourishing emollient" },
  "avocado oil": { rating: "safe", function: "emollient", reason: "Rich emollient with vitamins A, D, and E" },
  "persea gratissima oil": { rating: "safe", function: "emollient", reason: "Rich emollient with vitamins A, D, and E" },
  "grapeseed oil": { rating: "safe", function: "emollient", reason: "Lightweight, non-comedogenic emollient" },
  "vitis vinifera seed oil": { rating: "safe", function: "emollient", reason: "Lightweight, non-comedogenic emollient" },
  "hemp seed oil": { rating: "safe", function: "emollient", reason: "Balanced omega fatty acid profile; non-comedogenic" },
  "cannabis sativa seed oil": { rating: "safe", function: "emollient", reason: "Balanced omega fatty acid profile; non-comedogenic" },
  "castor oil": { rating: "safe", function: "emollient", reason: "Thick emollient and film-former" },
  "ricinus communis seed oil": { rating: "safe", function: "emollient", reason: "Thick emollient and film-former" },
  "evening primrose oil": { rating: "safe", function: "emollient", reason: "Rich in GLA; beneficial for dry skin conditions" },
  "oenothera biennis oil": { rating: "safe", function: "emollient", reason: "Rich in GLA; beneficial for dry skin conditions" },
  "safflower oil": { rating: "safe", function: "emollient", reason: "Lightweight, high linoleic acid emollient" },
  "carthamus tinctorius seed oil": { rating: "safe", function: "emollient", reason: "Lightweight, high linoleic acid emollient" },
  "camellia oil": { rating: "safe", function: "emollient", reason: "Lightweight emollient similar to sebum" },
  "camellia japonica seed oil": { rating: "safe", function: "emollient", reason: "Lightweight emollient similar to sebum" },
  "caprylic/capric triglyceride": { rating: "safe", function: "emollient", reason: "Lightweight, stable emollient" },
  "isononyl isononanoate": { rating: "safe", function: "emollient", reason: "Lightweight, dry-touch emollient" },
  "isopropyl myristate": { rating: "caution", function: "emollient", reason: "May be comedogenic for acne-prone skin" },
  "isopropyl palmitate": { rating: "caution", function: "emollient", reason: "May be comedogenic for acne-prone skin" },
  "meadowfoam seed oil": { rating: "safe", function: "emollient", reason: "Stable, nourishing emollient" },
  "limnanthes alba seed oil": { rating: "safe", function: "emollient", reason: "Stable, nourishing emollient" },
  bakuchiol: { rating: "safe", function: "skin-conditioning", reason: "Plant-based retinol alternative; gentle and effective" },

  // Occlusives
  petrolatum: { rating: "safe", function: "occlusive", reason: "Highly effective occlusive moisturizer; hypoallergenic" },
  "mineral oil": { rating: "safe", function: "occlusive", reason: "Effective occlusive; refined grades are safe and non-comedogenic" },
  paraffin: { rating: "safe", function: "occlusive", reason: "Occlusive moisturizer" },
  "paraffinum liquidum": { rating: "safe", function: "occlusive", reason: "Occlusive moisturizer" },
  cyclomethicone: { rating: "caution", function: "emollient", reason: "Silicone compound; environmental concerns under review" },
  cyclopentasiloxane: { rating: "caution", function: "emollient", reason: "Silicone compound; environmental concerns under review" },
  cyclohexasiloxane: { rating: "caution", function: "emollient", reason: "Silicone compound; environmental concerns under review" },
  beeswax: { rating: "safe", function: "occlusive", reason: "Natural occlusive and emollient" },
  "cera alba": { rating: "safe", function: "occlusive", reason: "Natural occlusive and emollient" },
  "carnauba wax": { rating: "safe", function: "occlusive", reason: "Natural wax; generally well-tolerated" },
  "copernicia cerifera cera": { rating: "safe", function: "occlusive", reason: "Natural wax; generally well-tolerated" },
  lanolin: { rating: "caution", function: "occlusive", reason: "Effective emollient; potential allergen for some individuals" },
  "wool wax": { rating: "caution", function: "occlusive", reason: "Effective emollient; potential allergen for some individuals" },
  polyisobutene: { rating: "safe", function: "occlusive", reason: "Synthetic occlusive; non-comedogenic" },
  "hydrogenated polyisobutene": { rating: "safe", function: "occlusive", reason: "Synthetic occlusive; non-comedogenic" },

  // Additional Preservatives
  ethylhexylglycerin: { rating: "safe", function: "preservative", reason: "Gentle preservative enhancer" },
  "sodium benzoate": { rating: "caution", function: "preservative", reason: "May combine with vitamin C to form benzene; use with caution" },
  "potassium sorbate": { rating: "safe", function: "preservative", reason: "Gentle, widely tolerated preservative" },
  "sorbic acid": { rating: "safe", function: "preservative", reason: "Gentle, widely tolerated preservative" },
  butylparaben: { rating: "caution", function: "preservative", reason: "Some shoppers prefer to review this preservative" },
  ethylparaben: { rating: "caution", function: "preservative", reason: "Some shoppers prefer to review this preservative" },
  isobutylparaben: { rating: "caution", function: "preservative", reason: "Some shoppers prefer to review this preservative" },
  "benzoic acid": { rating: "caution", function: "preservative", reason: "May cause irritation in some individuals" },
  "dehydroacetic acid": { rating: "safe", function: "preservative", reason: "Gentle, widely tolerated preservative" },
  "dmdm hydantoin": { rating: "avoid", function: "preservative", reason: "Formaldehyde-releasing preservative; potential sensitizer" },
  "diazolidinyl urea": { rating: "avoid", function: "preservative", reason: "Formaldehyde-releasing preservative; potential sensitizer" },
  "imidazolidinyl urea": { rating: "avoid", function: "preservative", reason: "Formaldehyde-releasing preservative; potential sensitizer" },
  "quaternium-15": { rating: "avoid", function: "preservative", reason: "Formaldehyde-releasing preservative; known sensitizer" },
  bronopol: { rating: "avoid", function: "preservative", reason: "Formaldehyde-releasing preservative; potential sensitizer" },
  "2-bromo-2-nitropropane-1,3-diol": { rating: "avoid", function: "preservative", reason: "Formaldehyde-releasing preservative; potential sensitizer" },
  "chloromethylisothiazolinone": { rating: "avoid", function: "preservative", reason: "Strong sensitizer; restricted in rinse-off products" },
  methylisothiazolinone: { rating: "avoid", function: "preservative", reason: "Strong sensitizer; causes contact dermatitis" },
  "mi/mci": { rating: "avoid", function: "preservative", reason: "Strong sensitizer; causes contact dermatitis" },
  chlorphenesin: { rating: "caution", function: "preservative", reason: "May cause irritation; EU restricted to 0.3%" },
  "caprylhydroxamic acid": { rating: "safe", function: "preservative", reason: "Gentle, chelating preservative" },

  // Sunscreen Actives
  avobenzone: { rating: "caution", function: "UV filter", reason: "Effective UVA filter; may degrade without stabilizers" },
  "butyl methoxydibenzoylmethane": { rating: "caution", function: "UV filter", reason: "Effective UVA filter; may degrade without stabilizers" },
  octinoxate: { rating: "caution", function: "UV filter", reason: "Chemical UV filter; some environmental and endocrine concerns" },
  "ethylhexyl methoxycinnamate": { rating: "caution", function: "UV filter", reason: "Chemical UV filter; some environmental and endocrine concerns" },
  octisalate: { rating: "caution", function: "UV filter", reason: "Chemical UV filter; generally well-tolerated" },
  "ethylhexyl salicylate": { rating: "caution", function: "UV filter", reason: "Chemical UV filter; generally well-tolerated" },
  homosalate: { rating: "caution", function: "UV filter", reason: "Chemical UV filter; potential endocrine activity at high doses" },
  octocrylene: { rating: "caution", function: "UV filter", reason: "Chemical UV filter; may generate reactive oxygen species" },
  "benzophenone-3": { rating: "caution", function: "UV filter", reason: "Chemical UV filter; some environmental and endocrine concerns" },
  "benzophenone-4": { rating: "caution", function: "UV filter", reason: "Water-soluble UV filter; may cause sensitization" },
  iscotrizinol: { rating: "safe", function: "UV filter", reason: "Photostable broad-spectrum UV filter" },
  "diethylamino hydroxybenzoyl hexyl benzoate": { rating: "safe", function: "UV filter", reason: "Photostable UVA filter; well-tolerated" },
  "bis-ethylhexyloxyphenol methoxyphenyl triazine": { rating: "safe", function: "UV filter", reason: "Broad-spectrum photostable UV filter" },
  "phenylbenzimidazole sulfonic acid": { rating: "safe", function: "UV filter", reason: "Water-soluble UVB filter; gentle on skin" },
  ensulizole: { rating: "safe", function: "UV filter", reason: "Water-soluble UVB filter; gentle on skin" },
  "drometrizole trisiloxane": { rating: "safe", function: "UV filter", reason: "Photostable broad-spectrum UV filter" },

  // Exfoliants (AHAs / BHAs / PHAs)
  "glycolic acid": { rating: "caution", function: "exfoliating", reason: "Effective AHA; may cause irritation or photosensitivity", reason_ko: "각질을 효과적으로 제거하는 AHA 성분; 자극 주의" },
  "lactic acid": { rating: "caution", function: "exfoliating", reason: "Gentle AHA; may cause irritation at high concentrations", reason_ko: "순하게 각질을 제거하는 AHA 성분; 고농도 주의" },
  "mandelic acid": { rating: "caution", function: "exfoliating", reason: "Gentle AHA suitable for sensitive skin; use with caution" },
  "tartaric acid": { rating: "caution", function: "exfoliating", reason: "AHA; use with caution on sensitive skin" },
  "malic acid": { rating: "caution", function: "exfoliating", reason: "Gentle AHA; use with caution on sensitive skin" },
  gluconolactone: { rating: "caution", function: "exfoliating", reason: "Gentle PHA; suitable for sensitive skin but use with caution" },
  "lactobionic acid": { rating: "caution", function: "exfoliating", reason: "Gentle PHA with antioxidant properties; use with caution" },
  "polyhydroxy acid": { rating: "caution", function: "exfoliating", reason: "Gentle exfoliant; suitable for sensitive skin" },
  "azelaic acid": { rating: "caution", function: "exfoliating", reason: "Effective for redness and hyperpigmentation; may cause tingling", reason_ko: "피부 결과 색소 침착에 사용하는 성분; 일부 따끔거림 가능" },
  "benzoyl peroxide": { rating: "avoid", function: "exfoliating", reason: "Strong oxidant; may cause significant irritation and bleach fabrics" },
  "trichloroacetic acid": { rating: "avoid", function: "exfoliating", reason: "Professional-use only chemical peel; too harsh for home use" },

  // Actives/Treatments
  tretinoin: { rating: "avoid", function: "skin-conditioning", reason: "Prescription-strength retinoid; use under dermatologist supervision only" },
  "retinoic acid": { rating: "avoid", function: "skin-conditioning", reason: "Prescription-strength retinoid; use under dermatologist supervision only" },
  "kojic acid": { rating: "caution", function: "skin-conditioning", reason: "Brightening agent; may cause irritation or sensitization", reason_ko: "멜라닌 생성을 억제하는 미백 성분; 자극 주의" },
  "tranexamic acid": { rating: "safe", function: "skin-conditioning", reason: "Gentle brightening ingredient; well-tolerated", reason_ko: "트러블 자국과 색소 침착에 사용하는 순한 미백 성분" },
  arbutin: { rating: "safe", function: "skin-conditioning", reason: "Gentle brightening ingredient", reason_ko: "멜라닌 생성을 억제하는 순한 미백 성분" },
  "alpha-arbutin": { rating: "safe", function: "skin-conditioning", reason: "Effective, gentle brightening ingredient", reason_ko: "효과적이고 순한 미백 성분" },
  resveratrol: { rating: "safe", function: "antioxidant", reason: "Potent antioxidant with anti-aging properties" },
  "ferulic acid": { rating: "safe", function: "antioxidant", reason: "Antioxidant that enhances efficacy of vitamins C and E" },
  glutathione: { rating: "safe", function: "antioxidant", reason: "Natural antioxidant" },
  "ascorbyl glucoside": { rating: "safe", function: "skin-conditioning", reason: "Stable vitamin C derivative" },
  "ascorbyl palmitate": { rating: "safe", function: "antioxidant", reason: "Fat-soluble vitamin C derivative" },
  "magnesium ascorbyl phosphate": { rating: "safe", function: "skin-conditioning", reason: "Stable, gentle vitamin C derivative" },
  "sodium ascorbyl phosphate": { rating: "safe", function: "skin-conditioning", reason: "Stable, gentle vitamin C derivative" },
  "3-o-ethyl ascorbic acid": { rating: "safe", function: "skin-conditioning", reason: "Stable vitamin C derivative" },
  "ethyl ascorbic acid": { rating: "safe", function: "skin-conditioning", reason: "Stable vitamin C derivative" },
  hydroquinone: { rating: "avoid", function: "skin-conditioning", reason: "Strong skin-lightening agent; potential toxicity; restricted in many countries" },
  "kojic dipalmitate": { rating: "caution", function: "skin-conditioning", reason: "Brightening agent; more stable form of kojic acid" },
  "alpha lipoic acid": { rating: "caution", function: "antioxidant", reason: "Potent antioxidant; may cause irritation at high concentrations" },

  // Antioxidants
  "tocopheryl acetate": { rating: "safe", function: "antioxidant", reason: "Stable vitamin E ester; skin-conditioning" },
  "vitamin e": { rating: "safe", function: "antioxidant", reason: "Antioxidant and skin-conditioning" },
  "green tea extract": { rating: "safe", function: "antioxidant", reason: "Potent antioxidant with anti-inflammatory properties" },
  "camellia sinensis leaf extract": { rating: "safe", function: "antioxidant", reason: "Potent antioxidant with anti-inflammatory properties" },
  "coenzyme q10": { rating: "safe", function: "antioxidant", reason: "Antioxidant with anti-aging properties" },
  ubiquinone: { rating: "safe", function: "antioxidant", reason: "Antioxidant with anti-aging properties" },
  astaxanthin: { rating: "safe", function: "antioxidant", reason: "Powerful antioxidant carotenoid" },
  lycopene: { rating: "safe", function: "antioxidant", reason: "Antioxidant carotenoid" },
  "beta-carotene": { rating: "safe", function: "antioxidant", reason: "Antioxidant carotenoid; precursor to vitamin A" },
  "grape seed extract": { rating: "safe", function: "antioxidant", reason: "Potent antioxidant" },
  "vitis vinifera seed extract": { rating: "safe", function: "antioxidant", reason: "Potent antioxidant" },
  "pomegranate extract": { rating: "safe", function: "antioxidant", reason: "Potent antioxidant" },
  "punica granatum extract": { rating: "safe", function: "antioxidant", reason: "Potent antioxidant" },
  lutein: { rating: "safe", function: "antioxidant", reason: "Carotenoid antioxidant" },
  idebenone: { rating: "safe", function: "antioxidant", reason: "Synthetic coenzyme Q10 analog" },
  "superoxide dismutase": { rating: "safe", function: "antioxidant", reason: "Enzymatic antioxidant" },
  ergothioneine: { rating: "safe", function: "antioxidant", reason: "Amino acid antioxidant" },

  // Peptides
  "palmitoyl pentapeptide-4": { rating: "safe", function: "skin-conditioning", reason: "Signal peptide for collagen synthesis" },
  "acetyl hexapeptide-3": { rating: "safe", function: "skin-conditioning", reason: "Neurotransmitter-inhibiting peptide; reduces expression lines" },
  "acetyl hexapeptide-8": { rating: "safe", function: "skin-conditioning", reason: "Neurotransmitter-inhibiting peptide; reduces expression lines" },
  argireline: { rating: "safe", function: "skin-conditioning", reason: "Peptide that reduces expression lines" },
  "copper peptide": { rating: "safe", function: "skin-conditioning", reason: "Wound-healing and anti-aging peptide" },
  "copper tripeptide-1": { rating: "safe", function: "skin-conditioning", reason: "Wound-healing and anti-aging peptide" },
  "palmitoyl tripeptide-1": { rating: "safe", function: "skin-conditioning", reason: "Signal peptide for collagen synthesis" },
  "palmitoyl tetrapeptide-7": { rating: "safe", function: "skin-conditioning", reason: "Anti-inflammatory signal peptide" },
  "syn-ake": { rating: "safe", function: "skin-conditioning", reason: "Synthetic tripeptide that relaxes expression lines" },
  "snap-8": { rating: "safe", function: "skin-conditioning", reason: "Octapeptide that reduces expression lines" },
  leuphasyl: { rating: "safe", function: "skin-conditioning", reason: "Pentapeptide that reduces expression lines" },
  matrixyl: { rating: "safe", function: "skin-conditioning", reason: "Collagen-stimulating peptide complex" },
  "palmitoyl oligopeptide": { rating: "safe", function: "skin-conditioning", reason: "Anti-aging signal peptide" },
  "hexapeptide-11": { rating: "safe", function: "skin-conditioning", reason: "Anti-aging peptide from yeast" },
  "oligopeptide-1": { rating: "safe", function: "skin-conditioning", reason: "EGF-like peptide for skin repair" },
  "sh-oligopeptide-1": { rating: "safe", function: "skin-conditioning", reason: "EGF-like peptide for skin repair" },
  "hydrolyzed collagen": { rating: "safe", function: "skin-conditioning", reason: "Hydrating protein film-former" },
  "soluble collagen": { rating: "safe", function: "skin-conditioning", reason: "Hydrating protein film-former" },

  // Surfactants/Cleansers
  "cocamidopropyl betaine": { rating: "caution", function: "cleansing", reason: "Mild surfactant; may cause sensitization in some individuals" },
  "decyl glucoside": { rating: "safe", function: "cleansing", reason: "Gentle, biodegradable surfactant" },
  "lauryl glucoside": { rating: "safe", function: "cleansing", reason: "Gentle surfactant from glucose and coconut" },
  "sodium cocoyl isethionate": { rating: "safe", function: "cleansing", reason: "Mild, skin-friendly surfactant" },
  "sodium lauroyl glutamate": { rating: "safe", function: "cleansing", reason: "Amino acid-based mild surfactant" },
  "sodium cocoyl glycinate": { rating: "safe", function: "cleansing", reason: "Amino acid-based mild surfactant" },
  "coco glucoside": { rating: "safe", function: "cleansing", reason: "Gentle, biodegradable surfactant" },
  "sodium cocoamphoacetate": { rating: "safe", function: "cleansing", reason: "Gentle amphoteric surfactant" },
  "disodium cocoamphodiacetate": { rating: "safe", function: "cleansing", reason: "Gentle amphoteric surfactant" },
  "polysorbate 20": { rating: "safe", function: "emulsifier", reason: "Gentle solubilizer and emulsifier" },
  "polysorbate 60": { rating: "safe", function: "emulsifier", reason: "Emulsifier; generally well-tolerated" },
  "polysorbate 80": { rating: "safe", function: "emulsifier", reason: "Emulsifier; generally well-tolerated" },
  "ammonium lauryl sulfate": { rating: "caution", function: "cleansing", reason: "Surfactant; may irritate sensitive skin" },
  "ammonium laureth sulfate": { rating: "caution", function: "cleansing", reason: "Surfactant; may irritate sensitive skin" },
  "sodium coco-sulfate": { rating: "caution", function: "cleansing", reason: "Sulfate surfactant; may irritate sensitive skin" },
  "sodium lauroyl sarcosinate": { rating: "safe", function: "cleansing", reason: "Mild amino acid-based surfactant" },
  "disodium laureth sulfosuccinate": { rating: "safe", function: "cleansing", reason: "Mild surfactant; well-tolerated" },
  "sodium lauryl sulfoacetate": { rating: "safe", function: "cleansing", reason: "Mild sulfoacetate surfactant" },

  // Thickeners/Stabilizers
  carbomer: { rating: "safe", function: "thickening", reason: "Common thickener and gelling agent; well-tolerated" },
  "xanthan gum": { rating: "safe", function: "thickening", reason: "Natural polysaccharide thickener; well-tolerated" },
  hydroxyethylcellulose: { rating: "safe", function: "thickening", reason: "Natural-derived cellulose thickener" },
  "stearyl alcohol": { rating: "safe", function: "emollient", reason: "Fatty alcohol emollient and thickener" },
  "cetearyl alcohol": { rating: "safe", function: "emollient", reason: "Fatty alcohol blend; emollient and thickener" },
  "hydroxypropyl methylcellulose": { rating: "safe", function: "thickening", reason: "Cellulose-derived thickener" },
  "acrylates/c10-30 alkyl acrylate crosspolymer": { rating: "safe", function: "thickening", reason: "Polymer thickener; well-tolerated" },
  "sclerotium gum": { rating: "safe", function: "thickening", reason: "Natural polysaccharide thickener from fermentation" },
  "locust bean gum": { rating: "safe", function: "thickening", reason: "Natural plant-derived thickener" },
  "guar gum": { rating: "safe", function: "thickening", reason: "Natural plant-derived thickener" },
  "sodium acrylates copolymer": { rating: "safe", function: "thickening", reason: "Polymer thickener" },
  polyacrylamide: { rating: "caution", function: "thickening", reason: "May contain trace acrylamide" },
  triethanolamine: { rating: "caution", function: "pH adjuster", reason: "pH adjuster; may cause sensitization with prolonged use" },
  "sodium hydroxide": { rating: "safe", function: "pH adjuster", reason: "pH adjuster; safe at low concentrations in finished products" },
  "disodium edta": { rating: "safe", function: "chelating", reason: "Chelating agent; stabilizes formulas" },
  "tetrasodium edta": { rating: "safe", function: "chelating", reason: "Chelating agent; stabilizes formulas" },
  "phytic acid": { rating: "safe", function: "chelating", reason: "Natural chelating agent with antioxidant properties" },

  // Additional Fragrances/Irritants
  citronellol: { rating: "caution", function: "fragrance", reason: "Potential irritant for sensitive skin" },
  eugenol: { rating: "caution", function: "fragrance", reason: "Potential sensitizer; common allergen in fragrances" },
  cinnamal: { rating: "avoid", function: "fragrance", reason: "Common sensitizer; high allergy potential" },
  cinnamaldehyde: { rating: "avoid", function: "fragrance", reason: "Common sensitizer; high allergy potential" },
  "benzyl salicylate": { rating: "caution", function: "fragrance", reason: "Potential sensitizer; EU-restricted fragrance" },
  "alpha-isomethyl ionone": { rating: "caution", function: "fragrance", reason: "Potential sensitizer; EU-restricted fragrance" },
  "amyl cinnamal": { rating: "avoid", function: "fragrance", reason: "Common sensitizer; EU-restricted fragrance" },
  hydroxycitronellal: { rating: "caution", function: "fragrance", reason: "Potential sensitizer; EU-restricted fragrance" },
  "benzyl benzoate": { rating: "caution", function: "fragrance", reason: "Potential sensitizer; EU-restricted fragrance" },
  coumarin: { rating: "caution", function: "fragrance", reason: "Potential sensitizer; EU-restricted fragrance" },
  isoeugenol: { rating: "avoid", function: "fragrance", reason: "Common sensitizer; EU-restricted fragrance" },
  "cinnamyl alcohol": { rating: "caution", function: "fragrance", reason: "Potential sensitizer; EU-restricted fragrance" },
  "hexyl cinnamal": { rating: "caution", function: "fragrance", reason: "Potential sensitizer; EU-restricted fragrance" },
  farnesol: { rating: "caution", function: "fragrance", reason: "Potential sensitizer; EU-restricted fragrance" },
  "butylphenyl methylpropional": { rating: "avoid", function: "fragrance", reason: "Banned in EU cosmetics; allergen" },
  "hydroxyisohexyl 3-cyclohexene carboxaldehyde": { rating: "avoid", function: "fragrance", reason: "Banned in EU cosmetics; allergen" },
  "oakmoss extract": { rating: "avoid", function: "fragrance", reason: "Strong allergen; restricted in EU" },
  "evernia prunastri extract": { rating: "avoid", function: "fragrance", reason: "Strong allergen; restricted in EU" },
  "treemoss extract": { rating: "avoid", function: "fragrance", reason: "Strong allergen; restricted in EU" },
  "evernia furfuracea extract": { rating: "avoid", function: "fragrance", reason: "Strong allergen; restricted in EU" },
  "benzyl cinnamate": { rating: "caution", function: "fragrance", reason: "Potential sensitizer" },
  "lavender oil": { rating: "caution", function: "fragrance", reason: "Potential irritant; contains linalool and linalyl acetate" },
  "lavandula angustifolia oil": { rating: "caution", function: "fragrance", reason: "Potential irritant; contains linalool and linalyl acetate" },
  "eucalyptus oil": { rating: "caution", function: "fragrance", reason: "Strong irritant; not recommended for sensitive skin" },
  "eucalyptus globulus leaf oil": { rating: "caution", function: "fragrance", reason: "Strong irritant; not recommended for sensitive skin" },
  "clove oil": { rating: "avoid", function: "fragrance", reason: "Strong irritant; contains eugenol" },
  "cinnamon oil": { rating: "avoid", function: "fragrance", reason: "Strong sensitizer" },
  "bergamot oil": { rating: "caution", function: "fragrance", reason: "Phototoxic; may cause photosensitivity reactions" },
  "citrus bergamia peel oil": { rating: "caution", function: "fragrance", reason: "Phototoxic; may cause photosensitivity reactions" },
  "lemon oil": { rating: "caution", function: "fragrance", reason: "Phototoxic; may cause photosensitivity reactions" },
  "lime oil": { rating: "caution", function: "fragrance", reason: "Phototoxic; may cause photosensitivity reactions" },
  "grapefruit oil": { rating: "caution", function: "fragrance", reason: "May cause phototoxic reactions" },

  // Botanicals
  "chamomile extract": { rating: "safe", function: "soothing", reason: "Anti-inflammatory and soothing botanical" },
  "anthemis nobilis flower extract": { rating: "safe", function: "soothing", reason: "Anti-inflammatory and soothing botanical" },
  "matricaria chamomilla flower extract": { rating: "safe", function: "soothing", reason: "Anti-inflammatory and soothing botanical" },
  "calendula extract": { rating: "safe", function: "soothing", reason: "Anti-inflammatory and healing botanical" },
  "calendula officinalis flower extract": { rating: "safe", function: "soothing", reason: "Anti-inflammatory and healing botanical" },
  "mugwort extract": { rating: "safe", function: "soothing", reason: "Anti-inflammatory botanical" },
  "artemisia vulgaris extract": { rating: "safe", function: "soothing", reason: "Anti-inflammatory botanical" },
  "artemisia princeps leaf extract": { rating: "safe", function: "soothing", reason: "Anti-inflammatory botanical; popular in Korean skincare" },
  "snail secretion filtrate": { rating: "safe", function: "skin-conditioning", reason: "Hydrating and reparative ingredient" },
  "helix aspersa extract": { rating: "safe", function: "skin-conditioning", reason: "Hydrating and reparative ingredient" },
  "turmeric extract": { rating: "safe", function: "soothing", reason: "Anti-inflammatory antioxidant botanical" },
  "curcuma longa root extract": { rating: "safe", function: "soothing", reason: "Anti-inflammatory antioxidant botanical" },
  "licorice root extract": { rating: "safe", function: "skin-conditioning", reason: "Brightening and soothing botanical" },
  "glycyrrhiza glabra root extract": { rating: "safe", function: "skin-conditioning", reason: "Brightening and soothing botanical" },
  glycyrrhizin: { rating: "safe", function: "soothing", reason: "Anti-inflammatory compound from licorice root" },
  "dipotassium glycyrrhizate": { rating: "safe", function: "soothing", reason: "Anti-inflammatory compound from licorice root" },
  "lavender extract": { rating: "caution", function: "soothing", reason: "Botanical extract; may contain allergens" },
  "rosemary extract": { rating: "caution", function: "antioxidant", reason: "Antioxidant botanical; potential sensitizer for some" },
  "rosmarinus officinalis leaf extract": { rating: "caution", function: "antioxidant", reason: "Antioxidant botanical; potential sensitizer for some" },
  "witch hazel": { rating: "caution", function: "astringent", reason: "May contain tannins and alcohol; potentially drying" },
  "hamamelis virginiana extract": { rating: "caution", function: "astringent", reason: "May contain tannins and alcohol; potentially drying" },
  "echinacea extract": { rating: "safe", function: "soothing", reason: "Immune-supportive botanical" },
  "ginkgo biloba extract": { rating: "safe", function: "antioxidant", reason: "Antioxidant botanical" },
  "cucumber extract": { rating: "safe", function: "soothing", reason: "Cooling and soothing botanical" },
  "cucumis sativus fruit extract": { rating: "safe", function: "soothing", reason: "Cooling and soothing botanical" },
  "kelp extract": { rating: "safe", function: "skin-conditioning", reason: "Hydrating marine botanical" },
  "laminaria digitata extract": { rating: "safe", function: "skin-conditioning", reason: "Hydrating marine botanical" },
  "spirulina extract": { rating: "safe", function: "skin-conditioning", reason: "Nutrient-rich algae extract" },
  "portulaca oleracea extract": { rating: "safe", function: "soothing", reason: "Soothing botanical with antioxidant properties" },

  // Korean/Asian Skincare Ingredients
  "galactomyces ferment filtrate": { rating: "safe", function: "skin-conditioning", reason: "Yeast ferment filtrate; brightening and hydrating", reason_ko: "효모 발효 추출물; 미백과 보습에 도움" },
  "bifida ferment lysate": { rating: "safe", function: "skin-conditioning", reason: "Probiotic-derived ingredient for skin barrier support" },
  "rice extract": { rating: "safe", function: "skin-conditioning", reason: "Brightening and soothing botanical" },
  "oryza sativa bran extract": { rating: "safe", function: "skin-conditioning", reason: "Brightening and soothing botanical" },
  "rice bran extract": { rating: "safe", function: "skin-conditioning", reason: "Brightening botanical rich in antioxidants" },
  "ginseng extract": { rating: "safe", function: "skin-conditioning", reason: "Antioxidant and revitalizing botanical" },
  "panax ginseng root extract": { rating: "safe", function: "skin-conditioning", reason: "Antioxidant and revitalizing botanical" },
  "bamboo extract": { rating: "safe", function: "skin-conditioning", reason: "Silica-rich botanical; smoothing and mattifying" },
  "bambusa vulgaris extract": { rating: "safe", function: "skin-conditioning", reason: "Silica-rich botanical; smoothing and mattifying" },
  madecassoside: { rating: "safe", function: "soothing", reason: "Active compound from centella asiatica; potent anti-inflammatory", reason_ko: "병풀 유래 핵심 성분; 강력한 항염 작용" },
  asiaticoside: { rating: "safe", function: "soothing", reason: "Active compound from centella asiatica; promotes wound healing" },
  "madecassic acid": { rating: "safe", function: "soothing", reason: "Active compound from centella asiatica; anti-inflammatory" },
  "asiatic acid": { rating: "safe", function: "soothing", reason: "Active compound from centella asiatica; promotes collagen synthesis" },
  "lactobacillus ferment": { rating: "safe", function: "skin-conditioning", reason: "Probiotic-derived ingredient for skin barrier support" },
  "saccharomyces ferment filtrate": { rating: "safe", function: "skin-conditioning", reason: "Yeast ferment filtrate; skin-conditioning" },
  "lactobacillus/kelp ferment filtrate": { rating: "safe", function: "skin-conditioning", reason: "Fermented marine ingredient; hydrating" },
  "propolis extract": { rating: "caution", function: "soothing", reason: "Anti-inflammatory; may cause sensitization in bee-product allergic individuals" },
  "pearl extract": { rating: "safe", function: "skin-conditioning", reason: "Brightening mineral ingredient" },
  "sake extract": { rating: "safe", function: "skin-conditioning", reason: "Fermented rice extract; brightening and hydrating" },
  "tremella fuciformis extract": { rating: "safe", function: "moisturizing", reason: "Snow mushroom; highly hydrating polysaccharide" },
  mugwort: { rating: "safe", function: "soothing", reason: "Anti-inflammatory botanical; popular in K-beauty" },

  // Fatty Acids and Lipids
  "stearic acid": { rating: "safe", function: "emollient", reason: "Common fatty acid; emollient and thickener" },
  "palmitic acid": { rating: "safe", function: "emollient", reason: "Common fatty acid emollient" },
  "oleic acid": { rating: "caution", function: "emollient", reason: "Fatty acid emollient; may increase transepidermal water loss at high levels" },
  "linoleic acid": { rating: "safe", function: "emollient", reason: "Essential fatty acid; beneficial for skin barrier" },
  "linolenic acid": { rating: "safe", function: "emollient", reason: "Omega-3 fatty acid; anti-inflammatory" },
  ceramides: { rating: "safe", function: "skin-conditioning", reason: "Essential lipids for skin barrier integrity" },
  "ceramide eop": { rating: "safe", function: "skin-conditioning", reason: "Skin barrier lipid" },
  "ceramide ns": { rating: "safe", function: "skin-conditioning", reason: "Skin barrier lipid" },
  "ceramide ap": { rating: "safe", function: "skin-conditioning", reason: "Skin barrier lipid" },
  "ceramide eg": { rating: "safe", function: "skin-conditioning", reason: "Skin barrier lipid" },
  phytosphingosine: { rating: "safe", function: "skin-conditioning", reason: "Natural lipid for skin barrier support" },
  sphingosine: { rating: "safe", function: "skin-conditioning", reason: "Natural lipid for skin barrier support" },
  cholesterol: { rating: "safe", function: "skin-conditioning", reason: "Skin barrier lipid; naturally found in skin" },
  lecithin: { rating: "safe", function: "emollient", reason: "Natural lipid emulsifier and skin-conditioner" },
  phospholipid: { rating: "safe", function: "emollient", reason: "Natural lipid for skin barrier support" },
  "glyceryl stearate": { rating: "safe", function: "emulsifier", reason: "Gentle emulsifier and emollient" },
  "peg-100 stearate": { rating: "safe", function: "emulsifier", reason: "Emulsifier; generally well-tolerated" },
  "sodium stearoyl lactylate": { rating: "safe", function: "emulsifier", reason: "Gentle emulsifier from natural sources" },

  // Proteins and Amino Acids
  collagen: { rating: "safe", function: "skin-conditioning", reason: "Protein with hydrating properties on skin surface" },
  elastin: { rating: "safe", function: "skin-conditioning", reason: "Protein with film-forming and moisturizing properties" },
  "hydrolyzed silk": { rating: "safe", function: "skin-conditioning", reason: "Silk protein; smoothing and conditioning" },
  "silk amino acids": { rating: "safe", function: "skin-conditioning", reason: "Protein hydrolysate; smoothing and conditioning" },
  "hydrolyzed wheat protein": { rating: "caution", function: "skin-conditioning", reason: "May cause allergic reactions in wheat-sensitive individuals" },
  "hydrolyzed soy protein": { rating: "caution", function: "skin-conditioning", reason: "May cause allergic reactions in soy-sensitive individuals" },
  "hydrolyzed oat protein": { rating: "caution", function: "skin-conditioning", reason: "May cause allergic reactions in oat-sensitive individuals" },
  "amino acids": { rating: "safe", function: "skin-conditioning", reason: "Building blocks for skin proteins" },
  arginine: { rating: "safe", function: "skin-conditioning", reason: "Amino acid with soothing properties" },

  // Polysaccharides and Beta-Glucans
  "beta-glucan": { rating: "safe", function: "soothing", reason: "Potent soothing and immune-modulating ingredient", reason_ko: "피부 진정과 면역 조절을 돕는 강력한 성분" },
  "oat extract": { rating: "safe", function: "soothing", reason: "Anti-inflammatory and soothing botanical" },
  "avena sativa kernel extract": { rating: "safe", function: "soothing", reason: "Anti-inflammatory and soothing botanical" },
  "colloidal oatmeal": { rating: "safe", function: "soothing", reason: "Clinically proven to relieve skin irritation and itching" },
  "mushroom extract": { rating: "safe", function: "skin-conditioning", reason: "Antioxidant and soothing botanical" },

  // Minerals and Inorganic Compounds
  silica: { rating: "safe", function: "absorbent", reason: "Mineral powder; mattifying and texture-improving" },
  mica: { rating: "safe", function: "colorant", reason: "Natural mineral pigment" },
  kaolin: { rating: "safe", function: "absorbent", reason: "Natural clay mineral; oil-absorbing" },
  bentonite: { rating: "safe", function: "absorbent", reason: "Natural clay mineral; oil-absorbing and purifying" },
  "sodium chloride": { rating: "safe", function: "viscosity modifier", reason: "Common salt; thickener in cleansers" },
  "magnesium sulfate": { rating: "safe", function: "skin-conditioning", reason: "Epsom salt; relaxing mineral" },
  "zinc sulfate": { rating: "safe", function: "skin-conditioning", reason: "Zinc mineral salt" },
  "iron oxides": { rating: "safe", function: "colorant", reason: "Mineral pigments; safe colorants" },
  ultramarines: { rating: "safe", function: "colorant", reason: "Mineral pigments; safe colorants" },
  "chromium oxide greens": { rating: "safe", function: "colorant", reason: "Mineral pigment; safe colorant" },

  // Concern/Controversial Ingredients
  triclosan: { rating: "avoid", function: "preservative", reason: "Antimicrobial; endocrine disruption concerns; banned in some products" },
  triclocarban: { rating: "avoid", function: "preservative", reason: "Antimicrobial; endocrine disruption concerns" },
  "dibutyl phthalate": { rating: "avoid", function: "plasticizer", reason: "Potential endocrine disruptor" },
  "diethyl phthalate": { rating: "avoid", function: "solvent", reason: "Potential endocrine disruptor" },
  phthalates: { rating: "avoid", function: "plasticizer", reason: "Potential endocrine disruptors" },
  "butylated hydroxyanisole": { rating: "caution", function: "antioxidant", reason: "Potential endocrine activity; under review" },
  bha: { rating: "caution", function: "antioxidant", reason: "Butylated hydroxyanisole; potential endocrine activity; under review" },
  "butylated hydroxytoluene": { rating: "caution", function: "antioxidant", reason: "Antioxidant preservative; under review" },
  bht: { rating: "caution", function: "antioxidant", reason: "Butylated hydroxytoluene; antioxidant preservative; under review" },
  talc: { rating: "caution", function: "absorbent", reason: "Mineral powder; some concerns about asbestos contamination in talc" },
  "isopropyl alcohol": { rating: "caution", function: "solvent", reason: "Drying and potentially irritating" },
  "sd alcohol": { rating: "caution", function: "solvent", reason: "Denatured alcohol; may be drying and irritating" },
  "aluminum chlorohydrate": { rating: "caution", function: "antiperspirant", reason: "Aluminum-based antiperspirant; some concerns about long-term use" },
  "aluminum zirconium tetrachlorohydrex": { rating: "caution", function: "antiperspirant", reason: "Aluminum-based antiperspirant; some concerns about long-term use" },

  // Additional Emulsifiers and Stabilizers
  "ceteareth-20": { rating: "safe", function: "emulsifier", reason: "Emulsifier; generally well-tolerated" },
  "ceteareth-12": { rating: "safe", function: "emulsifier", reason: "Emulsifier; generally well-tolerated" },
  "steareth-20": { rating: "safe", function: "emulsifier", reason: "Emulsifier; generally well-tolerated" },
  "peg-40 hydrogenated castor oil": { rating: "safe", function: "emulsifier", reason: "Solubilizer and emulsifier" },
  "peg-60 hydrogenated castor oil": { rating: "safe", function: "emulsifier", reason: "Solubilizer and emulsifier" },
  "glyceryl stearate se": { rating: "safe", function: "emulsifier", reason: "Self-emulsifying emollient" },
  "sorbitan olivate": { rating: "safe", function: "emulsifier", reason: "Natural emulsifier from olive oil" },
  "cetyl phosphate": { rating: "safe", function: "emulsifier", reason: "Gentle emulsifier" },
  "hydroxypropyl starch phosphate": { rating: "safe", function: "thickening", reason: "Natural starch-derived thickener" },
  "tapioca starch": { rating: "safe", function: "absorbent", reason: "Natural starch; mattifying and texturizing" },
  "corn starch": { rating: "safe", function: "absorbent", reason: "Natural starch; absorbs excess oil" },
  "rice starch": { rating: "safe", function: "absorbent", reason: "Natural starch; softening and mattifying" },

  // Additional Silicones
  dimethiconol: { rating: "safe", function: "emollient", reason: "Silicone for smoothing and conditioning" },
  "amodimethicone": { rating: "safe", function: "emollient", reason: "Amino-functional silicone; conditioning" },
  "phenyl trimethicone": { rating: "safe", function: "emollient", reason: "Silicone with high refractive index; adds shine" },
  "trimethylsiloxysilicate": { rating: "safe", function: "film-former", reason: "Silicone resin; long-lasting film-former" },
  "isodecyl neopentanoate": { rating: "safe", function: "emollient", reason: "Lightweight, non-greasy emollient" },
  "diisopropyl adipate": { rating: "safe", function: "emollient", reason: "Lightweight emollient" },
  "diisopropyl sebacate": { rating: "safe", function: "emollient", reason: "Lightweight, non-comedogenic emollient" },

  // Additional Actives
  "niacinamide": { rating: "safe", function: "skin-conditioning", reason: "Multipurpose vitamin B3; brightening and barrier-supporting" },
  "pantothenic acid": { rating: "safe", function: "skin-conditioning", reason: "Vitamin B5; skin-conditioning and healing" },
  "biotin": { rating: "safe", function: "skin-conditioning", reason: "Vitamin B7; skin and nail conditioning" },
  "pyridoxine": { rating: "safe", function: "skin-conditioning", reason: "Vitamin B6; skin-conditioning" },
  "riboflavin": { rating: "safe", function: "skin-conditioning", reason: "Vitamin B2; antioxidant" },
  "thiamine": { rating: "safe", function: "skin-conditioning", reason: "Vitamin B1; skin-conditioning" },
  "folic acid": { rating: "safe", function: "skin-conditioning", reason: "Vitamin B9; skin-conditioning" },
  "retinaldehyde": { rating: "caution", function: "skin-conditioning", reason: "Vitamin A aldehyde; effective but may cause irritation" },
  "hydroxypinacolone retinoate": { rating: "caution", function: "skin-conditioning", reason: "Gentle retinoid ester; use with caution on sensitive skin" },
  "granactive retinoid": { rating: "caution", function: "skin-conditioning", reason: "Gentle retinoid complex; use with caution on sensitive skin" },
  "dioic acid": { rating: "caution", function: "skin-conditioning", reason: "Brightening dicarboxylic acid; use with caution" },
  "phytic acid": { rating: "safe", function: "chelating", reason: "Natural chelating agent with antioxidant properties" },

  // Skin-Brightening Agents
  "4-butylresorcinol": { rating: "caution", function: "skin-conditioning", reason: "Brightening agent; effective but use with caution" },
  "resorcinol": { rating: "caution", function: "skin-conditioning", reason: "Brightening agent; may cause irritation" },
  "undecylenoyl phenylalanine": { rating: "safe", function: "skin-conditioning", reason: "Gentle pigmentation-targeting ingredient" },
  "gigawhite": { rating: "safe", function: "skin-conditioning", reason: "Alpine plant extract blend for brightening" },
  "rumex occidentalis extract": { rating: "safe", function: "skin-conditioning", reason: "Brightening botanical extract" },
  "saxifraga sarmentosa extract": { rating: "safe", function: "skin-conditioning", reason: "Brightening botanical from K-beauty" },
  "emblica extract": { rating: "safe", function: "antioxidant", reason: "Phyllanthus emblica; potent antioxidant and brightening" },
  "phyllanthus emblica fruit extract": { rating: "safe", function: "antioxidant", reason: "Potent antioxidant and brightening botanical" },

  // Additional Hair and Skin Conditioning
  "hydrolyzed keratin": { rating: "safe", function: "skin-conditioning", reason: "Protein for strengthening and conditioning" },
  "hydrolyzed elastin": { rating: "safe", function: "skin-conditioning", reason: "Protein with hydrating and film-forming properties" },
  "keratin": { rating: "safe", function: "skin-conditioning", reason: "Structural protein for strengthening" },
  "bioferment": { rating: "safe", function: "skin-conditioning", reason: "Fermentation-derived skin-conditioning ingredient" },
  "saccharomyces cerevisiae extract": { rating: "safe", function: "skin-conditioning", reason: "Yeast extract; conditioning and brightening" },
  "pitera": { rating: "safe", function: "skin-conditioning", reason: "Galactomyces ferment filtrate; brightening and hydrating" },

  // Anti-Aging Actives
  "epidermal growth factor": { rating: "safe", function: "skin-conditioning", reason: "Protein that stimulates cell renewal" },
  "sh-oligopeptide-2": { rating: "safe", function: "skin-conditioning", reason: "IGF-1 like peptide; promotes cell renewal" },
  "acetyl tetrapeptide-2": { rating: "safe", function: "skin-conditioning", reason: "Peptide targeting hair and skin firmness" },
  "tripeptide-1": { rating: "safe", function: "skin-conditioning", reason: "Collagen-stimulating tripeptide" },
  "hexapeptide-10": { rating: "safe", function: "skin-conditioning", reason: "Laminin-stimulating peptide; promotes skin adhesion" },
  "acetyl dipeptide-1 cetyl ester": { rating: "safe", function: "skin-conditioning", reason: "Endorphin-like peptide; soothing" },
  "dipeptide-2": { rating: "safe", function: "skin-conditioning", reason: "Valine-tryptophan peptide; reduces puffiness" },

  // Specialty Ingredients
  "hyaluronidase": { rating: "safe", function: "skin-conditioning", reason: "Enzyme for enhanced ingredient delivery" },
  "papain": { rating: "caution", function: "exfoliating", reason: "Enzymatic exfoliant from papaya; may irritate sensitive skin" },
  "bromelain": { rating: "caution", function: "exfoliating", reason: "Enzymatic exfoliant from pineapple; may irritate sensitive skin" },
  "pineapple extract": { rating: "caution", function: "exfoliating", reason: "Contains bromelain; enzymatic exfoliant" },
  "papaya extract": { rating: "caution", function: "exfoliating", reason: "Contains papain; enzymatic exfoliant" },
  "ficin": { rating: "caution", function: "exfoliating", reason: "Enzymatic exfoliant from figs; may irritate sensitive skin" },
  "fruit enzymes": { rating: "caution", function: "exfoliating", reason: "Enzymatic exfoliant; may irritate sensitive skin" },
  "willow bark extract": { rating: "caution", function: "exfoliating", reason: "Natural source of salicin; mild exfoliant" },
  "salix alba bark extract": { rating: "caution", function: "exfoliating", reason: "White willow bark; mild natural exfoliant" },

  // Marine Ingredients
  "marine collagen": { rating: "safe", function: "skin-conditioning", reason: "Marine-derived protein; hydrating film-former" },
  "sea water": { rating: "safe", function: "skin-conditioning", reason: "Mineral-rich marine ingredient" },
  "coral extract": { rating: "safe", function: "skin-conditioning", reason: "Marine mineral ingredient" },
  "abalone extract": { rating: "safe", function: "skin-conditioning", reason: "Marine mollusk extract; skin-conditioning" },
  "chlorella extract": { rating: "safe", function: "skin-conditioning", reason: "Green algae extract; rich in nutrients" },
  "bladderwrack extract": { rating: "safe", function: "skin-conditioning", reason: "Fucus vesiculosus; marine botanical" },
  "fucus vesiculosus extract": { rating: "safe", function: "skin-conditioning", reason: "Bladderwrack seaweed; skin-conditioning" },
  "red algae extract": { rating: "safe", function: "moisturizing", reason: "Polysaccharide-rich hydrating marine extract" },
  "chondrus crispus extract": { rating: "safe", function: "moisturizing", reason: "Irish moss; hydrating marine extract" },

  // Additional pH Adjusters and Buffers
  "lactic acid/glycolic acid copolymer": { rating: "caution", function: "exfoliating", reason: "AHA polymer; may cause irritation" },
  "aminomethyl propanol": { rating: "safe", function: "pH adjuster", reason: "pH adjuster; generally well-tolerated" },
  "potassium hydroxide": { rating: "safe", function: "pH adjuster", reason: "pH adjuster; safe at low concentrations" },
  "ammonium hydroxide": { rating: "caution", function: "pH adjuster", reason: "pH adjuster; may be irritating at high concentrations" },
  "arginine hcl": { rating: "safe", function: "pH adjuster", reason: "Amino acid pH buffer" },
  "sodium citrate": { rating: "safe", function: "pH adjuster", reason: "Gentle pH buffer and chelator" },

  // Film-Formers and Polymers
  "polyvinyl alcohol": { rating: "safe", function: "film-former", reason: "Synthetic polymer film-former" },
  "pvm/ma decadiene crosspolymer": { rating: "safe", function: "thickening", reason: "Polymer thickener; well-tolerated" },
  "hydroxyethyl acrylate/sodium acryloyldimethyl taurate copolymer": { rating: "safe", function: "thickening", reason: "Polymer thickener" },
  "ammonium acryloyldimethyltaurate/vp copolymer": { rating: "safe", function: "thickening", reason: "Polymer thickener" },
  "sodium polyacrylate": { rating: "safe", function: "thickening", reason: "Superabsorbent polymer; thickener" },
  pullulan: { rating: "safe", function: "film-former", reason: "Natural polysaccharide; tightening film-former" },

  // Miscellaneous Safe Ingredients
  "sodium hyaluronate crosspolymer": { rating: "safe", function: "moisturizing", reason: "Crosslinked HA; long-lasting hydration" },
  "water/aqua/eau": { rating: "safe", function: "solvent", reason: "Common solvent" },
  "rosa damascena flower water": { rating: "caution", function: "toning", reason: "Rose water; may contain allergens from rose extract" },
  "lavandula angustifolia flower water": { rating: "caution", function: "toning", reason: "Lavender water; may contain allergens" },
  "hamamelis virginiana water": { rating: "caution", function: "astringent", reason: "Witch hazel water; may be drying" },
  "artemisia vulgaris water": { rating: "safe", function: "soothing", reason: "Mugwort water; anti-inflammatory" },
  "panthenol": { rating: "safe", function: "skin-conditioning", reason: "Provitamin B5; hydrating and healing" },
  "dexpanthenol": { rating: "safe", function: "skin-conditioning", reason: "Provitamin B5; hydrating and healing" },
  "bisabolol": { rating: "safe", function: "soothing", reason: "Gentle soothing ingredient from chamomile", reason_ko: "카모마일 유래의 순한 진정 성분" },
  "alpha-bisabolol": { rating: "safe", function: "soothing", reason: "Gentle soothing ingredient from chamomile", reason_ko: "카모마일 유래의 순한 진정 성분" },
  "centella asiatica water": { rating: "safe", function: "soothing", reason: "Centella-infused water; anti-inflammatory" },
  "dipotassium glycyrrhizinate": { rating: "safe", function: "soothing", reason: "Anti-inflammatory licorice root derivative" },
  "sodium hyaluronate": { rating: "safe", function: "moisturizing", reason: "Hydrating ingredient" },
  "methyl glucose sesquistearate": { rating: "safe", function: "emulsifier", reason: "Gentle sugar-based emulsifier" },
  "myristyl alcohol": { rating: "safe", function: "emollient", reason: "Fatty alcohol; emollient and thickener" },
};

export async function analyzeIngredients(ingredients, customIngredients = []) {
  const customMap = buildCustomMap(customIngredients);
  return Promise.all(
    ingredients.map((ingredient) => analyzeIngredient(ingredient, customMap)),
  );
}

function buildCustomMap(customIngredients) {
  const map = {};
  for (const item of customIngredients) {
    if (item?.name) {
      map[normalizeIngredientName(item.name)] = item;
    }
  }
  return map;
}

async function analyzeIngredient(name, customMap = {}) {
  const cleanName = cleanIngredientName(name);
  const normalizedName = normalizeIngredientName(cleanName);

  // 1. Custom ingredients take priority
  const customMatch = customMap[normalizedName];
  if (customMatch) {
    return {
      name: cleanName,
      safetyRating: customMatch.rating,
      function: customMatch.function || "custom ingredient",
      category: customMatch.function || "custom ingredient",
      reason: customMatch.reason || "",
      reason_ko: customMatch.reason_ko || "",
      source: "custom_db",
    };
  }

  // 2. Search the default DB
  const directMatch = findIngredientMatch(normalizedName);
  if (directMatch) {
    return {
      name: cleanName,
      safetyRating: directMatch.rating,
      function: directMatch.function,
      category: directMatch.function,
      reason: directMatch.reason,
      reason_ko: directMatch.reason_ko || "",
      source: "ingredient_db",
    };
  }

  return {
    name: cleanName,
    safetyRating: "caution",
    function: "unknown",
    category: "unknown",
    reason: "Ingredient information is limited",
    reason_ko: "",
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
