import Link from 'next/link';
import { Localized } from '@/components/language';
import { site } from '@/lib/content';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-grid">
          <p className="footer-note">
            <Localized
              en="Research on diffusion models, image watermarking, and adversarial learning at Nanjing University."
              zh="在南京大学研究扩散模型、图像水印与对抗学习。"
            />
          </p>
          <div className="footer-column">
            <h2 className="label"><Localized en="Site" zh="站点" /></h2>
            <ul>
              <li><Link href="/research/"><Localized en="Research" zh="研究" /></Link></li>
              <li><Link href="/projects/"><Localized en="Projects" zh="项目" /></Link></li>
              <li><Link href="/writing/"><Localized en="Writing" zh="写作" /></Link></li>
              <li><Link href="/cv/"><Localized en="Curriculum vitae" zh="简历" /></Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h2 className="label"><Localized en="Elsewhere" zh="其他" /></h2>
            <ul>
              <li><a href={`mailto:${site.email}`}><Localized en="Email" zh="邮箱" /></a></li>
              <li><a href={site.scholar} target="_blank" rel="noreferrer">Google Scholar</a></li>
              <li><a href={site.github} target="_blank" rel="noreferrer">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-legal">
          <span>© {new Date().getFullYear()} <Localized en="Yihan Meng" zh="蒙一涵" /></span>
          <span><Localized en="Nanjing University · Computer Science and Technology" zh="南京大学 · 计算机科学与技术系" /></span>
        </div>
      </div>
    </footer>
  );
}
