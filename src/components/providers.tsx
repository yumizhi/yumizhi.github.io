'use client';
import {motionTokens} from '@/lib/motion';
import { ThemeProvider } from 'next-themes';
import { MotionConfig } from 'motion/react';
import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ComponentProps, MouseEvent } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
type Navigation = {go:(href:string)=>void};
const NavigationContext=createContext<Navigation>({go:()=>{}});
export function Providers({children}:{children:ReactNode}){
  const pathname=usePathname();const router=useRouter();const done=useRef<null|(()=>void)>(null);const active=useRef<null|{skipTransition:()=>void}>(null);
  useEffect(()=>{done.current?.();done.current=null;},[pathname]);
  function go(href:string){
    if(href.replace(/\/$/,'')===pathname.replace(/\/$/,'')){router.push(href);return;}
    done.current?.();active.current?.skipTransition();
    const documentWithTransition=document as Document & {startViewTransition?:(update:()=>Promise<void>)=>{finished:Promise<void>;skipTransition:()=>void}};
    if(!documentWithTransition.startViewTransition||window.matchMedia('(prefers-reduced-motion: reduce)').matches){router.push(href);return;}
    // Resolve when App Router commits the destination, so named images share a transition.
    const transition=documentWithTransition.startViewTransition(()=>new Promise<void>(resolve=>{
      done.current=resolve;router.push(href);setTimeout(()=>{resolve();if(done.current===resolve)done.current=null;},1600);
    }));
    active.current=transition;transition.finished.catch(()=>{}).finally(()=>{if(active.current===transition)active.current=null;});
  }
  return <ThemeProvider attribute="class" defaultTheme="system" enableSystem><MotionConfig reducedMotion="user" transition={{duration:motionTokens.layout,ease:motionTokens.ease}}><TooltipProvider><NavigationContext.Provider value={{go}}>{children}</NavigationContext.Provider></TooltipProvider></MotionConfig></ThemeProvider>;
}
export function TransitionLink({href,onClick,...props}:ComponentProps<typeof Link>){
  const {go}=useContext(NavigationContext);
  function handle(e:MouseEvent<HTMLAnchorElement>){
    onClick?.(e);const url=String(href);
    if(e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0||!url.startsWith('/')||url.includes('#'))return;
    e.preventDefault();go(url);
  }
  return <Link href={href} onClick={handle} {...props}/>;
}
