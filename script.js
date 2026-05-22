const hpSlider = document.getElementById("hp-slider");
const hpValue = document.getElementById("hp-value");
const tabButtons = document.querySelectorAll("[data-tab-target]");
const tabPanels = document.querySelectorAll("[data-tab-panel]");
const resourceCards = document.querySelectorAll(".resource-card");
const craftModal = document.getElementById("craft-modal");
const inventoryModal = document.getElementById("inventory-modal");
const openCraftModalButton = document.getElementById("open-craft-modal");
const closeCraftModalButton = document.getElementById("close-craft-modal");
const closeInventoryModalButton = document.getElementById("close-inventory-modal");
const craftStatus = document.getElementById("craft-status");
const recipeButtons = document.querySelectorAll(".recipe-button");
const craftOptionPanel = document.getElementById("craft-option-panel");
const craftOptionTitle = document.getElementById("craft-option-title");
const craftOptionCopy = document.getElementById("craft-option-copy");
const optionButtons = document.querySelectorAll(".option-button");
const inventoryModalEyebrow = document.getElementById("inventory-modal-eyebrow");
const inventoryModalTitle = document.getElementById("inventory-modal-title");
const inventoryModalBody = document.getElementById("inventory-modal-body");
const specialDiceValue = document.getElementById("special-dice-value");

const resourceInputs = {
  oil: document.getElementById("resource-oil"),
  cloth: document.getElementById("resource-cloth"),
  scrap: document.getElementById("resource-scrap"),
  treasure: document.getElementById("resource-treasure"),
};

const inventoryConfig = {
  weapon: { label: "weapon", plural: "weapons", limit: 2, listId: "weapon-list", countId: "weapon-count" },
  outfit: { label: "outfit", plural: "outfits", limit: 1, listId: "outfit-list", countId: "outfit-count" },
  ability: { label: "ability", plural: "abilities", limit: 2, listId: "ability-list", countId: "ability-count" },
};

