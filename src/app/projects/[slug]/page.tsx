import {absoluteURL} from '@/lib/paths';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/lib/content';
import { TransitionLink } from '@/components/providers';
import { Button } from '@/components/ui/button';
import { Localized } from '@/components/language';
import { ProjectCaseStudy } from '@/components/project-case-study';
import { ProjectCaseContents } from '@/components/project-case-contents';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/coss/breadcrumb';
import '../../portfolio-editorial.css';
export function generateStaticParams(){return projects.map(p=>({slug:p.slug}));}
export const dynamicParams=false;
export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata> {
 const {slug} = await params;
 const project = projects.find(item => item.slug === slug);
 const url = absoluteURL(`/projects/${slug}/`);
 const metadata: Metadata = {title: project?.title, description: project?.summary, alternates: {canonical: url}};
 if (project?.slug === 'personal-agent') {
   const preview = project.previews?.[0];
   if (preview) {
     const images = [{url: absoluteURL(preview.image), width: preview.width, height: preview.height, alt: preview.alt}];
     metadata.openGraph = {type: 'article', siteName: 'Yihan Meng', title: project.title, description: project.summary, url, images};
     metadata.twitter = {card: 'summary_large_image', title: project.title, description: project.summary, images};
   }
 }
 return metadata;
}
export default async function Project({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params;
 const p=projects.find(p=>p.slug===slug);
 if(!p)notFound();
 return <article className="editorial-shell portfolio-editorial project-detail" data-case={p.slug}>
  <Breadcrumb className="breadcrumb" aria-label="Project breadcrumb">
   <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink render={<TransitionLink href="/projects/" />}><Localized en="Projects" zh="项目" /></BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbLink href="#main-content" aria-current="page">{p.title}</BreadcrumbLink></BreadcrumbItem>
   </BreadcrumbList>
  </Breadcrumb>
  <header className="detail-heading portfolio-heading">
   <p className="eyebrow"><Localized en={p.category} zh={p.categoryZh??p.category}/> · {p.year}</p>
   <h1 lang="en">{p.title}</h1>
   <p className="hero-description"><Localized en={p.summary} zh={p.summaryZh??p.summary}/></p>
   {(p.demo || p.repo || p.release) && <div className="detail-actions">
    {p.demo&&<Button asChild><a href={p.demo} target="_blank" rel="noreferrer"><Localized en="Open app" zh="打开应用"/> <ArrowUpRight size={16}/></a></Button>}
    {p.repo&&<Button asChild variant="outline"><a href={p.repo} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={16}/></a></Button>}
    {p.release&&<Button asChild variant="ghost"><a href={p.release} target="_blank" rel="noreferrer"><Localized en="Releases" zh="版本发布"/> <ArrowUpRight size={16}/></a></Button>}
   </div>}
   {!p.repo && <p className="project-source-note"><Localized en={p.technology} zh={p.technologyZh??p.technology} /></p>}
  </header>
  <ProjectCaseContents slug={p.slug} />
  <ProjectCaseStudy project={p} />
  {p.repo && <p className="project-availability"><Localized en={p.technology} zh={p.technologyZh??p.technology}/> <a href={p.repo} target="_blank" rel="noreferrer"><Localized en="Documentation" zh="使用文档"/> <ArrowUpRight size={13}/></a></p>}
 </article>;
}
