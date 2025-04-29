document.addEventListener("keydown", (event) => {
  switch (event.key.toLowerCase()) {
    case "a":
    case "q":
      addOrb("Q");
      break;
    case "z":
    case "w":
      addOrb("W");
      break;
    case "e":
      addOrb("E");
      break;
    case "r":
      invokeSpell();
      break;
    case "d":
      triggerSpell(0);
      break;
    case "f":
      triggerSpell(1);
      break;
  }
});

let currentOrbs = [];
let spellTray = [null, null];
let lastInvokedSpell = null;

const spellData = [
  {
    name: "Cold Snap",
    combination: "QQQ",
    icon: "./img/cold_snap.png",
    effect: "Applies a debuff that causes enemies to be stunned briefly and take damage each time they are damaged."
  },
  {
    name: "Ghost Walk",
    combination: "QQW",
    icon: "./img/ghost_walk.png",
    effect: "Turns Invoker invisible and slows nearby enemies. Movement speed is reduced while invisible."
  },
  {
    name: "Ice Wall",
    combination: "QQE",
    icon: "./img/ice_wall.png",
    effect: "Creates a wall of ice that slows and damages enemies who walk through it."
  },
  {
    name: "EMP",
    combination: "WWW",
    icon: "./img/emp.png",
    effect: "Generates a pulse that drains mana from enemies and deals damage based on the amount drained."
  },
  {
    name: "Tornado",
    combination: "WWQ",
    icon: "./img/tornado.png",
    effect: "Launches a tornado that lifts enemies into the air, damaging and purging them."
  },
  {
    name: "Alacrity",
    combination: "WWE",
    icon: "./img/alacrity.png",
    effect: "Increases an allied unit’s attack speed and damage for a short duration."
  },
  {
    name: "Sun Strike",
    combination: "EEE",
    icon: "./img/sun_strike.png",
    effect: "After a delay, deals global pure damage in a small area at the target location."
  },
  {
    name: "Forge Spirit",
    combination: "EEQ",
    icon: "./img/forge_spirit.png",
    effect: "Summons a spirit with long range attack and armor reduction. Number of spirits increases with level."
  },
  {
    name: "Chaos Meteor",
    combination: "EWW",
    icon: "./img/chaos_meteor.png",
    effect: "Summons a flaming meteor that rolls forward, dealing damage on impact and leaving a burning trail."
  },
  {
    name: "Deafening Blast",
    combination: "QWE",
    icon: "./img/deafening_blast.png",
    effect: "Releases a powerful wave that damages, knocks back, and disarms enemies hit."
  }
];

const guideContainer = document.getElementById("guide-container");
const spellEntryTemplate = document.getElementById("spell-entry-template");

function pressOrb(key) {
  addOrb(key.toUpperCase());
}

function addOrb(orb) {
  if (currentOrbs.length < 3) {
    currentOrbs.push(orb);
  } else {
    currentOrbs.shift();
    currentOrbs.push(orb);
  }
  updateCombinationDisplay();
}

function orbToFilename(orb) {
  switch (orb) {
    case "Q":
      return "./img/quas.png";
    case "W":
      return "./img/wex.png";
    case "E":
      return "./img/exort.png";
    default:
      return "";
  }
}

function updateCombinationDisplay() {
  const combinationContainer = document.getElementById("combination");
  combinationContainer.innerHTML = "";

  currentOrbs.forEach((orb) => {
    let span = document.createElement("span");
    span.textContent = orb;
    span.classList.add(orb.toLowerCase());
    combinationContainer.appendChild(span);
  });
}

function invokeSpell() {
  const spell = getSpell(currentOrbs);
  if (spell !== "None" && spell !== lastInvokedSpell) {
    updateSpellTray(spell);
    lastInvokedSpell = spell;
  }
}

function updateSpellTray(spell) {
  spellTray.shift();
  spellTray.push(spell);
  updateTrayDisplay();
}

function updateTrayDisplay() {
  const spell1Img = document.querySelector("#spell1 img");
  const spell2Img = document.querySelector("#spell2 img");

  if (spell1Img) {
    spell1Img.src = getImageForSpell(spellTray[0]);
    spell1Img.alt = spellTray[0] || "";
  }
  if (spell2Img) {
    spell2Img.src = getImageForSpell(spellTray[1]);
    spell2Img.alt = spellTray[1] || "";
  }
}

function triggerSpell(slot) {
  const spellElement = document.getElementById(`spell${slot + 1}`);
  if (spellElement && spellTray[slot]) {
    spellElement.classList.add("spell-animation");
    setTimeout(() => spellElement.classList.remove("spell-animation"), 500);
  }
}

function getImageForSpell(spellName) {
  if (!spellName) return "./img/no_spell.png";
  return `./img/${spellName.toLowerCase().replace(/ /g, "_")}.png`;
}

function getSpell(orbs) {
  const combo = [...orbs].sort().join("");
  const spellMap = {
    "QQQ": "Cold Snap",
    "EQQ": "Ice Wall",
    "QQW": "Ghost Walk",
    "WWW": "EMP",
    "QWW": "Tornado",
    "EWW": "Alacrity",
    "EEE": "Sun Strike",
    "EEQ": "Forge Spirit",
    "EEW": "Chaos Meteor",
    "EQW": "Deafening Blast"
  };

  return spellMap[combo] || "None";
}

function populateSpellGuide() {
  spellData.forEach(spell => {
    const templateContent = spellEntryTemplate.content.cloneNode(true);
    const spellEntryDiv = templateContent.querySelector('.spell-entry');
    const iconImg = spellEntryDiv.querySelector('[data-spell-icon]');
    const nameHeading = spellEntryDiv.querySelector('[data-spell-name]');
    const combinationParagraph = spellEntryDiv.querySelector('[data-spell-combination]');

    iconImg.src = spell.icon;
    iconImg.alt = spell.name;
    nameHeading.textContent = spell.name;

    let combinationHTML = '';
    for (const key of spell.combination) {
      combinationHTML += `<span class="${key.toLowerCase()}">${key}</span>`;
    }
    combinationParagraph.innerHTML = combinationHTML;

    // Tooltip modal logic
    const modal = document.getElementById("spell-modal");
    const modalContent = document.getElementById("modal-content");

    spellEntryDiv.addEventListener("mouseenter", (e) => {
      modalContent.textContent = spell.effect || "No effect description available.";
      modal.classList.remove("hidden");
    });

    spellEntryDiv.addEventListener("mousemove", (e) => {
      modal.style.top = `${e.clientY + 15}px`;
      modal.style.left = `${e.clientX + 15}px`;
    });

    spellEntryDiv.addEventListener("mouseleave", () => {
      modal.classList.add("hidden");
    });

    guideContainer.appendChild(spellEntryDiv);
  });
}


populateSpellGuide();