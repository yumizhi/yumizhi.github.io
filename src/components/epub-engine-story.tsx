import { ArrowRight, BookOpen, Files, FolderTree, Monitor, Terminal, FileCode2 } from 'lucide-react';
import { Localized } from './language';
import './epub-engine-story.css';

export function EpubEngineStory() {
  return <section className="epub-engine-story" aria-labelledby="epub-engine-title">
    <header><p className="eyebrow"><Localized en="Inside the engine" zh="实现背后"/></p><h2 id="epub-engine-title"><Localized en="Rebuilding a collection, preserving its volumes." zh="重组合集，保留原卷结构"/></h2>
      <p><Localized en="EPUB chapters refer to shared styles, images and other resources. Merging volumes changes their paths and reading order. The engine rewrites these references and records each resource’s source so that the collection can later be split into individual volumes." zh="EPUB 的章节会引用样式、图片等资源。合并分卷后，文件路径与阅读顺序发生变化。处理引擎重写这些引用，并记录资源所属的原卷，供后续拆分时重建。"/></p></header>
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
    <div className="epub-engine-decisions">
      <div><h3><Localized en="Resource mapping and deduplication" zh="资源映射与去重"/></h3><p><Localized en="Identical images and fonts are pooled by media type and SHA-256. The engine assigns their destinations first, then rewrites references in XHTML, CSS and SVG. Chapters keep working even when their original files had the same names." zh="相同的图片和字体按媒体类型与 SHA-256 去重。先确定资源的新位置，再更新 XHTML、CSS 与 SVG 中的引用；即使不同书籍使用相同文件名，章节中的链接也能指向正确资源。"/></p></div>
      <div><h3><Localized en="File processing in a Web Worker" zh="在 Web Worker 中处理文件"/></h3><p><Localized en="A Web Worker handles the file processing. Documents are decoded one at a time, and results pass between Merge, Split and Inspect directly. You can inspect or recover a merged book without downloading and uploading it again." zh="文件处理交给 Web Worker，文档逐个解码。合并结果可以直接转入拆分或检查，无需先下载再上传；书籍排序、内容预览与最终输出使用同一份结构信息。"/></p></div>
    </div>
    <div className="epub-runtime-strip">
      <div><Monitor/><strong><Localized en="Browser" zh="浏览器"/></strong><span>React · Web Worker · PWA</span></div>
      <div><Terminal/><strong>Node.js</strong><span><Localized en="Shared TypeScript core" zh="复用 TypeScript 核心"/></span></div>
      <div><FileCode2/><strong>Python CLI</strong><span><Localized en="Standard library implementation" zh="标准库实现"/></span></div>
    </div>
  </section>;
}
