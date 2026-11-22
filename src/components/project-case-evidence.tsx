import { Localized } from './language';
import type { CaseCheck } from '@/lib/project-chapters';

export function ProjectCaseEvidence({ checks }: { checks: CaseCheck[] }) {
  return <div className="case-prose case-checks">{checks.map(check =>
    <div key={check.title.en}><h3><Localized {...check.title} /></h3><p><Localized {...check.body} /></p></div>
  )}</div>;
}
