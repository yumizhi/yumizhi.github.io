import type { Metadata } from 'next';
import { getWritingEntries } from '@/lib/posts';
import { WritingIndex } from '@/components/writing-index';
import { Localized } from '@/components/language';
import { absoluteURL } from '@/lib/paths';

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Research notes by Yihan Meng.',
  alternates: { canonical: absoluteURL('/writing/') },
};

export default function Writing() {
  return (
    <div className="shell page">
      <header className="page-heading">
        <p className="label"><Localized en="Notes" zh="笔记" /></p>
        <h1 className="display"><Localized en="Writing" zh="文章与笔记" /></h1>
        <p><Localized en="Notes on research." zh="一些研究笔记。" /></p>
      </header>
      <WritingIndex posts={getWritingEntries()} />
    </div>
  );
}
