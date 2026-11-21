import { ArrowRight, ArrowUpRight, Mail } from 'lucide-react';
import { HomeBackground } from '@/components/home-background';
import { SasboPlate } from '@/components/home/research-plates';
import { ProjectCard } from '@/components/project-card';
import { TidePlate } from '@/components/home/tide-preview';
import { Localized } from '@/components/language';
import { PaperTitle } from '@/components/paper-title';
import { PublicationActions } from '@/components/publication-actions';
import { TransitionLink } from '@/components/providers';
import { asset } from '@/lib/paths';
import { papers, projects, site, type Paper } from '@/lib/content';
import { getWritingEntries } from '@/lib/posts';

const advisor = 'https://cs.nju.edu.cn/shanglin/index.htm';
const selectedPapers = papers.filter(paper => paper.slug === 'tide' || paper.slug === 'sasbo');

function PaperFeature({ paper }: { paper: Paper }) {
  const tide = paper.slug === 'tide';
  const url = `/research/${paper.slug}/?from=home`;
  const titleId = `home-${paper.slug}-title`;

  return (
    <article className="ph-study" data-testid={`research-card-${paper.slug}`} aria-labelledby={titleId}>
      <div className="ph-study-media">{tide ? <TidePlate /> : <SasboPlate />}</div>
      <header className="ph-study-header">
        <p className="ph-study-venue">
          <cite>{paper.venue}</cite> <time dateTime={String(paper.year)}>{paper.year}</time>
          <span aria-hidden="true"> · </span>{tide ? <Localized en="Accepted" zh="已接收" /> : <Localized en="Oral" zh="口头报告" />}
        </p>
        <h3 id={titleId} lang="en">
          <TransitionLink href={url}><PaperTitle>{paper.title}</PaperTitle></TransitionLink>
        </h3>
        <p className="ph-byline authors" lang="en">
          {paper.authors.map((author, index) => (
            <span key={author}>{index > 0 && ', '}{author === site.name ? <strong>{author}</strong> : author}</span>
          ))}
        </p>
        <p className="ph-paper-description">
          {tide
            ? <Localized en="TIDE follows the denoising trajectory to keep a watermark detectable while preserving the scene of the original generation." zh="TIDE 沿去噪轨迹调整水印引导，让生成图保留可检测信号，也尽量保住原有构图。" />
            : <Localized en="SASBO studies the fragility of image classifiers when only a few input coordinates change." zh="SASBO 研究图像分类器对局部变化的敏感性：改动集中在极少数位置时，模型的判断仍可能翻转。" />}
        </p>
        <PublicationActions paper={paper} fromHome />
      </header>
    </article>
  );
}

export default function Home() {
  const writing = getWritingEntries().slice(0, 3);

  return (
    <div className="portfolio-home">
      <div className="ph-shell">
        <section className="ph-intro" id="about-me" aria-labelledby="my-name">
          <img className="ph-portrait" src={asset('/images/profile-avatar.webp')} width={400} height={400} alt="" fetchPriority="high" />
          <div className="ph-identity">
            <h1 id="my-name"><Localized en={site.name} zh={site.chineseName} /></h1>
            <p className="ph-affiliation">
              <Localized
                en={<>Ph.D. candidate at <a href="https://www.nju.edu.cn/" target="_blank" rel="noreferrer">Nanjing University</a></>}
                zh={<><a href="https://www.nju.edu.cn/" target="_blank" rel="noreferrer">南京大学</a>计算机科学与技术博士研究生</>}
              />
            </p>
            <p className="ph-bio">
              <Localized
                en={<>My research spans diffusion models, image watermarking, and adversarial learning. I am advised by <a href={advisor} target="_blank" rel="noreferrer">Lin Shang</a>.</>}
                zh={<>我的研究方向是扩散模型、图像水印与对抗学习，导师为<a href={advisor} target="_blank" rel="noreferrer">商琳</a>副教授。</>}
              />
            </p>
            <ul className="ph-contact">
              <li><a href={site.scholar} target="_blank" rel="noreferrer">Scholar <ArrowUpRight size={14} aria-hidden="true" /></a></li>
              <li><a href={site.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} aria-hidden="true" /></a></li>
              <li><a href={`mailto:${site.email}`}><Localized en="Email" zh="邮箱" /> <Mail size={14} aria-hidden="true" /></a></li>
              <li><TransitionLink href="/cv/"><Localized en="CV" zh="简历" /> <ArrowRight size={14} aria-hidden="true" /></TransitionLink></li>
            </ul>
          </div>
        </section>

        <section className="ph-research" id="publications" aria-labelledby="selected-research">
          <div className="ph-section-heading">
            <h2 id="selected-research"><Localized en="Research" zh="研究成果" /></h2>
            <TransitionLink className="ph-link" href="/research/">
              <Localized en="All publications" zh="全部论文" /> <ArrowRight size={16} aria-hidden="true" />
            </TransitionLink>
          </div>
          <div className="ph-study-list">
            {selectedPapers.map(paper => <PaperFeature key={paper.slug} paper={paper} />)}
          </div>
        </section>

        <section className="ph-end-section ph-project" id="projects" aria-labelledby="home-projects">
          <div className="ph-section-heading">
            <h2 id="home-projects"><Localized en="Projects" zh="项目" /></h2>
            <TransitionLink className="ph-link" href="/projects/">
              <Localized en="All projects" zh="全部项目" /> <ArrowRight size={16} aria-hidden="true" />
            </TransitionLink>
          </div>
          <div className="project-card-list">
            {projects.map(project => <ProjectCard key={project.slug} project={project} />)}
          </div>
        </section>

        <section className="ph-end-section" id="background" aria-labelledby="background-heading">
          <div className="ph-section-heading">
            <h2 id="background-heading"><Localized en="Background" zh="教育与经历" /></h2>
            <TransitionLink className="ph-link" href="/cv/">
              <Localized en="Full CV" zh="完整简历" /> <ArrowRight size={16} aria-hidden="true" />
            </TransitionLink>
          </div>
          <HomeBackground />
        </section>

        <section className="ph-end-section ph-writing" id="writing" aria-labelledby="writing-heading">
          <div className="ph-section-heading">
            <h2 id="writing-heading"><Localized en="Writing & notes" zh="文章与笔记" /></h2>
            <TransitionLink className="ph-link" href="/writing/">
              <Localized en="All writing" zh="全部文章" /> <ArrowRight size={16} aria-hidden="true" />
            </TransitionLink>
          </div>
          <ul className="ph-notes">
            {writing.map(post => (
              <li key={post.slug}>
                <TransitionLink href={post.href} target={post.external ? '_blank' : undefined} rel={post.external ? 'noreferrer' : undefined}>
                  <div lang={post.language}>
                    <h3>{post.title}</h3>
                    <p>{post.description}</p>
                  </div>
                  {post.external ? <ArrowUpRight size={19} aria-hidden="true" /> : <ArrowRight size={19} aria-hidden="true" />}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
