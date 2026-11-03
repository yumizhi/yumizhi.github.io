'use client';
import { ThemeProvider } from 'next-themes';
import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';
import { LanguageProvider } from './language';
import { TooltipProvider } from '@/components/ui/tooltip';
import { motionTokens } from '@/lib/motion';

export function Providers({children}:{children:ReactNode}){
 return <LanguageProvider><ThemeProvider attribute="class" defaultTheme="system" enableSystem><MotionConfig reducedMotion="user" transition={{duration:motionTokens.layout,ease:motionTokens.ease}}><TooltipProvider>{children}</TooltipProvider></MotionConfig></ThemeProvider></LanguageProvider>;
}
export { default as TransitionLink } from 'next/link';
