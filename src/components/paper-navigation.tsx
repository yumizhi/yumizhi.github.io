'use client';

import { Suspense, type ReactNode } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, ChevronsUpDown, X } from 'lucide-react';
import { Button } from './ui/coss/button';
import { Menu, MenuLinkItem, MenuPopup, MenuTrigger } from './ui/coss/menu';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet';
import { Localized, useLanguage } from './language';
import './ui/cupertino/glass.css';
import type { Paper } from '@/lib/content';

type PaperLink = Pick<Paper, 'slug' | 'shortTitle' | 'venue' | 'year'>;
type ReaderLinks = { current: PaperLink; choices: PaperLink[]; children: ReactNode };

const detailUrl = (slug: string, fromHome: boolean) =>
  `/research/${slug}/${fromHome ? '?from=home' : ''}`;

function ReaderToolbar({ current, choices, fromHome, children }: ReaderLinks & { fromHome: boolean }) {
  const { language } = useLanguage();
  const pickerLabel = language === 'zh' ? `论文，当前为 ${current.shortTitle}` : `Papers, switch publication, current: ${current.shortTitle}`;
  const pickerTitle = <Localized en="Papers" zh="论文" />;
  const pickerContent = <>{pickerTitle}<ChevronsUpDown size={13} aria-hidden="true" /></>;
  return (
    <div className="paper-reader-toolbar" role="group" aria-label={language === 'zh' ? '论文导航' : 'Publication navigation'}>
      <div className="reader-dock reader-glass" data-page-lens="">
        <Button className="reader-back" variant="ghost" size="sm"
          aria-label={fromHome ? (language === 'zh' ? '回到首页' : 'Back to home') : (language === 'zh' ? '全部论文' : 'All publications')}
          render={<Link href={fromHome ? '/#publications' : '/research/'} />}>
          <ArrowLeft aria-hidden="true" />
          <span className="reader-back-label" aria-hidden="true">
            {fromHome ? <Localized en="Back to home" zh="回到首页" /> : <Localized en="All publications" zh="全部论文" />}
          </span>
        </Button>
        {children}
        <Menu>
          <MenuTrigger render={<Button variant="secondary" size="sm" className="reader-switch reader-switch-menu" />}
            aria-label={pickerLabel}>
            {pickerContent}
          </MenuTrigger>
          <MenuPopup align="end" sideOffset={6} className="reader-menu reader-glass glass-menu">
            {choices.map((paper) => (
              <MenuLinkItem key={paper.slug} render={<Link href={detailUrl(paper.slug, fromHome)} />}
                aria-current={current.slug === paper.slug ? 'page' : undefined} label={paper.shortTitle}>
                <span className="reader-menu-description"><strong>{paper.shortTitle}</strong><small>{paper.venue} {paper.year}</small></span>
                {current.slug === paper.slug && <Check aria-hidden="true" />}
              </MenuLinkItem>
            ))}
          </MenuPopup>
        </Menu>
        <Sheet>
          <SheetTrigger asChild>
            <button type="button" className="reader-switch reader-switch-sheet" aria-label={pickerLabel}>
              {pickerContent}
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" showCloseButton={false} aria-describedby={undefined} className="reader-paper-sheet">
            <div className="reader-sheet-heading">
              <SheetTitle>{pickerTitle}</SheetTitle>
              <SheetClose className="reader-sheet-close" aria-label={language === 'zh' ? '关闭' : 'Close'}>
                <X size={17} aria-hidden="true" />
              </SheetClose>
            </div>
            <ul className="reader-sheet-list">
              {choices.map(paper => (
                <li key={paper.slug}>
                  <SheetClose asChild>
                    <Link href={detailUrl(paper.slug, fromHome)} aria-current={current.slug === paper.slug ? 'page' : undefined}>
                      <span className="reader-menu-description"><strong>{paper.shortTitle}</strong><small>{paper.venue} {paper.year}</small></span>
                      {current.slug === paper.slug && <Check size={17} aria-hidden="true" />}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

function ContextualReaderToolbar(props: ReaderLinks) {
  const fromHome = useSearchParams().get('from') === 'home';
  return <ReaderToolbar {...props} fromHome={fromHome} />;
}

export function PaperReaderToolbar(props: ReaderLinks) {
  return (
    <Suspense fallback={<ReaderToolbar {...props} fromHome={false} />}>
      <ContextualReaderToolbar {...props} />
    </Suspense>
  );
}

function ReaderNext({ next, fromHome }: { next: PaperLink; fromHome: boolean }) {
  return (
    <Link className="reader-next" href={detailUrl(next.slug, fromHome)}>
      <span><small><Localized en="Next publication" zh="下一篇论文" /></small><strong>{next.shortTitle}</strong></span>
      <ArrowRight size={18} aria-hidden="true" />
    </Link>
  );
}

function ContextualReaderNext({ next }: { next: PaperLink }) {
  const fromHome = useSearchParams().get('from') === 'home';
  return <ReaderNext next={next} fromHome={fromHome} />;
}

export function PaperReadNext({ next }: { next: PaperLink }) {
  return (
    <Suspense fallback={<ReaderNext next={next} fromHome={false} />}>
      <ContextualReaderNext next={next} />
    </Suspense>
  );
}
