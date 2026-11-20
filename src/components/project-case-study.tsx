import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Localized } from './language';
import { EpubEngineStory } from './epub-engine-story';
import { ProjectCaseFlow } from './project-case-flow';
import { projects, type Project } from '@/lib/content';
import { projectStories } from '@/lib/project-stories';
import './project-case-study.css';

export function ProjectCaseStudy({ project }: { project: Project }) {
  const story = projectStories[project.slug];
  if (!story) return null;

  return (
    <>
      <section className="case-section" id="design" tabIndex={-1} aria-labelledby="case-design">
        <header className="project-story-heading">
          <span className="case-section-label"><Localized en="Design" zh="产品设计" /></span>
          <h2 id="case-design"><Localized {...story.designTitle} /></h2>
          <p><Localized en={project.description} zh={project.descriptionZh ?? project.description} /></p>
        </header>
        <div className="case-prose">
          {story.design.map(block => (
            <div key={block.title.en}>
              <h3><Localized {...block.title} /></h3>
              <p><Localized {...block.body} /></p>
            </div>
          ))}
        </div>
      </section>

      <section className="case-section" id="implementation" tabIndex={-1} aria-labelledby="case-implementation">
        <header className="project-story-heading">
          <span className="case-section-label"><Localized en="Implementation" zh="技术实现" /></span>
          <h2 id="case-implementation"><Localized {...story.implementationTitle} /></h2>
        </header>

        {project.slug === 'epub-toolkit' && <EpubEngineStory />}
        {story.steps && story.workflowTitle && <ProjectCaseFlow steps={story.steps} title={story.workflowTitle} />}

        <div className="case-prose">
          {story.implementation.map(block => (
            <div key={block.title.en}>
              <h3><Localized {...block.title} /></h3>
              <p><Localized {...block.body} /></p>
            </div>
          ))}
        </div>

        {project.slug === 'originmark' && (
          <div className="case-project-reference">
            <Link href="/research/tide/"><Localized en="The research behind Generate · TIDE" zh="生成能力背后的研究 · TIDE" /><ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
        )}
        {project.slug === 'epub-toolkit' && project.repo && (
          <div className="case-project-reference">
            <a href={`${project.repo}/blob/main/docs/architecture.md`} target="_blank" rel="noreferrer">
              <Localized en="Read the engine documentation" zh="阅读引擎文档" /><ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        )}
      </section>

      <section className="case-section case-verification" id="verification" tabIndex={-1} aria-labelledby="case-verification">
        <header className="project-story-heading">
          <h2 id="case-verification"><Localized en="What we verified" zh="实际验证了什么" /></h2>
          <p><Localized {...story.verification} /></p>
        </header>
      </section>

      <nav className="case-other-projects" aria-label="Other projects">
        <Link href="/projects/"><Localized en="All projects" zh="全部项目" /></Link>
        {projects.filter(other => other.slug !== project.slug).map(other => (
          <Link key={other.slug} href={`/projects/${other.slug}/`} lang="en">
            {other.title}<ArrowRight size={14} aria-hidden="true" />
          </Link>
        ))}
      </nav>
    </>
  );
}
