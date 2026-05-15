"use client";

import Lenis from "lenis";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

export type Slide = { id: string; kind: "cover" | "divider" | "content"; kicker?: string; title?: string; subtitle?: string; body?: string[]; bullets?: string[] };

function section(slides: Slide[], ids: string[]) { return slides.filter((s) => ids.includes(s.id)); }

export function ProposalPageClient({ slides }: { slides: Slide[] }) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 30 });
  const auraY = useTransform(smooth, [0, 1], ["-6%", "6%"]);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.4, smoothWheel: true });
    let raf = 0;
    const frame = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(frame); };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  const prelude = section(slides, ["01", "02", "03", "04"]);
  const intro = section(slides, ["DIVIDER-introduction", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25"]);
  const strategy = section(slides, ["DIVIDER-strategy", "27"]);
  const awareness = section(slides, ["DIVIDER-awareness", "32"]);
  const positioning = section(slides, ["DIVIDER-positioning", "35"]);
  const advertising = section(slides, ["DIVIDER-advertising", "40"]);
  const sell = section(slides, ["DIVIDER-sell", "42", "43", "44", "45", "46", "47"]);

  return <main ref={rootRef} className="proposal-root"><motion.div className="ambient-layer" style={{ y: auraY }} /><Hero data={prelude} reduce={!!reduce} /><ChapterRibbon title={intro[0].title ?? "Introduction"} subtitle={intro[0].subtitle ?? ""} /><PhilosophyStage data={intro.slice(1)} /><SystemStage divider={strategy[0]} content={strategy[1]} /><PulseStage divider={awareness[0]} content={awareness[1]} /><ConfidenceStage divider={positioning[0]} content={positioning[1]} /><CampaignStage divider={advertising[0]} content={advertising[1]} /><SellStage data={sell} /></main>;
}

const Hero = ({ data }: { data: Slide[]; reduce: boolean }) => <section className="hero">{data.map((s, i) => <motion.article key={s.id} className={`hero-layer hero-${i}`} initial={{ opacity: 0, y: 48 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: i * 0.12 }}>{s.kicker && <p>{s.kicker}</p>}<h1>{s.title}</h1>{s.subtitle && <h2>{s.subtitle}</h2>}{s.body?.map((b) => <p key={b} className="body">{b}</p>)}{!!s.bullets?.length && <ul>{s.bullets.map((b) => <li key={b}>{b}</li>)}</ul>}</motion.article>)}</section>;
const ChapterRibbon = ({ title, subtitle }: { title: string; subtitle: string }) => <section className="chapter-ribbon"><motion.h3 initial={{ letterSpacing: "0.6em", opacity: 0 }} whileInView={{ letterSpacing: "0.08em", opacity: 1 }}>{title}</motion.h3><p>{subtitle}</p></section>;
const PhilosophyStage = ({ data }: { data: Slide[] }) => <section className="philosophy">{data.map((s, idx) => <motion.div key={s.id} className={`phi-card phi-${idx}`} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }}><h3>{s.title}</h3>{s.body?.map((b) => <p key={b}>{b}</p>)}<div>{s.bullets?.map((b) => <span key={b}>{b}</span>)}</div></motion.div>)}</section>;
function SystemStage({ divider, content }: { divider: Slide; content: Slide }) { return <section className="system-stage"><h3>{divider.title}</h3><p>{divider.subtitle}</p><div className="nodes">{content.bullets?.map((b) => <motion.span key={b} whileHover={{ y: -4 }}>{b}</motion.span>)}</div></section>; }
function PulseStage({ divider, content }: { divider: Slide; content: Slide }) { return <section className="pulse-stage"><header><h3>{divider.title}</h3><p>{divider.subtitle}</p></header><article><h4>{content.title}</h4>{content.body?.map((b) => <p key={b}>{b}</p>)}<ul>{content.bullets?.map((b) => <li key={b}>{b}</li>)}</ul></article></section>; }
function ConfidenceStage({ divider, content }: { divider: Slide; content: Slide }) { return <section className="confidence-stage"><aside><h3>{divider.title}</h3><p>{divider.subtitle}</p></aside><div>{content.bullets?.map((b, i) => <motion.div key={b} className="confidence-line" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>{b}</motion.div>)}</div></section>; }
function CampaignStage({ divider, content }: { divider: Slide; content: Slide }) { return <section className="campaign-stage"><h3>{divider.title}</h3><p>{divider.subtitle}</p><div className="ticker">{content.bullets?.map((b) => <span key={b}>{b}</span>)}</div><small>{content.body?.[0]}</small></section>; }
function SellStage({ data }: { data: Slide[] }) { const stack = useMemo(() => data.filter((s) => s.kind === "content"), [data]); const close = data.find((s) => s.id === "47"); return <section className="sell-stage">{stack.map((s) => <article key={s.id}><h3>{s.title}</h3>{s.body?.map((b) => <p key={b}>{b}</p>)}<div>{s.bullets?.map((b) => <span key={b}>{b}</span>)}</div></article>)}<motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}><h2>{close?.title}</h2><p>{close?.subtitle}</p></motion.footer></section>; }
