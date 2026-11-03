import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { TransitionLink } from '@/components/providers';
import { ResearchCard } from '@/components/research-card';
import { ProjectShowcase } from '@/components/project-showcase';
import { HomeBackground } from '@/components/home-background';
import { SectionHeading } from '@/components/section-heading';
import { Localized } from '@/components/language';
import { papers, projects, site } from '@/lib/content';
import { getWritingEntries } from '@/lib/posts';
import { asset } from '@/lib/paths';

export default function Home(){
 return <div className="shell homepage">
  <section className="profile" id="about-me" aria-labelledby="my-name">
   <div className="profile-grid"><div className="profile-copy">
    <h1 id="my-name"><Localized en="Yihan Meng" zh="蒙一涵"/></h1>
    <p className="profile-intro"><Localized en={<>Ph.D. candidate at <a href="https://www.nju.edu.cn/" target="_blank" rel="noreferrer">Nanjing University</a>, advised by <a href="https://cs.nju.edu.cn/shanglin/index.htm" target="_blank" rel="noreferrer">Lin Shang</a>.</>} zh={<><a href="https://www.nju.edu.cn/" target="_blank" rel="noreferrer">南京大学</a>博士研究生，导师为<a href="https://cs.nju.edu.cn/shanglin/index.htm" target="_blank" rel="noreferrer">商琳副教授</a>。</>}/></p>
    <p className="profile-focus"><Localized en="My research focuses on diffusion models, image watermarking, and adversarial learning." zh="研究方向包括扩散模型、图像水印与对抗学习。"/></p>
    <div className="profile-links"><a href={site.scholar} target="_blank" rel="noreferrer">Scholar <ArrowUpRight size={14}/></a><a href={site.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14}/></a><a href={`mailto:${site.email}`}><Localized en="Email" zh="邮箱"/> <ArrowUpRight size={14}/></a><TransitionLink href="/cv/"><Localized en="CV" zh="简历"/> <ArrowRight size={14}/></TransitionLink></div>
   </div><img className="profile-avatar" src={asset('/images/profile-avatar.webp')} width="400" height="400" alt="Yihan Meng" fetchPriority="high"/></div>
  </section>
  <section className="home-research" id="publications" aria-labelledby="selected-research"><SectionHeading id="selected-research" title={<Localized en="Research" zh="研究成果"/>}><TransitionLink href="/research/"><Localized en="All publications" zh="全部论文"/> <ArrowRight size={15}/></TransitionLink></SectionHeading><div className="selected-papers">{papers.filter(p=>p.featured).map(p=><ResearchCard key={p.slug} paper={p}/>)}</div>{papers.some(p=>!p.featured)&&<div className="other-research">{papers.filter(p=>!p.featured).map(p=><TransitionLink href={`/research/${p.slug}/`} className="other-paper" key={p.slug}><span className="paper-meta venue-name">{p.venue} {p.year}</span><h3 lang="en">{p.title}</h3><ArrowUpRight size={17}/></TransitionLink>)}</div>}</section>
  <section className="home-project" id="open-source" aria-labelledby="selected-project"><SectionHeading id="selected-project" title={<Localized en="Selected projects" zh="开源项目"/>}><TransitionLink href="/projects/"><Localized en="All projects" zh="全部项目"/> <ArrowRight size={15}/></TransitionLink></SectionHeading><div className="project-list">{projects.map((project,i)=><ProjectShowcase key={project.slug} project={project} primary={i===0}/>)}</div></section>
  <section className="home-background" id="background" aria-labelledby="background-heading"><SectionHeading id="background-heading" title={<Localized en="Education & experience" zh="教育与经历"/>}><TransitionLink href="/cv/"><Localized en="Full CV" zh="完整简历"/> <ArrowRight size={15}/></TransitionLink></SectionHeading><HomeBackground/></section>
  <section className="home-writing" id="writing" aria-labelledby="writing-heading"><SectionHeading id="writing-heading" title={<Localized en="Writing & notes" zh="文章与笔记"/>}><TransitionLink href="/writing/"><Localized en="All writing" zh="全部文章"/> <ArrowRight size={15}/></TransitionLink></SectionHeading><div className="writing-directory">{getWritingEntries().slice(0,3).map(post=><TransitionLink className="writing-entry" href={post.href} target={post.external?'_blank':undefined} rel={post.external?'noreferrer':undefined} key={post.slug}>{post.date?<time dateTime={post.date}>{post.date.slice(0,4)}</time>:<span className="writing-platform">Notion</span>}<h3 lang={post.language}>{post.title}</h3><ArrowUpRight size={18}/></TransitionLink>)}</div></section>
 </div>;
}
