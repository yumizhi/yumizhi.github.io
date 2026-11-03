import type {Metadata} from 'next';
import {ArrowUpRight, Mail, Globe, CodeXml} from 'lucide-react';
import {absoluteURL, asset} from '@/lib/paths';
import {education, experience, awards, site} from '@/lib/content';
import {cvResearch, cvCollaboration, cvIndustry, cvProject, type CVBullet, type CVResearchEntry} from '@/lib/cv';
import {CVActions} from '@/components/cv-actions';
import {Localized} from '@/components/language';
import './cv.css';

export const metadata:Metadata={title:'CV',description:'Yihan Meng — AI algorithm research, generative models, and software engineering.',alternates:{canonical:absoluteURL('/cv/')}};

function emphasis(text:string){
 return text.split(/(\*\*.*?\*\*)/g).map((part,i)=>part.startsWith('**')?<strong key={i}>{part.slice(2,-2)}</strong>:part);
}

function Bullets({items}:{items:CVBullet[]}){
 return <ul className="resume-bullets">{items.map(item=><li key={item.label.en}><strong><Localized {...item.label}/><Localized en=": " zh="："/></strong><Localized en={emphasis(item.text.en)} zh={emphasis(item.text.zh)}/></li>)}</ul>;
}

function ResearchEntry({item}:{item:CVResearchEntry}){
 return <article className="resume-entry">
  <header className="resume-entry-heading"><h3>{item.paper.shortTitle}<span className="resume-topic"><Localized {...item.topic}/></span></h3><div className="resume-entry-meta"><strong>{item.paper.venue} {item.paper.year}</strong><span><Localized {...item.role}/></span></div></header>
  <p className="resume-stack"><Localized {...item.keywords}/></p>
  <a className="resume-paper-title" href={absoluteURL(item.paper.paper)}>{item.paper.title}<ArrowUpRight size={11}/></a>
  <p className="resume-intro"><Localized {...item.intro}/></p>
  <Bullets items={item.bullets}/>
  {item.result&&<p className="resume-result"><strong><Localized {...item.result}/></strong></p>}
 </article>;
}

export default function CV(){
 return <div className="shell cv-page">
  <div className="cv-page-toolbar"><p><Localized en="Curriculum Vitae" zh="个人简历"/></p><CVActions/></div>
  <article className="resume-document asu-resume">
   <div className="resume-sheet">
    <header className="resume-header">
     <div><h1><Localized en={site.name} zh={site.chineseName}/></h1>
      <p className="resume-position"><Localized en="AI Research Engineer · Generative models / Optimization / Industrial vision" zh="AI 算法研发 · 生成式模型 / 优化算法 / 工业视觉"/></p>
      <p className="resume-affiliation"><Localized en="Ph.D. candidate, Nanjing University · Research Intern, Guodian Nanjing Automation" zh="南京大学计算机博士在读 · 国电南自研究实习生"/></p>
      <p className="resume-credentials"><Localized en="First author: NeurIPS 2026 / PAKDD 2024 Oral" zh="NeurIPS 2026 第一作者 / PAKDD 2024 Oral 第一作者"/></p>
     </div>
     <img src={asset('/images/nju-seal.svg')} alt="Nanjing University" width="60" height="72"/>
    </header>
    <div className="resume-contact">
     <a href={`mailto:${site.email}`}><Mail size={12}/>{site.email}</a>
     <a href={site.url}><Globe size={12}/>yumizhi.github.io</a>
     <a href={site.github}><CodeXml size={12}/>github.com/yumizhi</a>
     <a href={site.scholar}>Google Scholar <ArrowUpRight size={11}/></a>
    </div>

    <section className="resume-section resume-education">
     <h2><Localized en="Education" zh="教育背景"/></h2>
     {education.map((e,i)=><div className="resume-education-row" key={e.period}><div className="resume-school"><img src={asset('/images/nju-seal.svg')} alt="" width="14" height="17"/><div><strong><Localized en="Nanjing University" zh="南京大学"/></strong><Localized en={i===0?'Ph.D. candidate, Computer Science and Technology':'B.S., Computer Science and Technology'} zh={i===0?'计算机科学与技术 · 博士研究生':'计算机科学与技术 · 本科'}/></div></div><time><Localized en={e.dates} zh={i===0?'2023.09 — 至今':'2019.09 — 2023.06'}/></time></div>)}
    </section>

    <section className="resume-section resume-honors"><h2><Localized en="Honors & awards" zh="荣誉奖励"/></h2>
     <ul className="resume-award-list">{awards.map(a=><li key={a.title}><span><Localized en={a.title} zh={a.titleZh}/></span><time dateTime={a.year}>{a.year}</time></li>)}</ul>
    </section>

    <section className="resume-section">
     <h2><Localized en="Selected research" zh="代表性研究"/></h2>
     {cvResearch.map(item=><ResearchEntry item={item} key={item.paper.slug}/>)}
    </section>

    <div className="resume-folio"><span><Localized en="Yihan Meng · AI Research & Engineering" zh="蒙一涵 · AI 算法研发"/></span><span>1 / 2</span></div>
   </div>

   <div className="resume-sheet resume-sheet-next">
    <header className="resume-running-head"><strong><Localized en="Yihan Meng" zh="蒙一涵"/></strong><span><Localized en="Industry research & software engineering" zh="企业研发与工程项目"/></span></header>
    <section className="resume-section resume-industry">
     <h2><Localized en="Industry experience" zh="企业研发经历"/></h2>
     <div className="resume-company"><img src={asset('/images/guodian.webp')} width="24" height="24" alt=""/><div><strong><Localized en={experience[0].institution} zh="国电南京自动化股份有限公司"/></strong><span><Localized en="Research Intern · Visual algorithm development" zh="研究实习生 · 视觉算法开发"/></span></div><time><Localized en={experience[0].dates} zh="2025.07 — 至今"/></time></div>
     <header className="resume-entry-heading"><h3><Localized {...cvIndustry.title}/></h3><time className="resume-project-date"><Localized en="Completed Jun 2026" zh="2026.06 结项"/></time></header>
     <p className="resume-intro"><Localized {...cvIndustry.intro}/></p>
     <Bullets items={cvIndustry.bullets}/>
    </section>
    <section className="resume-section resume-engineering">
     <h2><Localized en="Open-source engineering" zh="独立开源项目"/></h2>
     <header className="resume-entry-heading"><h3>EPUB Toolkit</h3><div className="resume-entry-meta"><strong><Localized en="Independent project" zh="独立开源项目"/></strong><span>2026</span></div></header>
     
     <p className="resume-stack"><Localized en="Structured document processing engine · TypeScript / Python / Web Worker" zh="结构化文档处理引擎 · TypeScript / Python / Web Worker"/></p>
     <p className="resume-intro"><Localized {...cvProject.intro}/></p>
     <Bullets items={cvProject.bullets}/>
     <div className="resume-project-links"><a href={cvProject.project.repo}>github.com/yumizhi/lightweight_epub_merge_tool <ArrowUpRight size={11}/></a><a href={cvProject.project.demo}><Localized en="Live application" zh="在线演示"/><ArrowUpRight size={11}/></a></div>
    </section>

    <section className="resume-section resume-collaboration"><h2><Localized en="Collaborative research" zh="合作研究"/></h2>
     <ResearchEntry item={cvCollaboration}/>
    </section>

    <div className="resume-folio"><span><Localized en="Yihan Meng · AI Research & Engineering" zh="蒙一涵 · AI 算法研发"/></span><span>2 / 2</span></div>
   </div>
  </article>
 </div>;
}
