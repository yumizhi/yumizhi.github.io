import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Localized } from '@/components/language';

export default function NotFound() {
  return (
    <div className="shell page" style={{ minHeight: '60vh' }}>
      <header className="page-heading">
        <p className="label">404</p>
        <h1 className="display"><Localized en="This address has no page." zh="这个地址没有对应的页面。" /></h1>
        <p>
          <Link className="arrow-link" data-direction="right" href="/">
            <Localized en="Return to the homepage" zh="返回首页" /> <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </p>
      </header>
    </div>
  );
}
