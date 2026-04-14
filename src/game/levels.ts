import type { Level, ShopItem, SkillType } from "./types";

const CUSTOM_LEVELS_KEY = "word-quest-custom-levels-v1";
const BULK_WORDS_RAW = `Absolute 2. Accurate 3. Analysis 4. Apparatus 5. Asteroid 6. Atmosphere 7. Atom 8. Axis 9. Bacteria 10. Balance 11. Biology 12. Calculation 13. Capacity 14. Cell 15. Chemistry 16. Climate 17. Comet 18. Component 19. Conclusion 20. Constant 21. Coordinate 22. Cycle 23. Data 24. Density 25. Diagram 26. Diameter 27. Dimension 28. Discovery 29. Distance 30. Element 31. Energy 32. Environment 33. Equation 34. Estimate 35. Evaporation 36. Evidence 37. Evolution 38. Examination 39. Experiment 40. Expert 41. Fact 42. Feature 43. Force 44. Formula 45. Fossil 46. Fraction 47. Friction 48. Function 49. Galaxy 50. Gas 51. Genetics 52. Geology 53. Geometry 54. Graduate 55. Gravity 56. Habitat 57. Hypothesis 58. Identify 59. Impact 60. Industry 61. Instrument 62. Intelligence 63. Investigate 64. Invisible 65. Laboratory 66. Layer 67. Liquid 68. Logic 69. Magnet 70. Mass 71. Material 72. Measurement 73. Mechanics 74. Method 75. Microscope 76. Molecule 77. Motion 78. Negative 79. Observation 80. Orbit 81. Organism 82. Oxygen 83. Particle 84. Pattern 85. Periodic 86. Phenomenon 87. Physics 88. Planet 89. Positive 90. Pressure 91. Probability 92. Process 93. Proof 94. Property 95. Prototype 96. Quantum 97. Radiation 98. Ratio 99. Reaction 100. ResearchAcademic 102. Achievement 103. Address 104. Administration 105. Advanced 106. Advice 107. Agenda 108. Agreement 109. Application 110. Appointment 111. Assembly 112. Assignment 113. Assistant 114. Attendance 115. Attention 116. Audience 117. Authority 118. Average 119. Award 120. Background 121. Behaviour (CA) 122. Benefit 123. Binder 124. Board 125. Briefcase 126. Bulletin 127. Cafeteria 128. Calendar 129. Campus 130. Candidate 131. Category 132. Certificate 133. Challenge 134. Chapter 135. Chart 136. Chorus 137. Classroom 138. Coach 139. Code 140. Collection 141. College 142. Committee 143. Community 144. Comparison 145. Competition 146. Complaint 147. Complex 148. Concentration 149. Concept 150. Conference 151. Conflict 152. Connection 153. Consequence 154. Construction 155. Consultant 156. Content 157. Contest 158. Contribution 159. Conversation 160. Cooperation 161. Correct 162. Counsel 163. Creative 164. Credit 165. Criterion 166. Culture 167. Curriculum 168. Decision 169. Definition 170. Degree 171. Delivery 172. Department 173. Description 174. Detail 175. Detention 176. Development 177. Device 178. Dictionary 179. Difficulty 180. Diploma 181. Direction 182. Director 183. Discipline 184. Discussion 185. Display 186. Distance 187. Distribution 188. Document 189. Education 190. Effort 191. Election 192. Elementary 193. Emergency 194. Emphasis 195. Encouragement 196. Encyclopedia 197. Equipment 198. Evaluation 199. Example 200. ExerciseAbilities 202. Acceptance 203. Admire 204. Adventure 205. Affection 206. Ambitious 207. Ancient 208. Anger 209. Anniversary 210. Announce 211. Anxious 212. Apology 213. Appearance 214. Appreciate 215. Argument 216. Arrogant 217. Ashamed 218. Attitude 219. Attractive 220. Awkward 221. Belief 222. Bravery 223. Brilliant 224. Calmness 225. Capability 226. Careful 227. Caring 228. Celebration 229. Character 230. Charity 231. Charming 232. Cheerful 233. Choice 234. Clever 235. Comfort 236. Communication 237. Compassion 238. Compliment 239. Confidence 240. Confusion 241. Considerate 242. Courage 243. Curiosity 244. Danger 245. Dedication 246. Defeated 247. Defiant 248. Delight 249. Dependable 250. Determination 251. Difference 252. Dignity 253. Disappoint 254. Disaster 255. Discomfort 256. Discovery 257. Dishonest 258. Distinction 259. Doubt 260. Eager 261. Earnest 262. Emotion 263. Empathy 264. Energetic 265. Enjoyment 266. Enthusiasm 267. Envy 268. Equality 269. Error 270. Event 271. Evil 272. Excellence 273. Excitement 274. Expectation 275. Experience 276. Expression 277. Failure 278. Fairness 279. Faithful 280. Famous 281. Fantasy 282. Fearless 283. Feeling 284. Fellowship 285. Fiction 286. Focus 287. Foolish 288. Forgive 289. Freedom 290. Friendship 291. Frustrated 292. Future 293. Generous 294. Gentle 295. Glorious 296. Grateful 297. Greed 298. Guilt 299. Happiness 300. HarmonyAccomplish 302. Acquire 303. Adapt 304. Adjust 305. Adopt 306. Advantage 307. Advertise 308. Affect 309. Agree 310. Alter 311. Amaze 312. Analyze 313. Appear 314. Apply 315. Approve 316. Arrange 317. Assemble 318. Assess 319. Assist 320. Assume 321. Astonish 322. Attach 323. Attempt 324. Attend 325. Attract 326. Avoid 327. Barely 328. Become 329. Believe 330. Belong 331. Borrow 332. Bother 333. Boundary 334. Briefly 335. Broaden 336. Build 337. Capture 338. Carefully 339. Celebrate 340. Central 341. Certainly 342. Change 343. Choose 344. Clarify 345. Collect 346. Combine 347. Comfort 348. Command 349. Commit 350. Compare 351. Compel 352. Compete 353. Complain 354. Complete 355. Comply 356. Compose 357. Concern 358. Conclude 359. Conduct 360. Confirm 361. Connect 362. Consider 363. Consist 364. Construct 365. Consult 366. Contain 367. Continue 368. Contrast 369. Control 370. Convert 371. Convince 372. Create 373. Criticize 374. Damage 375. Declare 376. Decline 377. Decrease 378. Defend 379. Define 380. Deliver 381. Demand 382. Demonstrate 383. Depend 384. Describe 385. Deserve 386. Design 387. Destroy 388. Detail 389. Detect 390. Determine 391. Develop 392. Devote 393. Differ 394. Direct 395. Disappear 396. Discover 397. Discuss 398. Display 399. Distinguish 400. DistributeActivity 402. Addition 403. Amount 404. Annual 405. Apartment 406. Appliance 407. Architecture 408. Area 409. Article 410. Audience 411. Available 412. Avenue 413. Average 414. Baggage 415. Bakery 416. Balance 417. Barrier 418. Battery 419. Beauty 420. Beverage 421. Boundary 422. Branch 423. Bridge 424. Budget 425. Business 426. Camera 427. Campaign 428. Canal 429. Capital 430. Captain 431. Career 432. Castle 433. Catalogue 434. Celebrity 435. Century 436. Ceremony 437. Challenge 438. Channel 439. Chapter 440. Character 441. Charity 442. Chemical 443. Choice 444. Cinema 445. Circle 446. Citizen 447. City 448. Civil 449. Classic 450. Client 451. Climate 452. Clinic 453. Clothing 454. Coast 455. Coffee 456. Coin 457. Colony 458. Colour (CA) 459. Column 460. Combination 461. Comfort 462. Command 463. Commerce 464. Commission 465. Committee 466. Common 467. Communication 468. Community 469. Company 470. Comparison 471. Competition 472. Complaint 473. Complex 474. Component 475. Computer 476. Concentration 477. Concept 478. Concern 479. Concert 480. Conclusion 481. Condition 482. Conference 483. Confidence 484. Conflict 485. Confusion 486. Connection 487. Consequence 488. Conservation 489. Consider 490. Consist 491. Constant 492. Construction 493. Consumer 494. Contact 495. Container 496. Content 497. Context 498. Continent 499. Continue 500. Contract`;

