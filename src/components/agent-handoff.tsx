import { Localized as Text } from './language';
import './agent-handoff.css';

const runs = [
  { id: 'original', en: 'Original', zh: '原登记', time: '09:04', minutes: 54, result: { en: '9 minutes overdue', zh: '超时 9 分钟' } },
  { id: 'corrected', en: 'Corrected', zh: '更正后', time: '08:49', minutes: 39, result: { en: 'Within the allowance', zh: '在约定时限内' } },
] as const;

export function AgentHandoff() {
  return <div className="handoff-print">
    <div className="handoff-compare-axis"><span>08:10 UTC</span><span><Text en="45 min limit" zh="45 分钟时限" /></span></div>
    <div className="handoff-compare-data">
      {runs.map(run => <div className="handoff-reading" key={run.id} data-reading={run.id}>
        <div className="handoff-reading-label"><strong><Text en={run.en} zh={run.zh} /></strong><span>{run.time} UTC</span></div>
        <div className="handoff-reading-track"><i style={{width:run.minutes/60*100+'%'}} /></div>
        <div className="handoff-outcome"><b>{run.minutes} <Text en="min" zh="分钟" /></b><span><Text {...run.result} /></span></div>
      </div>)}
    </div>
  </div>;
}
