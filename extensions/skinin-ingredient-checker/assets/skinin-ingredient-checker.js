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
  const ANALYZE_PATH = "/api/ingredients/analyze";

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
    console.log(`[Skinin] ingredients text found: ${ingredients.length > 0}`);

    if (!ingredients.length) {
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
    const appUrl = root.dataset.appUrl;
    if (!appUrl) return ANALYZE_PATH;

    try {
      return new URL(ANALYZE_PATH, appUrl).toString();
    } catch (_error) {
      return ANALYZE_PATH;
    }
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
      return {
        ingredients: cleanIngredients(metafieldIngredients),
        status: "empty",
      };
    }
    if (
      typeof metafieldIngredients === "string" &&
      metafieldIngredients.trim()
    ) {
      return {
        ingredients: splitIngredients(metafieldIngredients),
        status: "empty",
      };
    }

    const description = productData.description || document.body?.innerText || "";
    const ingredientText = findIngredientText(description);
    if (ingredientText !== null) {
      return { ingredients: splitIngredients(ingredientText), status: "empty" };
    }

    return {
      ingredients: [],
      status: description.trim() ? "not_ingredient_product" : "empty",
    };
  }

  function findIngredientText(description) {
    const lowerDescription = description.toLowerCase();
    for (const label of INGREDIENT_LABELS) {
      const index = lowerDescription.indexOf(label);
      if (index >= 0)
        return description.slice(index + label.length).replace(/^[:\s-]+/, "");
    }
    return null;
  }

  function splitIngredients(value) {
    return cleanIngredients(String(value).split(/[,;\n]+/));
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
          Results are based on the ingredient information available in the product description and are for informational purposes only.
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
          No ingredient data found.
        </div>
      `;
    }

    if (status === "not_ingredient_product") {
      return `
        <div class="skinin-summary skinin-summary-neutral">
          No ingredient data found.
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
          Add ingredients to the product description to run a check.
        </div>
      `;
    }

    if (status === "not_ingredient_product") {
      return `
        <div class="skinin-modal-message">
          This product doesn't appear to contain ingredient information.
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
      { safe: "SAFE", caution: "CAUTION", avoid: "AVOID" }[rating] ||
      rating.toUpperCase();
    const name = cleanIngredientName(ingredient.name);
    const reason = ingredient.reason
      ? `<p class="skinin-reason">${escapeHtml(ingredient.reason)}</p>`
      : "";

    return `
      <article class="skinin-modal-item">
        <div class="skinin-item-info">
          <h3>${escapeHtml(name)}</h3>
          <p class="skinin-function">${escapeHtml(ingredient.function || "cosmetic ingredient")}</p>
          ${reason}
        </div>
        <span class="skinin-rating skinin-rating-${rating}">${ratingLabel}</span>
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
