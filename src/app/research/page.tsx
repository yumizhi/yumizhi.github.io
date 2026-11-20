import {absoluteURL} from '@/lib/paths';
import type { Metadata } from 'next';
import { ResearchIndex } from '@/components/research-index';
import { Localized } from '@/components/language';
export const metadata:Metadata={title:'Research',description:'Selected publications on watermarking, generative models, and adversarial learning.',alternates:{canonical:absoluteURL('/research/')}};
export default function Research() {
  return (
    <div className="editorial-shell directory-page">
      <header className="page-heading">
        <h1><Localized en="Research" zh="研究成果" /></h1>

      </header>
      <ResearchIndex />
    </div>
  );
}
