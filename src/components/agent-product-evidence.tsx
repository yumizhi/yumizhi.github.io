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
    <figcaption><Localized en="Two views of the same P-17 demonstration. The run records the inbox delivery. Opening that delivery reveals the assistant’s recommendation and the numbered passages behind it."
      zh="同一项 P-17 演示任务留下两份记录。执行面板保存收件箱的送达回执；打开交付结果，能读到助手的建议，并沿编号引用核对原文。" /></figcaption>
  </figure>;
}
