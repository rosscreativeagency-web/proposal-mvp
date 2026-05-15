import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

export type NarrativeRole = "cover" | "divider" | "chapter";

export type ContentBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export type ProposalChapter = {
  id: string;
  marker: "SLIDE" | "DIVIDER";
  role: NarrativeRole;
  label: string;
  kicker?: string;
  title?: string;
  titleFa?: string;
  subtitle?: string;
  blocks: ContentBlock[];
};

const CONTENT_PATH = path.join(process.cwd(), "proposal-input/content.md");
const source = readFileSync(CONTENT_PATH, "utf8");

function parseHeader(line: string): { marker: "SLIDE" | "DIVIDER"; id: string; label: string } | null {
  const m = line.match(/^#\s+(SLIDE|DIVIDER)(?:\s+(\d+))?\s+—\s+(.+)$/);
  if (!m) return null;
  return {
    marker: m[1] as "SLIDE" | "DIVIDER",
    id: m[2] ?? `DIVIDER-${m[3].trim().toLowerCase().replace(/\s+/g, "-")}`,
    label: m[3].trim(),
  };
}

function normalize(lines: string[]): string[] {
  return lines.map((line) => line.replace(/\s+$/g, ""));
}

function parseBlocks(lines: string[]): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i += 1;
      continue;
    }
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      blocks.push({ type: "heading", level: 2, text: h2[1].trim() });
      i += 1;
      continue;
    }
    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) {
      blocks.push({ type: "heading", level: 3, text: h3[1].trim() });
      i += 1;
      continue;
    }
    if (/^-\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length) {
        const li = lines[i].trim();
        if (!/^-\s+/.test(li)) break;
        items.push(li.replace(/^-\s+/, "").trim());
        i += 1;
      }
      blocks.push({ type: "list", items });
      continue;
    }
    const para: string[] = [line];
    i += 1;
    while (i < lines.length) {
      const next = lines[i].trim();
      if (!next || /^#{2,3}\s+/.test(next) || /^-\s+/.test(next)) break;
      para.push(next);
      i += 1;
    }
    blocks.push({ type: "paragraph", text: para.join(" ") });
  }
  return blocks;
}

function determineRole(marker: "SLIDE" | "DIVIDER", label: string): NarrativeRole {
  if (marker === "DIVIDER") return "divider";
  if (/\bCOVER\b|\bENDING\b/i.test(label)) return "cover";
  return "chapter";
}

function parseChapters(markdown: string): ProposalChapter[] {
  const lines = normalize(markdown.split(/\r?\n/));
  const chapterIndexes = lines
    .map((line, index) => ({ line, index, header: parseHeader(line) }))
    .filter((x): x is { line: string; index: number; header: { marker: "SLIDE" | "DIVIDER"; id: string; label: string } } => Boolean(x.header));

  return chapterIndexes.map((entry, idx) => {
    const start = entry.index + 1;
    const end = idx + 1 < chapterIndexes.length ? chapterIndexes[idx + 1].index : lines.length;
    const chunk = lines.slice(start, end).filter((line) => line.trim() !== "---");
    const blocks = parseBlocks(chunk);
    const h2s = blocks.filter((b): b is Extract<ContentBlock, { type: "heading"; level: 2 }> => b.type === "heading" && b.level === 2);

    return {
      id: entry.header.id,
      marker: entry.header.marker,
      role: determineRole(entry.header.marker, entry.header.label),
      label: entry.header.label,
      kicker: h2s[0]?.text,
      title: h2s[1]?.text ?? h2s[0]?.text,
      titleFa: h2s[1]?.text && /[\u0600-\u06FF]/.test(h2s[1].text) ? h2s[1].text : undefined,
      subtitle: blocks.find((b) => b.type === "paragraph")?.text,
      blocks,
    };
  });
}

export const proposalChapters = parseChapters(source);

const chapterOrder = proposalChapters.map((c) => c.id);
const checksum = createHash("sha256").update(chapterOrder.join("|")).digest("hex");
const SNAPSHOT = {
  chapterCount: 47,
  chapterOrder,
  checksum,
};

const EXPECTED = {
  chapterCount: 47,
  chapterOrder: [
    "01","02","03","04","05","06","07","08","09","10","11","12","DIVIDER-introduction","14","15","16","17","18","19","20","21","22","23","24","25","DIVIDER-strategy","27","28","29","30","DIVIDER-awareness","32","33","DIVIDER-positioning","35","36","37","DIVIDER-advertising","39","40","DIVIDER-sell","42","43","44","45","46","47"
  ],
  checksum: "d8f9f6be7450f1a9d4f0f43f83093aad565dc3ef096db44f51c2ff607f4383f5",
};

if (
  SNAPSHOT.chapterCount !== EXPECTED.chapterCount ||
  SNAPSHOT.checksum !== EXPECTED.checksum ||
  SNAPSHOT.chapterOrder.join("|") !== EXPECTED.chapterOrder.join("|")
) {
  throw new Error(
    `proposal-input/content.md changed. Expected ${EXPECTED.chapterCount}/${EXPECTED.checksum} but got ${SNAPSHOT.chapterCount}/${SNAPSHOT.checksum}.`,
  );
}
