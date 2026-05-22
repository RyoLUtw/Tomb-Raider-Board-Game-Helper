const hpSlider = document.getElementById("hp-slider");
const hpValue = document.getElementById("hp-value");
const openSettingsModalButton = document.getElementById("open-settings-modal");
const tabButtons = document.querySelectorAll("[data-tab-target]");
const tabPanels = document.querySelectorAll("[data-tab-panel]");
const resourceCards = document.querySelectorAll(".resource-card");
const chapterList = document.getElementById("chapter-list");
const chapterProgress = document.getElementById("chapter-progress");
const chapterProgressSummary = document.getElementById("chapter-progress-summary");
const chapterObjectiveSelect = document.getElementById("chapter-objective-select");
const chapterObjectiveList = document.getElementById("chapter-objective-list");
const chapterObjectiveSummary = document.getElementById("chapter-objective-summary");
const craftModal = document.getElementById("craft-modal");
const searchModal = document.getElementById("search-modal");
const treasureModal = document.getElementById("treasure-modal");
const settingsModal = document.getElementById("settings-modal");
const profileNameModal = document.getElementById("profile-name-modal");
const objectiveCompleteModal = document.getElementById("objective-complete-modal");
const chapterChangeModal = document.getElementById("chapter-change-modal");
const inventoryModal = document.getElementById("inventory-modal");
const openCraftModalButton = document.getElementById("open-craft-modal");
const openSearchModalButton = document.getElementById("open-search-modal");
const closeCraftModalButton = document.getElementById("close-craft-modal");
const closeSearchModalButton = document.getElementById("close-search-modal");
const closeTreasureModalButton = document.getElementById("close-treasure-modal");
const closeSettingsModalButton = document.getElementById("close-settings-modal");
const closeProfileNameModalButton = document.getElementById("close-profile-name-modal");
const closeObjectiveCompleteModalButton = document.getElementById("close-objective-complete-modal");
const closeChapterChangeModalButton = document.getElementById("close-chapter-change-modal");
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
const searchPoolSummary = document.getElementById("search-pool-summary");
const searchDrawSlider = document.getElementById("search-draw-slider");
const searchDrawValue = document.getElementById("search-draw-value");
const decreaseSearchDrawButton = document.getElementById("decrease-search-draw");
const increaseSearchDrawButton = document.getElementById("increase-search-draw");
const cancelSearchDrawButton = document.getElementById("cancel-search-draw");
const confirmSearchDrawButton = document.getElementById("confirm-search-draw");
const treasureModalTitle = document.getElementById("treasure-modal-title");
const treasureModalCopy = document.getElementById("treasure-modal-copy");
const treasureChoiceList = document.getElementById("treasure-choice-list");
const treasureCostSummary = document.getElementById("treasure-cost-summary");
const cancelTreasureChoiceButton = document.getElementById("cancel-treasure-choice");
const confirmTreasureChoiceButton = document.getElementById("confirm-treasure-choice");
const profileList = document.getElementById("profile-list");
const createProfileButton = document.getElementById("create-profile");
const downloadProfileButton = document.getElementById("download-profile");
const uploadProfileButton = document.getElementById("upload-profile");
const uploadProfileInput = document.getElementById("upload-profile-input");
const profileNameForm = document.getElementById("profile-name-form");
const profileNameInput = document.getElementById("profile-name-input");
const cancelProfileNameButton = document.getElementById("cancel-profile-name");
const objectiveCompleteCopy = document.getElementById("objective-complete-copy");
const declineObjectiveCompleteButton = document.getElementById("decline-objective-complete");
const confirmObjectiveCompleteButton = document.getElementById("confirm-objective-complete");
const chapterChangeCopy = document.getElementById("chapter-change-copy");
const cancelChapterChangeButton = document.getElementById("cancel-chapter-change");
const confirmChapterChangeButton = document.getElementById("confirm-chapter-change");
const eventDiscardedValue = document.getElementById("event-discarded-value");
const decreaseEventDiscardedButton = document.getElementById("decrease-event-discarded");
const increaseEventDiscardedButton = document.getElementById("increase-event-discarded");
const eventRemovedInputs = document.querySelectorAll("[data-event-removed]");
const invadedLevelInput = document.getElementById("invaded-level-input");
const decreaseInvadedLevelButton = document.getElementById("decrease-invaded-level");
const increaseInvadedLevelButton = document.getElementById("increase-invaded-level");
const sightTokenButton = document.getElementById("sight-token");
const sightTokenLabel = document.getElementById("sight-token-label");
const mapInputs = {
  laraX: document.getElementById("lara-x"),
  laraY: document.getElementById("lara-y"),
};
const addEnemyButton = document.getElementById("add-enemy");
const enemyList = document.getElementById("enemy-list");
const doorButtons = document.querySelectorAll("[data-door]");

const resourceInputs = {
  oil: document.getElementById("resource-oil"),
  cloth: document.getElementById("resource-cloth"),
  scrap: document.getElementById("resource-scrap"),
  treasure: document.getElementById("resource-treasure"),
};

const resourcePoolInitial = {
  oil: 8,
  cloth: 8,
  scrap: 8,
  treasure: 16,
};

const resourceLabels = {
  oil: "oil",
  cloth: "cloth",
  scrap: "scrap",
  treasure: "treasure",
};

const resourcePool = { ...resourcePoolInitial };
const previousResourceValues = Object.fromEntries(
  Object.entries(resourceInputs).map(([resource, input]) => [resource, clampNumber(input.value)])
);

const saveStorageKey = "tombRaiderBoardHelper.saves.v1";
const activeProfileStorageKey = "tombRaiderBoardHelper.activeProfile.v1";
const defaultProfileId = "default";
const defaultProfileName = "Default Save";
const chapterCount = 15;
const chapterObjectiveCounts = [3, 2, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2];

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
  chapters: Array.from({ length: chapterCount }, () => false),
  chapterObjectives: createEmptyChapterObjectives(),
  eventDiscarded: 0,
  eventRemoved: {
    upgrade: false,
    special1: false,
    special2: false,
    resources: false,
  },
  invadedLevel: 0,
  sightSeen: false,
  map: {
    lara: { x: 1, y: 1 },
    enemies: [],
    doors: {
      red: false,
      blue: false,
      gold: false,
    },
  },
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
let pendingTreasureChoice = null;
let itemId = 0;
let activeProfileId = defaultProfileId;
let saveProfiles = {};
let isLoadingSave = false;
let selectedObjectiveChapter = 0;
let pendingObjectiveCompleteChapter = null;
let pendingChapterChange = null;
let profileNameMode = "create";
let profileNameProfileId = null;
let enemyId = 0;

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

function getStoredProfiles() {
  try {
    return JSON.parse(localStorage.getItem(saveStorageKey)) || {};
  } catch (error) {
    return {};
  }
}

