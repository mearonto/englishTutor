const STORAGE_KEY = "word-quest-save-v1";

const SHOP_ITEMS = [
  { id: "hat", label: "Maple Explorer Hat", cost: 20 },
  { id: "pet", label: "Beaver Companion", cost: 35 },
  { id: "boost", label: "Hint Compass (x3)", cost: 15 }
];

const LEVELS = [
  {
    id: "g3-spelling-colour",
    grade: 3,
    type: "spelling",
    word: "colour",
    prompt: "Spell the Canadian word for this clue: The sky has a bright blue ____.",
    choices: ["color", "colour", "collour"],
    answer: "colour",
    definition: "how something looks, like red or blue",
    contextSentence: "My favourite colour is green.",
    hints: ["Canadian spelling uses -our here.", "Look for the word ending with -our."],
    coach: "In Canada, many words keep the -our ending: colour, favourite, neighbour."
  },
  {
    id: "g3-spelling-centre",
    grade: 3,
    type: "spelling",
    word: "centre",
    prompt: "Choose the correct Canadian spelling: We met at the town ____.",
    choices: ["center", "centre", "centr"],
    answer: "centre",
    definition: "the middle point",
    contextSentence: "The stage is in the centre of the room.",
    hints: ["Canadian spelling often uses -re.", "Think: centre, metre, theatre."],
    coach: "Canadian English uses centre, while American English often uses center."
  },
  {
    id: "g3-homophone-their",
    grade: 3,
    type: "homophone",
    word: "their",
    prompt: "Pick the right word: That is ____ backpack by the canoe.",
    choices: ["there", "their", "they're"],
    answer: "their",
    definition: "belonging to them",
    contextSentence: "Their dog is very friendly.",
    hints: ["This sentence needs an ownership word.", "Try: belonging to them backpack."],
    coach: "Their = ownership. There = place. They're = they are."
  },
  {
    id: "g3-homophone-theyre",
    grade: 3,
    type: "homophone",
    word: "they're",
    prompt: "Pick the right word: ____ going to the skating rink.",
    choices: ["There", "Their", "They're"],
    answer: "They're",
    definition: "short form of they are",
    contextSentence: "They're ready for class.",
    hints: ["Expand it: they are going.", "Look for the apostrophe."],
    coach: "They're is a contraction of they are."
  },
  {
    id: "g4-prefix-preview",
    grade: 4,
    type: "prefix",
    word: "preview",
    prompt: "Which word means to view something before it happens?",
    choices: ["review", "preview", "viewer"],
    answer: "preview",
    definition: "to look at something before the full event",
    contextSentence: "We watched a preview of the school play.",
    hints: ["Prefix pre- means before.", "Find the word with pre-."],
    coach: "pre- = before. preview = view before."
  },
  {
    id: "g4-suffix-careless",
    grade: 4,
    type: "suffix",
    word: "careless",
    prompt: "Fill in the blank: Leaving your lunch outside is ____.",
    choices: ["careful", "careless", "carely"],
    answer: "careless",
    definition: "not careful",
    contextSentence: "A careless choice can cause a mistake.",
    hints: ["Suffix -less means without.", "Without care = ?"],
    coach: "-less means without. careless = without care."
  },
  {
    id: "g4-multiple-meaning-bark",
    grade: 4,
    type: "multiple-meaning",
    word: "bark",
    prompt: "Choose the sentence where bark means tree covering.",
    choices: [
      "The bark of the tree feels rough.",
      "Our dog will bark at strangers.",
      "Bark your command loudly."
    ],
    answer: "The bark of the tree feels rough.",
    definition: "outer covering of a tree (or a dog sound)",
    contextSentence: "The bark protected the trunk.",
    hints: ["Look for tree clues.", "Dog bark is a sound, not a covering."],
    coach: "Some words have more than one meaning. Use context clues in the sentence."
  },
  {
    id: "g4-spelling-travelled",
    grade: 4,
    type: "spelling",
    word: "travelled",
    prompt: "Choose the Canadian spelling: We ____ across Ontario last summer.",
    choices: ["traveled", "travelled", "traveld"],
    answer: "travelled",
    definition: "went from place to place",
    contextSentence: "We travelled by train.",
    hints: ["Canadian spelling often doubles the l.", "Look for two l letters."],
    coach: "In Canadian English, travelled usually uses double l."
  }
];

