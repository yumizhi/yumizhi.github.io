'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, ChevronsUpDown } from 'lucide-react';
import { Button } from './ui/coss/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from './ui/coss/breadcrumb';
import { Menu, MenuLinkItem, MenuPopup, MenuTrigger } from './ui/coss/menu';
import { Localized, useLanguage } from './language';
import type { Paper } from '@/lib/content';

type PaperLink = Pick<Paper, 'slug' | 'shortTitle' | 'venue' | 'year'>;
type ReaderLinks = { current: PaperLink; choices: PaperLink[] };

const detailUrl = (slug: string, fromHome: boolean) =>
  `/research/${slug}/${fromHome ? '?from=home' : ''}`;

export function PaperBreadcrumb({ current }: { current: PaperLink }) {
  const { language } = useLanguage();
  return (
    <Breadcrumb className="paper-crumbs" aria-label={language === 'zh' ? '当前位置' : 'Publication breadcrumb'}>
      <BreadcrumbList>
        <BreadcrumbItem><BreadcrumbLink render={<Link href="/" />}><Localized en="Home" zh="首页" /></BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbLink render={<Link href="/research/" />}><Localized en="Research" zh="研究成果" /></BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#main-content" aria-current="page">{current.shortTitle}</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function ReaderToolbar({ current, choices, fromHome }: ReaderLinks & { fromHome: boolean }) {
  const { language } = useLanguage();
  return (
    <div className="paper-reader-toolbar" role="group" aria-label={language === 'zh' ? '论文导航' : 'Publication navigation'}>
      <Button className="reader-back" variant="ghost" size="sm" render={<Link href={fromHome ? '/#publications' : '/research/'} />}>
        <ArrowLeft aria-hidden="true" />
        {fromHome ? <Localized en="Back to home" zh="回到首页" /> : <Localized en="All publications" zh="全部论文" />}
      </Button>
      <Menu>
        <MenuTrigger render={<Button variant="secondary" size="sm" className="reader-switch" />}
          aria-label={language === 'zh' ? `论文，当前为 ${current.shortTitle}` : `Papers, switch publication, current: ${current.shortTitle}`}>
          <span><Localized en="Papers" zh="论文" /></span><ChevronsUpDown aria-hidden="true" />
        </MenuTrigger>
        <MenuPopup align="end" sideOffset={6} className="reader-menu">
          {choices.map((paper) => (
            <MenuLinkItem key={paper.slug} render={<Link href={detailUrl(paper.slug, fromHome)} />}
              aria-current={current.slug === paper.slug ? 'page' : undefined} label={paper.shortTitle}>
              <span className="reader-menu-description"><strong>{paper.shortTitle}</strong><small>{paper.venue} {paper.year}</small></span>
              {current.slug === paper.slug && <Check aria-hidden="true" />}
            </MenuLinkItem>
          ))}
        </MenuPopup>
      </Menu>
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
