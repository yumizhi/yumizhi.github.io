import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Localized } from './language';
import { EpubPreview } from './epub-preview';
import { asset } from '@/lib/paths';
import type { Project } from '@/lib/content';
import './project-cards.css';

export function ProjectCard({ project, heading: Heading = 'h3' }: { project: Project; heading?: 'h2' | 'h3' }) {
  const href = `/projects/${project.slug}/`;
  const summary = project.cardSummary ?? { en: project.summary, zh: project.summaryZh ?? project.summary };
  const merge = project.previews?.find(view => view.id === 'merge');
  const split = project.previews?.find(view => view.id === 'split');

  return (
    <article className="project-card" data-project={project.slug}>
      {merge && split ? <EpubPreview views={[merge, split]} /> : (
        <Link href={href} className="project-card-cover" tabIndex={-1} aria-hidden="true">
          <img src={asset(project.image)} loading="lazy" alt="" />
        </Link>
      )}
      <div className="project-card-copy">
        <p className="project-card-category"><Localized en={project.category} zh={project.categoryZh ?? project.category} /></p>
        <Heading lang="en">
          <Link href={href}>{project.title}<ArrowRight size={15} aria-hidden="true" /></Link>
        </Heading>
        <p className="project-card-summary"><Localized {...summary} /></p>
        {project.demo && (
          <a className="project-card-launch" href={project.demo} target="_blank" rel="noreferrer">
            <Localized en="Open the tool" zh="打开工具" /><ArrowUpRight size={14} aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
}
