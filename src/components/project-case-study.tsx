import Link from 'next/link';
import { Fragment } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Localized as Text } from './language';
import { ProjectCaseEvidence } from './project-case-evidence';
import { EpubEngineStory } from './epub-engine-story';
import { ProjectCaseFlow } from './project-case-flow';
import { ProjectArchitecture, Diagram } from './project-architecture';
import { ProjectStage } from './project-stage';
import { ProjectGallery } from './project-gallery';
import { ProjectArticleFigure } from './project-article-figures';
import { projects, type Project } from '@/lib/content';
import { projectArticles, type CaseBlock } from '@/lib/project-chapters';
import './project-case-study.css';

function OriginCalibration() {
  const cohorts = [
    { en: 'Generated JPEGs', zh: '生成 JPEG', count: '12 / 2,500', rate: 0.48 },
    { en: 'Photographs', zh: '照片', count: '52 / 2,500', rate: 2.08 },
    { en: 'Additional PNG controls', zh: '额外 PNG 对照', count: '24 / 1,000', rate: 2.40 },
  ];
  return <Diagram id="originmark-calibration" title={{en:'False positives at one frozen threshold',zh:'同一固定阈值下的误报'}}
    caption={{en:'False-positive rates on unedited, unmarked images. The vertical line marks the 1% calibration target. Some PNG controls share image content with the JPEG group.',zh:'未经编辑的无水印图像上的误报率。竖线是 1% 的校准目标，部分 PNG 对照与 JPEG 组共享图像内容。'}}>
    <div className="calibration-plot">
      {cohorts.map(row=><div className="calibration-row" key={row.en}>
        <strong><Text en={row.en} zh={row.zh} /></strong>
        <div className="calibration-track" aria-hidden="true"><i style={{width:row.rate/3*100+'%'}} /></div>
        <div className="calibration-readout">{row.rate.toFixed(2)}% <small>{row.count}</small></div>
      </div>)}
    </div>
  </Diagram>;
}

function CaseFigure({kind,project}:{kind: NonNullable<CaseBlock['figure']>; project: Project}) {
  switch (kind) {
    case 'gallery': return <figure className="project-workflow detail-figure" aria-label="Application preview">
      {project.previews?.length ? <div className="workflow-preview"><ProjectStage project={project}/></div> : <ProjectGallery title={project.title} images={project.gallery}/>}
    </figure>;
    case 'architecture': return <ProjectArchitecture slug={project.slug} />;
    case 'calibration': return <OriginCalibration />;
    case 'merge-record': return <EpubEngineStory />;
    case 'epub-docs': return project.repo && <div className="case-project-reference"><a href={project.repo+'/blob/main/docs/architecture.md'} target="_blank" rel="noreferrer"><Text en="EPUB engine documentation" zh="EPUB 引擎文档" /><ArrowUpRight size={15} /></a></div>;
    case 'tide-link': return <div className="case-project-reference"><Link href="/research/tide/"><Text en="The research behind Generate · TIDE" zh="生成能力背后的研究 · TIDE" /><ArrowRight size={15} /></Link></div>;
    default: return <ProjectArticleFigure figure={kind} />;
  }
}

export function ProjectCaseStudy({ project }: { project: Project }) {
  return <>
    {projectArticles[project.slug].map(section => <section className="case-section" key={section.id} id={section.id} tabIndex={-1} aria-labelledby={'case-'+section.id}>
      <header className="project-story-heading"><h2 id={'case-'+section.id}><Text {...section.title} /></h2></header>
      <div className="case-chapters">{section.blocks.map((block,index) => <Fragment key={block.id ?? index}>
        {block.paragraphs && <div className="case-prose case-chapter" id={block.id}>
          {block.title && <h3><Text {...block.title} /></h3>}
          {block.paragraphs.map(p=><p key={p.en}><Text {...p} /></p>)}
        </div>}
        {block.figure && <CaseFigure kind={block.figure} project={project} />}
        {block.steps && block.title && <ProjectCaseFlow slug={project.slug} title={block.title} steps={block.steps} />}
        {block.checks && <ProjectCaseEvidence checks={block.checks} />}
      </Fragment>)}</div>
    </section>)}
    <nav className="case-other-projects" aria-label="Other projects">
      <Link href="/projects/"><Text en="All projects" zh="全部项目" /></Link>
      {projects.filter(other => other.slug !== project.slug).map(other =>
        <Link key={other.slug} href={`/projects/${other.slug}/`} lang="en">{other.title}<ArrowRight size={14} aria-hidden="true" /></Link>
      )}
    </nav>
  </>;
}
