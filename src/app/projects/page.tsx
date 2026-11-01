import type { Metadata } from 'next';
import { ArrowRight,ArrowUpRight } from 'lucide-react';
import { projects } from '@/lib/content';
import { asset,absoluteURL } from '@/lib/paths';
import { TransitionLink } from '@/components/providers';
export const metadata:Metadata={title:'Projects',description:'Public software by Yihan Meng. Explore EPUB Toolkit.',alternates:{canonical:absoluteURL('/projects/')}};
export default function Projects(){return <div className="shell"><header className="page-heading"><span className="eyebrow">Software & Tools</span><h1>Projects</h1><p>Open-source projects, from the interface to the implementation.</p></header><div className="project-index">{projects.map(p=><article className="project-feature" key={p.slug}><div className="project-text"><p className="eyebrow">{p.category} · {p.year}</p><h3>{p.title}</h3><p>{p.description}</p><div className="project-links"><TransitionLink href={`/projects/${p.slug}/`}>Explore project <ArrowRight size={15}/></TransitionLink><a href={p.demo} target="_blank" rel="noreferrer">Open app <ArrowUpRight size={15}/></a></div></div><TransitionLink href={`/projects/${p.slug}/`} className="project-screenshot"><img style={{viewTransitionName:`project-${p.slug}`}} src={asset(p.image)} width="1440" height="1050" alt={p.imageAlt}/></TransitionLink></article>)}</div></div>;}
