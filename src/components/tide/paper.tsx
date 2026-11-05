import { ArrowLeft, Download, FileText } from 'lucide-react';
import type { Paper } from '@/lib/content';
import { asset } from '@/lib/paths';
import { CopyButton } from '../disclosure';
import { Localized } from '../language';
import { TransitionLink } from '../providers';
import { Button } from '../ui/button';
import { TideComparison } from './comparison';
import { PaperNav, PipelineInset } from './paper-controls';
import './paper.css';

const authorNotes = ['1,2', '1,3', '4', '1,2', '1,2,*'];
const affiliations = [
  'State Key Laboratory of Novel Software Technology, Nanjing University',
  'School of Computer Science, Nanjing University',
  'School of Management, Nanjing University of Posts and Telecommunications',
  'Guodian Nanjing Automation Co., Ltd.',
];
// SD 2.1, Table 1. Attacked values are the means over seven settings.
const verification = [
  ['Tree-Ring (key)', '1.000', '0.694', '0.975'],
  ['Tree-Ring (paired)', '1.000', '0.765', '0.962'],
  ['ROBIN', '1.000', '0.825', '0.981'],
  ['TIDE', '1.000', '0.986', '0.999'],
];

export function TidePaper({paper}:{paper:Paper}){
  const [methodTitle, modelScope] = paper.title.split(' for ');
  return <article className="tide-paper">
    <header className="tide-masthead">
      <p className="tide-venue">{paper.venue} {paper.year}</p>
      <h1 lang="en">{methodTitle} <span className="tide-title-scope">for {modelScope}</span></h1>
      <ul className="tide-byline" aria-label="Authors" lang="en">
        {paper.authors.map((author,i)=><li key={author}>{author}<sup>{authorNotes[i]}</sup></li>)}
      </ul>
      <ol className="tide-affiliations" aria-label="Affiliations" lang="en">
        {affiliations.map((name,i)=><li key={name}><sup>{i+1}</sup>{name}</li>)}
      </ol>
      <p className="tide-corresponding"><Localized en="* Corresponding author" zh="* 通讯作者"/></p>
      <div className="tide-paper-actions">
        <Button asChild><a target="_blank" rel="noreferrer" href={asset(paper.paper)}>
          <FileText size={15}/><Localized en="Paper" zh="论文"/>
        </a></Button>
        <Button variant="secondary" asChild><a download href={asset(paper.paper)}>
          <Download size={15}/><Localized en="Download PDF" zh="下载 PDF"/>
        </a></Button>
      </div>
    </header>
    <PaperNav/>
    <section id="abstract" className="tide-abstract tide-bound">
      <h2><Localized en="Abstract" zh="摘要"/></h2>
      <div lang="en">{paper.abstract.split(/ (?=We propose TIDE,|Verification uses )/).map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div>
    </section>
    <section id="method" className="tide-method-band">
      <div className="tide-bound">
        <header className="tide-chapter-head">
          <p className="tide-kicker"><Localized en="Method" zh="研究方法"/></p>
          <h2><Localized en="Guiding the watermark after injection" zh="水印注入后，如何引导后续去噪"/></h2>
        </header>
        <p className="tide-prose"><Localized
          en={<>Once a watermark enters the latent, the remaining denoising steps can weaken it. Strengthening it indiscriminately can also pull the image away from the prompt. TIDE learns a watermark and an auxiliary condition together, then uses <strong>the recent direction of text guidance</strong> to decide how much of the watermark update to keep at each step.</>}
          zh={<>水印写入潜变量之后，还要经过多步去噪。这个过程可能削弱水印，而一味加大水印引导，又可能改变提示词原本要生成的内容。TIDE 联合学习水印和辅助条件，再根据<strong>最近几步的文本引导方向</strong>，决定每一步保留哪些水印更新分量。</>}/></p>
        <figure className="tide-overview">
          <a href={asset('/images/tide-paper/overview.webp')} target="_blank" rel="noreferrer">
            <img loading="lazy" width="1800" height="1383" src={asset('/images/tide-paper/overview.webp')}
              alt="TIDE architecture: intermediate watermark injection, trajectory-aware guidance and inversion-based verification."/>
          </a>
          <figcaption lang="en"><strong>Figure 1: Overview of TIDE.</strong> A learnable watermark is injected into an intermediate latent state. After injection, TIDE projects the watermark residual away from recent text-guidance directions and assigns an adaptive guidance budget. Verification partially inverts a queried image with an empty prompt and matches the recovered Fourier coefficients to the target watermark.</figcaption>
        </figure>
        <p className="tide-prose tide-demo-intro"><Localized en="In the sampling example, the watermark enters at step 35. From that step onward, follow the text and watermark predictions separately to see how their overlap changes the sampler’s update." zh="在下面的采样示例中，水印在第 35 步注入。从这一步起，可以分别查看文本与水印的预测，以及两者的重合分量如何影响采样更新。"/></p>
        <PipelineInset/>
      </div>
    </section>
    <section id="examples" className="tide-results tide-bound">
      <header className="tide-chapter-head">
        <p className="tide-kicker"><Localized en="Results" zh="实验结果"/></p>
        <h2><Localized en="What changes in the generated image?" zh={<>加入水印后，<span className="tide-heading-phrase">画面如何变化？</span></>}/></h2>
      </header>
      <p className="tide-prose"><Localized en="Look at the sports car. Tree-Ring shows it from behind, while TIDE retains the front wheel and the viewpoint of the unwatermarked image. Select another prompt to compare the composition and finer details." zh="先看跑车。Tree-Ring 生成的是车尾，TIDE 则保留了无水印图像中的前轮和车头视角。换一组提示词，可以继续对照主体的位置、构图和纹理。"/></p>
      {paper.image&&<TideComparison original={paper.image}/>}
      <div className="tide-quant">
        <h3><Localized en="Detection after image edits" zh="图像编辑后，水印还能否检出？"/></h3>
        <p className="tide-prose"><Localized
          en={<>Without edits, both ROBIN and TIDE detect all watermarked images at a 1% false-positive rate. Across seven attack settings on Stable Diffusion 2.1, mean detection at the same threshold is <strong>82.5% for ROBIN and 98.6% for TIDE</strong>.</>}
          zh={<>在 1% 的假阳性率下，ROBIN 和 TIDE 都能检出全部未经编辑的水印图像。差别出现在编辑之后：在 Stable Diffusion 2.1 的七类攻击设置下，同一阈值对应的平均检出率分别为 <strong>82.5% 和 98.6%</strong>。</>}/></p>
        <div className="tide-table-wrap">
          <table>
            <caption><Localized en="Table 1 · Selected verification results on SD 2.1" zh="表 1 · SD 2.1 水印检测结果节选"/></caption>
            <thead>
              <tr><th rowSpan={2} scope="col"><Localized en="Method" zh="方法"/></th><th scope="colgroup"><Localized en="No attack" zh="无攻击"/></th><th colSpan={2} scope="colgroup"><Localized en="After attack · mean" zh="攻击后 · 均值"/></th></tr>
              <tr><th scope="col">TPR¹</th><th scope="col">TPR¹</th><th scope="col">AUC</th></tr>
            </thead>
            <tbody>{verification.map(([name,clean,attacked,auc])=><tr key={name}><th scope="row">{name}</th><td>{clean}</td><td>{attacked}</td><td>{auc}</td></tr>)}</tbody>
          </table>
          <p><Localized en="¹ True positive rate at 1% false positives." zh="¹ 假阳性率为 1% 时的真阳性率。"/></p>
        </div>
      </div>
    </section>
    <section className="tide-citation" id="citation">
      <div className="tide-reading">
        <div className="tide-bib-heading"><h2>BibTeX</h2><CopyButton text={paper.bibtex}/></div>
        <pre className="bibtex"><code>{paper.bibtex}</code></pre>
      </div>
    </section>
    <footer className="tide-paper-footer">
      <TransitionLink href="/research/"><ArrowLeft size={15}/><Localized en="All publications" zh="全部论文"/></TransitionLink>
      <TransitionLink href="/research/sasbo/">SASBO <span aria-hidden="true">→</span></TransitionLink>
    </footer>
  </article>;
}
