"use client";

import Lenis from "lenis";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

type Slide = { id: string; kind: "cover" | "divider" | "content"; kicker?: string; title?: string; subtitle?: string; body?: string[]; bullets?: string[]; placeholder?: string };

const slides: Slide[] = [
  { id: "01", kind: "cover", kicker: "SPM", title: "Proposal Mardom Hub", subtitle: "SPM Project · Feb - 2026", placeholder: "تصویر پیشنهادی: کاور سینمایی برند SPM" },
  { id: "02", kind: "content", kicker: "OurHolding", title: "Mardom Hub", bullets: ["Communication Agency", "Entertainment", "Branding Services", "Media Services", "Marketing Services in: Sport & Wellness / Care & Beauty"], placeholder: "تصویر پیشنهادی: نمای کلی هلدینگ" },
  { id: "03", kind: "content", kicker: "OurBranches", title: "Mardom Hub", bullets: ["Iran: تهران، نیاوران، خیابان فیضیه، پلاک ۴، زنگ اول", "Iran: تهران، خیابان شریعتی، کوچه سجاد، پلاک ۷۹، واحد ۳", "UAE: Office 2714, Churchill Tower, Business Bay", "Turkey: Maslak Mah. Maslak Meydan Sk... Istanbul"], placeholder: "نقشه پیشنهادی: نقاط جغرافیایی شعب" },
  { id: "04", kind: "content", kicker: "OurServices", title: "Overview", body: ["تحقیقات برند · طراحی هویت برند · ارتباطات برند · دیجیتال مارکتینگ · برنامه‌ریزی رسانه · فروش آنلاین"], bullets: ["مطالعات بازار و روندها / مخاطب / رقبا", "استراتژی و هویت بصری/کلامی/دیجیتال", "تجربه برند، کمپین، محتوا", "SEO, Social, Google Ads, VOD", "Tech, Decoration, Pet, Sport", "MarketPlace Growth / Store Management"], placeholder: "دیاگرام پیشنهادی: ماتریس خدمات" },
  { id: "13", kind: "divider", title: "Introduction", subtitle: "مقدمه" },
  { id: "14", kind: "content", title: "ROSS Philosophy", body: ["انسان از خاک برخاسته؛ رس، نماد پیوند ماده و معناست.", "رس نرم و انعطاف‌پذیر است؛ مانند ذهن خلاق انسان.", "در رس، تداوم، جاودانگی و انسانیت نهفته است."], bullets: ["الهام‌بخش", "پویا", "اصیل", "ریشه‌دارترین", "منعطف", "انسان‌محور", "تعامل‌گرا", "مشتاق"] },
  { id: "15", kind: "content", title: "Human Meaningful Advertising", body: ["ما اعتقاد داریم تبلیغات باید انسانی‌تر و معنادارتر باشد.", "استفاده نابجا از فناوری منجر به محتوای سطحی می‌شود.", "هدف ما: ارتباطی سالم، انسانی و اثرگذار با مخاطب."] },
  { id: "20", kind: "content", title: "چرا این پروژه؟", body: ["رشد SPM در بازار مواد شوینده تخصصی دستگاه قهوه.", "نیاز به آموزش، آگاهی و اعتمادسازی."], bullets: ["محیط‌های حرفه‌ای مانند کافه‌ها", "مصرف‌کنندگان خانگی"] },
  { id: "21", kind: "content", title: "SPM چیست؟", body: ["برند تخصصی تولید مواد شوینده دستگاه قهوه و آسیاب."], bullets: ["تنها برند ایرانی دارای سیب سلامت", "کیفیت قابل رقابت با خارجی", "قیمت اقتصادی‌تر", "افزایش عمر دستگاه"] },
  { id: "26", kind: "divider", title: "Strategy", subtitle: "استراتژی" },
  { id: "27", kind: "content", title: "SPM Strategy", body: ["مسیر تصمیم‌سازی دقیق پروژه"], bullets: ["تحقیقات بازار", "تحلیل مخاطب", "تدوین استراتژی ارتباطی"] },
  { id: "31", kind: "divider", title: "Awareness", subtitle: "آگاهی" },
  { id: "32", kind: "content", title: "SPM Awareness", body: ["برای رشد برند، ابتدا باید بازار نسبت به مسئله اصلی آگاه شود."], bullets: ["PR", "Social Media", "Digital"] },
  { id: "34", kind: "divider", title: "Positioning", subtitle: "جایگاه‌سازی" },
  { id: "35", kind: "content", title: "Positioning", bullets: ["SPM انتخاب تخصصی", "کیفیت رقابتی", "قیمت اقتصادی‌تر", "اعتمادپذیری برند داخلی"] },
  { id: "38", kind: "divider", title: "Advertising", subtitle: "تبلیغات" },
  { id: "40", kind: "content", title: "Suggested Media Channels", bullets: ["SnappFood", "Digikala", "SnappMarket", "DigiMarket", "Okala", "In-store Lightbox Media"], body: ["هدف: افزایش دیده‌شدن، اتصال پیام به خرید، افزایش آگاهی و آمادگی فروش."] },
  { id: "41", kind: "divider", title: "Sell", subtitle: "فروش" },
  { id: "42", kind: "content", title: "Sell", bullets: ["POS", "Bundle / Sampling", "Promotion"], body: ["فعال‌سازی فروش و تبدیل مخاطب آگاه به خریدار."] },
  { id: "46", kind: "content", title: "Budgeting", bullets: ["Strategy → View / Engagement", "Awareness → View / Page View", "Positioning → CTR / View", "Advertising → Impression / View", "Sell → Click / Conversion", "KPI: View, Page View, CTR, Impression, Click, Conversion", "نمونه: 110000 Click · 250000 View · 1.2M Impression"] },
  { id: "47", kind: "cover", title: "Thanks", subtitle: "For watching · SPM Project · Feb - 2026" },
];

