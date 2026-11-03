import {ArrowRight, ArrowUpRight} from 'lucide-react';
import {TransitionLink} from './providers';
import {ProductPoster} from './product-poster';
import {Localized} from './language';
import {asset} from '@/lib/paths';
import type {Project} from '@/lib/content';

export function ProjectShowcase({project,primary=false}:{project:Project;primary?:boolean}) {
  if(primary) return <article className="project-showcase product-story">
    <div className="product-copy">
      <h3 lang="en"><TransitionLink href={`/projects/${project.slug}/`}>{project.title}</TransitionLink></h3>
      <p className="product-description"><Localized en={project.summary} zh={project.summaryZh??project.summary}/></p>
      <div className="product-actions">
        {project.demo&&<a className="product-launch" href={project.demo} target="_blank" rel="noreferrer"><Localized en="Open app" zh="打开应用"/><ArrowUpRight size={14}/></a>}
        <TransitionLink href={`/projects/${project.slug}/`}><Localized en="About the project" zh="了解项目"/><ArrowRight size={14}/></TransitionLink>
      </div>
      <a className="product-source" href={project.repo} target="_blank" rel="noreferrer"><Localized en="Source on GitHub" zh="GitHub 源码"/><ArrowUpRight size={12}/></a>
    </div>
    <ProductPoster project={project}/>
  </article>;
  return <article className="project-showcase project-secondary">
    <div className="project-copy">
      <p className="project-category"><Localized en={project.category} zh={project.categoryZh??project.category}/></p>
      <h3 lang="en"><TransitionLink href={`/projects/${project.slug}/`}>{project.title}</TransitionLink></h3>
      <p className="project-lead"><Localized en={project.summary} zh={project.summaryZh??project.summary}/></p>
      <div className="project-links">
        {project.demo&&<a href={project.demo} target="_blank" rel="noreferrer"><Localized en="Open app" zh="打开应用"/><ArrowUpRight size={14}/></a>}
        <a href={project.repo} target="_blank" rel="noreferrer">GitHub<ArrowUpRight size={14}/></a>
        <TransitionLink href={`/projects/${project.slug}/`}><Localized en="About the project" zh="了解项目"/><ArrowRight size={14}/></TransitionLink>
      </div>
    </div>
    <TransitionLink href={`/projects/${project.slug}/`} className="secondary-project-image"><img src={asset(project.image)} width="1440" height="1050" alt={project.imageAlt} loading="lazy"/></TransitionLink>
  </article>;
}
