import {absoluteURL} from '@/lib/paths';
import type {Metadata} from 'next';
import {ResourcesIndex} from '@/components/resources-index';
import {Localized} from '@/components/language';
export const metadata:Metadata={title:'Resources',description:'Preview and download papers and the CV.',alternates:{canonical:absoluteURL('/resources/')}};
export default function Resources() {
  return (
    <div className="editorial-shell directory-page">
      <header className="page-heading">
        <h1><Localized en="Resources" zh="资料与文档" /></h1>

      </header>
      <ResourcesIndex />
    </div>
  );
}
