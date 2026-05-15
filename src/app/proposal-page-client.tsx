"use client";

import Lenis from "lenis";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo } from "react";
import type { SceneType } from "./page";

export type SceneSlide = {
  id: string;
  scene: SceneType;
  kind: "cover" | "divider" | "content";
  kicker?: string;
  title?: string;
  subtitle?: string;
  body?: string[];
  bullets?: string[];
};

const byScene = (slides: SceneSlide[], scene: SceneType) => slides.filter((slide) => slide.scene === scene);
const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay } });

export function ProposalPageClient({ slides }: { slides: SceneSlide[] }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 30 });
  const auraY = useTransform(smooth, [0, 1], ["-6%", "6%"]);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.4, smoothWheel: true });
    let raf = 0;
    const frame = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <main className="proposal-root">
      <motion.div className="ambient-layer" style={{ y: auraY }} />
      <HeroScene data={byScene(slides, "hero")} reduce={!!reduce} />
      <IntroductionScene data={byScene(slides, "introduction")} />
      <StrategyScene data={byScene(slides, "strategy")} />
      <ResearchScene data={byScene(slides, "research")} />
      <AudienceScene data={byScene(slides, "audience")} />
      <AwarenessScene data={byScene(slides, "awareness")} />
      <PositioningScene data={byScene(slides, "positioning")} />
      <AdvertisingScene data={byScene(slides, "advertising")} />
      <SellScene data={byScene(slides, "sell")} />
      <BudgetScene data={byScene(slides, "budget")} />
    </main>
  );
}

const HeroScene = ({ data, reduce }: { data: SceneSlide[]; reduce: boolean }) => (
  <section className="hero-scene">{data.map((slide, index) => <motion.article key={slide.id} className="hero-panel" {...fadeUp(reduce ? 0 : index * 0.12)}><p>{slide.kicker}</p><h1>{slide.title}</h1>{slide.subtitle && <h2>{slide.subtitle}</h2>}{slide.body?.map((entry) => <p key={entry}>{entry}</p>)}</motion.article>)}</section>
);

const IntroductionScene = ({ data }: { data: SceneSlide[] }) => (
  <section className="introduction-scene">
    <header><h3>{data[0]?.title}</h3><p>{data[0]?.subtitle}</p></header>
    <div className="intro-grid">{data.slice(1).map((slide) => <motion.article key={slide.id} className="intro-fragment" {...fadeUp()}><h4>{slide.title}</h4>{slide.body?.[0] && <p>{slide.body[0]}</p>}</motion.article>)}</div>
  </section>
);

const StrategyScene = ({ data }: { data: SceneSlide[] }) => {
  const divider = data.find((slide) => slide.kind === "divider");
  const narrative = data.filter((slide) => slide.kind === "content");
  return <section className="strategy-scene"><header><h3>{divider?.title}</h3><p>{divider?.subtitle}</p></header>{narrative.map((slide) => <motion.article key={slide.id} className="strategy-strip" {...fadeUp()}><h4>{slide.title}</h4>{slide.body?.map((entry) => <p key={entry}>{entry}</p>)}<ul>{slide.bullets?.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></motion.article>)}</section>;
};

const ResearchScene = ({ data }: { data: SceneSlide[] }) => {
  const slide = data[0];
  return <section className="research-scene"><motion.div className="research-core" {...fadeUp()}><h3>{slide?.title}</h3>{slide?.body?.map((entry) => <p key={entry}>{entry}</p>)}</motion.div><aside>{slide?.bullets?.map((bullet, idx) => <motion.div key={bullet} className="research-point" {...fadeUp(idx * 0.08)}>{bullet}</motion.div>)}</aside></section>;
};

const AudienceScene = ({ data }: { data: SceneSlide[] }) => {
  const slide = data[0];
  return <section className="audience-scene"><h3>{slide?.title}</h3><p>{slide?.body?.[0]}</p><div>{slide?.bullets?.map((bullet) => <motion.span key={bullet} whileInView={{ scale: [0.95, 1] }}>{bullet}</motion.span>)}</div></section>;
};

const AwarenessScene = ({ data }: { data: SceneSlide[] }) => {
  const [divider, ...content] = data;
  return <section className="awareness-scene"><motion.header {...fadeUp()}><h3>{divider?.title}</h3><p>{divider?.subtitle}</p></motion.header><div className="awareness-columns">{content.map((slide) => <article key={slide.id}><h4>{slide.title}</h4>{slide.bullets?.map((bullet) => <p key={bullet}>{bullet}</p>)}</article>)}</div></section>;
};

const PositioningScene = ({ data }: { data: SceneSlide[] }) => {
  const [divider, ...content] = data;
  return <section className="positioning-scene"><h3>{divider?.title}</h3><p>{divider?.subtitle}</p><ol>{content.map((slide, idx) => <motion.li key={slide.id} {...fadeUp(idx * 0.1)}><h4>{slide.title}</h4><ul>{slide.bullets?.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></motion.li>)}</ol></section>;
};

const AdvertisingScene = ({ data }: { data: SceneSlide[] }) => {
  const [divider, ...content] = data;
  return <section className="advertising-scene"><h3>{divider?.title}</h3><p>{divider?.subtitle}</p>{content.map((slide) => <motion.article key={slide.id} className="ad-band" {...fadeUp()}><h4>{slide.title}</h4><div>{slide.bullets?.map((bullet) => <span key={bullet}>{bullet}</span>)}</div></motion.article>)}</section>;
};

const SellScene = ({ data }: { data: SceneSlide[] }) => {
  const close = data.find((slide) => slide.id === "47");
  const stack = useMemo(() => data.filter((slide) => slide.kind === "content" && slide.id !== "47"), [data]);
  return <section className="sell-scene"><div className="sell-flow">{stack.map((slide) => <article key={slide.id}><h4>{slide.title}</h4>{slide.bullets?.map((bullet) => <p key={bullet}>{bullet}</p>)}</article>)}</div><motion.footer {...fadeUp()}><h2>{close?.title}</h2><p>{close?.subtitle}</p></motion.footer></section>;
};

const BudgetScene = ({ data }: { data: SceneSlide[] }) => {
  const slide = data[0];
  return <section className="budget-scene"><h3>{slide?.title}</h3><p>{slide?.subtitle}</p><div className="budget-kpis">{slide?.bullets?.map((bullet) => <span key={bullet}>{bullet}</span>)}</div>{slide?.body?.slice(0, 2).map((entry) => <p key={entry}>{entry}</p>)}</section>;
};
