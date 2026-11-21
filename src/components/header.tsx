'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { ArrowUpRight, BookOpen, FileText, Folder, House, LibraryBig, Languages, ChevronDown, Monitor, X, Menu, Moon, NotebookPen, Search, Sun } from 'lucide-react';
import { Button } from './ui/coss/button';
import { SegmentedControl } from './ui/coss/segmented-control';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet';
import { TransitionLink } from './providers';
import { Localized, useLanguage } from './language';
import type { SearchItem } from '@/lib/search';

const SiteSearch = dynamic(() => import('./site-search'));
const destinations = [
  { href: '/', en: 'Home', zh: '首页', icon: House },
  { href: '/research/', en: 'Research', zh: '研究', icon: BookOpen },
  { href: '/projects/', en: 'Projects', zh: '项目', icon: Folder },
  { href: '/writing/', en: 'Writing', zh: '写作', icon: NotebookPen },
  { href: '/resources/', en: 'Resources', zh: '资源', icon: LibraryBig },
  { href: '/cv/', en: 'CV', zh: '简历', icon: FileText },
];

function sectionOf(path: string, href: string) {
  return href === '/' ? path === '/' : path === href.slice(0, -1) || path.startsWith(href);
}

export function Header({ index }: { index: SearchItem[] }) {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const [pending, setPending] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [menu, setMenu] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const searchTrigger = useRef<HTMLButtonElement>(null);
  const dark = mounted && resolvedTheme === 'dark';
  const ThemeIcon = dark ? Sun : Moon;

  useEffect(() => {
    setMounted(true);
    const key = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setMenu(false);
        setHasSearched(true);
        setOpen(previous => !previous);
      }
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, []);

  useEffect(() => {
    setPending(null);
    setMenu(false);
    setOpen(false);
  }, [pathname]);

  const toggleLanguage = () => setLanguage(language === 'en' ? 'zh' : 'en');
  const toggleTheme = () => setTheme(dark ? 'light' : 'dark');
  const languageLabel = language === 'en' ? '中文 (Switch to Chinese)' : 'EN (Switch to English)';
  const themeLabel = dark ? 'Switch to light theme' : 'Switch to dark theme';

  return <>
    <header className="site-header">
      <div className="header-inner">
        <SegmentedControl render={<nav aria-label="Main navigation" data-glass-selection="" />} className="site-rail reader-glass">
          {destinations.map(({ href, icon: Icon, ...name }) => (
            <TransitionLink key={href} className="destination" href={href}
              onNavigate={() => setPending(href)} aria-label={name[language]} title={name[language]}
              aria-current={sectionOf(pathname, href) ? 'page' : undefined}
              data-selected={sectionOf(pending ?? pathname, href) || undefined}>
              <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
              <span>{name[language]}</span>
            </TransitionLink>
          ))}
        </SegmentedControl>
        <div className="header-actions reader-glass">
          <button className="language-switch header-preference" onClick={toggleLanguage} aria-label={languageLabel}>
            {language === 'en' ? '中文' : 'EN'}
          </button>
          <Button ref={searchTrigger} variant="ghost" size="icon" aria-label={language === 'en' ? 'Search site' : '站内搜索'}
            onClick={() => { setHasSearched(true); setOpen(true); }}><Search size={18} /></Button>
          <Button variant="ghost" size="icon" className="header-preference" onClick={toggleTheme} aria-label={themeLabel}><ThemeIcon size={18} /></Button>
          <Sheet open={menu} onOpenChange={setMenu}>
            <SheetTrigger asChild><Button variant="ghost" size="icon" className="mobile-menu" aria-label={language === 'en' ? 'Open navigation' : '打开导航'}><Menu size={20} /></Button></SheetTrigger>
            <SheetContent className="site-drawer" showCloseButton={false} aria-describedby={undefined}>
              <div className="mobile-nav-heading">
                <SheetTitle><Localized en="Explore" zh="浏览" /></SheetTitle>
                <SheetClose className="drawer-close" aria-label={language === 'zh' ? '关闭' : 'Close'}><X size={18} /></SheetClose>
              </div>
              <nav className="sheet-nav" aria-label="Mobile navigation">
                {destinations.map(({ href, icon: Icon, ...name }) => (
                  <TransitionLink key={href} href={href} onClick={() => setMenu(false)} aria-current={sectionOf(pathname, href) ? 'page' : undefined}>
                    <Icon size={18} aria-hidden="true" />{name[language]}
                  </TransitionLink>
                ))}
              </nav>
              <div className="drawer-preferences">
                <label className="drawer-setting">
                  <Languages size={18} aria-hidden="true" /><span><Localized en="Language" zh="语言" /></span>
                  <select aria-label={language === 'zh' ? '语言' : 'Language'} value={language} onChange={event => setLanguage(event.target.value === 'zh' ? 'zh' : 'en')}>
                    <option value="en">English</option><option value="zh">中文</option>
                  </select>
                  <ChevronDown size={14} aria-hidden="true" />
                </label>
                <label className="drawer-setting">
                  <Monitor size={18} aria-hidden="true" /><span><Localized en="Appearance" zh="外观" /></span>
                  <select aria-label={language === 'zh' ? '外观' : 'Appearance'} value={mounted ? theme ?? 'system' : 'system'} onChange={event => setTheme(event.target.value)}>
                    <option value="system">{language === 'zh' ? '跟随系统' : 'System'}</option>
                    <option value="light">{language === 'zh' ? '浅色' : 'Light'}</option>
                    <option value="dark">{language === 'zh' ? '深色' : 'Dark'}</option>
                  </select>
                  <ChevronDown size={14} aria-hidden="true" />
                </label>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    {hasSearched && <SiteSearch index={index} open={open} onOpenChange={setOpen} trigger={searchTrigger} />}
  </>;
}

export function Footer() {
  return <footer className="site-footer shell">
    <p><Localized en="Nanjing University · Computer Science" zh="南京大学 · 计算机科学" /></p>
    <div className="footer-links">
      <a href="mailto:mengyihan@smail.nju.edu.cn"><Localized en="Get in touch" zh="联系我" /> <ArrowUpRight size={14} /></a>
      <a href="https://github.com/yumizhi" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>
      <span>© {new Date().getFullYear()}</span>
    </div>
  </footer>;
}
