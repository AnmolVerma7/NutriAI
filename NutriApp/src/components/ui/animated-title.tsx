'use client';

import { motion } from 'framer-motion';

export function AnimatedTitle() {
  return (
    <motion.h1
      className="text-6xl font-bold tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      NutriAI
    </motion.h1>
  );
}
