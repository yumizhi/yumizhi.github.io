import { Diagram } from './project-architecture';
import { Localized as Text } from './language';
import './agent-runtime-trace.css';

const steps = [
  {
    id: 'context',
    label: { en: 'Context', zh: '装配上下文' },
    title: { en: 'Engine → Pi adapter', zh: '引擎 → Pi 适配器' },
    detail: { en: 'The engine loads the Agent version and prepares the scoped input and tools for this step.', zh: '引擎读取固定版本，为这一步准备输入、来源与获授权的工具。' },
  },
  {
    id: 'tool',
    label: { en: 'Tool call', zh: '工具调用' },
    title: { en: 'Pi → authorized read tool → Pi', zh: 'Pi → 获授权的读取工具 → Pi' },
    detail: { en: 'Pi requests a read. The engine checks the capability, validates the call and passes its result back into the model turn.', zh: 'Pi 请求读取，引擎核对能力权限并校验调用，结果再交回这一轮模型。' },
  },
  {
    id: 'commit',
    label: { en: 'Checkpoint', zh: '提交检查点' },
    title: { en: 'Pi adapter → engine → SQLite', zh: 'Pi 适配器 → 引擎 → SQLite' },
    detail: { en: 'The adapter returns the summary, evidence references, model and usage. The engine verifies that the worker still owns the step before committing its checkpoint.', zh: '适配器交回摘要、证据引用、模型与用量。引擎确认工作进程仍持有这一步的执行权，再写入检查点。' },
  },
  {
    id: 'resume',
    label: { en: 'Resume', zh: '接续运行' },
    title: { en: 'SQLite → engine', zh: 'SQLite → 引擎' },
    detail: { en: 'A worker reads the committed step results and advances the graph from the next eligible node.', zh: 'Worker 读取已提交的步骤结果，从下一个可执行节点接着推进。' },
  },
] as const;

export function AgentRuntimeTrace() {
  return <Diagram id="agent-runtime-trace" title={{en: 'A model turn inside a durable workflow', zh:'工作流中的一次模型回合'}}
    caption={{en:'The Pi adapter handles model turns. The inspection template uses a deterministic evidence adapter with the same execution contract.',zh:'Pi 适配器负责模型回合。巡检模板通过同一执行契约调用确定性的证据适配器。'}}>
    <ol className="runtime-sequence">{steps.map(step => <li key={step.id}>
      <div><strong><Text {...step.label} /></strong><span><Text {...step.title} /></span></div>
      <p><Text {...step.detail} /></p>
    </li>)}</ol>
    <a className="agent-runtime-source" href="https://github.com/earendil-works/pi/tree/main/packages/agent" target="_blank" rel="noreferrer"><Text en="Pi Agent Core documentation" zh="Pi Agent Core 文档" /></a>
  </Diagram>;
}
