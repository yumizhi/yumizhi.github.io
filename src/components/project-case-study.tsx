import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Localized } from './language';
import { ProjectCaseEvidence } from './project-case-evidence';
import { EpubEngineStory } from './epub-engine-story';
import { ProjectCaseFlow } from './project-case-flow';
import { ProjectArchitecture } from './project-architecture';
import { projects, type Project } from '@/lib/content';
import { projectStories } from '@/lib/project-stories';
import { projectChapters } from '@/lib/project-chapters';
import './project-case-study.css';

export function ProjectCaseStudy({ project }: { project: Project }) {
  const story = projectStories[project.slug];
  const chapters = projectChapters[project.slug];
  if (!story) return null;

  return (
    <>
      <section className="case-section" id="design" tabIndex={-1} aria-labelledby="case-design">
        <header className="project-story-heading">
          <span className="case-section-label"><Localized en="Design" zh="产品设计" /></span>
          <h2 id="case-design"><Localized {...story.designTitle} /></h2>
          <p><Localized {...story.example} /></p>
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

      {chapters && (
        <section className="case-section" id="architecture" tabIndex={-1} aria-labelledby="case-architecture">
          <header className="project-story-heading">
            <span className="case-section-label"><Localized en="Architecture" zh="系统架构" /></span>
            <h2 id="case-architecture"><Localized {...chapters.architectureTitle} /></h2>
            <p><Localized {...chapters.architectureLead} /></p>
          </header>
          <ProjectArchitecture slug={project.slug} />
          <ChapterProse chapters={chapters.architecture} />
        </section>
      )}

      <section className="case-section" id="implementation" tabIndex={-1} aria-labelledby="case-implementation">
        <header className="project-story-heading">
          <span className="case-section-label"><Localized en="Implementation" zh="技术实现" /></span>
          <h2 id="case-implementation"><Localized {...story.implementationTitle} /></h2>
          <p><Localized {...story.implementationLead} /></p>
        </header>

        {story.steps && story.workflowTitle && <ProjectCaseFlow slug={project.slug} steps={story.steps} title={story.workflowTitle} />}
        {project.slug === 'epub-toolkit' && <EpubEngineStory />}

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

      {chapters && (
        <section className="case-section" id="decisions" tabIndex={-1} aria-labelledby="case-decisions">
          <header className="project-story-heading">
            <span className="case-section-label"><Localized en="Trade-offs" zh="设计取舍" /></span>
            <h2 id="case-decisions"><Localized {...chapters.decisionsTitle} /></h2>
          </header>
          <ChapterProse chapters={chapters.decisions} />
        </section>
      )}

      <section className="case-section case-verification" id="verification" tabIndex={-1} aria-labelledby="case-verification">
        <header className="project-story-heading">
          <h2 id="case-verification"><Localized en="Validation results" zh="验收结果" /></h2>
          <p><Localized {...story.verification} /></p>
        </header>
        <ProjectCaseEvidence checks={story.checks} />
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

function ChapterProse({ chapters }: { chapters: (typeof projectChapters)[string]['architecture'] }) {
  return (
    <div className="case-prose">
      {chapters.map(chapter => (
        <div key={chapter.title.en}>
          <h3><Localized {...chapter.title} /></h3>
          {chapter.paragraphs.map(paragraph => (
            <p key={paragraph.en}><Localized {...paragraph} /></p>
          ))}
        </div>
      ))}
    </div>
  );
}
