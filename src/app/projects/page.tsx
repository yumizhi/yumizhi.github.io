import type { Metadata } from 'next';
import { projects } from '@/lib/content';
import { absoluteURL } from '@/lib/paths';
import { ProjectCard } from '@/components/project-card';
import { ProjectShowcase } from '@/components/project-showcase';
import { Localized } from '@/components/language';
import '../portfolio-editorial.css';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Projects by Yihan Meng, including EPUB Toolkit, OriginMark, and Personal Agent.',
  alternates: { canonical: absoluteURL('/projects/') },
};

export default function Projects() {
  const featured = projects.find(project => project.slug === 'epub-toolkit');
  const others = projects.filter(project => project !== featured);
  return <div className="editorial-shell directory-page portfolio-editorial project-directory">
    <header className="page-heading">
      <h1><Localized en="Projects" zh="项目" /></h1>

    </header>
    <div className="project-index project-list">
      {featured && <ProjectShowcase project={featured} />}
      <div className="project-card-list">
        {others.map(project => <ProjectCard key={project.slug} project={project} heading="h2" />)}
      </div>
    </div>
  </div>;
}
