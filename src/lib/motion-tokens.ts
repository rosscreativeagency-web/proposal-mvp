import type { SpringOptions, Transition } from "framer-motion";

export const motionTokens = {
  duration: {
    fast: 0.18,
    base: 0.28,
    slow: 0.48,
    ambient: 1.8,
  },
  easing: {
    standard: [0.22, 1, 0.36, 1] as const,
    inOut: [0.42, 0, 0.58, 1] as const,
  },
  spring: {
    panel: { type: "spring", stiffness: 240, damping: 24 } satisfies Transition,
    gentle: { stiffness: 120, damping: 28 } satisfies SpringOptions,
    responsive: { stiffness: 140, damping: 30 } satisfies SpringOptions,
  },
} as const;

export function whenMotionAllowed<T>(reduceMotion: boolean, motion: T): T | undefined {
  return reduceMotion ? undefined : motion;
}
