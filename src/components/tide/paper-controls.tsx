import { ArticleSectionNav } from '../article-section-nav';

const baseSections = [
  { id: 'abstract', en: 'Abstract', zh: '摘要' },
  { id: 'overview', en: 'Introduction', zh: '引言' },
  { id: 'method', en: 'Method', zh: '方法' },
  { id: 'examples', en: 'Results', zh: '实验结果' },
  { id: 'discussion', en: 'Discussion', zh: '讨论' },
  { id: 'citation', en: 'BibTeX', zh: '引用' },
];
const tideSections = [
  ...baseSections.slice(0, 4),
  { id: 'timing', en: 'Timing', zh: '注入时刻' },
  ...baseSections.slice(4),
];

export function PaperNav({ expanded = false }: { expanded?: boolean }) {
  return <ArticleSectionNav embedded sections={expanded ? tideSections : baseSections} label={{ en: 'Paper sections', zh: '论文目录' }} />;
}
