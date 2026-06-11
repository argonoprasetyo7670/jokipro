"use client";

import { motion, type Variants, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

// ===== Animation Variants =====

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// ===== Motion Components =====

export const MotionDiv = motion.div;
export const MotionSection = motion.section;
export const MotionNav = motion.nav;
export const MotionSpan = motion.span;
export const MotionH1 = motion.h1;
export const MotionP = motion.p;
export const MotionA = motion.a;

// ===== Page Wrapper with stagger animation =====

export function PageTransition({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className={className}
    >
      {children}
    </MotionDiv>
  );
}

// ===== Animated card wrapper =====

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, delay = 0, ...props }, ref) => {
    return (
      <MotionDiv
        ref={ref}
        variants={staggerItem}
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
        {...props}
      >
        {children}
      </MotionDiv>
    );
  }
);
AnimatedCard.displayName = "AnimatedCard";