const state = {
  weapon: [],
  outfit: [],
  ability: [],
  specialDice: 0,
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
    label: "1 special die",
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
let pendingModalClose = null;
let itemId = 0;

function clampNumber(value) {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
}

function updateAutoWidth(input) {
  input.style.width = "100%";
}

function getResourceState() {
  return Object.fromEntries(
    Object.entries(resourceInputs).map(([key, input]) => [key, clampNumber(input.value)])
  );
}

function setResourceValue(resource, nextValue) {
  resourceInputs[resource].value = clampNumber(nextValue);
  updateAutoWidth(resourceInputs[resource]);
  updateRecipeAvailability();
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

function updateHpDisplay() {
  hpValue.textContent = hpSlider.value;
  updateRecipeAvailability();
}

function getAmmoCapacity() {
  return state.weapon.reduce((total, weapon) => total + weapon.maxAmmo, 0);
}

function getCurrentAmmo() {
  return state.weapon.reduce((total, weapon) => total + weapon.ammo, 0);
}

function addAmmo(amount) {
  let remaining = amount;

  state.weapon.forEach((weapon) => {
    if (remaining <= 0) {
      return;
    }

    const room = weapon.maxAmmo - weapon.ammo;
    const added = Math.min(room, remaining);
    weapon.ammo += added;
    remaining -= added;
  });

  renderInventory();
  updateRecipeAvailability();
  return amount - remaining;
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
  updateRecipeAvailability();
}

function closeCraftModal() {
  craftModal.hidden = true;
  document.body.style.overflow = "";
  resetCraftOptions();
}

function openInventoryModal(title, eyebrow = "Lara Board") {
  inventoryModalEyebrow.textContent = eyebrow;
  inventoryModalTitle.textContent = title;
  inventoryModal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeInventoryModal() {
  inventoryModal.hidden = true;
  inventoryModalBody.replaceChildren();
  document.body.style.overflow = "";

  if (typeof pendingModalClose === "function") {
    const onClose = pendingModalClose;
    pendingModalClose = null;
    onClose();
  }
}

function resetCraftOptions() {
  pendingVariableRecipe = null;
  craftOptionPanel.hidden = true;
  craftOptionTitle.textContent = "Choose a craft option";
  craftOptionCopy.textContent = "Select how you want to resolve this craft.";
}

function makeButton(label, className, onClick, type = "button") {
  const button = document.createElement("button");
  button.type = type;
  button.className = className;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function renderInventory() {
  Object.entries(inventoryConfig).forEach(([type, config]) => {
    const list = document.getElementById(config.listId);
    const count = document.getElementById(config.countId);
    list.replaceChildren();
    count.textContent = `${state[type].length} / ${config.limit}`;

    if (state[type].length === 0) {
      list.classList.add("empty-list");
      list.textContent = type === "weapon" ? "No weapons equipped." : `No ${config.plural} equipped.`;
      return;
    }

    list.classList.remove("empty-list");

    state[type].forEach((item) => {
      const row = document.createElement("article");
      row.className = "inventory-item";

      const header = document.createElement("div");
      header.className = "inventory-item-header";

      const name = document.createElement("span");
      name.className = "inventory-item-name";
      name.textContent = item.name;

      const removeButton = makeButton("X", "remove-item-button", () => removeItem(type, item.id));
      removeButton.setAttribute("aria-label", `Remove ${item.name}`);

      header.append(name, removeButton);
      row.append(header);

      if (type === "weapon") {
        const tracker = document.createElement("div");
        tracker.className = "tracker-controls";

        const down = makeButton("-", "stepper-button", () => setWeaponAmmo(item.id, item.ammo - 1));
        down.setAttribute("aria-label", `Decrease ammo for ${item.name}`);

        const value = document.createElement("span");
        value.className = "tracker-value";
        value.textContent = `${item.ammo} / ${item.maxAmmo}`;

        const up = makeButton("+", "stepper-button", () => setWeaponAmmo(item.id, item.ammo + 1));
        up.setAttribute("aria-label", `Increase ammo for ${item.name}`);

        tracker.append(down, value, up);
        row.append(tracker);
      }

      list.append(row);
    });
  });

  specialDiceValue.textContent = state.specialDice;
  updateRecipeAvailability();
}

function removeItem(type, id) {
  state[type] = state[type].filter((item) => item.id !== id);
  renderInventory();
}

function setWeaponAmmo(id, nextAmmo) {
  const weapon = state.weapon.find((item) => item.id === id);

  if (!weapon) {
    return;
  }

  weapon.ammo = Math.min(weapon.maxAmmo, Math.max(0, clampNumber(nextAmmo)));
  renderInventory();
}

function setSpecialDice(nextValue) {
  state.specialDice = Math.min(6, Math.max(0, clampNumber(nextValue)));
  renderInventory();
}

function addItem(type, details) {
  const nextItem = {
    id: ++itemId,
    name: details.name.trim(),
  };

  if (type === "weapon") {
    nextItem.maxAmmo = Math.max(0, clampNumber(details.maxAmmo));
    nextItem.ammo = nextItem.maxAmmo;
  }

  state[type].push(nextItem);
  renderInventory();
}

function showItemForm(type, onComplete) {
  const config = inventoryConfig[type];
  inventoryModalBody.replaceChildren();
  openInventoryModal(`Add ${config.label}`, "Lara Board");

  const form = document.createElement("form");
  form.className = "modal-form";

  const nameLabel = document.createElement("label");
  nameLabel.textContent = `${config.label[0].toUpperCase()}${config.label.slice(1)} name`;
  const nameInput = document.createElement("input");
  nameInput.className = "modal-field";
  nameInput.type = "text";
  nameInput.required = true;
  nameInput.placeholder = `Enter ${config.label} name`;
  nameLabel.append(nameInput);
  form.append(nameLabel);

  let ammoInput = null;

  if (type === "weapon") {
    const ammoLabel = document.createElement("label");
    ammoLabel.textContent = "Max ammo capacity";
    ammoInput = document.createElement("input");
    ammoInput.className = "modal-field";
    ammoInput.type = "number";
    ammoInput.min = "0";
    ammoInput.required = true;
    ammoInput.value = "0";
    ammoLabel.append(ammoInput);
    form.append(ammoLabel);
  }

  const actions = document.createElement("div");
  actions.className = "modal-actions";
  actions.append(
    makeButton("Cancel", "modal-secondary", closeInventoryModal),
    makeButton("Add", "modal-action", () => {}, "submit")
  );
  form.append(actions);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const details = {
      name: nameInput.value,
      maxAmmo: ammoInput ? ammoInput.value : 0,
    };

    addItem(type, details);
    closeInventoryModal();

    if (typeof onComplete === "function") {
      onComplete(details);
    }
  });

  inventoryModalBody.append(form);
  nameInput.focus();
}

function showDiscardFlow(type, onDiscarded) {
  const config = inventoryConfig[type];
  inventoryModalBody.replaceChildren();
  openInventoryModal(`Discard a ${config.label}`, "Inventory Limit");

  const copy = document.createElement("p");
  copy.className = "modal-copy";
  copy.textContent = `You can only keep ${config.limit} ${config.plural}. Select one current ${config.label} to discard.`;

  const form = document.createElement("form");
  form.className = "modal-form";

  const list = document.createElement("div");
  list.className = "discard-list";

  state[type].forEach((item, index) => {
    const label = document.createElement("label");
    label.className = "discard-option";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "discard-item";
    radio.value = String(item.id);
    radio.required = true;

    if (index === 0) {
      radio.checked = true;
    }

    const text = document.createElement("span");
    text.textContent = item.name;
    label.append(radio, text);
    list.append(label);
  });

  const actions = document.createElement("div");
  actions.className = "modal-actions";
  actions.append(
    makeButton("Cancel", "modal-secondary", closeInventoryModal),
    makeButton("Continue", "modal-action", () => {}, "submit")
  );

  form.append(list, actions);
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const selected = form.querySelector("input[name='discard-item']:checked");

    if (!selected) {
      return;
    }

    const id = Number.parseInt(selected.value, 10);
    const selectedItem = state[type].find((item) => item.id === id);
    showDiscardConfirm(type, selectedItem, onDiscarded);
  });

  inventoryModalBody.append(copy, form);
}

