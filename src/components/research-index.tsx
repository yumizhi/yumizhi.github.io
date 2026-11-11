'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Search } from 'lucide-react';
import { FilterTabs } from './filter-tabs';
import { Localized, useLanguage } from './language';
import { papers } from '@/lib/content';
import { asset } from '@/lib/paths';

const topics = [
  { value: 'All', zh: '全部' },
  { value: 'Watermarking', zh: '图像水印' },
  { value: 'Adversarial learning', zh: '对抗学习' },
];

const summaries: Record<string, string> = {
  tide: '在扩散采样的中间潜变量写入水印，并沿剩余轨迹自适应引导其传播，在保持图像质量的同时提升鲁棒性。',
  sasbo: '将稀疏对抗攻击表述为随机二值优化问题，用 ARM 无偏梯度估计联合优化扰动位置与幅度。',
  'sparse-meta-learning': '结合元学习与全局扰动稀疏化，提升稀疏对抗样本在黑盒模型上的迁移性。',
};

const hue: Record<string, string> = { tide: 'tide', sasbo: 'attack', 'sparse-meta-learning': 'meta' };

export function ResearchIndex() {
  const { language } = useLanguage();
  const [topic, setTopic] = useState('All');
  const [query, setQuery] = useState('');
  const found = papers.filter(
    paper =>
      (topic === 'All' || paper.topic === topic) &&
      `${paper.title} ${paper.authors.join(' ')} ${paper.venue} ${paper.year}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const placeholder = language === 'en' ? 'Search research' : '搜索论文';

  return (
    <>
      <div className="filter-toolbar">
        <FilterTabs
          value={topic}
          onChange={setTopic}
          label="Filter research"
          options={topics.map(item => ({ value: item.value, label: <Localized en={item.value} zh={item.zh} /> }))}
        />
        <label className="search-field">
          <Search size={15} aria-hidden="true" />
          <input type="search" aria-label={placeholder} placeholder={placeholder} value={query} onChange={event => setQuery(event.target.value)} />
        </label>
      </div>
      <p className="result-count" role="status">
        <Localized en={`${found.length} ${found.length === 1 ? 'publication' : 'publications'}`} zh={`${found.length} 篇论文`} />
      </p>
      <ol className="publication-list">
        {found.map(paper => (
          <li className="publication" key={paper.slug} data-hue={hue[paper.slug]}>
            <p className="label publication-venue">{paper.venue} {paper.year}</p>
            <div className="publication-body">
              <h2 className="display" lang="en"><Link href={`/research/${paper.slug}/`}>{paper.title}</Link></h2>
              <p className="publication-authors" lang="en">
                {paper.authors.map((author, index) => (
                  <span key={author}>
                    {author === 'Yihan Meng' ? <strong>{author}</strong> : author}
                    {index < paper.authors.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
              <p className="publication-summary"><Localized en={paper.summary} zh={summaries[paper.slug] ?? paper.summary} /></p>
              <p className="publication-links">
                <Link className="arrow-link" data-direction="right" href={`/research/${paper.slug}/`}>
                  <Localized en="Article" zh="研究文章" /> <ArrowRight size={14} aria-hidden="true" />
                </Link>
                <a className="arrow-link" href={asset(paper.paper)} target="_blank" rel="noreferrer">PDF <ArrowUpRight size={14} aria-hidden="true" /></a>
                {paper.publisher && (
                  <a className="arrow-link" href={paper.publisher} target="_blank" rel="noreferrer">
                    <Localized en="Publisher" zh="出版方" /> <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                )}
              </p>
            </div>
            <Link className="publication-art" href={`/research/${paper.slug}/`} tabIndex={-1} aria-hidden="true">
              <img
                src={asset(paper.slug === 'tide' ? '/images/art/tide-banner.webp' : paper.image!)}
                width={paper.slug === 'tide' ? 1800 : paper.imageWidth}
                height={paper.slug === 'tide' ? 760 : paper.imageHeight}
                alt=""
                loading="lazy"
              />
            </Link>
          </li>
        ))}
      </ol>
      {!found.length && (
        <div className="empty-state">
          <h2 className="display"><Localized en="No matching publications" zh="未找到匹配论文" /></h2>
          <p><Localized en="Try a different title, year, or research area." zh="试试其他标题、年份或研究方向。" /></p>
          <button className="pill" type="button" onClick={() => { setQuery(''); setTopic('All'); }}>
            <Localized en="Show all publications" zh="显示全部论文" />
          </button>
        </div>
      )}
    </>
  );
}
