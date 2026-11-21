import { ArticleSectionNav } from './article-section-nav';

const sections = [
  { id: 'preview', en: 'Preview', zh: '界面预览' },
  { id: 'design', en: 'Design', zh: '设计' },
  { id: 'architecture', en: 'Architecture', zh: '系统架构' },
  { id: 'implementation', en: 'Implementation', zh: '技术实现' },
  { id: 'decisions', en: 'Trade-offs', zh: '设计取舍' },
  { id: 'verification', en: 'Validation', zh: '验收' },
];

export function ProjectCaseContents() {
  return (
    <div className="case-contents">
      <ArticleSectionNav sections={sections} label={{ en: 'Project sections', zh: '项目目录' }} />
    </div>
  );
}