function section(ids: string[]) { return slides.filter((s) => ids.includes(s.id)); }

export default function Page() {
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

  const prelude = section(["01", "02", "03", "04"]);
  const intro = section(["13", "14", "15", "20", "21"]);
  const strategy = section(["26", "27"]);
  const awareness = section(["31", "32"]);
  const positioning = section(["34", "35"]);
  const advertising = section(["38", "40"]);
  const sell = section(["41", "42", "46", "47"]);

  return (
    <main ref={rootRef} className="proposal-root">
      <motion.div className="ambient-layer" style={{ y: auraY }} />
      <Hero data={prelude} reduce={!!reduce} />
      <ChapterRibbon title={intro[0].title ?? "Introduction"} subtitle={intro[0].subtitle ?? ""} />
      <PhilosophyStage data={intro.slice(1)} />
      <SystemStage divider={strategy[0]} content={strategy[1]} />
      <PulseStage divider={awareness[0]} content={awareness[1]} />
      <ConfidenceStage divider={positioning[0]} content={positioning[1]} />
      <CampaignStage divider={advertising[0]} content={advertising[1]} />
      <SellStage data={sell} />
    </main>
  );
}

const Hero = ({ data }: { data: Slide[]; reduce: boolean }) => <section className="hero">{data.map((s, i) => <motion.article key={s.id} className={`hero-layer hero-${i}`} initial={{ opacity: 0, y: 48 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: i * 0.12 }}>{s.kicker && <p>{s.kicker}</p>}<h1>{s.title}</h1>{s.subtitle && <h2>{s.subtitle}</h2>}{s.body?.map((b) => <p key={b} className="body">{b}</p>)}{!!s.bullets?.length && <ul>{s.bullets.map((b) => <li key={b}>{b}</li>)}</ul>}</motion.article>)}</section>;

const ChapterRibbon = ({ title, subtitle }: { title: string; subtitle: string }) => <section className="chapter-ribbon"><motion.h3 initial={{ letterSpacing: "0.6em", opacity: 0 }} whileInView={{ letterSpacing: "0.08em", opacity: 1 }}>{title}</motion.h3><p>{subtitle}</p></section>;

const PhilosophyStage = ({ data }: { data: Slide[] }) => <section className="philosophy">{data.map((s, idx) => <motion.div key={s.id} className={`phi-card phi-${idx}`} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }}><h3>{s.title}</h3>{s.body?.map((b) => <p key={b}>{b}</p>)}<div>{s.bullets?.map((b) => <span key={b}>{b}</span>)}</div></motion.div>)}</section>;

function SystemStage({ divider, content }: { divider: Slide; content: Slide }) { return <section className="system-stage"><h3>{divider.title}</h3><p>{divider.subtitle}</p><div className="nodes">{content.bullets?.map((b) => <motion.span key={b} whileHover={{ y: -4 }}>{b}</motion.span>)}</div></section>; }
function PulseStage({ divider, content }: { divider: Slide; content: Slide }) { return <section className="pulse-stage"><header><h3>{divider.title}</h3><p>{divider.subtitle}</p></header><article><h4>{content.title}</h4>{content.body?.map((b) => <p key={b}>{b}</p>)}<ul>{content.bullets?.map((b) => <li key={b}>{b}</li>)}</ul></article></section>; }
function ConfidenceStage({ divider, content }: { divider: Slide; content: Slide }) { return <section className="confidence-stage"><aside><h3>{divider.title}</h3><p>{divider.subtitle}</p></aside><div>{content.bullets?.map((b, i) => <motion.div key={b} className="confidence-line" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>{b}</motion.div>)}</div></section>; }
function CampaignStage({ divider, content }: { divider: Slide; content: Slide }) { return <section className="campaign-stage"><h3>{divider.title}</h3><p>{divider.subtitle}</p><div className="ticker">{content.bullets?.map((b) => <span key={b}>{b}</span>)}</div><small>{content.body?.[0]}</small></section>; }
function SellStage({ data }: { data: Slide[] }) {
  const stack = useMemo(() => data.filter((s) => s.kind === "content"), [data]);
  const close = data.find((s) => s.id === "47");
  return <section className="sell-stage">{stack.map((s) => <article key={s.id}><h3>{s.title}</h3>{s.body?.map((b) => <p key={b}>{b}</p>)}<div>{s.bullets?.map((b) => <span key={b}>{b}</span>)}</div></article>)}<motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}><h2>{close?.title}</h2><p>{close?.subtitle}</p></motion.footer></section>;
}
