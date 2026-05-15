"use client";

import Lenis from "lenis";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo } from "react";
import {
  ArrowUpRight,
  CircleDot,
  Compass,
  Gem,
  Layers,
  Orbit,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react";

type Slide = {
  id: string;
  kind: "cover" | "divider" | "content";
  layout?:
    | "opening-hero"
    | "editorial-statement"
    | "service-constellation"
    | "audience-split"
    | "strategy-framework"
    | "awareness-orbit"
    | "positioning-comparison"
    | "media-landscape"
    | "sell-flow"
    | "budget-matrix"
    | "cinematic-closing";
  kicker?: string;
  title?: string;
  subtitle?: string;
  body?: string[];
  bullets?: string[];
  placeholder?: string;
};

const slides: Slide[] = [
  { id: "01", kind: "cover", kicker: "SPM", title: "Proposal Mardom Hub", subtitle: "SPM Project · Feb - 2026", placeholder: "تصویر پیشنهادی: کاور سینمایی برند SPM" },
  { id: "02", kind: "content", kicker: "OurHolding", title: "Mardom Hub", bullets: ["Communication Agency", "Entertainment", "Branding Services", "Media Services", "Marketing Services in: Sport & Wellness / Care & Beauty"], placeholder: "تصویر پیشنهادی: نمای کلی هلدینگ" },
  { id: "03", kind: "content", kicker: "OurBranches", title: "Mardom Hub", bullets: ["Iran: تهران، نیاوران، خیابان فیضیه، پلاک ۴، زنگ اول", "Iran: تهران، خیابان شریعتی، کوچه سجاد، پلاک ۷۹، واحد ۳", "UAE: Office 2714, Churchill Tower, Business Bay", "Turkey: Maslak Mah. Maslak Meydan Sk... Istanbul"], placeholder: "نقشه پیشنهادی: نقاط جغرافیایی شعب" },
  { id: "04", kind: "content", kicker: "OurServices", title: "Overview", body: ["تحقیقات برند · طراحی هویت برند · ارتباطات برند · دیجیتال مارکتینگ · برنامه‌ریزی رسانه · فروش آنلاین"], bullets: ["مطالعات بازار و روندها / مخاطب / رقبا", "استراتژی و هویت بصری/کلامی/دیجیتال", "تجربه برند، کمپین، محتوا", "SEO, Social, Google Ads, VOD", "Tech, Decoration, Pet, Sport", "MarketPlace Growth / Store Management"], placeholder: "دیاگرام پیشنهادی: ماتریس خدمات" },
  { id: "05", kind: "content", title: "تحقیقات برند", body: ["تحقیقات برند نقطه شروع هر حرکت مؤثر برای شناخت بازار، مخاطب و فضای رقابتی است.", "استخراج تصویر دقیق از موقعیت فعلی برند و فرصت‌های رشد."], bullets: ["مطالعه بازار و روندها", "مطالعه مخاطبان", "تحلیل رقبا", "مطالعه سازمان", "ارزیابی فروشگاه‌های خرده‌فروشی"], placeholder: "آیکون پیشنهادی: تحقیقات بازار" },
  { id: "06", kind: "content", title: "طراحی هویت برند", body: ["طراحی هویت برند بر اساس شناخت دقیق برند، مخاطب و بازار انجام می‌شود."], bullets: ["استراتژی برند", "هویت بصری", "هویت کلامی", "نام‌گذاری و شعار", "هویت دیجیتال", "هویت حسی"], placeholder: "تصویر پیشنهادی: کیت هویت برند" },
  { id: "07", kind: "content", title: "ارتباطات برند", body: ["ساختن رابطه‌ای پایدار، هدفمند و قابل اعتماد میان برند و مخاطب."], bullets: ["تجربه برند", "نگهبانی برند", "تجربه مشتری", "تجربه کارکنان", "طراحی کمپین", "طراحی تبلیغات", "طراحی محتوا", "هدایت هنری", "تقویم محتوایی"], placeholder: "موکاپ پیشنهادی: اکوسیستم ارتباطات برند" },
  { id: "08", kind: "content", title: "دیجیتال مارکتینگ", body: ["مسیر رشد برند بدون برنامه‌ریزی دقیق دیجیتال کامل نمی‌شود.", "هدف: دیده شدن، تعامل، تبدیل."], bullets: ["پیاده‌سازی مارکتینگ", "خلاقیت و تولید محتوا", "اسپانسرینگ", "طراحی وب و اپلیکیشن", "مدیریت شبکه‌های اجتماعی", "SEO", "PR دیجیتال / VOD", "Google Ads"], placeholder: "تصویر پیشنهادی: صحنه دیجیتال مارکتینگ" },
  { id: "09", kind: "content", title: "برنامه‌ریزی رسانه", body: ["انتخاب دقیق کانال‌ها و زمان‌بندی مناسب برای نمایش پیام برند."], bullets: ["استراتژی رسانه‌ای", "ترکیب کانال‌ها", "تخصیص بودجه", "زمان‌بندی کمپین", "بهینه‌سازی عملکرد"], placeholder: "دیاگرام پیشنهادی: مسیر رسانه" },
  { id: "10", kind: "content", title: "فروش آنلاین", body: ["فروش آنلاین تنها نمایش محصول نیست؛ طراحی مسیر تبدیل است."], bullets: ["رشد مارکت‌پلیس", "مدیریت فروشگاه برند", "تجارت آنلاین جهانی", "مدیریت اعتبار آنلاین"], placeholder: "موکاپ پیشنهادی: فروشگاه آنلاین" },
  { id: "11", kind: "content", title: "OurClients", body: ["نمایش لوگوی مشتریان و برندهای همکار"], placeholder: "لوگو وال پیشنهادی: مشتریان و همکاران" },
  { id: "12", kind: "cover", kicker: "SPM", title: "Marketing Proposal", subtitle: "SPM Project · Feb - 2026", placeholder: "تصویر پیشنهادی: کاور فاز مارکتینگ" },
  { id: "13", kind: "divider", title: "Introduction", subtitle: "مقدمه" },
  { id: "14", kind: "content", title: "ROSS Philosophy", body: ["انسان از خاک برخاسته؛ رس، نماد پیوند ماده و معناست.", "رس نرم و انعطاف‌پذیر است؛ مانند ذهن خلاق انسان.", "در رس، تداوم، جاودانگی و انسانیت نهفته است."], bullets: ["الهام‌بخش", "پویا", "اصیل", "ریشه‌دارترین", "منعطف", "انسان‌محور", "تعامل‌گرا", "مشتاق"], placeholder: "تصویر پیشنهادی: فرم ارگانیک الهام‌گرفته از رس" },
  { id: "15", kind: "content", title: "Human Meaningful Advertising", body: ["ما اعتقاد داریم تبلیغات باید انسانی‌تر و معنادارتر باشد.", "استفاده نابجا از فناوری منجر به محتوای سطحی می‌شود.", "هدف ما: ارتباطی سالم، انسانی و اثرگذار با مخاطب."], placeholder: "تصویر پیشنهادی: انسان و رسانه" },
  { id: "16", kind: "content", title: "افتخارات و تجربه‌ها", bullets: ["برنده دو جایزه Gerety فرانسه", "برنده جشنواره نیویورک", "برنده Bowery", "تجربه اجرای کمپین‌های تبلیغاتی", "همکاری با برندهای متنوع"], placeholder: "مدال پیشنهادی: افتخارات" },
  { id: "17", kind: "content", title: "Gerety Award", body: ["برنده جایزه بین‌المللی از جشنواره Gerety فرانسه"], placeholder: "تصویر پیشنهادی: مستند جایزه Gerety" },
  { id: "18", kind: "content", title: "New York / Bowery", body: ["برنده مقام برنز از جشنواره نیویورک / Bowery Awards"], placeholder: "تصویر پیشنهادی: مستند جایزه Bowery" },
  { id: "19", kind: "content", title: "معرفی پروژه", body: ["هدف: طراحی رویکرد متفاوت برای افزایش فروش و جایگاه تازه SPM.", "تمرکز: شناخت بازار، مخاطب و مسیرهای رشد."], placeholder: "دیاگرام پیشنهادی: معرفی پروژه" },
  { id: "20", kind: "content", title: "چرا این پروژه؟", body: ["رشد SPM در بازار مواد شوینده تخصصی دستگاه قهوه.", "نیاز به آموزش، آگاهی و اعتمادسازی."], bullets: ["محیط‌های حرفه‌ای مانند کافه‌ها", "مصرف‌کنندگان خانگی"], placeholder: "تصویر پیشنهادی: کافه و خانه" },
  { id: "21", kind: "content", title: "SPM چیست؟", body: ["برند تخصصی تولید مواد شوینده دستگاه قهوه و آسیاب."], bullets: ["تنها برند ایرانی دارای سیب سلامت", "کیفیت قابل رقابت با خارجی", "قیمت اقتصادی‌تر", "افزایش عمر دستگاه"], placeholder: "تصویر پیشنهادی: محصول برند" },
  { id: "22", kind: "content", title: "مخاطب هدف: کافه‌ها", bullets: ["آگاهی نسبی از نگهداری", "شناخت ناکافی از SPM", "انتخاب بر اساس عادت یا توصیه"], placeholder: "تصویر پیشنهادی: فضای کافه" },
  { id: "23", kind: "content", title: "مخاطب هدف: خانگی", bullets: ["آگاهی محدود از نظافت دوره‌ای", "نیاز به آموزش", "آشنایی با SPM پس از آگاهی"], placeholder: "تصویر پیشنهادی: دستگاه خانگی" },
  { id: "24", kind: "content", title: "چالش اصلی", body: ["SPM تخصصی است اما به اندازه کافی در ذهن مخاطب شناخته نشده.", "فاصله میان کیفیت محصول و جایگاه ذهنی.", "نیاز به آگاهی، اعتمادسازی، جایگاه‌سازی."], placeholder: "دیاگرام پیشنهادی: شکاف ذهنی بازار" },
  { id: "25", kind: "content", title: "مسیر پیشنهادی پروژه", bullets: ["Strategy", "Awareness", "Positioning", "Advertising", "Sell"], body: ["حرکت از شناخت بازار تا رشد فروش."], placeholder: "دیاگرام پیشنهادی: مسیر رشد فروش" },
  { id: "26", kind: "divider", title: "Strategy", subtitle: "استراتژی" },
  { id: "27", kind: "content", title: "SPM Strategy", body: ["مسیر تصمیم‌سازی دقیق پروژه"], bullets: ["تحقیقات بازار", "تحلیل مخاطب", "تدوین استراتژی ارتباطی"], placeholder: "نقشه پیشنهادی: فاز استراتژی" },
  { id: "28", kind: "content", title: "تحقیقات بازار", bullets: ["پتانسیل بازار کافه‌ها و خانگی", "بررسی رقبا", "شناسایی خلأهای بازار"], placeholder: "نمودار پیشنهادی: فرصت بازار" },
  { id: "29", kind: "content", title: "تحلیل مخاطب", bullets: ["شناخت حرفه‌ای و خانگی", "تحلیل دغدغه‌ها", "شناخت موانع اعتماد و خرید"], placeholder: "پرسونا پیشنهادی: مخاطبان" },
  { id: "30", kind: "content", title: "تدوین استراتژی ارتباطی", bullets: ["تعریف پیام اصلی", "تعیین لحن", "اتصال به آگاهی، جایگاه‌سازی و فروش"], placeholder: "دیاگرام پیشنهادی: چارچوب پیام" },
  { id: "31", kind: "divider", title: "Awareness", subtitle: "آگاهی" },
  { id: "32", kind: "content", title: "SPM Awareness", body: ["برای رشد برند، ابتدا باید بازار نسبت به مسئله اصلی آگاه شود."], bullets: ["PR", "Social Media", "Digital"], placeholder: "اینفوگرافی پیشنهادی: ستون‌های آگاهی" },
  { id: "33", kind: "content", title: "PR / Social / Digital", body: ["PR: مقالات آموزشی، اطلاع‌رسانی، معرفی کاربرد محصول.", "Social: آموزش، ارتباط مستمر، تقویت اعتماد.", "Digital: وب‌سایت به‌عنوان هسته ارتباط و فروش."], placeholder: "موکاپ پیشنهادی: محتوا و شبکه اجتماعی" },
  { id: "34", kind: "divider", title: "Positioning", subtitle: "جایگاه‌سازی" },
  { id: "35", kind: "content", title: "Positioning", bullets: ["SPM انتخاب تخصصی", "کیفیت رقابتی", "قیمت اقتصادی‌تر", "اعتمادپذیری برند داخلی"], placeholder: "دیاگرام پیشنهادی: جایگاه ذهنی برند" },
  { id: "36", kind: "content", title: "Recommendation & Endorsement", bullets: ["همکاری با افراد معتبر حوزه قهوه", "توصیه متخصصان", "همکاری با کافه‌ها", "اعتبار از تجربه واقعی"], placeholder: "تصویر پیشنهادی: endorsement واقعی" },
  { id: "37", kind: "content", title: "Campaign Design", bullets: ["نمایش اهمیت نگهداری", "تفاوت شوینده تخصصی با عمومی", "تأکید کیفیت و بهداشت", "تقویت تصویر انتخاب درست"], placeholder: "موکاپ پیشنهادی: کمپین دیجیتال" },
  { id: "38", kind: "divider", title: "Advertising", subtitle: "تبلیغات" },
  { id: "39", kind: "content", title: "Media Planning", body: ["پیام برند در کانال‌های مرتبط با مخاطب نمایش داده شود.", "انتخاب رسانه‌های مؤثر و مسیر دیده‌شدن."], placeholder: "نقشه پیشنهادی: media planning" },
  { id: "40", kind: "content", title: "Suggested Media Channels", bullets: ["SnappFood", "Digikala", "SnappMarket", "DigiMarket", "Okala", "In-store Lightbox Media"], body: ["هدف: افزایش دیده‌شدن، اتصال پیام به خرید، افزایش آگاهی و آمادگی فروش."], placeholder: "لوکیشن پیشنهادی: کانال‌های رسانه‌ای" },
  { id: "41", kind: "divider", title: "Sell", subtitle: "فروش" },
  { id: "42", kind: "content", title: "Sell", bullets: ["POS", "Bundle / Sampling", "Promotion"], body: ["فعال‌سازی فروش و تبدیل مخاطب آگاه به خریدار."], placeholder: "دیاگرام پیشنهادی: قیف فروش" },
  { id: "43", kind: "content", title: "POS", body: ["اقلام Point of Sale برای دیده‌شدن در محل فروش."], bullets: ["تصمیم خرید", "تقویت حضور برند", "ارتباط مستقیم هنگام خرید"], placeholder: "موکاپ پیشنهادی: استند فروشگاهی" },
  { id: "44", kind: "content", title: "Bundle / Sampling", body: ["تجربه‌سازی محصول و کاهش مانع خرید."], bullets: ["نمونه محصول", "پیشنهاد خرید ترکیبی", "افزایش تست", "تبدیل تجربه به خرید"], placeholder: "تصویر پیشنهادی: پک نمونه" },
  { id: "45", kind: "content", title: "Promotion", body: ["تحریک خرید و فعال‌سازی مخاطب در بازه‌های مشخص."], bullets: ["انگیزه خرید", "پیشنهاد محدود", "رشد فروش", "خرید مجدد"], placeholder: "تصویر پیشنهادی: کمپین پروموشن" },
  { id: "46", kind: "content", title: "Budgeting", bullets: ["Strategy → View / Engagement", "Awareness → View / Page View", "Positioning → CTR / View", "Advertising → Impression / View", "Sell → Click / Conversion", "KPI: View, Page View, CTR, Impression, Click, Conversion", "نمونه: 110000 Click · 250000 View · 1.2M Impression"], placeholder: "دیاگرام پیشنهادی: مسیر KPI و بودجه" },
  { id: "47", kind: "cover", title: "Thanks", subtitle: "For watching · SPM Project · Feb - 2026", placeholder: "تصویر پیشنهادی: پایان‌بندی سینمایی" },
];

const icons = [Layers, Workflow, Compass, Orbit, Target, Gem];

function SlideContent({ slide, idx, sectionClass }: { slide: Slide; idx: number; sectionClass: string }) {
  const icon = icons[idx % icons.length];
  const Icon = icon;
  const mode = idx % 6;
  return (
    <motion.section className={`scene ${sectionClass} scene-${mode}`} initial={{ opacity: 0, y: 55 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: "-10%" }}>
      <div className="scene-text">
        <p className="eyebrow">SLIDE {slide.id} {slide.kicker ? `· ${slide.kicker}` : ""}</p>
        <h3>{slide.title}</h3>
        {slide.subtitle && <p className="subtitle">{slide.subtitle}</p>}
        {slide.body?.map((b) => <p className="body" key={b}>{b}</p>)}
        {!!slide.bullets?.length && <div className="bullet-grid">{slide.bullets.map((item) => <motion.div whileHover={{ y: -4, x: -3 }} className="bullet" key={item}><CircleDot size={14} />{item}</motion.div>)}</div>}
      </div>
      <motion.div className="media-block" whileHover={{ rotate: -1, scale: 1.02 }}>
        <div className="media-float" />
        <div className="media-frame"><Icon className="icon" /><p>{slide.placeholder}</p></div>
        <div className="media-mini" />
      </motion.div>
    </motion.section>
  );
}

const slideLayoutByRange: Array<{ start: number; end: number; layout: NonNullable<Slide["layout"]> }> = [
  { start: 2, end: 4, layout: "opening-hero" },
  { start: 5, end: 10, layout: "service-constellation" },
  { start: 11, end: 11, layout: "editorial-statement" },
  { start: 14, end: 18, layout: "editorial-statement" },
  { start: 19, end: 24, layout: "audience-split" },
  { start: 25, end: 30, layout: "strategy-framework" },
  { start: 32, end: 33, layout: "awareness-orbit" },
  { start: 35, end: 37, layout: "positioning-comparison" },
  { start: 39, end: 40, layout: "media-landscape" },
  { start: 42, end: 45, layout: "sell-flow" },
  { start: 46, end: 46, layout: "budget-matrix" },
  { start: 47, end: 47, layout: "cinematic-closing" },
];

function getSlideLayout(slide: Slide): NonNullable<Slide["layout"]> {
  if (slide.layout) return slide.layout;
  const id = Number.parseInt(slide.id, 10);
  const found = slideLayoutByRange.find((entry) => id >= entry.start && id <= entry.end);
  return found?.layout ?? "opening-hero";
}

function OpeningHeroSection({ slide, idx }: { slide: Slide; idx: number }) {
  return <SlideContent slide={slide} idx={idx} sectionClass="section-opening-hero" />;
}
function EditorialStatementSection({ slide, idx }: { slide: Slide; idx: number }) {
  return <SlideContent slide={slide} idx={idx} sectionClass="section-editorial-statement" />;
}
function ServiceConstellationSection({ slide, idx }: { slide: Slide; idx: number }) {
  return <SlideContent slide={slide} idx={idx} sectionClass="section-service-constellation" />;
}
function AudienceSplitSection({ slide, idx }: { slide: Slide; idx: number }) {
  return <SlideContent slide={slide} idx={idx} sectionClass="section-audience-split" />;
}
function StrategyFrameworkSection({ slide, idx }: { slide: Slide; idx: number }) {
  return <SlideContent slide={slide} idx={idx} sectionClass="section-strategy-framework" />;
}
function AwarenessOrbitSection({ slide, idx }: { slide: Slide; idx: number }) {
  return <SlideContent slide={slide} idx={idx} sectionClass="section-awareness-orbit" />;
}
function PositioningComparisonSection({ slide, idx }: { slide: Slide; idx: number }) {
  return <SlideContent slide={slide} idx={idx} sectionClass="section-positioning-comparison" />;
}
function MediaLandscapeSection({ slide, idx }: { slide: Slide; idx: number }) {
  return <SlideContent slide={slide} idx={idx} sectionClass="section-media-landscape" />;
}
function SellFlowSection({ slide, idx }: { slide: Slide; idx: number }) {
  return <SlideContent slide={slide} idx={idx} sectionClass="section-sell-flow" />;
}
function BudgetMatrixSection({ slide, idx }: { slide: Slide; idx: number }) {
  return <SlideContent slide={slide} idx={idx} sectionClass="section-budget-matrix" />;
}
function CinematicClosingSection({ slide, idx }: { slide: Slide; idx: number }) {
  return <SlideContent slide={slide} idx={idx} sectionClass="section-cinematic-closing" />;
}


function getChapterClass(slide: Slide): string {
  const id = Number.parseInt(slide.id, 10);
  if (id <= 12) return "chapter-prelude";
  if (id <= 25) return "chapter-intro";
  if (id <= 30) return "chapter-strategy";
  if (id <= 33) return "chapter-awareness";
  if (id <= 37) return "chapter-positioning";
  if (id <= 40) return "chapter-advertising";
  if (id <= 46) return "chapter-sell";
  return "chapter-closing";
}

function renderSlide(slide: Slide, idx: number) {
  if (slide.kind === "divider") return <motion.section key={slide.id} className="divider" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}><span>{slide.id}</span><h2>{slide.title}</h2><p>{slide.subtitle}</p></motion.section>;
  if (slide.kind === "cover") return <section key={slide.id} className="cover mini"><p>{slide.kicker}</p><h1>{slide.title}</h1><h2>{slide.subtitle}</h2><div className="chapter-tag">{slide.placeholder}</div></section>;
  switch (getSlideLayout(slide)) {
    case "opening-hero":
      return <OpeningHeroSection key={slide.id} slide={slide} idx={idx} />;
    case "editorial-statement":
      return <EditorialStatementSection key={slide.id} slide={slide} idx={idx} />;
    case "service-constellation":
      return <ServiceConstellationSection key={slide.id} slide={slide} idx={idx} />;
    case "audience-split":
      return <AudienceSplitSection key={slide.id} slide={slide} idx={idx} />;
    case "strategy-framework":
      return <StrategyFrameworkSection key={slide.id} slide={slide} idx={idx} />;
    case "awareness-orbit":
      return <AwarenessOrbitSection key={slide.id} slide={slide} idx={idx} />;
    case "positioning-comparison":
      return <PositioningComparisonSection key={slide.id} slide={slide} idx={idx} />;
    case "media-landscape":
      return <MediaLandscapeSection key={slide.id} slide={slide} idx={idx} />;
    case "sell-flow":
      return <SellFlowSection key={slide.id} slide={slide} idx={idx} />;
    case "budget-matrix":
      return <BudgetMatrixSection key={slide.id} slide={slide} idx={idx} />;
    case "cinematic-closing":
      return <CinematicClosingSection key={slide.id} slide={slide} idx={idx} />;
    default:
      return <SlideContent key={slide.id} slide={slide} idx={idx} sectionClass="section-opening-hero" />;
  }
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { damping: 28, stiffness: 140 });
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const bgX = useTransform(mx, [-300, 300], [-30, 30]);
  const bgY = useTransform(my, [-200, 200], [-24, 24]);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const sections = useMemo(() => slides, []);

  return (
    <main className="proposal-root" onMouseMove={(e) => { mx.set(e.clientX - window.innerWidth / 2); my.set(e.clientY - window.innerHeight / 2); }}>
      <motion.div className="progress" style={{ scaleX: progress }} />
      <motion.div className="blob b1" style={{ x: bgX, y: bgY }} />
      <motion.div className="blob b2" style={{ x: useTransform(bgX, (v) => v * -0.6), y: useTransform(bgY, (v) => v * 0.5) }} />
      <section className="cover">
        <p>ROSS CREATIVE AGENCY · INTERACTIVE PROPOSAL</p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>SPM Proposal Experience</motion.h1>
        <h2>روایتی سینمایی، تعاملی و زنده از مسیر Strategy تا Sell</h2>
        <motion.button whileHover={{ y: -4, scale: 1.03 }} whileTap={{ scale: 0.97 }} className="magnetic-btn"><Sparkles size={16} /> Scroll to enter chapters <ArrowUpRight size={16} /></motion.button>
      </section>
      {sections.map((slide, idx) => (
        <section key={`chapter-${slide.id}`} className={`chapter ${getChapterClass(slide)}`}>
          {renderSlide(slide, idx)}
        </section>
      ))}
    </main>
  );
}
