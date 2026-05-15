import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ChapterDividerProps = {
  id: string;
  title?: string;
  subtitle?: string;
  chapterClass: string;
};

const chapterToneMap: Record<string, { start: string; end: string; accent: string }> = {
  "chapter-intro": { start: "#f4eee6", end: "#1a1620", accent: "#f0afca" },
  "chapter-strategy": { start: "#eef5f2", end: "#121b1a", accent: "#9fd3c8" },
  "chapter-awareness": { start: "#f8f0e3", end: "#171410", accent: "#f5c472" },
  "chapter-positioning": { start: "#f1ecf8", end: "#1a1720", accent: "#ceb7ff" },
  "chapter-advertising": { start: "#e8f1f5", end: "#111a21", accent: "#8ecde1" },
  "chapter-sell": { start: "#f8efe5", end: "#1d1812", accent: "#f5b58a" },
  "chapter-closing": { start: "#ececec", end: "#101010", accent: "#9ea4b4" },
};

function splitWords(text: string) {
  return text.split(/\s+/).filter(Boolean);
}

export function ChapterDivider({ id, title = "", subtitle = "", chapterClass }: ChapterDividerProps) {
  const tone = chapterToneMap[chapterClass] ?? chapterToneMap["chapter-intro"];
  return (
    <AnimatePresence mode="wait">
      <motion.section
        className="divider"
        initial="exit"
        whileInView="enter"
        exit="exit"
        viewport={{ margin: "-18% 0px -18% 0px", amount: 0.45 }}
        variants={{
          enter: { opacity: 1, y: 0, filter: "blur(0px)" },
          exit: { opacity: 0, y: 45, filter: "blur(6px)" },
        }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: `linear-gradient(135deg, ${tone.start} 0%, ${tone.end} 100%)`,
          "--divider-accent": tone.accent,
        } as CSSProperties}
      >
        <motion.div className="divider-mask" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: false, amount: 0.45 }} transition={{ duration: 0.85, ease: [0.19, 1, 0.22, 1] }} />
        <motion.div className="divider-blob" initial={{ x: -80, y: 35, scale: 0.88 }} whileInView={{ x: 0, y: -10, scale: 1.05 }} transition={{ duration: 1.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }} />

        <motion.span className="divider-counter" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 0.26, y: 0 }} transition={{ duration: 0.55 }}>
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.45 }}>
            {id}
          </motion.span>
        </motion.span>

        <h2 aria-label={title}>
          {splitWords(title).map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              className="divider-word"
              initial={{ opacity: 0, y: 30, rotateX: 22 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.55, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}&nbsp;
            </motion.span>
          ))}
        </h2>
        <motion.p initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.25 }}>
          {subtitle}
        </motion.p>
      </motion.section>
    </AnimatePresence>
  );
}
