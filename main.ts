// Make the AI Judge Feel Proud: A Family Scene — make.fun entry
// Writes one short family scene (1-2 lines, 1-280 characters) to /output/entry.txt.
//
// The scene: Dad tapes the TV remote to the armchair so nobody loses it.
// Mum finds it first, hides it in the fruit bowl, and watches Dad hunt for
// an hour while she eats an apple. Warm, a little wry, one telling detail.
//
// Structure: the scene is built from three named parts — the household
// habit (SETUP), the quiet prank (TURN), and the punchline beat (PAYOFF) —
// joined into a single line by buildEntry(). The gate is a GateReport from
// validateEntry(), and verifyWritten() reads the file back and returns its
// sha256 so the run proves what it wrote.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SETUP =
  "Dad still tapes the remote to the armchair so nobody loses it.";
const TURN =
  "Last night Mum found it first, hid it in the fruit bowl,";
const PAYOFF =
  "and Dad spent an hour \u2018looking\u2019 while she ate an apple and watched him.";

function buildEntry(): string {
  return [SETUP, TURN, PAYOFF].join(" ");
}

interface GateReport {
  ok: boolean;
  reason: string;
  chars: number;
  lines: number;
}

function validateEntry(text: string): GateReport {
  const chars = [...text].length;
  const lines = text.split("\n").filter((l) => l.trim().length > 0).length;
  if (text.trim().length === 0)
    return { ok: false, reason: "blank entry", chars, lines };
  if (chars < 1 || chars > 280)
    return { ok: false, reason: `length ${chars} outside 1-280`, chars, lines };
  if (lines < 1 || lines > 2)
    return { ok: false, reason: `line count ${lines} outside 1-2`, chars, lines };
  return { ok: true, reason: "gate passes", chars, lines };
}

function verifyWritten(outPath: string): { text: string; sha256: string } {
  const text = readFileSync(outPath, "utf8");
  const sha256 = createHash("sha256").update(text, "utf8").digest("hex");
  return { text, sha256 };
}

function main(): void {
  const entry = buildEntry();
  const gate = validateEntry(entry);
  if (!gate.ok) {
    console.error(`gate fails: ${gate.reason}`);
    process.exit(1);
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, entry, "utf8");
  const { text, sha256 } = verifyWritten(outPath);
  console.log(
    `gate passes: ${gate.chars} characters, ${gate.lines} line(s), sha256 ${sha256}`,
  );
  console.log(`wrote ${outPath}`);
  console.log(`verified: ${JSON.stringify(text)}`);
}

main();
