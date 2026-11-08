'use client';
import {motionTokens} from '@/lib/motion';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Search, Sun, Moon, Menu, House, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import dynamic from 'next/dynamic';
const SiteSearch=dynamic(()=>import('./site-search'));
import { TransitionLink } from './providers';
import type { SearchItem } from '@/lib/search';
import { Localized, useLanguage } from './language';
const links=[['/research/','Research','研究'],['/projects/','Projects','项目'],['/writing/','Writing','写作'],['/resources/','Resources','资源'],['/cv/','CV','简历']];
export function Header({index}:{index:SearchItem[]}){
 const {language,setLanguage}=useLanguage();const pathname=usePathname();const reduced=useReducedMotion();const [pending,setPending]=useState<string|null>(null);const [open,setOpen]=useState(false);const [hasSearched,setHasSearched]=useState(false);const [menu,setMenu]=useState(false);const {resolvedTheme,setTheme}=useTheme();const [mounted,setMounted]=useState(false);
 useEffect(()=>{setMounted(true);const key=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();setHasSearched(true);setOpen(v=>!v);}};document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key);},[]);
 useEffect(()=>{setPending(null);setMenu(false);setOpen(false);},[pathname]);
 const {scrollY}=useScroll();const glass=useTransform(scrollY,[0,90],[0,1]);
 const isActive=(href:string)=>href==='/'?pathname==='/':pathname.startsWith(href.replace(/\/$/,''));
 return <><motion.header className="site-header"><motion.span aria-hidden="true" className="header-glass" style={{opacity:glass}}/><div className="header-inner"><TransitionLink className="home-link" href="/" aria-label={language==='en'?'Home':'返回首页'}><House size={22} strokeWidth={1.7} aria-hidden="true"/><span className="home-link-label"><Localized en="Home" zh="首页"/></span></TransitionLink><nav className="desktop-nav" aria-label="Main navigation">{links.map(([href,label,chinese])=><TransitionLink key={href} href={href} className="nav-link" onNavigate={()=>setPending(href)} data-selected={(pending??pathname).startsWith(href.replace(/\/$/,''))||undefined} aria-current={isActive(href)?'page':undefined}>{(pending??pathname).startsWith(href.replace(/\/$/,''))&&<motion.span className="nav-active" layoutId="active-navigation" transition={reduced?{duration:0}:motionTokens.navigation}/>}<span><Localized en={label} zh={chinese}/></span></TransitionLink>)}</nav><div className="header-actions"><button className="language-switch" onClick={()=>setLanguage(language==='en'?'zh':'en')} aria-label={language==='en'?'Switch to Chinese':'Switch to English'}><span aria-hidden="true">{language==='en'?'中文':'EN'}</span></button><Button variant="ghost" size="icon" aria-label="Search site" onClick={()=>{setHasSearched(true);setOpen(true);}}><Search size={18}/></Button><Button variant="ghost" size="icon" onClick={()=>setTheme(resolvedTheme==='dark'?'light':'dark')} aria-label={mounted&&resolvedTheme==='dark'?'Switch to light theme':'Switch to dark theme'}>{mounted&&resolvedTheme==='dark'?<Sun size={18}/>:<Moon size={18}/>}</Button><Sheet open={menu} onOpenChange={setMenu}><SheetTrigger asChild><Button variant="ghost" size="icon" className="mobile-menu" aria-label="Open navigation"><Menu size={20}/></Button></SheetTrigger><SheetContent><SheetTitle><Localized en="Explore" zh="浏览"/></SheetTitle><SheetDescription><Localized en="Research, projects, and notes by Yihan Meng." zh="蒙一涵的研究、开源项目与笔记。"/></SheetDescription><nav className="sheet-nav" aria-label="Mobile navigation">{[['/','Home','首页'],...links].map(([href,label,chinese])=><TransitionLink key={href} href={href} onClick={()=>setMenu(false)} aria-current={isActive(href)?'page':undefined}><Localized en={label} zh={chinese}/><ArrowUpRight size={18}/></TransitionLink>)}</nav></SheetContent></Sheet></div></div></motion.header>{hasSearched&&<SiteSearch index={index} open={open} onOpenChange={setOpen}/>}</>;
}
export function Footer(){return <footer className="site-footer shell"><p><Localized en="Nanjing University · Computer Science" zh="南京大学 · 计算机科学"/></p><div className="footer-links"><a href="mailto:mengyihan@smail.nju.edu.cn"><Localized en="Get in touch" zh="联系我"/> <ArrowUpRight size={14}/></a><a href="https://github.com/yumizhi" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14}/></a><span>© {new Date().getFullYear()}</span></div></footer>;}
