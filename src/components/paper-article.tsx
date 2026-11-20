import type { ReactNode } from 'react';
import { ArrowLeft, ArrowUpRight, Download, FileText } from 'lucide-react';
import { papers, type Paper } from '@/lib/content';
import { asset } from '@/lib/paths';
import { ArticleProgress } from './article-progress';
import { CopyButton } from './disclosure';
import { Localized } from './language';
import { TransitionLink } from './providers';
import { PaperNav } from './tide/paper-controls';
import { TideCover } from './research-experiment/tide-cover';
import './tide/paper.css';
import './article-editorial.css';

type PaperArticleProps = {
  paper: Paper;
  title?: ReactNode;
  authorNotes: string[];
  affiliations: string[];
  abstractBreaks: RegExp;
  children: ReactNode;
};

export function PaperArticle({ paper, title, authorNotes, affiliations, abstractBreaks, children }: PaperArticleProps) {
  const nextIndex = (papers.findIndex(item => item.slug === paper.slug) + 1) % papers.length;
  const related = papers[nextIndex];

  return (
    <article className="tide-paper editorial-paper" data-study={paper.slug}>
      <ArticleProgress />
      <header className="paper-masthead-band">
        <div className="tide-masthead">
          <TransitionLink className="paper-back" href="/research/"><ArrowLeft size={14} aria-hidden="true" /><Localized en="Research" zh="研究" /></TransitionLink>
          <p className="tide-venue">{paper.venue} {paper.year}{paper.slug === 'sasbo' && ' · Oral'}</p>
          <h1 lang="en">{title ?? paper.title}</h1>
          <p className="paper-standfirst"><Localized en={paper.summary} zh={paper.summaryZh ?? paper.summary} /></p>
          <ul className="tide-byline" aria-label="Authors" lang="en">
            {paper.authors.map((author, i) => <li key={author}>{author}<sup>{authorNotes[i]}</sup></li>)}
          </ul>
          <details className="paper-affiliation-details">
            <summary><Localized en="Author affiliations" zh="作者单位" /></summary>
            <ol className="tide-affiliations" aria-label="Affiliations" lang="en">
              {affiliations.map((name, i) => <li key={name}>{affiliations.length > 1 && <sup>{i + 1}</sup>}{name}</li>)}
            </ol>
            {authorNotes.some(note => note.includes('*')) && <p className="tide-corresponding"><Localized en="* Corresponding author" zh="* 通讯作者" /></p>}
          </details>
          <div className="tide-paper-actions">
            <a target="_blank" rel="noreferrer" href={asset(paper.paper)}><FileText size={15} aria-hidden="true" /><Localized en="Paper" zh="论文" /></a>
            <a download href={asset(paper.paper)}><Download size={15} aria-hidden="true" /><Localized en="Download PDF" zh="下载 PDF" /></a>
            {paper.publisher && <a href={paper.publisher} target="_blank" rel="noreferrer"><Localized en="Publisher" zh="出版页面" /><ArrowUpRight size={14} aria-hidden="true" /></a>}
          </div>
        </div>
      </header>
      <div className="paper-body-grid">
        <aside className="tide-navigation"><PaperNav expanded={paper.slug === 'tide'} /></aside>
        <div className="tide-document">
          <section id="abstract" className="tide-abstract tide-bound">
            <h2><Localized en="Abstract" zh="摘要" /></h2>
            <div lang="en">{paper.abstract.split(abstractBreaks).map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
          </section>
          {paper.slug === 'tide' && (
            <figure className="paper-intro-figure">
              <TideCover />
              <figcaption><Localized en="Image samples generated with TIDE (Figure 2)." zh="采用 TIDE 生成的图像样例（论文图 2）。" /></figcaption>
            </figure>
          )}
          {children}
          <section className="tide-citation" id="citation">
            <div className="tide-reading">
              <div className="tide-bib-heading"><h2>BibTeX</h2><CopyButton text={paper.bibtex} /></div>
              <pre className="bibtex"><code>{paper.bibtex}</code></pre>
            </div>
          </section>
          <footer className="tide-paper-footer">
            <TransitionLink href="/research/"><ArrowLeft size={15} aria-hidden="true" /><Localized en="All publications" zh="全部论文" /></TransitionLink>
            <TransitionLink href={`/research/${related.slug}/`}>{related.shortTitle} <span aria-hidden="true">→</span></TransitionLink>
          </footer>
        </div>
      </div>
    </article>
  );
}
