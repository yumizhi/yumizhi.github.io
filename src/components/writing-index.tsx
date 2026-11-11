'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { FilterTabs } from './filter-tabs';
import { TransitionLink } from './providers';
import { Localized } from './language';
import type { WritingEntry } from '@/lib/posts';

const categoryNames: Record<string, string> = { All: '全部', 'Research notes': '研究笔记' };

export function WritingIndex({ posts }: { posts: WritingEntry[] }) {
  const [category, setCategory] = useState('All');
  const categories = [...new Set(posts.map(post => post.category))];
  return (
    <>
      {categories.length > 1 && (
        <div className="filter-toolbar">
          <FilterTabs
            value={category}
            onChange={setCategory}
            label="Writing categories"
            options={['All', ...categories].map(name => ({ value: name, label: <Localized en={name} zh={categoryNames[name] ?? name} /> }))}
          />
        </div>
      )}
      <ul className="entry-list writing-index">
        {posts.filter(post => category === 'All' || post.category === category).map(post => (
          <li key={post.slug}>
            <TransitionLink className="entry" href={post.href} target={post.external ? '_blank' : undefined} rel={post.external ? 'noreferrer' : undefined}>
              <span className="label">
                {post.date ? <time dateTime={post.date}>{post.date}</time> : 'Notion'}
                <br />
                <Localized en={post.category} zh={categoryNames[post.category] ?? post.category} />
              </span>
              <span className="entry-body" lang={post.language}>
                <strong className="display">{post.title}</strong>
                <span>{post.description}</span>
              </span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </TransitionLink>
          </li>
        ))}
      </ul>
    </>
  );
}
