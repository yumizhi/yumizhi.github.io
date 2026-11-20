import {ArrowRight, ArrowUpRight} from 'lucide-react';
import {TransitionLink} from './providers';
import {ProductPoster} from './product-poster';
import {Localized} from './language';
import type {Project} from '@/lib/content';

export function ProjectShowcase({project}:{project:Project}) {
  return <article className="project-showcase product-story">
    <div className="product-copy">
      <h2 lang="en"><TransitionLink href={`/projects/${project.slug}/`}>{project.title}</TransitionLink></h2>
      <p className="product-description"><Localized en={project.summary} zh={project.summaryZh??project.summary}/></p>
      <div className="product-actions">
        {project.demo&&<a className="product-launch" href={project.demo} target="_blank" rel="noreferrer"><Localized en="Open app" zh="打开应用"/><ArrowUpRight size={14}/></a>}
        <TransitionLink href={`/projects/${project.slug}/`}><Localized en="About the project" zh="了解项目"/><ArrowRight size={14}/></TransitionLink>
      </div>
      {project.repo && <a className="product-source" href={project.repo} target="_blank" rel="noreferrer"><Localized en="Source on GitHub" zh="GitHub 源码"/><ArrowUpRight size={12}/></a>}
    </div>
    <ProductPoster project={project}/>
  </article>;
}
