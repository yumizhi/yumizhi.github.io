import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { projects } from '@/lib/content';
import { absoluteURL, asset } from '@/lib/paths';
import { Localized } from '@/components/language';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Public software by Yihan Meng. Explore EPUB Toolkit.',
  alternates: { canonical: absoluteURL('/projects/') },
};

export default function Projects() {
  return (
    <div className="shell page">
      <header className="page-heading">
        <p className="label"><Localized en="Software" zh="软件" /></p>
        <h1 className="display"><Localized en="Projects" zh="开源项目" /></h1>
        <p><Localized en="Open-source software and tools." zh="开源软件与实用工具。" /></p>
      </header>
      <div className="project-index">
        {projects.map(project => (
          <article className="project-feature" key={project.slug}>
            <div className="project-feature-copy">
              <p className="label"><Localized en={project.category} zh={project.categoryZh ?? project.category} /> · {project.year}</p>
              <h2 className="display" lang="en"><Link href={`/projects/${project.slug}/`}>{project.title}</Link></h2>
              <p className="paper-note"><Localized en={project.summary} zh={project.summaryZh ?? project.summary} /></p>
              <div className="project-feature-actions">
                <Link className="pill" data-variant="solid" href={`/projects/${project.slug}/`}>
                  <Localized en="Project details" zh="项目详情" /> <ArrowRight size={14} aria-hidden="true" />
                </Link>
                {project.demo && (
                  <a className="pill" href={project.demo} target="_blank" rel="noreferrer">
                    <Localized en="Open app" zh="打开应用" /> <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                )}
                <a className="pill" href={project.repo} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} aria-hidden="true" /></a>
              </div>
            </div>
            <Link className="project-feature-shot" href={`/projects/${project.slug}/`} tabIndex={-1} aria-hidden="true">
              <img src={asset('/images/epub-workspace-crop.webp')} width={1137} height={842} alt="" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