export const SHOP_ITEMS: ShopItem[] = [
  { id: "hat", label: "Maple Explorer Hat", cost: 20 },
  { id: "pet", label: "Beaver Companion", cost: 35 },
  { id: "boost", label: "Hint Compass (x3)", cost: 15 }
];

export const BASE_LEVELS: Level[] = [
  {
    id: "g3-spelling-colour",
    grade: 3,
    type: "spelling",
    word: "colour",
    prompt: "Spell the Canadian word for this clue: The sky has a bright blue ____. ",
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
    prompt: "Choose the correct Canadian spelling: We met at the town ____. ",
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
    id: "g3-relationships-synonym-happy",
    grade: 3,
    type: "word-relationships",
    word: "happy",
    prompt: "Choose the synonym of happy.",
    choices: ["sad", "joyful", "angry"],
    answer: "joyful",
    definition: "feeling good or glad",
    contextSentence: "The class felt joyful after the field trip.",
    hints: ["A synonym means nearly the same thing.", "Which word also means glad?"],
    coach: "Synonyms are words with similar meanings. happy and joyful are close in meaning."
  },
  {
    id: "g3-compound-snowman",
    grade: 3,
    type: "compound-word",
    word: "snowman",
    prompt: "Which two base words combine to make the compound word snowman?",
    choices: ["snow + man", "snow + men", "snows + man"],
    answer: "snow + man",
    definition: "a figure made of snow",
    contextSentence: "We built a snowman in the yard.",
    hints: ["Compound words join two real words.", "Think of the winter word and person word."],
    coach: "snowman is made from snow + man."
  },
  {
    id: "g3-context-forest-path",
    grade: 3,
    type: "context-clues",
    word: "path",
    prompt:
      "Use context clues: We followed the signs through the forest. The narrow _____ was covered with leaves and led us to the lake.",
    choices: ["path", "storm", "window"],
    answer: "path",
    definition: "a small track or way to walk",
    contextSentence: "The path led to the picnic area.",
    hints: ["What can be narrow and lead to a lake?", "Look for walking and direction clues."],
    coach: "Context clues like forest, signs, and led us show this is a walking path."
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
    prompt: "Fill in the blank: Leaving your lunch outside is ____. ",
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
  },
  {
    id: "g4-relationships-antonym-ancient",
    grade: 4,
    type: "word-relationships",
    word: "ancient",
    prompt: "Choose the antonym of ancient.",
    choices: ["old", "modern", "historic"],
    answer: "modern",
    definition: "from a very long time ago",
    contextSentence: "The museum has ancient tools and modern machines.",
    hints: ["An antonym means opposite.", "Which word means new/current?"],
    coach: "Opposites are antonyms: ancient and modern."
  },
  {
    id: "g4-compound-bookstore",
    grade: 4,
    type: "compound-word",
    word: "bookstore",
    prompt: "Pick the correct compound word for this clue: A shop where you buy novels.",
    choices: ["bookstore", "book house", "storebook"],
    answer: "bookstore",
    definition: "a store that sells books",
    contextSentence: "We visited the bookstore after school.",
    hints: ["Combine book and store into one word.", "Look for the standard spelling form."],
    coach: "book + store = bookstore."
  },
  {
    id: "g4-context-science-lab",
    grade: 4,
    type: "context-clues",
    word: "observe",
    prompt:
      "Use context clues: In science class, Mia wrote notes while she watched the caterpillar change. Her teacher said to _____ carefully and record each change.",
    choices: ["observe", "forget", "scatter"],
    answer: "observe",
    definition: "to watch closely",
    contextSentence: "Scientists observe details before making conclusions.",
    hints: ["Look for clues: watched, notes, record.", "Which word means watch carefully?"],
    coach: "The paragraph clues point to careful watching, so observe fits best."
  }
];

