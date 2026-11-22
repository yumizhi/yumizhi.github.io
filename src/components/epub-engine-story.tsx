import { Monitor, Terminal, FileCode2 } from 'lucide-react';
import { Localized } from './language';
import './epub-engine-story.css';

export function EpubEngineStory() {
  return (
    <div className="epub-engine-story">
      <figure className="epub-merge-record">
        <figcaption>
          <strong><Localized en="A resource entry in the merge record" zh="合并记录的资源条目" /></strong>
          <code>META-INF/epub-merge-tool.json</code>
        </figcaption>
        <pre><code>{`{
  "href": "chapters/01.xhtml",
  "merged_href": "v1/chapters/01.xhtml"
}`}</code></pre>
        <p><Localized en="In this entry, href identifies the source chapter and merged_href identifies its copy in the collection. The full record also includes each volume’s reading order, navigation and rewritten references."
          zh="此条记录的 href 对应原卷章节，merged_href 对应章节在合集中的位置。完整记录还保存每卷的阅读顺序、目录和引用改写关系。" /></p>
      </figure>

      <div className="epub-runtime-strip">
        <div><Monitor aria-hidden="true" /><strong><Localized en="Browser" zh="浏览器" /></strong><span>React · Web Worker · PWA</span></div>
        <div><Terminal aria-hidden="true" /><strong>Node.js</strong><span><Localized en="Shared TypeScript core" zh="复用 TypeScript 核心" /></span></div>
        <div><FileCode2 aria-hidden="true" /><strong>Python CLI</strong><span><Localized en="Standard-library implementation" zh="标准库实现" /></span></div>
      </div>
    </div>
  );
}
