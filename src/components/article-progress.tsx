'use client';

import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react';

/** A continuous reading indicator, with no delayed page transition. */
export function ArticleProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: .3 });
  const reduced = useReducedMotion();
  return <motion.div className="article-progress" aria-hidden="true" style={{ scaleX: reduced ? scrollYProgress : smooth }}/>;
}