let customLevels: Level[] = loadCustomLevels();
const bulkWordLevels: Level[] = buildBulkWordLevels();

export function getLevels(): Level[] {
  return [...BASE_LEVELS, ...bulkWordLevels, ...customLevels];
}

export function getCustomLevelsCount(): number {
  return customLevels.length;
}

export function replaceCustomLevels(levels: Level[]): void {
  customLevels = dedupeById(levels);
  localStorage.setItem(CUSTOM_LEVELS_KEY, JSON.stringify(customLevels));
}

export function clearCustomLevels(): void {
  customLevels = [];
  localStorage.removeItem(CUSTOM_LEVELS_KEY);
}

function loadCustomLevels(): Level[] {
  try {
    const raw = localStorage.getItem(CUSTOM_LEVELS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return dedupeById(parsed.filter(isLevelLike).map(normalizeLevelLike));
  } catch {
    return [];
  }
}

function dedupeById(levels: Level[]): Level[] {
  const map = new Map<string, Level>();
  levels.forEach((level) => map.set(level.id, level));
  return Array.from(map.values());
}

function isLevelLike(value: unknown): value is Partial<Level> {
  return typeof value === "object" && value !== null;
}

function normalizeLevelLike(partial: Partial<Level>, index = 0): Level {
  const fallbackWord = String(partial.word ?? `word-${index + 1}`);
  const id = String(partial.id ?? `custom-${Date.now()}-${index}`);
  const grade = partial.grade === 4 ? 4 : 3;
  const validTypes: SkillType[] = [
    "spelling",
    "homophone",
    "prefix",
    "suffix",
    "multiple-meaning",
    "word-relationships",
    "compound-word",
    "context-clues"
  ];
  const type = validTypes.includes(partial.type as SkillType)
    ? (partial.type as SkillType)
    : "spelling";

  const choices = Array.isArray(partial.choices)
    ? partial.choices.map(String).filter(Boolean)
    : [fallbackWord, `${fallbackWord}x`, `${fallbackWord}y`];
  const answer = String(partial.answer ?? choices[0] ?? fallbackWord);
  const mergedChoices = choices.includes(answer) ? choices : [...choices, answer];
  const hints: [string, string] =
    Array.isArray(partial.hints) && partial.hints.length >= 2
      ? [String(partial.hints[0]), String(partial.hints[1])]
      : ["Look for context clues.", "Break the word into parts."];

  return {
    id,
    grade,
    type,
    word: fallbackWord,
    prompt: String(partial.prompt ?? `Choose the best option for ${fallbackWord}.`),
    choices: mergedChoices,
    answer,
    definition: String(partial.definition ?? "Teacher supplied word."),
    contextSentence: String(partial.contextSentence ?? "Use this word in a sentence."),
    hints,
    coach: String(partial.coach ?? "Think about meaning and sentence clues before retrying.")
  };
}

function buildBulkWordLevels(): Level[] {
  const tokens: string[] = [];
  const prefix = BULK_WORDS_RAW.split(/\s+\d+\.\s+/)[0]?.trim();
  if (prefix) {
    tokens.push(prefix);
  }

  const re = /\d+\.\s*([^0-9]+?)(?=(?:\s+\d+\.\s)|$)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(BULK_WORDS_RAW)) !== null) {
    tokens.push(match[1]);
  }

  const mapper: Record<string, string> = {
    ResearchAcademic: "Research",
    ExerciseAbilities: "Exercise",
    HarmonyAccomplish: "Harmony",
    DistributeActivity: "Distribute"
  };

  const seen = new Set<string>();
  const levels: Level[] = [];
  tokens.forEach((raw, index) => {
    const cleaned = sanitizeWord(raw, mapper);
    const key = cleaned.toLowerCase();
    if (!cleaned || seen.has(key)) {
      return;
    }
    seen.add(key);
    levels.push(makeSpellingLevel(cleaned, index + 1));
  });
  return levels;
}