function setStoredProfiles(profiles) {
  localStorage.setItem(saveStorageKey, JSON.stringify(profiles));
}

function getLastCompletedChapter(chapters = state.chapters) {
  const lastIndex = chapters.reduce((latest, isComplete, index) => isComplete ? index : latest, -1);
  return lastIndex >= 0 ? `Chapter ${lastIndex + 1}` : "None";
}

function createEmptyChapterObjectives() {
  return Array.from({ length: chapterCount }, (_, chapterIndex) =>
    Array.from({ length: chapterObjectiveCounts[chapterIndex] }, () => false)
  );
}

function createDefaultAdventureState() {
  return {
    eventDiscarded: 0,
    eventRemoved: {
      upgrade: false,
      special1: false,
      special2: false,
      resources: false,
    },
    invadedLevel: 0,
    sightSeen: false,
    map: {
      lara: { x: 1, y: 1 },
      enemies: [],
      doors: {
        red: false,
        blue: false,
        gold: false,
      },
    },
  };
}

function clampCoordinate(value) {
  return Math.min(16, Math.max(1, clampNumber(value) || 1));
}

function createSavePayload(name = defaultProfileName) {
  return {
    version: 1,
    id: activeProfileId,
    name,
    lastSavedAt: new Date().toISOString(),
    itemId,
    state: {
      weapon: state.weapon,
      outfit: state.outfit,
      ability: state.ability,
      specialDice: state.specialDice,
      chapters: state.chapters,
      chapterObjectives: state.chapterObjectives,
      selectedObjectiveChapter,
      eventDiscarded: state.eventDiscarded,
      eventRemoved: state.eventRemoved,
      invadedLevel: state.invadedLevel,
      sightSeen: state.sightSeen,
      map: state.map,
    },
    hp: clampNumber(hpSlider.value),
    resources: getResourceState(),
    resourcePool: { ...resourcePool },
  };
}

function normalizeSavePayload(payload, fallbackId = `profile-${Date.now()}`) {
  const source = payload && typeof payload === "object" ? payload : {};
  const sourceState = source.state && typeof source.state === "object" ? source.state : {};
  const sourceResources = source.resources && typeof source.resources === "object" ? source.resources : {};
  const sourcePool = source.resourcePool && typeof source.resourcePool === "object" ? source.resourcePool : {};
  const sourceObjectives = Array.isArray(sourceState.chapterObjectives) ? sourceState.chapterObjectives : [];
  const defaultAdventure = createDefaultAdventureState();
  const sourceEventRemoved = sourceState.eventRemoved && typeof sourceState.eventRemoved === "object" ? sourceState.eventRemoved : {};
  const sourceMap = sourceState.map && typeof sourceState.map === "object" ? sourceState.map : {};
  const sourceDoors = sourceMap.doors && typeof sourceMap.doors === "object" ? sourceMap.doors : {};
  const sourceEnemies = Array.isArray(sourceMap.enemies) ? sourceMap.enemies : [];

  return {
    version: 1,
    id: typeof source.id === "string" && source.id.trim() ? source.id : fallbackId,
    name: typeof source.name === "string" && source.name.trim() ? source.name.trim() : "Imported Save",
    lastSavedAt: typeof source.lastSavedAt === "string" ? source.lastSavedAt : new Date().toISOString(),
    itemId: clampNumber(source.itemId),
    state: {
      weapon: Array.isArray(sourceState.weapon) ? sourceState.weapon : [],
      outfit: Array.isArray(sourceState.outfit) ? sourceState.outfit : [],
      ability: Array.isArray(sourceState.ability) ? sourceState.ability : [],
      specialDice: Math.min(6, clampNumber(sourceState.specialDice)),
      chapters: Array.from({ length: chapterCount }, (_, index) => Boolean(sourceState.chapters?.[index])),
      chapterObjectives: Array.from({ length: chapterCount }, (_, chapterIndex) =>
        Array.from({ length: chapterObjectiveCounts[chapterIndex] }, (_, objectiveIndex) =>
          Boolean(sourceObjectives[chapterIndex]?.[objectiveIndex])
        )
      ),
      selectedObjectiveChapter: Math.min(chapterCount - 1, clampNumber(sourceState.selectedObjectiveChapter)),
      eventDiscarded: clampNumber(sourceState.eventDiscarded),
      eventRemoved: {
        upgrade: Boolean(sourceEventRemoved.upgrade),
        special1: Boolean(sourceEventRemoved.special1),
        special2: Boolean(sourceEventRemoved.special2),
        resources: Boolean(sourceEventRemoved.resources),
      },
      invadedLevel: clampNumber(sourceState.invadedLevel),
      sightSeen: typeof sourceState.sightSeen === "boolean" ? sourceState.sightSeen : defaultAdventure.sightSeen,
      map: {
        lara: {
          x: clampCoordinate(sourceMap.lara?.x),
          y: clampCoordinate(sourceMap.lara?.y),
        },
        enemies: sourceEnemies.map((enemy, index) => ({
          id: clampNumber(enemy.id) || index + 1,
          type: ["Wildlife", "Protectors", "Natla Tech"].includes(enemy.type) ? enemy.type : "Wildlife",
          x: clampCoordinate(enemy.x),
          y: clampCoordinate(enemy.y),
        })),
        doors: {
          red: Boolean(sourceDoors.red),
          blue: Boolean(sourceDoors.blue),
          gold: Boolean(sourceDoors.gold),
        },
      },
    },
    hp: Math.min(10, Math.max(1, clampNumber(source.hp) || 10)),
    resources: Object.fromEntries(
      Object.keys(resourceInputs).map((resource) => [resource, clampNumber(sourceResources[resource])])
    ),
    resourcePool: Object.fromEntries(
      Object.entries(resourcePoolInitial).map(([resource, initialAmount]) => [
        resource,
        Math.min(initialAmount, clampNumber(sourcePool[resource] ?? initialAmount)),
      ])
    ),
  };
}

function saveCurrentProfile() {
  if (isLoadingSave) {
    return;
  }

  const existingProfile = saveProfiles[activeProfileId];
  saveProfiles[activeProfileId] = createSavePayload(existingProfile?.name || defaultProfileName);
  setStoredProfiles(saveProfiles);
  localStorage.setItem(activeProfileStorageKey, activeProfileId);
  renderProfileList();
}

function ensureSaveProfiles() {
  saveProfiles = getStoredProfiles();
  activeProfileId = localStorage.getItem(activeProfileStorageKey) || defaultProfileId;

  if (!saveProfiles[activeProfileId]) {
    activeProfileId = Object.keys(saveProfiles)[0] || defaultProfileId;
  }

  if (!saveProfiles[activeProfileId]) {
    saveProfiles[activeProfileId] = createSavePayload(defaultProfileName);
    setStoredProfiles(saveProfiles);
    localStorage.setItem(activeProfileStorageKey, activeProfileId);
  }
}

