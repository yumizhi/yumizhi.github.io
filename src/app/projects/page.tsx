import type { Metadata } from 'next';
import { projects } from '@/lib/content';
import { absoluteURL } from '@/lib/paths';
import { ProjectShowcase } from '@/components/project-showcase';
import { Localized } from '@/components/language';
export const metadata:Metadata={title:'Projects',description:'Public software by Yihan Meng. Explore EPUB Toolkit.',alternates:{canonical:absoluteURL('/projects/')}};
export default function Projects(){return <div className="shell"><header className="page-heading"><h1><Localized en="Projects" zh="开源项目"/></h1><p><Localized en="Open-source software and tools." zh="开源软件与实用工具。"/></p></header><div className="project-index project-list">{projects.map((project,i)=><ProjectShowcase key={project.slug} project={project} primary={i===0}/>)}</div></div>;}
