import {absoluteURL} from '@/lib/paths';
import type {Metadata} from 'next';
import {ResourcesIndex} from '@/components/resources-index';
import {Localized} from '@/components/language';
export const metadata:Metadata={title:'Resources',description:'Papers, CV, slides, and posters. Preview and download original documents.',alternates:{canonical:absoluteURL('/resources/')}};
export default function Resources(){return <div className="shell"><header className="page-heading"><h1><Localized en="Resources" zh="资料与文档"/></h1><p><Localized en="Read or download papers and supporting documents." zh="浏览或下载论文与相关文档。"/></p></header><ResourcesIndex/></div>;}
