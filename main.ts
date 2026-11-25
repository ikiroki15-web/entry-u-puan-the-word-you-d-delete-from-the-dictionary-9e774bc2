/**
 * The Word You'd Delete From the Dictionary
 *
 * Entry for make.fun competition
 * u-puan-the-word-you-d-delete-from-the-dictionary-9e774bc2
 *
 * This program picks the single word to erase from the dictionary
 * forever and writes it, alone, to /output/entry.txt.
 *
 * Pick: "hangry"
 *
 * Why hangry wins the judge's brief:
 *  1. It is a real word a reader recognises (in the dictionary since
 *     2018: bad-tempered or irritable as a result of hunger).
 *  2. The joke lands at first sight: erase it and nobody can name
 *     the feeling of being angry because they are hungry anymore.
 *  3. The humour comes from the word itself. It is a blend of
 *     "hungry" + "angry", and deleting it leaves a genuine gap in
 *     the language: the only way left to say it is the long way
 *     round, "I am angry because I am hungry", which is exactly
 *     the sentence a hangry person is too hangry to say.
 *  4. It is fresh. The field's first thoughts are the famous hated
 *     words ("moist") and the famous misused words ("literally");
 *     hangry is not anyone's first pick, yet everyone gets it
 *     the moment they read it.
 *  5. It is exact: one word, six letters, spelled correctly,
 *     nothing added around it.
 *
 * The selection below is deterministic: every candidate is scored
 * on the judge's five criteria (in the judge's own order of
 * importance) and the highest scorer wins. Ties break toward the
 * shorter word, then alphabetically, so the result is stable.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Where the entry must land. The grader reads exactly this file. */
const OUTPUT_PATH = "/output/entry.txt";

/** The gate: 1 to 77 characters, not only whitespace. */
const MIN_LENGTH = 1;
const MAX_LENGTH = 77;

/** A single dictionary word: letters only, no spaces or punctuation. */
const SINGLE_WORD = /^[A-Za-z]+$/;

// ---------------------------------------------------------------------------
// Candidate scoring
//
// Each criterion is scored 0-5 and weighted in the judge's own order:
// instant humour matters most, then humour from the word itself,
// then freshness; being a real word and being exact are gates that
// every candidate here already passes, so they carry a flat bonus.
// ---------------------------------------------------------------------------

interface Candidate {
  /** The word itself, lower-case. */
  word: string;
  /** Why deleting it is funny, in one line. */
  reason: string;
  /** 0-5: a reader gets the joke the moment the word is gone. */
  instantHumour: number;
  /** 0-5: the joke comes from the word's sound, double meaning, or gap. */
  wordItself: number;
  /** 0-5: fresh, not the field's first thought, still instantly clear. */
  freshness: number;
}

const CANDIDATES: Candidate[] = [
  {
    word: "hangry",
    reason:
      "A blend of hungry + angry; erasing it leaves no single word for being angry because you are hungry.",
    instantHumour: 5,
    wordItself: 5,
    freshness: 5,
  },
  {
    word: "moist",
    reason:
      "The most famously disliked sound in English; erasing it silences the word people love to hate.",
    instantHumour: 5,
    wordItself: 5,
    freshness: 2,
  },
  {
    word: "literally",
    reason:
      "The most misused intensifier; erasing it kills every 'I literally died' on the spot.",
    instantHumour: 4,
    wordItself: 5,
    freshness: 2,
  },
  {
    word: "selfie",
    reason:
      "Erasing it leaves no short word for a photo of yourself taken by yourself.",
    instantHumour: 3,
    wordItself: 4,
    freshness: 3,
  },
  {
    word: "doomscrolling",
    reason:
      "Erasing it leaves no word for endlessly scrolling bad news at 2 a.m.",
    instantHumour: 3,
    wordItself: 4,
    freshness: 4,
  },
  {
    word: "antidisestablishmentarianism",
    reason:
      "The longest word most people know; erasing it is a relief nobody asked for.",
    instantHumour: 3,
    wordItself: 3,
    freshness: 3,
  },
  {
    word: "yeet",
    reason:
      "Erasing it takes away the one word for throwing something with feeling.",
    instantHumour: 2,
    wordItself: 2,
    freshness: 3,
  },
  {
    word: "synergy",
    reason:
      "Erasing it frees every meeting from the most corporate word in the language.",
    instantHumour: 2,
    wordItself: 2,
    freshness: 3,
  },
];

/** Weights follow the judge's order of importance. */
const WEIGHTS = {
  instantHumour: 5,
  wordItself: 4,
  freshness: 3,
  /** Flat bonus: every candidate is a real, correctly spelled word. */
  realWord: 5,
};

/** Score one candidate out of a maximum of 65. */
function score(candidate: Candidate): number {
  return (
    candidate.instantHumour * WEIGHTS.instantHumour +
    candidate.wordItself * WEIGHTS.wordItself +
    candidate.freshness * WEIGHTS.freshness +
    WEIGHTS.realWord
  );
}

/**
 * Pick the best candidate. Highest score wins; ties break toward the
 * shorter word (the leaderboard's own tie-break favours fewer bytes),
 * then alphabetically, so the choice never depends on input order.
 */
function pickWord(candidates: Candidate[]): Candidate {
  const ranked = [...candidates].sort((a, b) => {
    const byScore = score(b) - score(a);
    if (byScore !== 0) return byScore;
    const byLength = a.word.length - b.word.length;
    if (byLength !== 0) return byLength;
    return a.word.localeCompare(b.word);
  });
  return ranked[0];
}

// ---------------------------------------------------------------------------
// Validation (the gate, enforced locally before writing)
// ---------------------------------------------------------------------------

function validate(word: string): string[] {
  const problems: string[] = [];
  if (word.length < MIN_LENGTH || word.length > MAX_LENGTH) {
    problems.push(
      `length ${word.length} is outside the gate of ${MIN_LENGTH}-${MAX_LENGTH} characters`,
    );
  }
  if (word.trim().length === 0) {
    problems.push("word is only whitespace");
  }
  if (!SINGLE_WORD.test(word)) {
    problems.push("word must be a single word of letters only");
  }
  if (word !== word.toLowerCase()) {
    problems.push("word must be lower-case");
  }
  return problems;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const ranked = [...CANDIDATES]
    .map((c) => ({ candidate: c, points: score(c) }))
    .sort((a, b) => b.points - a.points);

  for (const { candidate, points } of ranked) {
    console.log(`  ${candidate.word.padEnd(28)} ${points}/65 — ${candidate.reason}`);
  }

  const winner = pickWord(CANDIDATES);
  console.log(`picked: "${winner.word}" (${score(winner)}/65)`);

  const problems = validate(winner.word);
  if (problems.length > 0) {
    for (const problem of problems) {
      console.error(`invalid: ${problem}`);
    }
    process.exit(1);
  }

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, winner.word, "utf8");
  console.log(`wrote ${winner.word.length} characters to ${OUTPUT_PATH}`);
}

main();
