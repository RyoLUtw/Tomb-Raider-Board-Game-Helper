const hpSlider = document.getElementById("hp-slider");
const hpValue = document.getElementById("hp-value");
const tabButtons = document.querySelectorAll("[data-tab-target]");
const tabPanels = document.querySelectorAll("[data-tab-panel]");
const resourceCards = document.querySelectorAll(".resource-card");
const craftModal = document.getElementById("craft-modal");
const openCraftModalButton = document.getElementById("open-craft-modal");
const closeCraftModalButton = document.getElementById("close-craft-modal");
const craftStatus = document.getElementById("craft-status");
const recipeButtons = document.querySelectorAll(".recipe-button");
const craftOptionPanel = document.getElementById("craft-option-panel");
const craftOptionTitle = document.getElementById("craft-option-title");
const craftOptionCopy = document.getElementById("craft-option-copy");
const optionButtons = document.querySelectorAll(".option-button");

const resourceInputs = {
  oil: document.getElementById("resource-oil"),
  cloth: document.getElementById("resource-cloth"),
  scrap: document.getElementById("resource-scrap"),
  treasure: document.getElementById("resource-treasure"),
};

const fixedRecipes = {
  bullets: {
    label: "5 bullets",
    cost: { oil: 1, scrap: 1 },
  },
  medpack: {
    label: "3 HP med pack",
    cost: { cloth: 1, oil: 1 },
  },
  "special-dice": {
    label: "2 special die",
    cost: { scrap: 1, cloth: 1 },
  },
};

const variableRecipes = {
  weapon: {
    label: "weapon",
    resource: "scrap",
  },
  outfit: {
    label: "outfit",
    resource: "cloth",
  },
  ability: {
    label: "ability",
    resource: "oil",
  },
};

let pendingVariableRecipe = null;

function clampNumber(value) {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
}

function getResourceState() {
  return Object.fromEntries(
    Object.entries(resourceInputs).map(([key, input]) => [key, clampNumber(input.value)])
  );
}

function setResourceValue(resource, nextValue) {
  resourceInputs[resource].value = clampNumber(nextValue);
}

function canAfford(cost) {
  const resources = getResourceState();

  return Object.entries(cost).every(([resource, amount]) => resources[resource] >= amount);
}

function applyCost(cost) {
  Object.entries(cost).forEach(([resource, amount]) => {
    const currentValue = clampNumber(resourceInputs[resource].value);
    setResourceValue(resource, currentValue - amount);
  });
}

function setCraftStatus(message, isError = false) {
  craftStatus.textContent = message;
  craftStatus.style.color = isError ? "var(--danger)" : "";
}

function craftItem(label, cost, detail = "") {
  if (!canAfford(cost)) {
    setCraftStatus(`Not enough resources to craft ${label}.`, true);
    return;
  }

  applyCost(cost);

  const suffix = detail ? ` (${detail})` : "";
  setCraftStatus(`Crafted ${label}${suffix}.`);
  closeCraftModal();
}

function updateHpDisplay() {
  hpValue.textContent = hpSlider.value;
}

function switchTab(target) {
  tabButtons.forEach((button) => {
    const isActive = button.dataset.tabTarget === target;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  tabPanels.forEach((panel) => {
    const isActive = panel.dataset.tabPanel === target;
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  });
}

function openCraftModal() {
  craftModal.hidden = false;
  document.body.style.overflow = "hidden";
  resetCraftOptions();
}

function closeCraftModal() {
  craftModal.hidden = true;
  document.body.style.overflow = "";
  resetCraftOptions();
}

function resetCraftOptions() {
  pendingVariableRecipe = null;
  craftOptionPanel.hidden = true;
  craftOptionTitle.textContent = "Choose a craft option";
  craftOptionCopy.textContent = "Select how you want to resolve this craft.";
}

function showVariableRecipeOptions(recipeKey) {
  const recipe = variableRecipes[recipeKey];
  pendingVariableRecipe = recipeKey;
  craftOptionTitle.textContent = `Choose a ${recipe.label} craft option`;
  craftOptionCopy.textContent = `Spend ${recipe.resource} to draw 1, or spend more to draw 2 and keep 1.`;
  craftOptionPanel.hidden = false;
}

hpSlider.addEventListener("input", updateHpDisplay);

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    switchTab(button.dataset.tabTarget);
  });
});

resourceCards.forEach((card) => {
  const resource = card.dataset.resource;
  const input = resourceInputs[resource];
  const buttons = card.querySelectorAll(".stepper-button");

  input.addEventListener("input", () => {
    input.value = clampNumber(input.value);
  });

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const step = Number.parseInt(button.dataset.step, 10);
      const nextValue = clampNumber(input.value) + step;
      setResourceValue(resource, nextValue);
    });
  });
});

openCraftModalButton.addEventListener("click", openCraftModal);
closeCraftModalButton.addEventListener("click", closeCraftModal);

craftModal.addEventListener("click", (event) => {
  const target = event.target;

  if (target instanceof HTMLElement && target.dataset.closeModal === "true") {
    closeCraftModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !craftModal.hidden) {
    closeCraftModal();
  }
});

recipeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const recipeKey = button.dataset.craftItem;

    if (recipeKey in fixedRecipes) {
      const recipe = fixedRecipes[recipeKey];
      craftItem(recipe.label, recipe.cost);
      return;
    }

    showVariableRecipeOptions(recipeKey);
  });
});

optionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!pendingVariableRecipe) {
      return;
    }

    const recipe = variableRecipes[pendingVariableRecipe];
    const costAmount = Number.parseInt(button.dataset.craftOption, 10);
    const detail = costAmount === 5 ? "draw 1" : "draw 2 and keep 1";

    craftItem(recipe.label, { [recipe.resource]: costAmount }, detail);
  });
});

updateHpDisplay();
