import Link from 'next/link';
import { Fragment } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Localized as Text } from './language';
import { ProjectCaseEvidence } from './project-case-evidence';
import { EpubEngineStory } from './epub-engine-story';
import { ProjectCaseFlow } from './project-case-flow';
import { AgentProductEvidence } from './agent-product-evidence';
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
    caption={{en:'Unedited negative images in the isolated TIDE evaluation. The vertical reference marks the 1% calibration target. Some additional PNGs share content with the JPEG cohort.',zh:'数据取自独立 TIDE 校准验收，负样本均未经编辑。竖线标出 1% 校准目标；部分额外 PNG 对照与 JPEG 组共享图像内容。'}}>
    <div className="calibration-plot">
      {cohorts.map(row=><div className="calibration-row" key={row.en}>
        <strong><Text en={row.en} zh={row.zh} /></strong>
        <div className="calibration-track" aria-hidden="true"><i style={{width:row.rate/3*100+'%'}} /></div>
        <div className="calibration-readout">{row.rate.toFixed(2)}% <small>{row.count}</small></div>
      </div>)}
    </div>
  </Diagram>;
}

function DeploymentEvidence() {
  const rows = [
    {
      label: { en: 'Entry', zh: '入口' },
      initial: { en: 'API', zh: 'API' },
      narrowed: { en: 'Web app', zh: '网页应用' },
    },
    {
      label: { en: 'Tool trace', zh: '工具执行' },
      initial: { en: 'Maintenance register read', zh: '读取维护台账' },
      narrowed: { en: 'No tool call', zh: '无工具调用' },
    },
    {
      label: { en: 'Retrieved evidence', zh: '检索证据' },
      initial: { en: 'Equipment manual, lines 1–2', zh: '设备手册第 1–2 行' },
      narrowed: { en: 'No passages', zh: '无片段' },
    },
    {
      label: { en: 'Report', zh: '报告' },
      initial: { en: '72-hour interval, ticket MT-203', zh: '检修周期 72 小时，工单 MT-203' },
      narrowed: { en: 'No matching project material', zh: '无匹配的项目资料' },
    },
  ];
  return <Diagram id="agent-deployment-scope"
    title={{ en: 'One published version under two access policies', zh: '同一版本，两种访问权限' }}
    caption={{ en: 'Two recorded invocations of the same P-17 request. Both used the local evidence runtime. The second deployment removed the tool and knowledge access available to the first.', zh: '图中为同一条 P-17 查询的两次实测调用，均使用本地证据运行时。第二次部署收回了第一次可用的工具和知识访问权限。' }}>
    <table className="deployment-receipts">
      <thead><tr>
        <th scope="col"><Text en="Record" zh="记录" /></th>
        <th scope="col"><Text en="Initial deployment" zh="首次部署" /></th>
        <th scope="col"><Text en="Narrower grant" zh="收窄权限后" /></th>
      </tr></thead>
      <tbody>{rows.map(row => <tr key={row.label.en}>
        <th scope="row"><Text {...row.label} /></th>
        <td><Text {...row.initial} /></td>
        <td><Text {...row.narrowed} /></td>
      </tr>)}</tbody>
    </table>
  </Diagram>;
}

function CaseFigure({kind,project}:{kind: NonNullable<CaseBlock['figure']>; project: Project}) {
  switch (kind) {
    case 'gallery': return <figure className="project-workflow detail-figure" aria-label="Application preview">
      {project.previews?.length ? <div className="workflow-preview"><ProjectStage project={project}/></div> : <ProjectGallery title={project.title} images={project.gallery}/>}
    </figure>;
    case 'architecture': return <ProjectArchitecture slug={project.slug} />;
    case 'member-evidence': return <AgentProductEvidence />;
    case 'deployment-scopes': return <DeploymentEvidence />;
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