function showDiscardConfirm(type, item, onDiscarded) {
  const config = inventoryConfig[type];
  inventoryModalBody.replaceChildren();
  openInventoryModal(`Confirm discard`, "Double Check");

  const copy = document.createElement("p");
  copy.className = "modal-copy";
  copy.textContent = `Discard "${item.name}"? This will remove it from Lara's current ${config.label} inventory.`;

  const actions = document.createElement("div");
  actions.className = "modal-actions";
  actions.append(
    makeButton("Back", "modal-secondary", () => showDiscardFlow(type, onDiscarded)),
    makeButton("Discard", "modal-action", () => {
      removeItem(type, item.id);
      closeInventoryModal();

      if (typeof onDiscarded === "function") {
        onDiscarded();
      }
    })
  );

  inventoryModalBody.append(copy, actions);
}

function startAddItemFlow(type, onComplete) {
  if (state[type].length >= inventoryConfig[type].limit) {
    showDiscardFlow(type, () => showItemForm(type, onComplete));
    return;
  }

  showItemForm(type, onComplete);
}

function canGainHp() {
  return Number.parseInt(hpSlider.value, 10) < 10;
}

function canGainSpecialDice() {
  return state.specialDice < 6;
}

function canGainAmmo() {
  return getAmmoCapacity() > getCurrentAmmo();
}

function craftFixedItem(recipeKey) {
  const recipe = fixedRecipes[recipeKey];

  if (!canAfford(recipe.cost)) {
    setCraftStatus(`Not enough resources to craft ${recipe.label}.`, true);
    return;
  }

  if (recipeKey === "bullets" && !canGainAmmo()) {
    setCraftStatus("Ammo is already full or no weapon has ammo capacity.", true);
    return;
  }

  if (recipeKey === "medpack" && !canGainHp()) {
    setCraftStatus("HP is already full.", true);
    return;
  }

  if (recipeKey === "special-dice" && !canGainSpecialDice()) {
    setCraftStatus("Special dice are already full.", true);
    return;
  }

  applyCost(recipe.cost);

  if (recipeKey === "bullets") {
    const added = addAmmo(5);
    setCraftStatus(`Crafted ${added} bullets.`);
  }

  if (recipeKey === "medpack") {
    hpSlider.value = Math.min(10, Number.parseInt(hpSlider.value, 10) + 3);
    updateHpDisplay();
    setCraftStatus("Crafted 3 HP med pack.");
  }

  if (recipeKey === "special-dice") {
    setSpecialDice(state.specialDice + 1);
    setCraftStatus("Crafted 1 special die.");
  }

  closeCraftModal();
}

function showVariableRecipeOptions(recipeKey) {
  const recipe = variableRecipes[recipeKey];
  pendingVariableRecipe = recipeKey;
  craftOptionTitle.textContent = `Choose a ${recipe.label} craft option`;
  craftOptionCopy.textContent = `Spend ${recipe.resource} to draw 1, or spend more to draw 2 and keep 1. If Lara's ${recipe.label} inventory is full, you will discard one first.`;
  optionButtons.forEach((button) => {
    const costAmount = Number.parseInt(button.dataset.craftOption, 10);
    const note = button.querySelector("span");

    if (note) {
      note.textContent = `Cost: ${costAmount} ${recipe.resource}`;
    }
  });
  craftOptionPanel.hidden = false;
  requestAnimationFrame(() => {
    craftOptionPanel.scrollIntoView({ block: "end", behavior: "smooth" });
  });
}

