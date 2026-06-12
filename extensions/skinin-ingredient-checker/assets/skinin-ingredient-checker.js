/* skinin-asset v1.0.4 */
(function () {
  if (window.SkininIngredientCheckerLoaded) return;
  window.SkininIngredientCheckerLoaded = true;
  console.log("[Skinin] theme extension loaded");

  const INGREDIENT_LABELS = [
    "ingredients",
    "ingredient list",
    "inci",
    "full ingredients",
  ];
  const EMPTY_STATE_TITLE = "No ingredient list found for this product.";
  const EMPTY_STATE_MESSAGE =
    "Add ingredients to the product description using this format: Ingredients: Water, Glycerin, Niacinamide, Panthenol, Fragrance";
  const ANALYZE_PATH = "https://skinin-shopify-app.onrender.com/api/ingredients/analyze";
  const IS_KOREAN = (navigator.language || "").startsWith("ko");

  bindIngredientCheckerBlocks();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindIngredientCheckerBlocks);
  }

  document.addEventListener("shopify:section:load", (event) => {
    bindIngredientCheckerBlocks(event.target);
  });

  function bindIngredientCheckerBlocks(scope = document) {
    scope
      .querySelectorAll("[data-skinin-check-button], .skinin-check-button")
      .forEach((button) => {
        if (button.dataset.skininBound === "true") return;
        button.dataset.skininBound = "true";
        button.addEventListener("click", (event) => {
          event.preventDefault();
          handleIngredientCheck(button);
        });
      });
  }

  async function handleIngredientCheck(button) {
    console.log("[Skinin] Check Ingredients clicked");
    const root = button.closest(".skinin-ingredient-checker");
    if (!root) return;

    const productData = readProductData(root);
    const ingredientResult = extractIngredients(productData);
    const ingredients = ingredientResult.ingredients;
    console.log(`[Skinin] ingredient list found: ${ingredients.length > 0}`);

    if (!ingredients.length) {
      console.log(
        "[Skinin] skipped analysis because no ingredient list was found",
      );
      openModal([], { status: ingredientResult.status });
      return;
    }

    button.disabled = true;
    button.textContent = "Checking ingredients...";
    let statusLogged = false;

    try {
      console.log("[Skinin] calling analyze API");

      const response = await fetch(resolveAnalyzeUrl(root), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shop: root.dataset.shop,
          productId: root.dataset.productId,
          productTitle: root.dataset.productTitle,
          ingredients,
        }),
      });

      console.log(`[Skinin] analyze status: ${response.status}`);
      statusLogged = true;

      if (!response.ok) {
        throw new Error(`Ingredient check request failed (${response.status})`);
      }

      const result = await response.json();
      openModal(result.ingredients || []);
    } catch (error) {
      if (!statusLogged) console.log("[Skinin] analyze status: network_error");
      openModal([], {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Ingredient check request failed",
      });
    } finally {
      button.disabled = false;
      button.textContent = "Check Ingredients";
    }
  }

  function resolveAnalyzeUrl(root) {
    const appUrl = root?.dataset.appUrl;
    if (!appUrl) return ANALYZE_PATH;
    try { return new URL("/api/ingredients/analyze", appUrl).toString(); } catch (_e) { return ANALYZE_PATH; }
  }

  function readProductData(root) {
    const script = root?.querySelector("[data-skinin-product]");
    if (!script) return {};

    try {
      return JSON.parse(script.textContent);
    } catch (_error) {
      return {};
    }
  }

  function extractIngredients(productData) {
    const metafieldIngredients = productData.metafieldIngredients;
    if (Array.isArray(metafieldIngredients)) {
      const ingredients = cleanIngredients(metafieldIngredients);
      return {
        ingredients: isPlausibleIngredientList(ingredients) ? ingredients : [],
        status: "empty",
      };
    }
    if (
      typeof metafieldIngredients === "string" &&
      metafieldIngredients.trim()
    ) {
      const ingredients = splitIngredients(metafieldIngredients);
      return {
        ingredients: isPlausibleIngredientList(ingredients, metafieldIngredients)
          ? ingredients
          : [],
        status: "empty",
      };
    }

    const description = productData.description || "";
    const ingredientText = findIngredientText(description);
    if (ingredientText) {
      const ingredients = splitIngredients(ingredientText);
      if (isPlausibleIngredientList(ingredients, ingredientText)) {
        return { ingredients, status: "empty" };
      }
    }

    return {
      ingredients: [],
      status: description.trim() ? "not_ingredient_product" : "empty",
    };
  }

  function findIngredientText(description) {
    const text = String(description || "");
    const lowerDescription = text.toLowerCase();
    for (const label of INGREDIENT_LABELS) {
      const pattern = new RegExp(`\\b${escapeRegExp(label)}\\b\\s*:`, "i");
      const match = pattern.exec(text);
      if (match) return trimIngredientSection(text.slice(match.index + match[0].length));

      const index = lowerDescription.indexOf(`${label}:`);
      if (index >= 0) {
        return trimIngredientSection(text.slice(index + label.length + 1));
      }
    }
    return null;
  }

  function trimIngredientSection(value) {
    const sectionBreak = String(value).search(
      /\b(directions|usage|how to use|warnings?|caution|description|details|benefits|related products?|you may also like|sale)\b\s*:/i,
    );
    const section =
      sectionBreak >= 0 ? String(value).slice(0, sectionBreak) : String(value);
    return section.replace(/^[:\s-]+/, "").trim();
  }

  function splitIngredients(value) {
    return cleanIngredients(String(value).split(/[,;\n]+/));
  }

  function isPlausibleIngredientList(ingredients, sourceText = "") {
    if (!Array.isArray(ingredients) || ingredients.length < 2) return false;
    if (sourceText && !String(sourceText).includes(",")) return false;

    const plausibleCount = ingredients.filter((ingredient) =>
      isPlausibleIngredientName(ingredient),
    ).length;
    return plausibleCount >= 2 && plausibleCount / ingredients.length >= 0.7;
  }

  function isPlausibleIngredientName(value) {
    const ingredient = cleanIngredientName(value);
    if (!/[a-z]/i.test(ingredient)) return false;
    if (ingredient.length < 2 || ingredient.length > 80) return false;
    if (/[+$€£¥₩]|(?:\d+%?\s*off)|(?:\$\s*\d+)/i.test(ingredient)) return false;
    if (
      /\b(add to cart|buy now|sale|sold out|related products?|you may also like|shipping|returns?|reviews?|price|subtotal|checkout|home|menu)\b/i.test(
        ingredient,
      )
    )
      return false;
    return true;
  }

  function cleanIngredients(values) {
    return values.map(cleanIngredientName).filter(Boolean).slice(0, 80);
  }

  function cleanIngredientName(value) {
    return String(value)
      .trim()
      .replace(/[.,;:]+$/g, "")
      .trim();
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function openModal(ingredients, options = {}) {
    closeModal();

    const status = normalizeModalStatus(ingredients, options.status);
    const summaryHtml = renderSummary(ingredients, status);
    const bodyHtml = renderMessage(status, options.message);
    const listHtml = ingredients.length
      ? `
        <div class="skinin-modal-list">
          ${ingredients.map(renderIngredient).join("")}
        </div>
      `
      : "";

    const overlay = document.createElement("div");
    overlay.className = "skinin-modal-overlay";
    overlay.innerHTML = `
      <div class="skinin-modal" role="dialog" aria-modal="true" aria-labelledby="skinin-modal-title">
        <div class="skinin-modal-header">
          <h2 id="skinin-modal-title">Ingredient Check</h2>
          <button type="button" class="skinin-modal-close" aria-label="Close">✕</button>
        </div>
        ${summaryHtml}
        ${bodyHtml}
        ${listHtml}
        <div class="skinin-modal-footer">
          Ingredient notes are based on the ingredient list in the product description and are for informational purposes only. Not medical advice.
        </div>
      </div>
    `;

    overlay.addEventListener("click", (event) => {
      if (
        event.target === overlay ||
        event.target.closest(".skinin-modal-close")
      )
        closeModal();
    });

    document.body.appendChild(overlay);
  }

  function normalizeModalStatus(ingredients, status) {
    if (status) return status;
    return ingredients.length ? "results" : "empty";
  }

  function renderSummary(ingredients, status) {
    if (status === "empty") {
      return `
        <div class="skinin-summary skinin-summary-neutral">
          ${EMPTY_STATE_TITLE}
        </div>
      `;
    }

    if (status === "not_ingredient_product") {
      return `
        <div class="skinin-summary skinin-summary-neutral">
          ${EMPTY_STATE_TITLE}
        </div>
      `;
    }

    if (status === "error") {
      return `
        <div class="skinin-summary skinin-summary-caution">
          We couldn't check this product right now.
        </div>
      `;
    }

    const attentionCount = ingredients.filter((i) =>
      ["avoid", "caution"].includes(i.safetyRating),
    ).length;
    if (attentionCount > 0) {
      const summaryClass = ingredients.some((i) => i.safetyRating === "avoid")
        ? "skinin-summary-avoid"
        : "skinin-summary-caution";
      const message =
        attentionCount === 1
          ? "1 ingredient may need attention."
          : `${attentionCount} ingredients may need attention.`;
      return `<div class="skinin-summary ${summaryClass}">${message}</div>`;
    }

    return `<div class="skinin-summary skinin-summary-safe">No flagged ingredients found.</div>`;
  }

  function renderMessage(status, message) {
    if (status === "empty") {
      return `
        <div class="skinin-modal-message">
          ${EMPTY_STATE_MESSAGE}
        </div>
      `;
    }

    if (status === "not_ingredient_product") {
      return `
        <div class="skinin-modal-message">
          ${EMPTY_STATE_MESSAGE}
        </div>
      `;
    }

    if (status === "error") {
      return `
        <div class="skinin-modal-message">
          ${escapeHtml(message || "Please try again in a moment.")}
        </div>
      `;
    }

    return "";
  }

  function closeModal() {
    document.querySelector(".skinin-modal-overlay")?.remove();
  }

  function renderIngredient(ingredient) {
    const rating = escapeHtml(ingredient.safetyRating || "caution");
    const ratingLabel =
      {
        safe: "Low concern",
        caution: "Worth noting",
        avoid: "Potential sensitivity",
      }[rating] ||
      rating.toUpperCase();
    const dotClass =
      {
        safe: "safe",
        low_concern: "safe",
        caution: "caution",
        worth_noting: "caution",
        avoid: "avoid",
        potential_sensitivity: "avoid",
      }[rating] || "caution";
    const name = cleanIngredientName(ingredient.name);
    return `
      <article class="skinin-modal-item">
        <div class="skinin-item-info">
          <div class="skinin-item-name">
            <span class="skinin-dot skinin-dot-${dotClass}" aria-hidden="true"></span>
            <h3>${escapeHtml(name)}</h3>
          </div>
          <p class="skinin-function">${escapeHtml(ingredient.function || "cosmetic ingredient")}</p>
        </div>
        <div class="skinin-item-right">
          <span class="skinin-rating skinin-rating-${rating}">${ratingLabel}</span>
        </div>
      </article>
    `;
  }

  function escapeHtml(value) {
    return String(value).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        })[c],
    );
  }
})();
