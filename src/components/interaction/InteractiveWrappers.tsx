"use client";

import { motion, type MotionProps } from "framer-motion";
import type { PropsWithChildren } from "react";
import { motionTokens, whenMotionAllowed } from "@/lib/motion-tokens";

type WrapperProps = PropsWithChildren<MotionProps & { className?: string; reduceMotion?: boolean }>;

export function MagneticAction({ children, reduceMotion = false, ...props }: WrapperProps) {
  return (
    <motion.button
      whileHover={whenMotionAllowed(reduceMotion, { y: -4, scale: 1.03 })}
      whileTap={whenMotionAllowed(reduceMotion, { scale: 0.97 })}
      transition={reduceMotion ? { duration: 0 } : { duration: motionTokens.duration.base, ease: motionTokens.easing.standard }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function TiltPanel({ children, reduceMotion = false, ...props }: WrapperProps) {
  return (
    <motion.div
      whileHover={whenMotionAllowed(reduceMotion, { rotate: -1, scale: 1.02 })}
      transition={reduceMotion ? { duration: 0 } : { duration: motionTokens.duration.base, ease: motionTokens.easing.standard }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function BreathingCard({ children, reduceMotion = false, ...props }: WrapperProps) {
  return (
    <motion.div
      animate={reduceMotion ? { y: 0 } : { y: [0, -1.6, 0] }}
      transition={reduceMotion ? { duration: 0 } : { duration: motionTokens.duration.ambient, repeat: Infinity, ease: motionTokens.easing.inOut }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function GlowMedia({ children, reduceMotion = false, ...props }: WrapperProps) {
  return (
    <motion.div
      animate={reduceMotion ? { boxShadow: "0 0 0 rgba(216,138,166,0)" } : { boxShadow: ["0 0 0 rgba(216,138,166,0.15)", "0 0 24px rgba(216,138,166,0.32)", "0 0 0 rgba(216,138,166,0.15)"] }}
      transition={reduceMotion ? { duration: 0 } : { duration: motionTokens.duration.slow, repeat: Infinity, ease: motionTokens.easing.inOut }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function InteractiveBullet({ children, reduceMotion = false, ...props }: WrapperProps) {
  return (
    <motion.div
      whileHover={whenMotionAllowed(reduceMotion, { y: -4, x: -3 })}
      transition={reduceMotion ? { duration: 0 } : { duration: motionTokens.duration.fast, ease: motionTokens.easing.standard }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
