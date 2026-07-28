'use client';

import { motion, useReducedMotion } from 'motion/react';
import { usePathname } from 'next/navigation';

import { MOTION } from '@/constants/design';

/**
 * The one transition in the application.
 *
 * §07 — PUSH · direction LEFT · 300ms · ease-out on every forward
 * navigation. Root switching is INSTANT: "tabs are siblings with no spatial
 * relationship, so no motion is permitted."
 * §05 — 300ms and EASE_OUT are the only values, defined once in
 * constants/design.ts and read here.
 * §11 — reduced motion renders all transitions instantly. Nothing is lost:
 * motion carries orientation only, never information.
 *
 * §15 requires exactly one transition type to exist in the codebase, so this
 * is the only place a `motion` element appears.
 */
export function PageTransition({
  instant,
  children,
}: {
  instant: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const skip = instant || reduceMotion;

  return (
    <motion.div
      key={pathname}
      initial={skip ? false : { x: 24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={
        skip
          ? { duration: 0 }
          : { duration: MOTION.duration, ease: [...MOTION.ease] }
      }
      className="flex h-full min-h-0 flex-col"
    >
      {children}
    </motion.div>
  );
}