function applySaveProfile(profile) {
  const normalized = normalizeSavePayload(profile, profile?.id || activeProfileId);
  isLoadingSave = true;

  state.weapon = normalized.state.weapon;
  state.outfit = normalized.state.outfit;
  state.ability = normalized.state.ability;
  state.specialDice = normalized.state.specialDice;
  state.chapters = normalized.state.chapters;
  state.chapterObjectives = normalized.state.chapterObjectives;
  state.eventDiscarded = normalized.state.eventDiscarded;
  state.eventRemoved = normalized.state.eventRemoved;
  state.invadedLevel = normalized.state.invadedLevel;
  state.sightSeen = normalized.state.sightSeen;
  state.map = normalized.state.map;
  enemyId = Math.max(0, ...state.map.enemies.map((enemy) => clampNumber(enemy.id)));
  selectedObjectiveChapter = normalized.state.selectedObjectiveChapter;
  itemId = Math.max(
    normalized.itemId,
    ...state.weapon.map((item) => clampNumber(item.id)),
    ...state.outfit.map((item) => clampNumber(item.id)),
    ...state.ability.map((item) => clampNumber(item.id))
  );

  hpSlider.value = normalized.hp;
  Object.assign(resourcePool, normalized.resourcePool);
  Object.entries(normalized.resources).forEach(([resource, value]) => {
    resourceInputs[resource].value = value;
    previousResourceValues[resource] = value;
    updateAutoWidth(resourceInputs[resource]);
  });

  renderChapters();
  renderChapterObjectiveSelect();
  renderChapterObjectives();
  renderAdventureLog();
  updateHpDisplay();
  renderInventory();
  updateSearchControls();
  isLoadingSave = false;
}

function switchProfile(profileId) {
  if (!saveProfiles[profileId]) {
    return;
  }

  saveCurrentProfile();
  activeProfileId = profileId;
  localStorage.setItem(activeProfileStorageKey, activeProfileId);
  applySaveProfile(saveProfiles[profileId]);
  renderProfileList();
}

function createProfileFromName(name) {
  saveCurrentProfile();
  activeProfileId = `profile-${Date.now()}`;
  state.weapon = [];
  state.outfit = [];
  state.ability = [];
  state.specialDice = 0;
  state.chapters = Array.from({ length: chapterCount }, () => false);
  state.chapterObjectives = createEmptyChapterObjectives();
  Object.assign(state, createDefaultAdventureState());
  selectedObjectiveChapter = 0;
  itemId = 0;
  enemyId = 0;
  hpSlider.value = "10";
  Object.assign(resourcePool, resourcePoolInitial);
  Object.keys(resourceInputs).forEach((resource) => {
    resourceInputs[resource].value = "0";
    previousResourceValues[resource] = 0;
    updateAutoWidth(resourceInputs[resource]);
  });
  saveProfiles[activeProfileId] = createSavePayload(name.trim());
  setStoredProfiles(saveProfiles);
  localStorage.setItem(activeProfileStorageKey, activeProfileId);
  applySaveProfile(saveProfiles[activeProfileId]);
  renderProfileList();
}

function openProfileNameModal(mode = "create", profileId = null) {
  const profile = profileId ? saveProfiles[profileId] : null;
  profileNameMode = mode;
  profileNameProfileId = profileId;
  document.getElementById("profile-name-modal-title").textContent = mode === "rename" ? "Rename savegame profile" : "New savegame profile";
  document.getElementById("confirm-profile-name").textContent = mode === "rename" ? "Save" : "Create";
  profileNameInput.value = mode === "rename" && profile ? profile.name : "";
  profileNameModal.hidden = false;
  document.body.style.overflow = "hidden";
  profileNameInput.select();
  profileNameInput.focus();
}

function closeProfileNameModal() {
  profileNameModal.hidden = true;
  profileNameMode = "create";
  profileNameProfileId = null;

  if (craftModal.hidden && searchModal.hidden && treasureModal.hidden && settingsModal.hidden && objectiveCompleteModal.hidden && chapterChangeModal.hidden && inventoryModal.hidden) {
    document.body.style.overflow = "";
  }
}

function createProfile() {
  openProfileNameModal();
}

function renameProfile(profileId) {
  const profile = saveProfiles[profileId];

  if (!profile) {
    return;
  }

  openProfileNameModal("rename", profileId);
}

function deleteProfile(profileId) {
  if (!saveProfiles[profileId] || Object.keys(saveProfiles).length <= 1) {
    return;
  }

  const profileName = saveProfiles[profileId].name;

  if (!window.confirm(`Delete "${profileName}"?`)) {
    return;
  }

  delete saveProfiles[profileId];

  if (profileId === activeProfileId) {
    activeProfileId = Object.keys(saveProfiles)[0];
    localStorage.setItem(activeProfileStorageKey, activeProfileId);
    applySaveProfile(saveProfiles[activeProfileId]);
  }

  setStoredProfiles(saveProfiles);
  renderProfileList();
}

