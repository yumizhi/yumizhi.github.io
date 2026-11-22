import { studyOpenings } from './paper-figures/study-openings';
import type { ReactNode } from 'react';
import { ArrowLeft, ArrowUpRight, Download, FileText } from 'lucide-react';
import { papers, type Paper } from '@/lib/content';
import { asset } from '@/lib/paths';
import { ArticleProgress } from './article-progress';
import { CopyButton } from './disclosure';
import { Localized } from './language';
import { TransitionLink } from './providers';
import { PaperNav } from './tide/paper-controls';
import { PaperReaderToolbar, PaperReadNext } from './paper-navigation';
import './tide/paper.css';
import './article-editorial.css';

type PaperArticleProps = {
  paper: Paper;
  title?: ReactNode;
  authorNotes: string[];
  affiliations: string[];
  overviewFigure?: ReactNode;
  children: ReactNode;
};

export function PaperArticle({ paper, title, authorNotes, affiliations, overviewFigure, children }: PaperArticleProps) {
  const opening = studyOpenings[paper.slug as keyof typeof studyOpenings];
  const nextIndex = (papers.findIndex(item => item.slug === paper.slug) + 1) % papers.length;
  const current = { slug: paper.slug, shortTitle: paper.shortTitle, venue: paper.venue, year: paper.year };
  const paperLinks = papers.map(({ slug, shortTitle, venue, year }) => ({ slug, shortTitle, venue, year }));

  return (
    <article className="tide-paper editorial-paper" data-study={paper.slug}>
      <ArticleProgress />
      <div className="paper-reader-sticky">
        <PaperReaderToolbar current={current} choices={paperLinks}>
          <PaperNav expanded={paper.slug === 'tide'} />
        </PaperReaderToolbar>
      </div>
      <header className="paper-masthead-band">
        <div className="tide-masthead">
          <h1 lang="en">{title ?? paper.title}</h1>
          <ul className="tide-byline" aria-label="Authors" lang="en">
            {paper.authors.map((author, i) => <li key={author}>{author}<sup>{authorNotes[i]}</sup></li>)}
          </ul>
          <ol className="tide-affiliations" aria-label="Affiliations" lang="en">
            {affiliations.map((name, i) => <li key={name}>{affiliations.length > 1 && <sup>{i + 1}</sup>}{name}</li>)}
          </ol>
          {authorNotes.some(note => note.includes('*')) && <p className="tide-corresponding"><Localized en="* Corresponding author" zh="* 通讯作者" /></p>}
          <p className="tide-venue">{paper.venue} {paper.year}{paper.slug === 'sasbo' && ' · Oral'}</p>
          <div className="tide-paper-actions">
            <a target="_blank" rel="noreferrer" href={asset(paper.paper)}><FileText size={15} aria-hidden="true" /><Localized en="Paper" zh="论文" /></a>
            <a download href={asset(paper.paper)}><Download size={15} aria-hidden="true" /><Localized en="Download PDF" zh="下载 PDF" /></a>
            {paper.publisher && <a href={paper.publisher} target="_blank" rel="noreferrer"><Localized en="Publisher" zh="出版页面" /><ArrowUpRight size={14} aria-hidden="true" /></a>}
          </div>
        </div>
      </header>
      <div className="paper-body-grid">
        <div className="tide-document">
          <section id="abstract" className="tide-abstract tide-bound" aria-labelledby="paper-abstract-heading">
            <h2 id="paper-abstract-heading"><Localized en="Abstract" zh="原文摘要" /></h2>
            <p lang="en">{paper.abstract}</p>
          </section>
          <section id="overview" className="tide-abstract tide-bound" aria-labelledby="paper-overview-heading">
            <h2 id="paper-overview-heading"><Localized {...opening.title} /></h2>
            {opening.paragraphs.map(paragraph => (
              <p key={paragraph.en}><Localized {...paragraph} /></p>
            ))}
          </section>
          {overviewFigure}
          {children}
          <section className="tide-citation" id="citation">
            <div className="tide-reading">
              <div className="tide-bib-heading"><h2>BibTeX</h2><CopyButton text={paper.bibtex} /></div>
              <pre className="bibtex"><code>{paper.bibtex}</code></pre>
            </div>
          </section>
          <footer className="tide-paper-footer">
            <TransitionLink href="/research/"><ArrowLeft size={15} aria-hidden="true" /><Localized en="All publications" zh="全部论文" /></TransitionLink>
            <PaperReadNext next={paperLinks[nextIndex]} />
          </footer>
        </div>
      </div>
    </article>
  );
}
