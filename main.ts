// The Word You'd Delete From the Dictionary
//
// Picks the single funniest word to erase from the dictionary forever and
// writes it, alone, to /output/entry.txt.
//
// Scoring follows the judge brief, most important first:
//   1. Speed: the joke lands the moment the word is gone, no caption needed.
//   2. Word-itself: the humour comes from the word's sound, double meanings,
//      or the gap its absence leaves in the language, not from shock alone.
//   3. Freshness: a pick the rest of the field would not think of first,
//      still instantly understood.
//
// Each candidate gets a 0-10 score per criterion, combined with weights
// that mirror the brief's order (speed heaviest, then word-itself, then
// freshness). The highest total wins; ties break toward the earlier-listed
// candidate, so the result is fully deterministic.

import { mkdirSync, writeFileSync } from "node:fs";

interface Candidate {
  word: string;
  // 0-10: how fast the joke lands at first sight.
  speed: number;
  // 0-10: how much of the humour comes from the word itself.
  fromWord: number;
  // 0-10: how fresh the pick is (not the field's first thought).
  freshness: number;
}

const WEIGHTS = { speed: 0.5, fromWord: 0.3, freshness: 0.2 };

const CANDIDATES: Candidate[] = [
  // A portmanteau everybody already uses: hungry + angry. The moment it is
  // gone, every "I'm hangry" sentence loses its only word — the joke is the
  // gap itself, and the word's sound does all the work.
  { word: "hangry", speed: 10, fromWord: 10, freshness: 8 },
  // Damp and unpleasant to say, but the joke is mostly the sound; deleting
  // it leaves no real hole in the language.
  { word: "moist", speed: 8, fromWord: 7, freshness: 5 },
  // A fun nonsense word, but deleting it costs nothing — nobody needs it.
  { word: "kerfuffle", speed: 7, fromWord: 8, freshness: 7 },
  // Slang with a short shelf life; the joke needs the internet as context.
  { word: "yeet", speed: 6, fromWord: 5, freshness: 4 },
  // Deleting a word people love to hate is satisfying, but the humour is
  // mostly pedantry, not the word itself.
  { word: "irregardless", speed: 7, fromWord: 6, freshness: 6 },
  // Overused intensifier; its deletion is a shrug, not a punchline.
  { word: "literally", speed: 6, fromWord: 5, freshness: 3 },
  // A bodily word whose humour leans on shock more than on the word.
  { word: "ointment", speed: 5, fromWord: 4, freshness: 6 },
  // Deleting it would be funny for a day, then everyone just says "very".
  { word: "very", speed: 4, fromWord: 3, freshness: 7 },
];

function score(c: Candidate): number {
  return (
    c.speed * WEIGHTS.speed +
    c.fromWord * WEIGHTS.fromWord +
    c.freshness * WEIGHTS.freshness
  );
}

// Guard the inputs before scoring: every candidate must be one real word
// and every criterion score must sit inside 0-10, so a typo in the table
// fails loudly instead of silently picking a broken entry.
for (const c of CANDIDATES) {
  if (!/^[A-Za-z]+$/.test(c.word)) {
    throw new Error(`candidate is not a single word: ${JSON.stringify(c.word)}`);
  }
  for (const [name, value] of [
    ["speed", c.speed],
    ["fromWord", c.fromWord],
    ["freshness", c.freshness],
  ] as const) {
    if (!Number.isFinite(value) || value < 0 || value > 10) {
      throw new Error(`candidate ${c.word}: ${name} out of range 0-10: ${value}`);
    }
  }
}

function pickWinner(candidates: Candidate[]): Candidate {
  let best = candidates[0];
  for (const c of candidates.slice(1)) {
    if (score(c) > score(best)) best = c;
  }
  return best;
}

const winner = pickWinner(CANDIDATES);

// The gate allows 1-77 UTF-8 characters, not only whitespace: one word,
// spelled correctly, nothing added around it — no trailing newline.
if (!/^[A-Za-z]+$/.test(winner.word)) {
  throw new Error(`winner is not a single word: ${JSON.stringify(winner.word)}`);
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", winner.word, "utf8");
console.log(`winner: ${winner.word} (score ${score(winner).toFixed(2)})`);
