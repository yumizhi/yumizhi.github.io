import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { HeroTrajectory } from '@/components/home/hero-trajectory';
import { Localized } from '@/components/language';
import { awards, papers, projects, site } from '@/lib/content';
import { getWritingEntries } from '@/lib/posts';
import { asset } from '@/lib/paths';

const advisor = 'https://cs.nju.edu.cn/shanglin/index.htm';

const paperNotes: Record<string, { zh: string; en: string }> = {
  tide: {
    en: 'A watermark written into an intermediate diffusion latent, then carried to the image by guidance that adapts at every remaining step.',
    zh: '在扩散模型的中间潜变量中写入水印，并在之后的每一步自适应地引导它传播到最终图像。',
  },
  sasbo: {
    en: 'Choosing which pixels to perturb as a stochastic binary optimization problem, solved with an unbiased gradient estimator.',
    zh: '把“扰动哪些像素”表述为随机二值优化问题，并用无偏梯度估计求解。',
  },
  'sparse-meta-learning': {
    en: 'Meta-learning over sampled source models, followed by a projection that keeps only the most useful pixels, for sparse attacks that transfer.',
    zh: '在多个源模型上进行元学习，再通过投影只保留贡献最大的像素，得到可迁移的稀疏攻击。',
  },
};

export default function Home() {
  const [tide, ...others] = papers;
  const project = projects[0];
  return (
    <div className="home">
      <section className="shell hero" id="about-me" aria-labelledby="my-name">
        <div className="hero-copy">
          <p className="label">
            <Localized en="Ph.D. candidate · Nanjing University" zh="博士研究生 · 南京大学" />
          </p>
          <h1 className="display" id="my-name"><Localized en="Yihan Meng" zh="蒙一涵" /></h1>
          <p className="display hero-statement">
            <Localized
              en={<>I work on watermarks that <em>survive</em> inside diffusion models, and on how few pixels it takes to fool a classifier.</>}
              zh={<>我研究能在扩散模型生成过程中<em>留存</em>的水印，以及改动多少像素就足以欺骗分类器。</>}
            />
          </p>
          <p className="hero-detail">
            <Localized
              en={<>My research covers diffusion models, image watermarking, and adversarial learning. I am advised by <a className="link" href={advisor} target="_blank" rel="noreferrer">Lin Shang</a> at <a className="link" href="https://www.nju.edu.cn/" target="_blank" rel="noreferrer">Nanjing University</a>.</>}
              zh={<>研究方向包括扩散模型、图像水印与对抗学习。就读于<a className="link" href="https://www.nju.edu.cn/" target="_blank" rel="noreferrer">南京大学</a>，导师为<a className="link" href={advisor} target="_blank" rel="noreferrer">商琳</a>副教授。</>}
            />
          </p>
          <ul className="hero-links" aria-label="Profiles">
            <li><a className="arrow-link" href={site.scholar} target="_blank" rel="noreferrer">Scholar <ArrowUpRight size={14} aria-hidden="true" /></a></li>
            <li><a className="arrow-link" href={site.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} aria-hidden="true" /></a></li>
            <li><a className="arrow-link" href={`mailto:${site.email}`}><Localized en="Email" zh="邮箱" /> <ArrowUpRight size={14} aria-hidden="true" /></a></li>
            <li><Link className="arrow-link" data-direction="right" href="/cv/"><Localized en="CV" zh="简历" /> <ArrowRight size={14} aria-hidden="true" /></Link></li>
          </ul>
        </div>
        <img className="hero-portrait" src={asset('/images/profile-avatar.webp')} width={400} height={400} alt="Yihan Meng" />
      </section>

      <div className="shell"><HeroTrajectory /></div>

      <section className="shell home-section" id="publications" aria-labelledby="selected-research">
        <header className="section-heading">
          <h2 className="display" id="selected-research"><Localized en="Research" zh="研究成果" /></h2>
          <Link className="arrow-link" data-direction="right" href="/research/">
            <Localized en="All publications" zh="全部论文" /> <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </header>

        <article className="lead-paper">
          <div className="lead-paper-copy">
            <p className="label paper-venue" data-hue="tide">{tide.venue} {tide.year}</p>
            <h3 className="display" lang="en"><Link href="/research/tide/">{tide.title}</Link></h3>
            <p className="paper-note"><Localized en={paperNotes.tide.en} zh={paperNotes.tide.zh} /></p>
            <dl className="lead-paper-figures">
              <div><dt><Localized en="AUC under attack" zh="攻击下 AUC" /></dt><dd>0.999</dd></div>
              <div><dt><Localized en="TPR@1%FPR under attack" zh="攻击下 TPR@1%FPR" /></dt><dd>0.986</dd></div>
              <div><dt><Localized en="PSNR to reference" zh="相对参照图 PSNR" /></dt><dd>24.53</dd></div>
            </dl>
            <Link className="pill" data-variant="solid" href="/research/tide/">
              <Localized en="Read the article" zh="阅读全文" /> <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <Link className="lead-paper-art" href="/research/tide/" tabIndex={-1} aria-hidden="true">
            {[
              { id: 'original', en: 'No watermark', zh: '无水印' },
              { id: 'tree', en: 'Tree-Ring', zh: 'Tree-Ring' },
              { id: 'tide', en: 'TIDE', zh: 'TIDE' },
            ].map(lane => (
              <span className="lane" data-track={lane.id} key={lane.id}>
                <span className="label"><Localized en={lane.en} zh={lane.zh} /></span>
                <img src={asset(`/images/art/tide-lane-${lane.id}.webp`)} width={2560} height={256} alt="" loading="lazy" />
              </span>
            ))}
            <span className="lane-caption">
              <Localized en="Same prompt and seed, ten of the fifty denoising steps" zh="相同提示词与随机种子，五十步中的十步" />
            </span>
          </Link>
        </article>

        <div className="paper-pair">
          {others.map(paper => (
            <article className="paper-card" key={paper.slug} data-paper={paper.slug}>
              <Link className="paper-card-art" href={`/research/${paper.slug}/`} tabIndex={-1} aria-hidden="true">
                {paper.slug === 'sasbo' ? (
                  <>
                    <img src={asset('/images/research-motion/sasbo-attack.webp')} width={468} height={468} alt="" loading="lazy" />
                    <img src={asset('/images/research-motion/sasbo-map.webp')} width={468} height={468} alt="" loading="lazy" />
                  </>
                ) : (
                  <img className="paper-card-figure" src={asset(paper.image!)} width={paper.imageWidth} height={paper.imageHeight} alt="" loading="lazy" />
                )}
              </Link>
              <p className="label paper-venue" data-hue={paper.slug === 'sasbo' ? 'attack' : 'meta'}>{paper.venue} {paper.year}</p>
              <h3 className="display" lang="en"><Link href={`/research/${paper.slug}/`}>{paper.title}</Link></h3>
              <p className="paper-note"><Localized en={paperNotes[paper.slug].en} zh={paperNotes[paper.slug].zh} /></p>
            </article>
          ))}
        </div>
      </section>

      <section className="shell home-section" id="open-source" aria-labelledby="selected-project">
        <header className="section-heading">
          <h2 className="display" id="selected-project"><Localized en="Projects" zh="开源项目" /></h2>
          <Link className="arrow-link" data-direction="right" href="/projects/">
            <Localized en="All projects" zh="全部项目" /> <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </header>
        <article className="project-feature">
          <div className="project-feature-copy">
            <p className="label"><Localized en={project.category} zh={project.categoryZh ?? project.category} /></p>
            <h3 className="display" lang="en"><Link href={`/projects/${project.slug}/`}>{project.title}</Link></h3>
            <p className="paper-note"><Localized en={project.summary} zh={project.summaryZh ?? project.summary} /></p>
            <div className="project-feature-actions">
              {project.demo && (
                <a className="pill" data-variant="solid" href={project.demo} target="_blank" rel="noreferrer">
                  <Localized en="Open app" zh="打开应用" /> <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              )}
              <a className="pill" href={project.repo} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} aria-hidden="true" /></a>
            </div>
          </div>
          <Link className="project-feature-shot" href={`/projects/${project.slug}/`} tabIndex={-1} aria-hidden="true">
            <img src={asset('/images/epub-workspace-crop.webp')} width={1137} height={842} alt="" loading="lazy" />
          </Link>
        </article>
      </section>

      <section className="shell home-section" id="background" aria-labelledby="background-heading">
        <header className="section-heading">
          <h2 className="display" id="background-heading"><Localized en="Education & experience" zh="教育与经历" /></h2>
          <Link className="arrow-link" data-direction="right" href="/cv/">
            <Localized en="Full CV" zh="完整简历" /> <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </header>
        <div className="background">
          <ol className="timeline">
            <li>
              <time><Localized en="2025 — Present" zh="2025 — 至今" /></time>
              <img src={asset('/images/guodian.webp')} width={43} height={43} alt="" loading="lazy" />
              <div>
                <h3><Localized en="Research Intern" zh="研究实习生" /></h3>
                <p><Localized en="Guodian Nanjing Automation Co., Ltd." zh="国电南京自动化股份有限公司" /></p>
              </div>
            </li>
            <li>
              <time><Localized en="2023 — Present" zh="2023 — 至今" /></time>
              <img src={asset('/images/nju-seal.svg')} width={43} height={54} alt="" loading="lazy" />
              <div>
                <h3><Localized en="Ph.D. candidate, Computer Science and Technology" zh="计算机科学与技术 博士研究生" /></h3>
                <p>
                  <Localized
                    en={<>Nanjing University · Advisor: <a className="link" href={advisor} target="_blank" rel="noreferrer">Lin Shang</a></>}
                    zh={<>南京大学 · 导师：<a className="link" href={advisor} target="_blank" rel="noreferrer">商琳</a></>}
                  />
                </p>
              </div>
            </li>
            <li>
              <time>2019 — 2023</time>
              <img src={asset('/images/nju-seal.svg')} width={43} height={54} alt="" loading="lazy" />
              <div>
                <h3><Localized en="B.S., Computer Science and Technology" zh="计算机科学与技术 本科" /></h3>
                <p><Localized en="Nanjing University" zh="南京大学" /></p>
              </div>
            </li>
          </ol>
          <div className="honours">
            <h3 className="label"><Localized en="Honours" zh="荣誉奖项" /></h3>
            <ul>
              {awards.map(award => (
                <li key={award.title}>
                  <time>{award.year}</time>
                  <span><Localized en={award.title} zh={award.titleZh} /></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="shell home-section" id="writing" aria-labelledby="writing-heading">
        <header className="section-heading">
          <h2 className="display" id="writing-heading"><Localized en="Writing & notes" zh="文章与笔记" /></h2>
          <Link className="arrow-link" data-direction="right" href="/writing/">
            <Localized en="All writing" zh="全部文章" /> <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </header>
        <ul className="entry-list">
          {getWritingEntries().slice(0, 3).map(post => (
            <li key={post.slug}>
              <a className="entry" href={post.href} target={post.external ? '_blank' : undefined} rel={post.external ? 'noreferrer' : undefined}>
                <span className="label">{post.date ? post.date.slice(0, 4) : 'Notion'}</span>
                <span className="entry-body" lang={post.language}>
                  <strong className="display">{post.title}</strong>
                  <span>{post.description}</span>
                </span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
