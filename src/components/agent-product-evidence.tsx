import { Localized } from './language';
import { asset } from '@/lib/paths';
import './agent-product-evidence.css';

export function AgentProductEvidence() {
  return <figure className="agent-product-evidence">
    <div className="agent-product-spread">
      <div>
        <strong><Localized en="Run record" zh="执行记录" /></strong>
        <img src={asset('/images/projects/agent-run-detail.webp')} width={482} height={481}
          loading="lazy" alt="P-17 run detail with four completed steps and a web inbox receipt." />
      </div>
      <div>
        <strong><Localized en="Delivered report" zh="交付给成员的报告" /></strong>
        <img src={asset('/images/projects/agent-result-detail.webp')} width={771} height={441}
          loading="lazy" alt="P-17 handoff report citing an equipment manual and maintenance record." />
      </div>
    </div>
    <figcaption><Localized en="The P-17 demonstration run has four completed steps and an inbox receipt. The delivered report cites the equipment manual and maintenance record alongside its recommendation."
      zh="P-17 演示任务的执行记录列出四个已完成步骤和收件箱回执。报告列有维护建议，并标注对应的设备手册与台账条目。" /></figcaption>
  </figure>;
}
