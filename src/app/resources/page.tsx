import {absoluteURL} from '@/lib/paths';
import type {Metadata} from 'next';
import {ResourcesIndex} from '@/components/resources-index';
export const metadata:Metadata={title:'Resources',description:'Papers, CV, slides, and posters. Preview and download original documents.',alternates:{canonical:absoluteURL('/resources/')}};
export default function Resources(){return <div className="shell"><header className="page-heading"><span className="eyebrow">Files & Documents</span><h1>Resources</h1><p>Original papers and supporting materials, ready to read or keep.</p></header><ResourcesIndex/></div>;}
