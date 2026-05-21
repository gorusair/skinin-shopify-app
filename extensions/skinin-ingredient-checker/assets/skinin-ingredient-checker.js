(function () {
  const INGREDIENT_LABELS = [
    "ingredients",
    "ingredient list",
    "inci",
    "full ingredients",
  ];

  document.addEventListener("click", async (event) => {
    const button = event.target.closest(".skinin-check-button");
    if (!button) return;

    const root = button.closest(".skinin-ingredient-checker");
    const productData = readProductData(root);
    const ingredientResult = extractIngredients(productData);
    const ingredients = ingredientResult.ingredients;

    if (!ingredients.length) {
      openModal([], { status: ingredientResult.status });
      return;
    }

    button.disabled = true;
    button.textContent = "Checking ingredients...";

    try {
      const response = await fetch(
        `${root.dataset.appUrl}/api/ingredients/analyze`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            shop: root.dataset.shop,
            productId: root.dataset.productId,
            productTitle: root.dataset.productTitle,
            ingredients,
          }),
        },
      );

      if (!response.ok) throw new Error("Ingredient check request failed");

      const result = await response.json();
      openModal(result.ingredients || []);
    } catch (_error) {
      openModal([], { status: "error" });
    } finally {
      button.disabled = false;
      button.textContent = "Check Ingredients";
    }
  });

  function readProductData(root) {
    const script = root.querySelector("[data-skinin-product]");
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

    const description = productData.description || "";
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
    const bodyHtml = renderMessage(status);
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

    return `<div class="skinin-summary skinin-summary-safe">All ingredients look good.</div>`;
  }

  function renderMessage(status) {
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
          Please try again in a moment.
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
