"use client";

import { LevelUpTransitions } from "@/components/brand/levelup-transition";

/**
 * Global page transition, mounted once by the root layout: the LevelUp
 * editorial panel wipe for internal links and for links to LevelStudio and
 * the dashboard (see components/brand/levelup-transition.tsx).
 */
export function NavigationTransition() {
  return <LevelUpTransitions />;
}

export default NavigationTransition;
