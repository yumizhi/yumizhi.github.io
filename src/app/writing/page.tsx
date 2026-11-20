import {absoluteURL} from '@/lib/paths';
import type {Metadata} from 'next';
import {getWritingEntries} from '@/lib/posts';
import {WritingIndex} from '@/components/writing-index';
import {Localized} from '@/components/language';
import '../portfolio-editorial.css';

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Research notes by Yihan Meng.',
  alternates: { canonical: absoluteURL('/writing/') },
};

export default function Writing() {
  return <div className="editorial-shell portfolio-editorial writing-directory-page">
    <header className="portfolio-heading">
      <h1><Localized en="Writing" zh="文章与笔记" /></h1>
      <p><Localized en="Notes on model mechanisms, mathematical derivations and implementation." zh="记录模型机制、数学推导与实现细节。" /></p>
    </header>
    <WritingIndex posts={getWritingEntries()} />
  </div>;
}