function formatSavedDate(value) {
  if (!value) {
    return "Never saved";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Never saved" : date.toLocaleString();
}

function renderProfileList() {
  if (!profileList) {
    return;
  }

  profileList.replaceChildren();
  Object.entries(saveProfiles).forEach(([profileId, profile]) => {
    const normalized = normalizeSavePayload(profile, profileId);
    const row = document.createElement("div");
    row.className = "profile-row";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "profile-button";
    button.classList.toggle("active", profileId === activeProfileId);
    button.dataset.profileId = profileId;

    const name = document.createElement("strong");
    name.textContent = normalized.name;

    const chapter = document.createElement("span");
    chapter.textContent = `Last chapter completed: ${getLastCompletedChapter(normalized.state.chapters)}`;

    const saved = document.createElement("span");
    saved.textContent = `Last saved: ${formatSavedDate(normalized.lastSavedAt)}`;

    button.append(name, chapter, saved);
    button.addEventListener("click", () => switchProfile(profileId));

    const renameButton = document.createElement("button");
    renameButton.type = "button";
    renameButton.className = "profile-edit-button";
    renameButton.textContent = "Edit";
    renameButton.setAttribute("aria-label", `Rename ${normalized.name}`);
    renameButton.addEventListener("click", () => renameProfile(profileId));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "profile-edit-button";
    deleteButton.textContent = "Del";
    deleteButton.disabled = Object.keys(saveProfiles).length <= 1;
    deleteButton.setAttribute("aria-label", `Delete ${normalized.name}`);
    deleteButton.addEventListener("click", () => deleteProfile(profileId));

    row.append(button, renameButton, deleteButton);
    profileList.append(row);
  });
}

function downloadActiveProfile() {
  saveCurrentProfile();
  const profile = saveProfiles[activeProfileId];
  const blob = new Blob([JSON.stringify(profile, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  const fileName = `${profile.name.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "savegame"}.json`;

  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}

function importProfile(file) {
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const imported = normalizeSavePayload(JSON.parse(reader.result), `profile-${Date.now()}`);
      let profileId = imported.id;

      if (saveProfiles[profileId]) {
        profileId = `profile-${Date.now()}`;
        imported.id = profileId;
        imported.name = `${imported.name} Imported`;
      }

      saveProfiles[profileId] = imported;
      activeProfileId = profileId;
      setStoredProfiles(saveProfiles);
      localStorage.setItem(activeProfileStorageKey, activeProfileId);
      applySaveProfile(imported);
      renderProfileList();
    } catch (error) {
      setCraftStatus("Could not upload that savegame profile.", true);
    } finally {
      uploadProfileInput.value = "";
    }
  });
  reader.readAsText(file);
}

function getResourceState() {
  return Object.fromEntries(
    Object.entries(resourceInputs).map(([key, input]) => [key, clampNumber(input.value)])
  );
}

function getTotalSearchPool() {
  return Object.values(resourcePool).reduce((total, amount) => total + amount, 0);
}

function formatResourceCounts(counts, separator = ", ") {
  return Object.entries(counts)
    .filter(([, amount]) => amount > 0)
    .map(([resource, amount]) => `${amount} ${resourceLabels[resource]}`)
    .join(separator);
}

function formatCost(cost) {
  const text = formatResourceCounts(cost, " + ");
  return text || "0 resources";
}

function returnResourceToPool(resource, amount) {
  resourcePool[resource] = Math.min(resourcePoolInitial[resource], resourcePool[resource] + amount);
}

function updateSearchControls() {
  const totalPool = getTotalSearchPool();
  const maxDraw = Math.max(1, totalPool);
  const currentDraw = Math.min(maxDraw, Math.max(1, clampNumber(searchDrawSlider.value)));

  searchPoolSummary.textContent = totalPool > 0
    ? `Pool remaining: ${formatResourceCounts(resourcePool)}.`
    : "The search pool is empty. Spend resources to return them to the pool.";

  searchDrawSlider.max = String(maxDraw);
  searchDrawSlider.value = String(currentDraw);
  searchDrawValue.textContent = totalPool > 0 ? String(currentDraw) : "0";
  searchDrawSlider.disabled = totalPool === 0;
  decreaseSearchDrawButton.disabled = totalPool === 0 || currentDraw <= 1;
  increaseSearchDrawButton.disabled = totalPool === 0 || currentDraw >= maxDraw;
  confirmSearchDrawButton.disabled = totalPool === 0;
}

function setSearchDrawValue(nextValue) {
  const totalPool = getTotalSearchPool();
  const maxDraw = Math.max(1, totalPool);
  searchDrawSlider.value = String(Math.min(maxDraw, Math.max(1, clampNumber(nextValue))));
  updateSearchControls();
}

function setResourceValue(resource, nextValue, options = {}) {
  const previousValue = previousResourceValues[resource] ?? clampNumber(resourceInputs[resource].value);
  const clampedValue = clampNumber(nextValue);
  const usedAmount = Math.max(0, previousValue - clampedValue);

  if (!options.skipPoolReturn && usedAmount > 0) {
    returnResourceToPool(resource, usedAmount);
  }

  resourceInputs[resource].value = clampedValue;
  previousResourceValues[resource] = clampedValue;
  updateAutoWidth(resourceInputs[resource]);
  updateRecipeAvailability();
  updateSearchControls();
  saveCurrentProfile();
}

function canAfford(cost) {
  return resolveCostWithTreasure(cost) !== null;
}

function getNonTreasureCostEntries(cost) {
  return Object.entries(cost).filter(([resource, amount]) => resource !== "treasure" && amount > 0);
}

function resolveCostWithTreasure(cost) {
  const resources = getResourceState();
  const resolvedCost = {};
  let treasureNeeded = cost.treasure ?? 0;

  Object.entries(cost).forEach(([resource, amount]) => {
    if (resource === "treasure") {
      return;
    }

    const paidWithResource = Math.min(resources[resource], amount);
    const remainingCost = amount - paidWithResource;

    if (paidWithResource > 0) {
      resolvedCost[resource] = paidWithResource;
    }

    treasureNeeded += remainingCost;
  });

  if (treasureNeeded > resources.treasure) {
    return null;
  }

  if (treasureNeeded > 0) {
    resolvedCost.treasure = treasureNeeded;
  }

  return resolvedCost;
}

function canChooseTreasureCost(cost) {
  return resourceInputs.treasure
    && getNonTreasureCostEntries(cost).length > 0
    && getResourceState().treasure > 0
    && canAfford(cost);
}

function getTreasureChoiceCost(originalCost, replacementByResource) {
  const resolvedCost = {};
  let treasureCost = originalCost.treasure ?? 0;

  getNonTreasureCostEntries(originalCost).forEach(([resource, amount]) => {
    const replacement = replacementByResource[resource] ?? 0;
    const resourceCost = amount - replacement;

    if (resourceCost > 0) {
      resolvedCost[resource] = resourceCost;
    }

    treasureCost += replacement;
  });

  if (treasureCost > 0) {
    resolvedCost.treasure = treasureCost;
  }

  return resolvedCost;
}

function chooseCraftCost(originalCost, title, onConfirm) {
  const resolvedCost = resolveCostWithTreasure(originalCost);

  if (!resolvedCost) {
    return false;
  }

  if (!canChooseTreasureCost(originalCost)) {
    onConfirm(resolvedCost);
    return true;
  }

  openTreasureChoiceModal(originalCost, title, onConfirm);
  return true;
}

function applyCost(cost) {
  Object.entries(cost).forEach(([resource, amount]) => {
    const currentValue = clampNumber(resourceInputs[resource].value);
    setResourceValue(resource, currentValue - amount);
  });
}

function drawResourcesFromPool(amount) {
  const drawCount = Math.min(amount, getTotalSearchPool());
  const drawn = {};

  for (let index = 0; index < drawCount; index += 1) {
    const availableResources = Object.entries(resourcePool).flatMap(([resource, count]) =>
      Array.from({ length: count }, () => resource)
    );
    const resource = availableResources[Math.floor(Math.random() * availableResources.length)];
    resourcePool[resource] -= 1;
    drawn[resource] = (drawn[resource] ?? 0) + 1;
  }

  Object.entries(drawn).forEach(([resource, count]) => {
    const currentValue = clampNumber(resourceInputs[resource].value);
    setResourceValue(resource, currentValue + count, { skipPoolReturn: true });
  });

  updateSearchControls();
  return drawn;
}

function setCraftStatus(message, isError = false) {
  craftStatus.textContent = message;
  craftStatus.style.color = isError ? "var(--danger)" : "";
}

function updateHpDisplay() {
  hpValue.textContent = hpSlider.value;
  updateRecipeAvailability();
  saveCurrentProfile();
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

function openSearchModal() {
  searchModal.hidden = false;
  document.body.style.overflow = "hidden";
  updateSearchControls();
  searchDrawSlider.focus();
}

function closeSearchModal() {
  searchModal.hidden = true;

  if (craftModal.hidden && treasureModal.hidden && settingsModal.hidden && profileNameModal.hidden && objectiveCompleteModal.hidden && chapterChangeModal.hidden && inventoryModal.hidden) {
    document.body.style.overflow = "";
  }
}

function openTreasureChoiceModal(originalCost, title, onConfirm) {
  const resources = getResourceState();
  const replacements = {};

  pendingTreasureChoice = {
    originalCost,
    replacements,
    onConfirm,
  };

  treasureModalTitle.textContent = title;
  treasureModalCopy.textContent = `Choose how much treasure to spend as a wild resource. Original cost: ${formatCost(originalCost)}.`;
  treasureChoiceList.replaceChildren();

  getNonTreasureCostEntries(originalCost).forEach(([resource, amount]) => {
    const minimumTreasure = Math.max(0, amount - resources[resource]);
    replacements[resource] = minimumTreasure;

    const row = document.createElement("section");
    row.className = "treasure-choice-row";
    row.dataset.resource = resource;

    const header = document.createElement("div");
    header.className = "treasure-choice-header";

    const name = document.createElement("strong");
    name.textContent = resourceLabels[resource];

    const value = document.createElement("span");
    value.dataset.treasureChoiceValue = resource;

    header.append(name, value);

    const controls = document.createElement("div");
    controls.className = "treasure-choice-controls";

    const down = makeButton("-", "stepper-button", () => setTreasureReplacement(resource, replacements[resource] - 1));
    down.setAttribute("aria-label", `Spend less treasure for ${resourceLabels[resource]}`);

    const slider = document.createElement("input");
    slider.className = "hp-slider";
    slider.type = "range";
    slider.min = String(minimumTreasure);
    slider.max = String(amount);
    slider.value = String(minimumTreasure);
    slider.dataset.treasureChoiceSlider = resource;
    slider.setAttribute("aria-label", `Treasure replacing ${resourceLabels[resource]}`);
    slider.addEventListener("input", () => setTreasureReplacement(resource, slider.value));

    const up = makeButton("+", "stepper-button", () => setTreasureReplacement(resource, replacements[resource] + 1));
    up.setAttribute("aria-label", `Spend more treasure for ${resourceLabels[resource]}`);

    controls.append(down, slider, up);
    row.append(header, controls);
    treasureChoiceList.append(row);
  });

  treasureModal.hidden = false;
  document.body.style.overflow = "hidden";
  updateTreasureChoiceControls();
}

function closeTreasureChoiceModal() {
  treasureModal.hidden = true;
  treasureChoiceList.replaceChildren();
  pendingTreasureChoice = null;

  if (craftModal.hidden && searchModal.hidden && settingsModal.hidden && profileNameModal.hidden && objectiveCompleteModal.hidden && chapterChangeModal.hidden && inventoryModal.hidden) {
    document.body.style.overflow = "";
  }
}

function openSettingsModal() {
  saveCurrentProfile();
  renderProfileList();
  settingsModal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeSettingsModal() {
  settingsModal.hidden = true;

  if (craftModal.hidden && searchModal.hidden && treasureModal.hidden && profileNameModal.hidden && objectiveCompleteModal.hidden && chapterChangeModal.hidden && inventoryModal.hidden) {
    document.body.style.overflow = "";
  }
}

function openObjectiveCompleteModal(chapterIndex) {
  pendingObjectiveCompleteChapter = chapterIndex;
  objectiveCompleteCopy.textContent = `All Chapter ${chapterIndex + 1} objectives are complete. Mark Chapter ${chapterIndex + 1} complete in chapter progress?`;
  objectiveCompleteModal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeObjectiveCompleteModal() {
  objectiveCompleteModal.hidden = true;
  pendingObjectiveCompleteChapter = null;

  if (craftModal.hidden && searchModal.hidden && treasureModal.hidden && settingsModal.hidden && profileNameModal.hidden && chapterChangeModal.hidden && inventoryModal.hidden) {
    document.body.style.overflow = "";
  }
}

function confirmObjectiveComplete() {
  if (pendingObjectiveCompleteChapter === null) {
    return;
  }

  state.chapters[pendingObjectiveCompleteChapter] = true;
  renderChapters();
  saveCurrentProfile();
  closeObjectiveCompleteModal();
}

function openChapterChangeModal(nextChapterIndex) {
  pendingChapterChange = nextChapterIndex;
  chapterChangeCopy.textContent = `Change to Chapter ${nextChapterIndex + 1}? This will reset the objective checklist for that chapter, the map, and the sight token.`;
  chapterChangeModal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeChapterChangeModal() {
  chapterChangeModal.hidden = true;
  pendingChapterChange = null;
  chapterObjectiveSelect.value = String(selectedObjectiveChapter);

  if (craftModal.hidden && searchModal.hidden && treasureModal.hidden && settingsModal.hidden && profileNameModal.hidden && objectiveCompleteModal.hidden && inventoryModal.hidden) {
    document.body.style.overflow = "";
  }
}

function resetMapAndSight() {
  const defaults = createDefaultAdventureState();
  state.map = defaults.map;
  state.sightSeen = defaults.sightSeen;
  enemyId = 0;
  renderAdventureLog();
}

function confirmChapterChange() {
  if (pendingChapterChange === null) {
    return;
  }

  selectedObjectiveChapter = pendingChapterChange;
  state.chapterObjectives[selectedObjectiveChapter] = Array.from(
    { length: chapterObjectiveCounts[selectedObjectiveChapter] },
    () => false
  );
  resetMapAndSight();
  renderChapterObjectives();
  saveCurrentProfile();
  closeChapterChangeModal();
}

function closeCraftModal() {
  craftModal.hidden = true;

  if (searchModal.hidden && treasureModal.hidden && settingsModal.hidden && profileNameModal.hidden && objectiveCompleteModal.hidden && chapterChangeModal.hidden && inventoryModal.hidden) {
    document.body.style.overflow = "";
  }
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

  if (craftModal.hidden && searchModal.hidden && treasureModal.hidden && settingsModal.hidden && profileNameModal.hidden && objectiveCompleteModal.hidden && chapterChangeModal.hidden) {
    document.body.style.overflow = "";
  }

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

function renderChapters() {
  chapterList.replaceChildren();

  state.chapters.forEach((isComplete, index) => {
    const label = document.createElement("label");
    label.className = "chapter-option";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = isComplete;
    checkbox.dataset.chapterIndex = String(index);
    checkbox.addEventListener("change", () => {
      state.chapters[index] = checkbox.checked;
      updateChapterSummary();
      saveCurrentProfile();
    });

    const text = document.createElement("span");
    text.textContent = `Chapter ${index + 1}`;

    label.append(checkbox, text);
    chapterList.append(label);
  });

  updateChapterSummary();
}

function updateChapterSummary() {
  const completeCount = state.chapters.filter(Boolean).length;
  chapterProgressSummary.textContent = `${completeCount} / ${chapterCount} complete`;
}

function renderChapterObjectiveSelect() {
  chapterObjectiveSelect.replaceChildren();

  for (let index = 0; index < chapterCount; index += 1) {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `Chapter ${index + 1}`;
    chapterObjectiveSelect.append(option);
  }

  chapterObjectiveSelect.value = String(selectedObjectiveChapter);
}

function renderChapterObjectives() {
  chapterObjectiveList.replaceChildren();
  chapterObjectiveSelect.value = String(selectedObjectiveChapter);

  const objectives = state.chapterObjectives[selectedObjectiveChapter] || [];
  objectives.forEach((isComplete, index) => {
    const label = document.createElement("label");
    label.className = "chapter-option";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = isComplete;
    checkbox.dataset.objectiveIndex = String(index);
    checkbox.addEventListener("change", () => {
      state.chapterObjectives[selectedObjectiveChapter][index] = checkbox.checked;
      updateChapterObjectiveSummary();
      saveCurrentProfile();
      maybePromptChapterComplete(selectedObjectiveChapter);
    });

    const text = document.createElement("span");
    text.textContent = `Objective ${index + 1}`;

    label.append(checkbox, text);
    chapterObjectiveList.append(label);
  });

  updateChapterObjectiveSummary();
}

function updateChapterObjectiveSummary() {
  const objectives = state.chapterObjectives[selectedObjectiveChapter] || [];
  const completeCount = objectives.filter(Boolean).length;
  chapterObjectiveSummary.textContent = `Chapter ${selectedObjectiveChapter + 1}: ${completeCount} / ${objectives.length}`;
}

function maybePromptChapterComplete(chapterIndex) {
  const objectives = state.chapterObjectives[chapterIndex] || [];

  if (objectives.length === 0 || state.chapters[chapterIndex] || !objectives.every(Boolean)) {
    return;
  }

  openObjectiveCompleteModal(chapterIndex);
}

function renderAdventureLog() {
  eventDiscardedValue.textContent = state.eventDiscarded;
  invadedLevelInput.value = state.invadedLevel;
  sightTokenButton.setAttribute("aria-pressed", String(state.sightSeen));
  sightTokenLabel.textContent = state.sightSeen ? "Seen" : "Hidden";
  mapInputs.laraX.value = state.map.lara.x;
  mapInputs.laraY.value = state.map.lara.y;
  renderEnemies();

  eventRemovedInputs.forEach((input) => {
    input.checked = Boolean(state.eventRemoved[input.dataset.eventRemoved]);
  });

  doorButtons.forEach((button) => {
    const isOpen = Boolean(state.map.doors[button.dataset.door]);
    button.textContent = isOpen ? "open" : "close";
    button.setAttribute("aria-pressed", String(isOpen));
  });
}

function setEventDiscarded(nextValue) {
  state.eventDiscarded = clampNumber(nextValue);
  renderAdventureLog();
  saveCurrentProfile();
}

function setInvadedLevel(nextValue) {
  state.invadedLevel = clampNumber(nextValue);
  renderAdventureLog();
  saveCurrentProfile();
}

function setMapCoordinate(path, nextValue) {
  const [target, axis] = path;
  state.map[target][axis] = clampCoordinate(nextValue);
  renderAdventureLog();
  saveCurrentProfile();
}

function renderEnemies() {
  enemyList.replaceChildren();

  if (state.map.enemies.length === 0) {
    enemyList.classList.add("empty-list");
    enemyList.textContent = "No enemies placed.";
    return;
  }

  enemyList.classList.remove("empty-list");

  state.map.enemies.forEach((enemy, index) => {
    const card = document.createElement("article");
    card.className = "enemy-card";

    const header = document.createElement("div");
    header.className = "inventory-item-header";

    const title = document.createElement("strong");
    title.textContent = `Enemy ${index + 1}`;

    const removeButton = makeButton("X", "remove-item-button", () => removeEnemy(enemy.id));
    removeButton.setAttribute("aria-label", `Remove enemy ${index + 1}`);
    header.append(title, removeButton);

    const typeLabel = document.createElement("label");
    typeLabel.textContent = "Type";

    const typeSelect = document.createElement("select");
    typeSelect.className = "modal-field";
    ["Wildlife", "Protectors", "Natla Tech"].forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type;
      typeSelect.append(option);
    });
    typeSelect.value = enemy.type;
    typeSelect.addEventListener("change", () => {
      enemy.type = typeSelect.value;
      saveCurrentProfile();
    });
    typeLabel.append(typeSelect);

    const coordinates = document.createElement("div");
    coordinates.className = "coordinate-grid";

    const xLabel = document.createElement("label");
    xLabel.textContent = "X";
    const xInput = document.createElement("input");
    xInput.className = "resource-input";
    xInput.type = "number";
    xInput.min = "1";
    xInput.max = "16";
    xInput.value = enemy.x;
    xInput.addEventListener("input", () => {
      enemy.x = clampCoordinate(xInput.value);
      xInput.value = enemy.x;
      saveCurrentProfile();
    });
    xLabel.append(xInput);

    const yLabel = document.createElement("label");
    yLabel.textContent = "Y";
    const yInput = document.createElement("input");
    yInput.className = "resource-input";
    yInput.type = "number";
    yInput.min = "1";
    yInput.max = "16";
    yInput.value = enemy.y;
    yInput.addEventListener("input", () => {
      enemy.y = clampCoordinate(yInput.value);
      yInput.value = enemy.y;
      saveCurrentProfile();
    });
    yLabel.append(yInput);

    coordinates.append(xLabel, yLabel);
    card.append(header, typeLabel, coordinates);
    enemyList.append(card);
  });
}

function addEnemy() {
  state.map.enemies.push({
    id: ++enemyId,
    type: "Wildlife",
    x: 1,
    y: 1,
  });
  renderAdventureLog();
  saveCurrentProfile();
}

function removeEnemy(id) {
  state.map.enemies = state.map.enemies.filter((enemy) => enemy.id !== id);
  renderAdventureLog();
  saveCurrentProfile();
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
  saveCurrentProfile();
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

function getTotalTreasureReplacement() {
  if (!pendingTreasureChoice) {
    return 0;
  }

  return Object.values(pendingTreasureChoice.replacements).reduce((total, amount) => total + amount, 0);
}

function setTreasureReplacement(resource, nextValue) {
  if (!pendingTreasureChoice) {
    return;
  }

  const requiredAmount = pendingTreasureChoice.originalCost[resource];
  const resources = getResourceState();
  const minimumTreasure = Math.max(0, requiredAmount - resources[resource]);
  const previousValue = pendingTreasureChoice.replacements[resource] ?? minimumTreasure;
  let clampedValue = Math.min(requiredAmount, Math.max(minimumTreasure, clampNumber(nextValue)));
  const otherTreasure = getTotalTreasureReplacement() - previousValue;
  const maxAllowedByPool = Math.max(minimumTreasure, resources.treasure - otherTreasure);

  clampedValue = Math.min(clampedValue, maxAllowedByPool);
  pendingTreasureChoice.replacements[resource] = clampedValue;
  updateTreasureChoiceControls();
}

function updateTreasureChoiceControls() {
  if (!pendingTreasureChoice) {
    return;
  }

  const resources = getResourceState();
  const totalTreasure = getTotalTreasureReplacement();
  const resolvedCost = getTreasureChoiceCost(pendingTreasureChoice.originalCost, pendingTreasureChoice.replacements);

  getNonTreasureCostEntries(pendingTreasureChoice.originalCost).forEach(([resource, amount]) => {
    const replacement = pendingTreasureChoice.replacements[resource];
    const row = treasureChoiceList.querySelector(`[data-resource="${resource}"]`);
    const value = treasureChoiceList.querySelector(`[data-treasure-choice-value="${resource}"]`);
    const slider = treasureChoiceList.querySelector(`[data-treasure-choice-slider="${resource}"]`);
    const buttons = row ? row.querySelectorAll(".stepper-button") : [];
    const minimumTreasure = Math.max(0, amount - resources[resource]);
    const otherTreasure = totalTreasure - replacement;
    const maxByPool = Math.max(minimumTreasure, resources.treasure - otherTreasure);
    const effectiveMax = Math.min(amount, maxByPool);

    if (value) {
      value.textContent = `${amount - replacement} ${resourceLabels[resource]} + ${replacement} treasure`;
    }

    if (slider) {
      slider.min = String(minimumTreasure);
      slider.max = String(effectiveMax);
      slider.value = String(replacement);
    }

    if (buttons.length === 2) {
      buttons[0].disabled = replacement <= minimumTreasure;
      buttons[1].disabled = replacement >= effectiveMax;
    }
  });

  treasureCostSummary.textContent = `Cost: ${formatCost(resolvedCost)}`;
  confirmTreasureChoiceButton.disabled = totalTreasure > resources.treasure;
}

function confirmTreasureChoice() {
  if (!pendingTreasureChoice) {
    return;
  }

  const resolvedCost = getTreasureChoiceCost(pendingTreasureChoice.originalCost, pendingTreasureChoice.replacements);
  const onConfirm = pendingTreasureChoice.onConfirm;
  closeTreasureChoiceModal();
  onConfirm(resolvedCost);
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

function completeFixedCraft(recipeKey, resolvedCost) {
  applyCost(resolvedCost);

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

  chooseCraftCost(recipe.cost, `Craft ${recipe.label}`, (resolvedCost) => completeFixedCraft(recipeKey, resolvedCost));
}

function showVariableRecipeOptions(recipeKey) {
  const recipe = variableRecipes[recipeKey];
  pendingVariableRecipe = recipeKey;
  craftOptionTitle.textContent = `Choose a ${recipe.label} craft option`;
  craftOptionCopy.textContent = `Spend ${recipe.resource} to draw 1, or spend more to draw 2 and keep 1. If Lara's ${recipe.label} inventory is full, you will discard one first.`;
  optionButtons.forEach((button) => {
    const costAmount = Number.parseInt(button.dataset.craftOption, 10);
    const note = button.querySelector("span");
    const resolvedCost = resolveCostWithTreasure({ [recipe.resource]: costAmount });

    if (note) {
      note.textContent = `Cost: ${formatCost(resolvedCost ?? { [recipe.resource]: costAmount })}`;
    }
  });
  craftOptionPanel.hidden = false;
  requestAnimationFrame(() => {
    craftOptionPanel.scrollIntoView({ block: "end", behavior: "smooth" });
  });
}

function completeVariableCraft(recipeKey, costAmount, resolvedCost) {
  const recipe = variableRecipes[recipeKey];
  const detail = costAmount === 5 ? "draw 1" : "draw 2 and keep 1";

  applyCost(resolvedCost);
  const craftedType = recipeKey;
  closeCraftModal();
  startAddItemFlow(craftedType, () => setCraftStatus(`Crafted ${recipe.label} (${detail}).`));
}

function craftVariableItem(costAmount) {
  if (!pendingVariableRecipe) {
    return;
  }

  const recipeKey = pendingVariableRecipe;
  const recipe = variableRecipes[recipeKey];
  const cost = { [recipe.resource]: costAmount };

  if (!canAfford(cost)) {
    setCraftStatus(`Not enough ${recipe.resource} to craft ${recipe.label}.`, true);
    return;
  }

  chooseCraftCost(cost, `Craft ${recipe.label}`, (resolvedCost) => completeVariableCraft(recipeKey, costAmount, resolvedCost));
}

function updateRecipeAvailability() {
  recipeButtons.forEach((button) => {
    const recipeKey = button.dataset.craftItem;
    let disabled = false;
    let reason = "";
    let noteText = "";

    if (recipeKey in fixedRecipes) {
      const recipe = fixedRecipes[recipeKey];
      const resolvedCost = resolveCostWithTreasure(recipe.cost);
      disabled = !resolvedCost;
      reason = disabled ? "Not enough resources" : "";
      noteText = resolvedCost ? formatCost(resolvedCost) : formatCost(recipe.cost);

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
      const resolvedCost = resolveCostWithTreasure({ [recipe.resource]: 5 });
      disabled = !resolvedCost;
      reason = disabled ? `Need at least 5 ${recipe.resource} or treasure` : "";
      noteText = resolvedCost
        ? `Draw 1 cost: ${formatCost(resolvedCost)}`
        : `Draw 1 cost: ${formatCost({ [recipe.resource]: 5 })}`;
    }

    button.disabled = disabled;
    button.title = reason;
    const note = button.querySelector("span");

    if (note && reason) {
      note.textContent = reason;
    } else if (note && recipeKey === "bullets") {
      note.textContent = noteText;
    } else if (note && recipeKey === "medpack") {
      note.textContent = noteText;
    } else if (note && recipeKey === "special-dice") {
      note.textContent = noteText;
    } else if (note && recipeKey in variableRecipes) {
      note.textContent = state[recipeKey].length >= inventoryConfig[recipeKey].limit
        ? `Inventory full: discard 1, ${noteText}`
        : noteText;
    }
  });
}

hpSlider.addEventListener("input", updateHpDisplay);

chapterObjectiveSelect.addEventListener("change", () => {
  const nextChapter = clampNumber(chapterObjectiveSelect.value);

  if (nextChapter === selectedObjectiveChapter) {
    return;
  }

  openChapterChangeModal(nextChapter);
});

decreaseEventDiscardedButton.addEventListener("click", () => setEventDiscarded(state.eventDiscarded - 1));
increaseEventDiscardedButton.addEventListener("click", () => setEventDiscarded(state.eventDiscarded + 1));

eventRemovedInputs.forEach((input) => {
  input.addEventListener("change", () => {
    state.eventRemoved[input.dataset.eventRemoved] = input.checked;
    saveCurrentProfile();
  });
});

invadedLevelInput.addEventListener("input", () => setInvadedLevel(invadedLevelInput.value));
decreaseInvadedLevelButton.addEventListener("click", () => setInvadedLevel(state.invadedLevel - 1));
increaseInvadedLevelButton.addEventListener("click", () => setInvadedLevel(state.invadedLevel + 1));

sightTokenButton.addEventListener("click", () => {
  state.sightSeen = !state.sightSeen;
  renderAdventureLog();
  saveCurrentProfile();
});

mapInputs.laraX.addEventListener("input", () => setMapCoordinate(["lara", "x"], mapInputs.laraX.value));
mapInputs.laraY.addEventListener("input", () => setMapCoordinate(["lara", "y"], mapInputs.laraY.value));
addEnemyButton.addEventListener("click", addEnemy);

doorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const door = button.dataset.door;
    state.map.doors[door] = !state.map.doors[door];
    renderAdventureLog();
    saveCurrentProfile();
  });
});

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
    setResourceValue(resource, input.value);
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

openSettingsModalButton.addEventListener("click", openSettingsModal);
openCraftModalButton.addEventListener("click", openCraftModal);
openSearchModalButton.addEventListener("click", openSearchModal);
closeCraftModalButton.addEventListener("click", closeCraftModal);
closeSearchModalButton.addEventListener("click", closeSearchModal);
closeTreasureModalButton.addEventListener("click", closeTreasureChoiceModal);
closeSettingsModalButton.addEventListener("click", closeSettingsModal);
closeProfileNameModalButton.addEventListener("click", closeProfileNameModal);
closeObjectiveCompleteModalButton.addEventListener("click", closeObjectiveCompleteModal);
closeChapterChangeModalButton.addEventListener("click", closeChapterChangeModal);
closeInventoryModalButton.addEventListener("click", closeInventoryModal);

craftModal.addEventListener("click", (event) => {
  const target = event.target;

  if (target instanceof HTMLElement && target.dataset.closeModal === "true") {
    closeCraftModal();
  }
});

searchModal.addEventListener("click", (event) => {
  const target = event.target;

  if (target instanceof HTMLElement && target.dataset.closeSearchModal === "true") {
    closeSearchModal();
  }
});

treasureModal.addEventListener("click", (event) => {
  const target = event.target;

  if (target instanceof HTMLElement && target.dataset.closeTreasureModal === "true") {
    closeTreasureChoiceModal();
  }
});

settingsModal.addEventListener("click", (event) => {
  const target = event.target;

  if (target instanceof HTMLElement && target.dataset.closeSettingsModal === "true") {
    closeSettingsModal();
  }
});

profileNameModal.addEventListener("click", (event) => {
  const target = event.target;

  if (target instanceof HTMLElement && target.dataset.closeProfileNameModal === "true") {
    closeProfileNameModal();
  }
});

objectiveCompleteModal.addEventListener("click", (event) => {
  const target = event.target;

  if (target instanceof HTMLElement && target.dataset.closeObjectiveCompleteModal === "true") {
    closeObjectiveCompleteModal();
  }
});

chapterChangeModal.addEventListener("click", (event) => {
  const target = event.target;

  if (target instanceof HTMLElement && target.dataset.closeChapterChangeModal === "true") {
    closeChapterChangeModal();
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

  if (!profileNameModal.hidden) {
    closeProfileNameModal();
    return;
  }

  if (!objectiveCompleteModal.hidden) {
    closeObjectiveCompleteModal();
    return;
  }

  if (!chapterChangeModal.hidden) {
    closeChapterChangeModal();
    return;
  }

  if (!treasureModal.hidden) {
    closeTreasureChoiceModal();
    return;
  }

  if (!inventoryModal.hidden) {
    closeInventoryModal();
    return;
  }

  if (!settingsModal.hidden) {
    closeSettingsModal();
    return;
  }

  if (!searchModal.hidden) {
    closeSearchModal();
    return;
  }

  if (!craftModal.hidden) {
    closeCraftModal();
  }
});

searchDrawSlider.addEventListener("input", () => {
  setSearchDrawValue(searchDrawSlider.value);
});

decreaseSearchDrawButton.addEventListener("click", () => {
  setSearchDrawValue(clampNumber(searchDrawSlider.value) - 1);
});

increaseSearchDrawButton.addEventListener("click", () => {
  setSearchDrawValue(clampNumber(searchDrawSlider.value) + 1);
});

cancelSearchDrawButton.addEventListener("click", closeSearchModal);

confirmSearchDrawButton.addEventListener("click", () => {
  const drawAmount = clampNumber(searchDrawSlider.value);
  const drawn = drawResourcesFromPool(drawAmount);
  const drawnSummary = formatResourceCounts(drawn);

  setCraftStatus(drawnSummary ? `Searched and found ${drawnSummary}.` : "The search pool is empty.", !drawnSummary);
  closeSearchModal();
});

cancelTreasureChoiceButton.addEventListener("click", closeTreasureChoiceModal);
confirmTreasureChoiceButton.addEventListener("click", confirmTreasureChoice);
createProfileButton.addEventListener("click", createProfile);
downloadProfileButton.addEventListener("click", downloadActiveProfile);
uploadProfileButton.addEventListener("click", () => uploadProfileInput.click());
uploadProfileInput.addEventListener("change", () => importProfile(uploadProfileInput.files[0]));
cancelProfileNameButton.addEventListener("click", closeProfileNameModal);
profileNameForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const profileName = profileNameInput.value.trim();

  if (!profileName) {
    return;
  }

  if (profileNameMode === "rename" && profileNameProfileId && saveProfiles[profileNameProfileId]) {
    saveProfiles[profileNameProfileId].name = profileName;
    saveProfiles[profileNameProfileId].lastSavedAt = new Date().toISOString();
    setStoredProfiles(saveProfiles);
    renderProfileList();
  } else {
    createProfileFromName(profileName);
  }

  closeProfileNameModal();
});
declineObjectiveCompleteButton.addEventListener("click", closeObjectiveCompleteModal);
confirmObjectiveCompleteButton.addEventListener("click", confirmObjectiveComplete);
cancelChapterChangeButton.addEventListener("click", closeChapterChangeModal);
confirmChapterChangeButton.addEventListener("click", confirmChapterChange);

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

ensureSaveProfiles();
applySaveProfile(saveProfiles[activeProfileId]);
renderProfileList();