function sanitizeWord(raw: string, mapper: Record<string, string>): string {
  const value = raw
    .replace(/\(CA\)/gi, "")
    .replace(/[^\w\s'-]/g, "")
    .trim();
  const mapped = mapper[value] ?? value;
  return mapped.replace(/\s+/g, " ").trim();
}

function makeSpellingLevel(word: string, n: number): Level {
  const answer = word;
  const wrong1 = makeTypo(answer, 1);
  const wrong2 = makeTypo(answer, 2);
  const choices = dedupeStringArray(shuffle([answer, wrong1, wrong2]));
  if (!choices.includes(answer)) {
    choices[0] = answer;
  }
  while (choices.length < 3) {
    choices.push(`${answer}${choices.length}`);
  }
  const sentence = makeAcademicSentence(answer, n);
  const blankSentence = sentence.replace(answer, "_____");

  return {
    id: `bulk-word-${n}-${answer.toLowerCase().replace(/\s+/g, "-")}`,
    grade: 4,
    type: "spelling",
    word: answer,
    prompt: `Complete the sentence with the correctly spelled word: ${blankSentence}`,
    choices,
    answer,
    definition: `Academic vocabulary word: ${answer}`,
    contextSentence: sentence,
    hints: ["Look closely at letter order.", "Watch for missing or extra letters."],
    coach: `Correct spelling: ${answer}.`
  };
}

function makeAcademicSentence(word: string, index: number): string {
  const templates = [
    `During class, we used ${word} to explain our thinking.`,
    `Our group wrote a clear ${word} in the project notebook.`,
    `The teacher asked us to check the ${word} before sharing.`,
    `In the lesson, ${word} helped us solve the problem.`,
    `For homework, we added ${word} to our science notes.`,
    `At school, the team discussed ${word} in detail.`
  ];
  return templates[index % templates.length];
}

function makeTypo(word: string, seed: number): string {
  const chars = word.split("");
  if (chars.length <= 4) {
    return `${word}${seed === 1 ? "e" : "s"}`;
  }

  if (seed === 1) {
    const i = Math.max(1, Math.floor(chars.length / 3));
    const c = chars[i];
    chars[i] = chars[i + 1] ?? chars[i];
    chars[i + 1] = c;
    return chars.join("");
  }

  const i = Math.max(1, Math.floor((chars.length * 2) / 3));
  chars.splice(i, 1);
  return chars.join("");
}

function dedupeStringArray(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  values.forEach((v) => {
    if (!seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  });
  return out;
}

function shuffle<T>(arr: T[]): T[] {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}
