import { ArrowLeft, Download, FileText } from 'lucide-react';
import type { Paper } from '@/lib/content';
import { asset } from '@/lib/paths';
import { Abstract, CopyButton } from '../disclosure';
import { Localized } from '../language';
import { TransitionLink } from '../providers';
import { Button } from '../ui/button';
import { TideComparison } from './comparison';
import { TideInline } from './entry';
import './paper.css';

const authorNotes = ['1,2', '1,3', '4', '1,2', '1,2,*'];
const affiliations = [
  'State Key Laboratory of Novel Software Technology, Nanjing University',
  'School of Computer Science, Nanjing University',
  'School of Management, Nanjing University of Posts and Telecommunications',
  'Guodian Nanjing Automation Co., Ltd.',
];
const sections = [
  {id:'examples', en:'Examples', zh:'图像对照'},
  {id:'method', en:'Method', zh:'方法'},
  {id:'interactive-method', en:'Demo', zh:'交互演示'},
  {id:'abstract', en:'Abstract', zh:'摘要'},
  {id:'citation', en:'BibTeX', zh:'BibTeX'},
];

export function TidePaper({paper}:{paper:Paper}){
  const [methodTitle, modelScope] = paper.title.split(' for ');
  return <article className="shell tide-paper">
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
    <nav className="tide-paper-nav" aria-label="Paper sections">
      {sections.map(({id,en,zh})=><a key={id} href={'#'+id}><Localized en={en} zh={zh}/></a>)}
    </nav>
    <section className="tide-paper-block" id="examples">
      <h2><Localized en="Visual comparison" zh="生成结果对照"/></h2>
      {paper.image&&<TideComparison original={paper.image}/>}
    </section>
    <section className="tide-paper-block" id="method">
      <h2><Localized en="How TIDE works" zh="TIDE 方法"/></h2>
      <figure className="tide-overview">
        <a href={asset('/images/tide-paper/overview.webp')} target="_blank" rel="noreferrer">
          <img loading="lazy" width="1800" height="1383" src={asset('/images/tide-paper/overview.webp')}
            alt="TIDE architecture: intermediate watermark injection, trajectory-aware guidance and inversion-based verification."/>
        </a>
        <figcaption lang="en">Figure 1: Overview of TIDE. A learnable watermark is injected into an intermediate latent state. After injection, TIDE projects the watermark residual away from recent text-guidance directions and assigns an adaptive guidance budget. Verification partially inverts a queried image with an empty prompt and matches the recovered Fourier coefficients to the target watermark.</figcaption>
      </figure>
    </section>
    <section className="tide-paper-block tide-demo">
      <h2><Localized en="Interactive pipeline" zh="交互流程"/></h2>
      <TideInline/>
    </section>
    <div className="tide-paper-block tide-paper-reading" id="abstract"><Abstract text={paper.abstract}/></div>
    <section className="tide-paper-block tide-paper-reading" id="citation">
      <div className="tide-bib-heading"><h2>BibTeX</h2><CopyButton text={paper.bibtex}/></div>
      <pre className="bibtex"><code>{paper.bibtex}</code></pre>
    </section>
    <footer className="tide-paper-footer">
      <TransitionLink href="/research/"><ArrowLeft size={15}/><Localized en="All publications" zh="全部论文"/></TransitionLink>
      <TransitionLink href="/research/sasbo/">SASBO <span aria-hidden="true">→</span></TransitionLink>
    </footer>
  </article>;
}
