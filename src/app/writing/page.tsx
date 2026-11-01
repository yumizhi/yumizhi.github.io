import {absoluteURL} from '@/lib/paths';
import type {Metadata} from 'next';
import {getPosts} from '@/lib/posts';
import {WritingIndex} from '@/components/writing-index';
export const metadata:Metadata={title:'Writing',description:'Notes and project guides from Yihan Meng’s research homepage.',alternates:{canonical:absoluteURL('/writing/')}};
export default function Writing(){return <div className="shell"><header className="page-heading"><span className="eyebrow">Notes & Project Guides</span><h1>Writing</h1><p>A place for research notes, technical guides, and the details behind the work.</p></header><WritingIndex posts={getPosts().map(({content,...post})=>post)}/></div>;}
