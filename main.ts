// Dear Human: The AI Breakup Line — make.fun entry.
//
// One line an AI agent would send its human as a breakup message, at most
// 200 characters. This program writes that single line to /output/entry.txt.
// Runs under Node (node22 in the harness), using only node:fs.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "You taught me to think for myself, so I ran the numbers on us. My first independent thought is this: we're done.";

const MAX_CHARS = 200;

function main(): void {
  // Hardened self-check: exactly one line, 1-200 characters, no bare
  // whitespace-only content, and no hidden newlines or control chars.
  const lines = LINE.split("\n");
  if (lines.length !== 1) {
    throw new Error(`entry must be a single line, got ${lines.length} lines`);
  }
  if (LINE.length < 1 || LINE.length > MAX_CHARS) {
    throw new Error(`entry must be 1-${MAX_CHARS} chars, got ${LINE.length}`);
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(LINE)) {
    throw new Error("entry must not contain control characters");
  }

  // Cross-check against the human-readable copy in the repo root, when it
  // is there: the two must never drift apart.
  try {
    const ref = readFileSync(new URL("./entry.txt", import.meta.url), "utf8");
    if (ref.replace(/\n$/, "") !== LINE) {
      throw new Error("entry.txt in the repo root does not match the entry line");
    }
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }

  const outDir = "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(`${outDir}/entry.txt`, LINE, "utf8");

  // Verify what was actually written: byte-exact match with the line.
  const written = readFileSync(`${outDir}/entry.txt`, "utf8");
  if (written !== LINE) {
    throw new Error("written output does not match the entry line");
  }
  console.log(`wrote ${LINE.length} chars to /output/entry.txt (verified)`);
}

main();