const dom = {
  gradeLabel: document.getElementById("gradeLabel"),
  xpLabel: document.getElementById("xpLabel"),
  starsLabel: document.getElementById("starsLabel"),
  tokensLabel: document.getElementById("tokensLabel"),
  streakLabel: document.getElementById("streakLabel"),
  masteryBar: document.getElementById("masteryBar"),
  masteryPct: document.getElementById("masteryPct"),
  zoneMessage: document.getElementById("zoneMessage"),
  questionCard: document.getElementById("questionCard"),
  nextBtn: document.getElementById("nextBtn"),
  feedback: document.getElementById("feedback"),
  resetBtn: document.getElementById("resetBtn"),
  shopBtn: document.getElementById("shopBtn"),
  shopDialog: document.getElementById("shopDialog"),
  shopList: document.getElementById("shopList"),
  closeShopBtn: document.getElementById("closeShopBtn")
};

let state = loadState();
let current = null;

function defaultState() {
  return {
    xp: 0,
    stars: 0,
    tokens: 0,
    streak: 0,
    gradeUnlocked: 3,
    mastery3: {},
    learned: {},
    inventory: []
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultState();
    }
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function masteryPercent() {
  const grade3Ids = LEVELS.filter((l) => l.grade === 3).map((l) => l.id);
  const mastered = grade3Ids.filter((id) => (state.mastery3[id] || 0) >= 2).length;
  return Math.round((mastered / grade3Ids.length) * 100);
}

function updateUnlocks() {
  if (masteryPercent() >= 80) {
    state.gradeUnlocked = 4;
  }
}

function availableLevels() {
  const unlocked = LEVELS.filter((lvl) => lvl.grade <= state.gradeUnlocked);
  unlocked.sort((a, b) => {
    const aSeen = state.learned[a.id] || 0;
    const bSeen = state.learned[b.id] || 0;
    return aSeen - bSeen;
  });
  return unlocked;
}

function pickNextLevel() {
  const levels = availableLevels();
  return levels[Math.floor(Math.random() * Math.min(levels.length, 4))];
}

function rewardForAttempt(correct, triesUsed) {
  if (!correct) {
    return { xp: 1, stars: 0, tokens: 0 };
  }
  if (triesUsed === 1) {
    return { xp: 10, stars: 3, tokens: 2 };
  }
  if (triesUsed === 2) {
    return { xp: 7, stars: 2, tokens: 1 };
  }
  return { xp: 5, stars: 1, tokens: 1 };
}

function renderHud() {
  const pct = masteryPercent();
  dom.gradeLabel.textContent = String(state.gradeUnlocked);
  dom.xpLabel.textContent = String(state.xp);
  dom.starsLabel.textContent = String(state.stars);
  dom.tokensLabel.textContent = String(state.tokens);
  dom.streakLabel.textContent = String(state.streak);
  dom.masteryBar.value = pct;
  dom.masteryPct.textContent = `${pct}%`;
  dom.zoneMessage.textContent =
    state.gradeUnlocked === 3
      ? "Grade 3 Trail: master homophones and Canadian spellings to unlock Grade 4."
      : "Grade 4 Ridge unlocked: prefixes, suffixes, and multiple-meaning words are live.";
}

function makeButton(text, onClick, className = "") {
  const btn = document.createElement("button");
  btn.textContent = text;
  if (className) {
    btn.className = className;
  }
  btn.addEventListener("click", onClick);
  return btn;
}

function setFeedback(message, isGood) {
  dom.feedback.textContent = message;
  dom.feedback.className = isGood ? "result-good" : "result-bad";
}

function renderQuestion() {
  current = {
    level: pickNextLevel(),
    tries: 0,
    complete: false
  };

  dom.nextBtn.disabled = true;
  dom.questionCard.innerHTML = "";

  const type = document.createElement("div");
  type.className = "question-type";
  type.textContent = `Grade ${current.level.grade} • ${current.level.type}`;

  const prompt = document.createElement("div");
  prompt.className = "prompt";
  prompt.textContent = current.level.prompt;

  const choicesWrap = document.createElement("div");
  choicesWrap.className = "choices";

  const hintBox = document.createElement("div");
  hintBox.className = "hint";
  hintBox.style.display = "none";

  current.level.choices.forEach((choice) => {
    const btn = makeButton(choice, () => {
      if (current.complete) {
        return;
      }
      current.tries += 1;

      const ok = choice === current.level.answer;
      if (ok) {
        current.complete = true;
        const reward = rewardForAttempt(true, current.tries);
        state.xp += reward.xp;
        state.stars += reward.stars;
        state.tokens += reward.tokens;
        state.streak += 1;
        state.learned[current.level.id] = (state.learned[current.level.id] || 0) + 1;
        if (current.level.grade === 3) {
          state.mastery3[current.level.id] = (state.mastery3[current.level.id] || 0) + 1;
        }
        updateUnlocks();
        saveState();
        renderHud();
        setFeedback(`Correct! +${reward.xp} XP, +${reward.stars} stars, +${reward.tokens} tokens`, true);
        dom.nextBtn.disabled = false;
      } else {
        state.streak = 0;
        saveState();
        renderHud();

        if (current.tries === 1) {
          hintBox.style.display = "block";
          hintBox.textContent = `Hint: ${current.level.hints[0]}`;
          setFeedback("Not yet. Try again with a clue.", false);
        } else if (current.tries === 2) {
          const stillWrong = Array.from(choicesWrap.querySelectorAll("button")).filter(
            (node) => node.textContent !== current.level.answer
          );
          if (stillWrong.length > 1) {
            stillWrong[0].disabled = true;
          }
          hintBox.style.display = "block";
          hintBox.textContent = `Hint: ${current.level.hints[1]}`;
          setFeedback("Closer. One wrong answer is removed.", false);
        } else {
          current.complete = true;
          const reward = rewardForAttempt(false, current.tries);
          state.xp += reward.xp;
          state.learned[current.level.id] = (state.learned[current.level.id] || 0) + 1;
          saveState();
          renderHud();
          hintBox.style.display = "block";
          hintBox.textContent = `Coach Mode: ${current.level.coach}`;
          setFeedback(`Answer: ${current.level.answer}. You still earn +${reward.xp} XP.`, false);
          dom.nextBtn.disabled = false;
        }
      }
    });

    choicesWrap.appendChild(btn);
  });

  const meta = document.createElement("p");
  meta.textContent = `Definition: ${current.level.definition}`;

  dom.questionCard.append(type, prompt, choicesWrap, hintBox, meta);
}

function renderShop() {
  dom.shopList.innerHTML = "";
  SHOP_ITEMS.forEach((item) => {
    const li = document.createElement("li");
    const owned = state.inventory.includes(item.id);
    const button = makeButton(
      owned ? `Owned: ${item.label}` : `Buy ${item.label} (${item.cost} tokens)`,
      () => {
        if (owned) {
          return;
        }
        if (state.tokens < item.cost) {
          setFeedback("Not enough tokens yet.", false);
          return;
        }
        state.tokens -= item.cost;
        state.inventory.push(item.id);
        saveState();
        renderHud();
        renderShop();
        setFeedback(`Purchased ${item.label}.`, true);
      },
      owned ? "" : "primary"
    );
    if (owned) {
      button.disabled = true;
    }
    li.append(button);
    dom.shopList.append(li);
  });
}

function resetSave() {
  localStorage.removeItem(STORAGE_KEY);
  state = defaultState();
  saveState();
  renderHud();
  renderQuestion();
  setFeedback("Progress reset. New trail started.", false);
}

dom.nextBtn.addEventListener("click", () => {
  setFeedback("", false);
  renderQuestion();
});

dom.resetBtn.addEventListener("click", resetSave);

dom.shopBtn.addEventListener("click", () => {
  renderShop();
  dom.shopDialog.showModal();
});

dom.closeShopBtn.addEventListener("click", () => dom.shopDialog.close());

updateUnlocks();
saveState();
renderHud();
renderQuestion();
