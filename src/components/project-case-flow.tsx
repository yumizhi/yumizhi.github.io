import { Localized as Text } from './language';
import type { Bilingual, ProjectStep } from '@/lib/project-chapters';

export function ProjectCaseFlow({ slug, steps, title }: { slug: string; steps: ProjectStep[]; title: Bilingual }) {
  const epub = slug === 'epub-toolkit';
  return <figure className="case-flow detail-figure" data-project-trace={slug}>
    <figcaption><Text {...title} /></figcaption>
    <ol className="case-exhibit">
      {steps.map(step => <li key={step.id} data-case-step={step.id}>
        <strong className="case-action"><Text {...step.label} /></strong>
        {epub && <div className="epub-paths">
          {['A','B'].map((vol,i) => <div key={vol}><small><Text en="Volume" zh="卷" /> {vol}</small>
            <code>{step.id === 'merge' && <>v{i+1}/<wbr /></>}chapters/<wbr />01.xhtml</code></div>)}
        </div>}
        {!epub && step.id === 'verify' && <><small className="verdict-artifact"><Text en="Original unsigned TIDE file" zh="原始未签名 TIDE 文件" /></small><dl className="origin-verdict">
          <dt><Text en="Watermark" zh="水印" /></dt><dd><Text en="Detected" zh="已检出" /></dd>
          <dt><Text en="Signature" zh="签名" /></dt><dd><Text en="No credential" zh="无凭证" /></dd>
          <dt><Text en="Issuer trust" zh="签发者信任" /></dt><dd><Text en="Not evaluated" zh="未评估" /></dd>
        </dl></>}
        <p><Text {...step.body} /></p>
        <small className="case-result"><Text {...step.output} /></small>
      </li>)}
    </ol>
  </figure>;
}