function craftVariableItem(costAmount) {
  if (!pendingVariableRecipe) {
    return;
  }

  const recipe = variableRecipes[pendingVariableRecipe];
  const detail = costAmount === 5 ? "draw 1" : "draw 2 and keep 1";

  if (!canAfford({ [recipe.resource]: costAmount })) {
    setCraftStatus(`Not enough ${recipe.resource} to craft ${recipe.label}.`, true);
    return;
  }

  applyCost({ [recipe.resource]: costAmount });
  const craftedType = pendingVariableRecipe;
  closeCraftModal();
  startAddItemFlow(craftedType, () => setCraftStatus(`Crafted ${recipe.label} (${detail}).`));
}

function updateRecipeAvailability() {
  recipeButtons.forEach((button) => {
    const recipeKey = button.dataset.craftItem;
    let disabled = false;
    let reason = "";

    if (recipeKey in fixedRecipes) {
      const recipe = fixedRecipes[recipeKey];
      disabled = !canAfford(recipe.cost);
      reason = disabled ? "Not enough resources" : "";

      if (!disabled && recipeKey === "bullets" && !canGainAmmo()) {
        disabled = true;
        reason = "Ammo inventory is full";
      }

      if (!disabled && recipeKey === "medpack" && !canGainHp()) {
        disabled = true;
        reason = "HP is full";
      }

      if (!disabled && recipeKey === "special-dice" && !canGainSpecialDice()) {
        disabled = true;
        reason = "Special dice inventory is full";
      }
    }

    if (recipeKey in variableRecipes) {
      const recipe = variableRecipes[recipeKey];
      disabled = getResourceState()[recipe.resource] < 5;
      reason = disabled ? `Need at least 5 ${recipe.resource}` : "";
    }

    button.disabled = disabled;
    button.title = reason;
    const note = button.querySelector("span");

    if (note && reason) {
      note.textContent = reason;
    } else if (note && recipeKey === "bullets") {
      note.textContent = "1 oil + 1 scrap";
    } else if (note && recipeKey === "medpack") {
      note.textContent = "1 cloth + 1 oil";
    } else if (note && recipeKey === "special-dice") {
      note.textContent = "1 scrap + 1 cloth";
    } else if (note && recipeKey in variableRecipes) {
      note.textContent = state[recipeKey].length >= inventoryConfig[recipeKey].limit
        ? "Inventory full: discard 1 after crafting"
        : "Choose draw 1 or draw 2 keep 1";
    }
  });
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
    updateAutoWidth(input);
    updateRecipeAvailability();
  });

  updateAutoWidth(input);

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const step = Number.parseInt(button.dataset.step, 10);
      const nextValue = clampNumber(input.value) + step;
      setResourceValue(resource, nextValue);
    });
  });
});

document.querySelectorAll("[data-add-item]").forEach((button) => {
  button.addEventListener("click", () => startAddItemFlow(button.dataset.addItem));
});

document.querySelectorAll("[data-counter='specialDice'] .stepper-button").forEach((button) => {
  button.addEventListener("click", () => {
    const step = Number.parseInt(button.dataset.step, 10);
    setSpecialDice(state.specialDice + step);
  });
});

openCraftModalButton.addEventListener("click", openCraftModal);
closeCraftModalButton.addEventListener("click", closeCraftModal);
closeInventoryModalButton.addEventListener("click", closeInventoryModal);

craftModal.addEventListener("click", (event) => {
  const target = event.target;

  if (target instanceof HTMLElement && target.dataset.closeModal === "true") {
    closeCraftModal();
  }
});

inventoryModal.addEventListener("click", (event) => {
  const target = event.target;

  if (target instanceof HTMLElement && target.dataset.closeInventoryModal === "true") {
    closeInventoryModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (!inventoryModal.hidden) {
    closeInventoryModal();
    return;
  }

  if (!craftModal.hidden) {
    closeCraftModal();
  }
});

recipeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const recipeKey = button.dataset.craftItem;

    if (button.disabled) {
      return;
    }

    if (recipeKey in fixedRecipes) {
      craftFixedItem(recipeKey);
      return;
    }

    showVariableRecipeOptions(recipeKey);
  });
});

optionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const costAmount = Number.parseInt(button.dataset.craftOption, 10);
    craftVariableItem(costAmount);
  });
});

updateHpDisplay();
renderInventory();
