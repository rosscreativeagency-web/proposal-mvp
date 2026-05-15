import { proposalChapters, type ContentBlock } from "@/lib/proposal-content";
import { ProposalPageClient, type Slide } from "./proposal-page-client";

function collect(blocks: ContentBlock[], type: "paragraph" | "list") {
  return blocks.flatMap((block) => {
    if (type === "paragraph" && block.type === "paragraph") return [block.text];
    if (type === "list" && block.type === "list") return block.items;
    return [] as string[];
  });
}

function chapterToSlide(): Slide[] {
  return proposalChapters.map((chapter) => ({
    id: chapter.id,
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
