import {absoluteURL} from '@/lib/paths';
import type { Metadata } from 'next';
import { ResearchIndex } from '@/components/research-index';
export const metadata:Metadata={title:'Research',description:'Selected publications on watermarking, generative models, and adversarial learning.',alternates:{canonical:absoluteURL('/research/')}};
export default function Research(){return <div className="shell"><header className="page-heading"><span className="eyebrow">Research & Publications</span><h1>Research</h1><p>Watermarking, generative models, and adversarial learning. Papers, figures, and the ideas behind them.</p></header><ResearchIndex/></div>;}
