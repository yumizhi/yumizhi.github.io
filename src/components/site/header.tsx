'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { ArrowUpRight, Menu, Moon, Search, Sun } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Localized, useLanguage } from '@/components/language';
import type { SearchItem } from '@/lib/search';

const SiteSearch = dynamic(() => import('@/components/site-search'));

const links = [
  ['/research/', 'Research', '研究'],
  ['/projects/', 'Projects', '项目'],
  ['/writing/', 'Writing', '写作'],
  ['/resources/', 'Resources', '资料'],
  ['/cv/', 'CV', '简历'],
] as const;

export function Header({ index }: { index: SearchItem[] }) {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoaded, setSearchLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchLoaded(true);
        setSearchOpen(open => !open);
      }
    };
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname.startsWith(href.replace(/\/$/, ''));
  const dark = mounted && resolvedTheme === 'dark';

  return (
    <>
      <header className="site-header" data-scrolled={scrolled}>
        <div className="shell header-inner">
          <Link className="wordmark" href="/" aria-label={language === 'en' ? 'Yihan Meng — home' : '蒙一涵 — 首页'}>
            <span className="wordmark-dot" aria-hidden="true" />
            <Localized en="Yihan Meng" zh="蒙一涵" />
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map(([href, en, zh]) => (
              <Link key={href} href={href} className="nav-link" aria-current={isActive(href) ? 'page' : undefined}>
                <Localized en={en} zh={zh} />
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <button
              type="button"
              className="icon-button language-switch"
              onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
              aria-label={language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
            >
              <span aria-hidden="true">{language === 'en' ? '中文' : 'EN'}</span>
            </button>
            <button
              type="button"
              className="icon-button"
              aria-label="Search site"
              onClick={() => { setSearchLoaded(true); setSearchOpen(true); }}
            >
              <Search size={17} />
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => setTheme(dark ? 'light' : 'dark')}
              aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button type="button" className="icon-button mobile-menu" aria-label="Open navigation">
                  <Menu size={19} />
                </button>
              </SheetTrigger>
              <SheetContent>
                <SheetTitle><Localized en="Explore" zh="浏览" /></SheetTitle>
                <SheetDescription>
                  <Localized en="Research, projects, and notes by Yihan Meng." zh="蒙一涵的研究、项目与笔记。" />
                </SheetDescription>
                <nav className="sheet-nav" aria-label="Mobile navigation">
                  {[['/', 'Home', '首页'] as const, ...links].map(([href, en, zh]) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={(href === '/' ? pathname === '/' : isActive(href)) ? 'page' : undefined}
                    >
                      <Localized en={en} zh={zh} />
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      {searchLoaded && <SiteSearch index={index} open={searchOpen} onOpenChange={setSearchOpen} />}
    </>
  );
}
