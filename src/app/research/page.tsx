import {absoluteURL} from '@/lib/paths';
import type { Metadata } from 'next';
import { ResearchIndex } from '@/components/research-index';
import { Localized } from '@/components/language';
export const metadata:Metadata={title:'Research',description:'Selected publications on watermarking, generative models, and adversarial learning.',alternates:{canonical:absoluteURL('/research/')}};
export default function Research(){return <div className="shell"><header className="page-heading"><h1><Localized en="Research" zh="研究成果"/></h1><p><Localized en="Publications on watermarking, generative models, and adversarial learning." zh="关于图像水印、生成模型与对抗学习的研究论文。"/></p></header><ResearchIndex/></div>;}
