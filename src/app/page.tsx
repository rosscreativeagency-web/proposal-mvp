import { proposalChapters, type ContentBlock } from "@/lib/proposal-content";
import { ProposalPageClient, type SceneSlide } from "./proposal-page-client";

function collect(blocks: ContentBlock[], type: "paragraph" | "list") {
  return blocks.flatMap((block) => {
    if (type === "paragraph" && block.type === "paragraph") return [block.text];
    if (type === "list" && block.type === "list") return block.items;
    return [] as string[];
  });
}

export type SceneType =
  | "hero"
  | "introduction"
  | "strategy"
  | "research"
  | "audience"
  | "awareness"
  | "positioning"
  | "advertising"
  | "sell"
  | "budget";

const SCENE_REGISTRY: Record<string, SceneType> = {
  "01": "hero",
  "02": "hero",
  "03": "hero",
  "04": "hero",
  "DIVIDER-introduction": "introduction",
  "14": "introduction",
  "15": "introduction",
  "16": "introduction",
  "17": "introduction",
  "18": "introduction",
  "19": "introduction",
  "20": "introduction",
  "21": "introduction",
  "22": "introduction",
  "23": "introduction",
  "24": "introduction",
  "25": "introduction",
  "DIVIDER-strategy": "strategy",
  "27": "strategy",
  "28": "research",
  "29": "audience",
  "30": "strategy",
  "DIVIDER-awareness": "awareness",
  "32": "awareness",
  "33": "awareness",
  "DIVIDER-positioning": "positioning",
  "35": "positioning",
  "36": "positioning",
  "37": "positioning",
  "DIVIDER-advertising": "advertising",
  "39": "advertising",
  "40": "advertising",
  "DIVIDER-sell": "sell",
  "42": "sell",
  "43": "sell",
  "44": "sell",
  "45": "sell",
  "46": "budget",
  "47": "sell",
};

function chapterToSlide(): SceneSlide[] {
  return proposalChapters.map((chapter) => ({
    id: chapter.id,
    scene: SCENE_REGISTRY[chapter.id] ?? "introduction",
    kind: chapter.role === "divider" ? "divider" : chapter.role === "cover" ? "cover" : "content",
    kicker: chapter.kicker,
    title: chapter.title,
    subtitle: chapter.titleFa ?? chapter.subtitle,
    body: collect(chapter.blocks, "paragraph"),
    bullets: collect(chapter.blocks, "list"),
  }));
}

export default function Page() {
  return <ProposalPageClient slides={chapterToSlide()} />;
}
