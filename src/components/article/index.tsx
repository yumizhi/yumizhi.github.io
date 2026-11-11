import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import katex from 'katex';
import { ArrowLeft, ArrowRight, ArrowUpRight, FileText } from 'lucide-react';
import { Localized } from '@/components/language';
import { papers, type Paper } from '@/lib/content';
import { asset } from '@/lib/paths';
import { CopyButton } from './copy-button';
import { Toc, type TocItem } from './toc';

type Bilingual = { en: ReactNode; zh: ReactNode };

export type ArticleProps = {
  paper: Paper;
  /** Signature hue for this paper's figures: a CSS colour token name. */
  hue: 'tide' | 'attack' | 'meta';
  kicker: Bilingual;
  deck: Bilingual;
  authors: { name: string; marks: string }[];
  affiliations: string[];
  banner: ReactNode;
  contents: TocItem[];
  children: ReactNode;
};

/** The shared frame of every research article: masthead, banner, contents rail, citation. */
export function Article({ paper, hue, kicker, deck, authors, affiliations, banner, contents, children }: ArticleProps) {
  const next = papers[(papers.findIndex(item => item.slug === paper.slug) + 1) % papers.length];
  return (
    <article className="article" style={{ '--hue': `var(--${hue})`, '--hue-soft': `var(--${hue}-soft)` } as CSSProperties}>
      <header className="shell masthead">
        <Link className="arrow-link masthead-back" href="/research/">
          <ArrowLeft size={14} aria-hidden="true" />
          <Localized en="Research" zh="研究" />
        </Link>
        <p className="label masthead-kicker"><Localized en={kicker.en} zh={kicker.zh} /></p>
        <h1 className="display" lang="en">{paper.title}</h1>
        <p className="masthead-deck"><Localized en={deck.en} zh={deck.zh} /></p>
      </header>

      <div className="shell article-banner">{banner}</div>

      <div className="shell">
      <dl className="masthead-meta">
        <div>
          <dt className="label"><Localized en="Authors" zh="作者" /></dt>
          <dd lang="en">
            <ul className="author-list" aria-label="Authors">
              {authors.map(author => (
                <li key={author.name} data-self={author.name === 'Yihan Meng' || undefined}>
                  {author.name}<sup>{author.marks}</sup>
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt className="label"><Localized en="Affiliations" zh="单位" /></dt>
          <dd lang="en">
            <ol className="affiliation-list">
              {affiliations.map((name, index) => (
                <li key={name}>{affiliations.length > 1 && <sup>{index + 1}</sup>}{name}</li>
              ))}
            </ol>
            {authors.some(author => author.marks.includes('*')) && (
              <p className="masthead-note"><Localized en="* Corresponding author" zh="* 通讯作者" /></p>
            )}
          </dd>
        </div>
        <div>
          <dt className="label"><Localized en="Published" zh="发表" /></dt>
          <dd>{paper.venue} {paper.year}</dd>
          <dd className="masthead-actions">
            <a className="pill" data-variant="solid" href={asset(paper.paper)} target="_blank" rel="noreferrer">
              <FileText size={14} aria-hidden="true" />
              <Localized en="Paper" zh="论文" />
            </a>
            {paper.publisher && (
              <a className="pill" href={paper.publisher} target="_blank" rel="noreferrer">
                <Localized en="Publisher" zh="出版页面" />
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            )}
            <a className="pill" href="#citation">BibTeX</a>
          </dd>
        </div>
      </dl>
      </div>

      <div className="shell article-layout">
        <aside className="article-rail"><Toc items={contents} /></aside>
        <div className="article-body">
          {children}
          <section className="article-section" id="citation">
            <div className="citation-heading">
              <h2 className="display"><Localized en="Cite this work" zh="引用" /></h2>
              <CopyButton text={paper.bibtex} />
            </div>
            <pre className="bibtex" lang="en"><code>{paper.bibtex}</code></pre>
          </section>
          <footer className="article-footer">
            <Link className="arrow-link" href="/research/">
              <ArrowLeft size={14} aria-hidden="true" />
              <Localized en="All research" zh="全部研究" />
            </Link>
            <Link className="arrow-link" data-direction="right" href={`/research/${next.slug}/`}>
              <span><Localized en="Next" zh="下一篇" />: {next.shortTitle}</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </footer>
        </div>
      </div>
    </article>
  );
}

/** A numbered chapter of the article. `id` must match an entry in the contents rail. */
export function Section({ id, number, title, children }: { id: string; number: string; title: Bilingual; children: ReactNode }) {
  return (
    <section className="article-section" id={id} aria-labelledby={`${id}-title`}>
      <p className="label section-number">{number}</p>
      <h2 className="display" id={`${id}-title`}><Localized en={title.en} zh={title.zh} /></h2>
      {children}
    </section>
  );
}

/** Running prose in both languages. */
export function P({ en, zh }: Bilingual) {
  return <p className="prose"><Localized en={en} zh={zh} /></p>;
}

export function Summary({ children }: { children: ReactNode }) {
  return (
    <aside className="summary" aria-label="Summary">
      <p className="label">TL;DR</p>
      {children}
    </aside>
  );
}

export function Callout({ title, children }: { title: Bilingual; children: ReactNode }) {
  return (
    <aside className="callout">
      <p className="callout-title"><Localized en={title.en} zh={title.zh} /></p>
      {children}
    </aside>
  );
}

type FigureProps = {
  number: number | string;
  caption: Bilingual;
  /** `paper` reproduces a published figure; `data` plots reported or measured numbers; `concept` is an explanatory drawing. */
  kind: 'paper' | 'data' | 'concept';
  width?: 'text' | 'wide';
  children: ReactNode;
};

const kindLabel = {
  paper: { en: 'From the paper', zh: '论文原图' },
  data: { en: 'Data', zh: '数据' },
  concept: { en: 'Conceptual illustration', zh: '概念示意' },
};

export function Figure({ number, caption, kind, width = 'text', children }: FigureProps) {
  return (
    <figure className="figure" data-width={width} id={`figure-${number}`}>
      <div className="figure-stage">{children}</div>
      <figcaption>
        <span className="label figure-number">
          <Localized en={`Figure ${number}`} zh={`图 ${number}`} /> · <Localized en={kindLabel[kind].en} zh={kindLabel[kind].zh} />
        </span>
        <span className="figure-caption"><Localized en={caption.en} zh={caption.zh} /></span>
      </figcaption>
    </figure>
  );
}

/** Display equation, rendered to HTML at build time. */
export function Equation({ tex, label }: { tex: string; label?: string }) {
  const html = katex.renderToString(tex, { displayMode: true, throwOnError: true });
  return (
    <div className="equation" role="math" aria-label={label ?? tex}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

/** Inline maths. */
export function M({ tex }: { tex: string }) {
  return <span className="math-inline" dangerouslySetInnerHTML={{ __html: katex.renderToString(tex, { throwOnError: true }) }} />;
}
