import {absoluteURL} from '@/lib/paths';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChevronRight,ArrowUpRight } from 'lucide-react';
import { projects } from '@/lib/content';
import { TransitionLink } from '@/components/providers';
import { ProjectGallery } from '@/components/project-gallery';
import { Button } from '@/components/ui/button';
export function generateStaticParams(){return projects.map(p=>({slug:p.slug}));}
export const dynamicParams=false;
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const{slug}=await params;const p=projects.find(p=>p.slug===slug);return {title:p?.title,description:p?.summary,alternates:{canonical:absoluteURL(`/projects/${slug}/`)}};}
export default async function Project({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const p=projects.find(p=>p.slug===slug);if(!p)notFound();return <div className="shell"><div className="breadcrumb"><TransitionLink href="/projects/">Projects</TransitionLink><ChevronRight size={13}/><span>{p.title}</span></div><header className="detail-heading"><p className="eyebrow">{p.category} · {p.year}</p><h1>{p.title}</h1><p className="hero-description">{p.summary}</p><div className="detail-actions"><Button asChild><a href={p.demo} target="_blank" rel="noreferrer">Open application <ArrowUpRight size={16}/></a></Button><Button asChild variant="outline"><a href={p.repo} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={16}/></a></Button><Button asChild variant="ghost"><a href={p.release} target="_blank" rel="noreferrer">Releases <ArrowUpRight size={16}/></a></Button></div></header><ProjectGallery title={p.title} images={p.gallery}/><section className="project-overview"><div><h2>The workflow</h2><p>{p.description}</p></div><div><h2>What it does</h2><ul>{p.features.map(f=><li key={f}>{f}</li>)}</ul></div><div><h2>Under the hood</h2><p>{p.technology}</p><p>See the public repository for architecture, local development, and packaging instructions.</p></div></section></div>;}
