"use client";

import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useMemo } from "react";

type BlobFieldProps = {
  palette: [string, string, string];
  density: number;
  motionProfile: "calm" | "drift" | "float";
  zLayer: number;
};

const profileMap = {
  calm: { parallax: 0.03, scroll: 26 },
  drift: { parallax: 0.05, scroll: 46 },
  float: { parallax: 0.07, scroll: 64 },
} as const;

export function BlobField({ palette, density, motionProfile, zLayer }: BlobFieldProps) {
  const { scrollYProgress } = useScroll();
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 110, damping: 28 });
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const config = profileMap[motionProfile];

  const blobCount = Math.min(8, Math.max(3, density));

  const blobs = useMemo(
    () => Array.from({ length: blobCount }, (_, i) => ({
      id: i,
      tone: palette[i % palette.length],
      tier: i % 3,
      size: 180 + ((i * 53) % 170),
      top: 5 + ((i * 17) % 84),
      left: 2 + ((i * 29) % 94),
      delay: i * 0.45,
    })),
    [blobCount, palette],
  );

  return (
    <div
      className="blob-field"
      style={{ zIndex: zLayer }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - rect.left - rect.width / 2);
        my.set(e.clientY - rect.top - rect.height / 2);
      }}
    >
      {blobs.map((blob, idx) => <BlobItem key={blob.id} blob={blob} idx={idx} parallax={config.parallax} scroll={config.scroll} mx={mx} my={my} smoothScroll={smoothScroll} />)}
    </div>
  );
}


type BlobItemProps = {
  blob: { id: number; tone: string; tier: number; size: number; top: number; left: number; delay: number };
  idx: number;
  parallax: number;
  scroll: number;
  mx: ReturnType<typeof useMotionValue<number>>;
  my: ReturnType<typeof useMotionValue<number>>;
  smoothScroll: ReturnType<typeof useSpring>;
};

function BlobItem({ blob, idx, parallax, scroll, mx, my, smoothScroll }: BlobItemProps) {
  const localFactor = 1 + idx * 0.12;
  const x = useTransform(mx, [-400, 400], [-22 * parallax * localFactor, 22 * parallax * localFactor]);
  const yMouse = useTransform(my, [-280, 280], [-18 * parallax * localFactor, 18 * parallax * localFactor]);
  const yScroll = useTransform(smoothScroll, [0, 1], [-scroll * localFactor, scroll * localFactor]);
  const y = useTransform([yMouse, yScroll], ([a, b]) => a + b);
  const background = useMotionTemplate`radial-gradient(circle at 30% 30%, ${blob.tone}, transparent 70%)`;

  return (
    <motion.span
      className={`blob-shape blob-tier-${blob.tier + 1} blob-morph-${(idx % 4) + 1}`}
      style={{
        width: blob.size,
        height: blob.size,
        top: `${blob.top}%`,
        left: `${blob.left}%`,
        x,
        y,
        background,
        animationDelay: `${blob.delay}s`,
      }}
    />
  );
}
