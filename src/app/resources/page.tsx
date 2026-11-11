import type { Metadata } from 'next';
import { ResourcesIndex } from '@/components/resources-index';
import { Localized } from '@/components/language';
import { absoluteURL } from '@/lib/paths';

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Papers, CV, slides, and posters. Preview and download original documents.',
  alternates: { canonical: absoluteURL('/resources/') },
};

export default function Resources() {
  return (
    <div className="shell page">
      <header className="page-heading">
        <p className="label"><Localized en="Documents" zh="文档" /></p>
        <h1 className="display"><Localized en="Resources" zh="资料与文档" /></h1>
        <p><Localized en="Read or download papers and supporting documents." zh="浏览或下载论文与相关文档。" /></p>
      </header>
      <ResourcesIndex />
    </div>
  );
}
