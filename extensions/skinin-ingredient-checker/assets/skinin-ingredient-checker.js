(function () {
  const INGREDIENT_LABELS = [
    "ingredients",
    "ingredient list",
    "inci",
    "full ingredients"
  ];

  document.addEventListener("click", async (event) => {
    const button = event.target.closest(".skinin-check-button");

    if (!button) {
      return;
    }

    const root = button.closest(".skinin-ingredient-checker");
    const productData = readProductData(root);
    const ingredients = extractIngredients(productData);

    if (!ingredients.length) {
      openModal([{ name: "No ingredients found", safetyRating: "moderate", function: "Add ingredients to the product description or metafields." }]);
      return;
    }

    button.disabled = true;
    button.textContent = "Checking...";

    try {
      const response = await fetch(`${root.dataset.appUrl}/api/ingredients/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shop: root.dataset.shop,
          productId: root.dataset.productId,
          productTitle: root.dataset.productTitle,
          ingredients
        })
      });

      if (!response.ok) {
        throw new Error("Ingredient analysis failed");
      }

      const result = await response.json();
      openModal(result.ingredients || []);
    } catch (error) {
      openModal([{ name: "Unable to check ingredients", safetyRating: "moderate", function: error.message }]);
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
      return cleanIngredients(metafieldIngredients);
    }

    if (typeof metafieldIngredients === "string" && metafieldIngredients.trim()) {
      return splitIngredients(metafieldIngredients);
    }

    return splitIngredients(findIngredientText(productData.description || ""));
  }

  function findIngredientText(description) {
    const lowerDescription = description.toLowerCase();

    for (const label of INGREDIENT_LABELS) {
      const index = lowerDescription.indexOf(label);

      if (index >= 0) {
        return description.slice(index + label.length).replace(/^[:\s-]+/, "");
      }
    }

    return description;
  }

  function splitIngredients(value) {
    return cleanIngredients(String(value).split(/[,;\n]+/));
  }

  function cleanIngredients(values) {
    return values.map((value) => String(value).trim()).filter(Boolean).slice(0, 80);
  }

  function openModal(ingredients) {
    closeModal();

    const overlay = document.createElement("div");
    overlay.className = "skinin-modal-overlay";
    overlay.innerHTML = `
      <div class="skinin-modal" role="dialog" aria-modal="true" aria-labelledby="skinin-modal-title">
        <div class="skinin-modal-header">
          <h2 id="skinin-modal-title">Ingredient Check</h2>
          <button type="button" class="skinin-modal-close" aria-label="Close">x</button>
        </div>
        <div class="skinin-modal-list">
          ${ingredients.map(renderIngredient).join("")}
        </div>
      </div>
    `;

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay || event.target.closest(".skinin-modal-close")) {
        closeModal();
      }
    });

    document.body.appendChild(overlay);
  }

  function closeModal() {
    document.querySelector(".skinin-modal-overlay")?.remove();
  }

  function renderIngredient(ingredient) {
    const rating = escapeHtml(ingredient.safetyRating || "moderate");

    return `
      <article class="skinin-modal-item">
        <div>
          <h3>${escapeHtml(ingredient.name)}</h3>
          <p>${escapeHtml(ingredient.function || "cosmetic ingredient")}</p>
        </div>
        <span class="skinin-rating skinin-rating-${rating}">${rating}</span>
      </article>
    `;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[character];
    });
  }
})();
