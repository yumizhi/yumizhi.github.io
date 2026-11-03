import { ArrowUpRight } from 'lucide-react';
import { asset } from '@/lib/paths';
import { Localized } from './language';
import { TransitionLink } from './providers';
import '@/app/tide-cover.css';

export function TideCover(){
 return <TransitionLink href="/research/tide/" className="diffusion-cover" aria-label="View TIDE research details"><img src={asset('/images/diffusion/tide-final.webp')} width="384" height="384" alt="Robot generated with TIDE, from Figure 2" loading="lazy"/><span className="diffusion-cover-shade"/><span className="diffusion-cover-eyebrow">TIDE <span>NeurIPS 2026</span></span><span className="diffusion-cover-title"><Localized en="Watermarking, with less interference." zh="让水印更少干扰生成。"/></span><span className="diffusion-cover-play"><Localized en="Read the research" zh="查看研究"/><ArrowUpRight size={14}/></span></TransitionLink>;
}
