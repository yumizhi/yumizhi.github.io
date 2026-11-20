import {absoluteURL} from '@/lib/paths';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChevronRight,ArrowUpRight } from 'lucide-react';
import { projects } from '@/lib/content';
import { TransitionLink } from '@/components/providers';
import { ProjectGallery } from '@/components/project-gallery';
import { ProjectStage } from '@/components/project-stage';
import { Button } from '@/components/ui/button';
import { Localized } from '@/components/language';
import { EpubEngineStory } from '@/components/epub-engine-story';
import '../../portfolio-editorial.css';
export function generateStaticParams(){return projects.map(p=>({slug:p.slug}));}
export const dynamicParams=false;
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const{slug}=await params;const p=projects.find(p=>p.slug===slug);return {title:p?.title,description:p?.summary,alternates:{canonical:absoluteURL(`/projects/${slug}/`)}};}
export default async function Project({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params;
 const p=projects.find(p=>p.slug===slug);
 if(!p)notFound();
 return <article className="editorial-shell portfolio-editorial project-detail">
  <nav className="breadcrumb" aria-label="Breadcrumb"><TransitionLink href="/projects/"><Localized en="Projects" zh="开源项目"/></TransitionLink><ChevronRight size={13}/><span>{p.title}</span></nav>
  <header className="detail-heading portfolio-heading">
   <p className="eyebrow"><Localized en={p.category} zh={p.categoryZh??p.category}/> · {p.year}</p>
   <h1 lang="en">{p.title}</h1>
   <p className="hero-description"><Localized en={p.summary} zh={p.summaryZh??p.summary}/></p>
   <div className="detail-actions">
    {p.demo&&<Button asChild><a href={p.demo} target="_blank" rel="noreferrer"><Localized en="Open app" zh="打开应用"/> <ArrowUpRight size={16}/></a></Button>}
    <Button asChild variant="outline"><a href={p.repo} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={16}/></a></Button>
    {p.release&&<Button asChild variant="ghost"><a href={p.release} target="_blank" rel="noreferrer"><Localized en="Releases" zh="版本发布"/> <ArrowUpRight size={16}/></a></Button>}
   </div>
  </header>
  <figure className="project-workflow" aria-label="Application preview">
   {p.previews?.length?<div className="workflow-preview"><ProjectStage project={p}/></div>:<ProjectGallery title={p.title} images={p.gallery}/>}
  </figure>
  <section className="project-usage" aria-labelledby="project-usage-heading">
   <header className="project-story-heading">
    <h2 id="project-usage-heading"><Localized en={p.slug==='epub-toolkit'?'Organizing a collection':'Overview'} zh={p.slug==='epub-toolkit'?'整理一套书的阅读顺序':'项目概览'}/></h2>
    <p><Localized en={p.description} zh={p.descriptionZh??p.description}/></p>
   </header>
   <div className="project-capabilities">
    {p.features.map(f=><div key={f.title}><h3><Localized en={f.title} zh={f.titleZh}/></h3><p><Localized en={f.description} zh={f.descriptionZh}/></p></div>)}
   </div>
  </section>
  {p.slug==='epub-toolkit'&&<EpubEngineStory/>}
  <p className="project-availability"><Localized en={p.technology} zh={p.technologyZh??p.technology}/> <a href={p.repo} target="_blank" rel="noreferrer"><Localized en="Documentation" zh="使用文档"/> <ArrowUpRight size={13}/></a></p>
 </article>;
}
