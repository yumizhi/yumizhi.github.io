import { ArrowRight, BookOpen, Files, FolderTree, Monitor, Terminal, FileCode2 } from 'lucide-react';
import { Localized } from './language';
import './epub-engine-story.css';

export function EpubEngineStory() {
  return <div className="epub-engine-story">
    <figure className="epub-reassembly">
      <div className="epub-reassembly-head"><strong><Localized en="From separate volumes to a reversible collection" zh="从独立分卷到可拆分的合集"/></strong><span><Localized en="Content structure" zh="内容结构"/></span></div>
      <div className="epub-reassembly-flow">
        <div className="epub-originals">
          <div className="epub-book"><header><BookOpen/><Localized en="Volume A" zh="分卷 A"/></header><span><Localized en="Chapters & navigation" zh="章节与目录"/></span><small><Localized en="Images · fonts · styles" zh="图片 · 字体 · 样式"/></small></div>
          <div className="epub-book"><header><BookOpen/><Localized en="Volume B" zh="分卷 B"/></header><span><Localized en="Chapters & navigation" zh="章节与目录"/></span><small><Localized en="Images · fonts · styles" zh="图片 · 字体 · 样式"/></small></div>
        </div>
        <div className="epub-operation"><Localized en="Merge" zh="合并"/><ArrowRight/></div>
        <div className="epub-package"><header><FolderTree/><Localized en="One EPUB" zh="一个 EPUB"/></header>
          <div className="epub-package-navigation"><strong><Localized en="Reading order" zh="阅读顺序"/></strong><span><i>A</i><Localized en="Chapters from A" zh="分卷 A 的章节"/></span><span><i>B</i><Localized en="Chapters from B" zh="分卷 B 的章节"/></span></div>
          <div className="epub-package-assets"><Files/><span><Localized en="Identical images & fonts stored once" zh="相同图片与字体只保留一份"/></span></div>
          <div className="epub-package-record"><FileCode2/><span><Localized en="Merge record" zh="合并记录"/><small><Localized en="Original paths & volume ownership" zh="原始路径与分卷归属"/></small></span></div>
        </div>
        <div className="epub-operation"><Localized en="Split" zh="拆分"/><ArrowRight/></div>
        <div className="epub-restored"><div><BookOpen/><span><Localized en="Volume A" zh="分卷 A"/></span></div><div><BookOpen/><span><Localized en="Volume B" zh="分卷 B"/></span></div><small><Localized en="Rebuilt chapters, navigation & assets" zh="重建各卷章节、目录与资源"/></small></div>
      </div>
      <figcaption><Localized en="The merge record preserves the information needed to reconstruct each volume’s content and resources. Package metadata and ZIP files are rebuilt during splitting." zh="合并记录保留各卷内容与资源的对应关系。拆分时按记录恢复分卷，重新生成包元数据与 ZIP 文件。"/></figcaption>
    </figure>
    <div className="epub-runtime-strip">
      <div><Monitor/><strong><Localized en="Browser" zh="浏览器"/></strong><span>React · Web Worker · PWA</span></div>
      <div><Terminal/><strong>Node.js</strong><span><Localized en="Shared TypeScript core" zh="复用 TypeScript 核心"/></span></div>
      <div><FileCode2/><strong>Python CLI</strong><span><Localized en="Standard library implementation" zh="标准库实现"/></span></div>
    </div>
  </div>;
}
