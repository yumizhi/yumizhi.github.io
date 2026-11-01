import Link from 'next/link';
export default function NotFound(){return <div className="shell page-heading" style={{minHeight:'60vh'}}><p className="eyebrow">404</p><h1>A page to come back to.</h1><p>This address has no page. <Link href="/" style={{color:'var(--primary)'}}>Return to the homepage →</Link></p></div>;}
