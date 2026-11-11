import type { Metadata } from 'next';
import { ResearchIndex } from '@/components/research-index';
import { Localized } from '@/components/language';
import { absoluteURL } from '@/lib/paths';

export const metadata: Metadata = {
  title: 'Research',
  description: 'Publications by Yihan Meng on diffusion-model watermarking and sparse adversarial attacks, each with a full research article.',
  alternates: { canonical: absoluteURL('/research/') },
};

export default function Research() {
  return (
    <div className="shell page">
      <header className="page-heading">
        <p className="label"><Localized en="Publications" zh="论文" /></p>
        <h1 className="display"><Localized en="Research" zh="研究成果" /></h1>
        <p>
          <Localized
            en="Papers on watermarking for diffusion models and on sparse adversarial attacks. Each one has an article that walks through the problem, the method and the results."
            zh="关于扩散模型水印与稀疏对抗攻击的论文。每篇都配有一篇研究文章，依次讲解问题、方法与实验结果。"
          />
        </p>
      </header>
      <ResearchIndex />
    </div>
  );
}
