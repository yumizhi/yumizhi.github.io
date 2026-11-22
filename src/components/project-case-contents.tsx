import { ArticleSectionNav } from './article-section-nav';
import { projectArticles } from '@/lib/project-chapters';

export function ProjectCaseContents({slug}: {slug: string}) {
  const sections = projectArticles[slug].map(({id,label}) => ({id,...label}));
  return <div className="case-contents">
    <ArticleSectionNav sections={sections} label={{ en: 'Project sections', zh: '项目目录' }} />
  </div>;
}
