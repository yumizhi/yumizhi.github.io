import type { ReactNode } from 'react';
import { ArrowLeft, ArrowUpRight, Download, FileText } from 'lucide-react';
import { papers, type Paper } from '@/lib/content';
import { asset } from '@/lib/paths';
import { Localized } from './language';
import { CopyButton } from './disclosure';
import { Button } from './ui/button';
import { TransitionLink } from './providers';
import { PaperNav } from './tide/paper-controls';
import './tide/paper.css';

type PaperArticleProps = {
  paper:Paper; title?:ReactNode; authorNotes:string[]; affiliations:string[];
  abstractBreaks:RegExp; children:ReactNode;
};

export function PaperArticle({paper,title,authorNotes,affiliations,abstractBreaks,children}:PaperArticleProps){
  const nextIndex=(papers.findIndex(item=>item.slug===paper.slug)+1)%papers.length;
  const related=papers[nextIndex];
  return <article className="tide-paper">
    <header className="tide-masthead">
      <TransitionLink className="paper-back" href="/research/"><ArrowLeft size={14}/><Localized en="Research" zh="研究"/></TransitionLink>
      <p className="tide-venue">{paper.venue} {paper.year}{paper.slug==='sasbo'&&' · Oral'}</p>
      <h1 lang="en">{title ?? paper.title}</h1>
      <ul className="tide-byline" aria-label="Authors" lang="en">
        {paper.authors.map((author,i)=><li key={author}>{author}<sup>{authorNotes[i]}</sup></li>)}
      </ul>
      <ol className="tide-affiliations" aria-label="Affiliations" lang="en">
        {affiliations.map((name,i)=><li key={name}>{affiliations.length>1&&<sup>{i+1}</sup>}{name}</li>)}
      </ol>
      {authorNotes.some(note=>note.includes('*'))&&<p className="tide-corresponding"><Localized en="* Corresponding author" zh="* 通讯作者"/></p>}
      <div className="tide-paper-actions">
        <Button asChild><a target="_blank" rel="noreferrer" href={asset(paper.paper)}>
          <FileText size={15}/><Localized en="Paper" zh="论文"/>
        </a></Button>
        <Button variant="secondary" asChild><a download href={asset(paper.paper)}>
          <Download size={15}/><Localized en="Download PDF" zh="下载 PDF"/>
        </a></Button>
        {paper.publisher&&<Button variant="secondary" asChild><a href={paper.publisher} target="_blank" rel="noreferrer"><Localized en="Publisher" zh="出版页面"/><ArrowUpRight size={14}/></a></Button>}
      </div>
    </header>
    <aside className="tide-navigation"><PaperNav/></aside>
    <div className="tide-document">
    <section id="abstract" className="tide-abstract tide-bound">
      <h2><Localized en="Abstract" zh="摘要"/></h2>
      <div lang="en">{paper.abstract.split(abstractBreaks).map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div>
    </section>
    {children}
    <section className="tide-citation" id="citation">
      <div className="tide-reading">
        <div className="tide-bib-heading"><h2>BibTeX</h2><CopyButton text={paper.bibtex}/></div>
        <pre className="bibtex"><code>{paper.bibtex}</code></pre>
      </div>
    </section>
    <footer className="tide-paper-footer">
      <TransitionLink href="/research/"><ArrowLeft size={15}/><Localized en="All publications" zh="全部论文"/></TransitionLink>
      <TransitionLink href={'/research/'+related.slug+'/'}>{related.shortTitle} <span aria-hidden="true">→</span></TransitionLink>
    </footer>
    </div>
  </article>;
}
