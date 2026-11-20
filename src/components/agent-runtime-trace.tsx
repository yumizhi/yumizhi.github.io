'use client';

import { useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Database, Layers3, Workflow, Wrench } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Diagram } from './project-architecture';
import { Localized as Text, useLanguage } from './language';
import { Tabs, TabsList, TabsPanel, TabsTab } from './ui/coss/tabs';
import './agent-runtime-trace.css';

const steps = [
  {
    id: 'context',
    label: { en: 'Context', zh: '装配上下文' },
    title: { en: 'Engine → Pi adapter', zh: '引擎 → Pi 适配器' },
    payload: 'input · records · evidence',
    detail: { en: 'The engine loads the Agent version and prepares the scoped input and tools for this step.', zh: '引擎读取固定版本，为这一步准备输入、来源与获授权的工具。' },
  },
  {
    id: 'tool',
    label: { en: 'Tool call', zh: '工具调用' },
    title: { en: 'Pi → authorized read tool → Pi', zh: 'Pi → 获授权的读取工具 → Pi' },
    payload: 'tool request → validated result',
    detail: { en: 'Pi requests a read. The engine checks the capability, validates the call and passes its result back into the model turn.', zh: 'Pi 请求读取，引擎核对能力权限并校验调用，结果再交回这一轮模型。' },
  },
  {
    id: 'commit',
    label: { en: 'Checkpoint', zh: '提交检查点' },
    title: { en: 'Pi adapter → engine → SQLite', zh: 'Pi 适配器 → 引擎 → SQLite' },
    payload: 'summary · evidence · model · usage',
    detail: { en: 'The adapter returns the step output. The engine checks its claim before committing a checkpoint.', zh: '适配器交回节点输出，引擎核对当前领取状态后才提交检查点。' },
  },
  {
    id: 'resume',
    label: { en: 'Resume', zh: '接续运行' },
    title: { en: 'SQLite → engine', zh: 'SQLite → 引擎' },
    payload: 'completed steps → next eligible node',
    detail: { en: 'A worker reads the committed step results and advances the graph from the next eligible node.', zh: 'Worker 读取已提交的步骤结果，从下一个可执行节点接着推进。' },
  },
] as const;

type Stage = (typeof steps)[number]['id'];

function RuntimeWire({ lit, reverse, vertical = false, bidirectional = false, animated }: {
  lit: boolean; reverse: boolean; vertical?: boolean; bidirectional?: boolean; animated: boolean;
}) {
  const Arrow = vertical ? (reverse ? ArrowUp : ArrowDown) : (reverse ? ArrowLeft : ArrowRight);
  return (
    <div className="runtime-wire" data-lit={lit} data-reverse={reverse} data-vertical={vertical} aria-hidden="true">
      <div className="runtime-wire-track">
        {lit && <motion.span initial={animated ? (vertical ? { scaleY: 0 } : { scaleX: 0 }) : false}
          animate={vertical ? { scaleY: 1 } : { scaleX: 1 }} transition={{ duration: animated ? .3 : 0, ease: 'easeOut' }} />}
      </div>
      <Arrow size={16} strokeWidth={1.6} />
      {bidirectional && <ArrowLeft className="runtime-return-arrow" size={16} strokeWidth={1.6} />}
    </div>
  );
}

export function AgentRuntimeTrace() {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const [value, setValue] = useState<Stage>('context');
  const [touched, setTouched] = useState(false);
  const animate = touched && !reduced;
  return (
    <Diagram id="agent-runtime-trace"
      title={{ en: 'A model turn within a durable workflow', zh: '一次模型回合在工作流中的位置' }}
      caption={{
        en: 'Illustration of the Pi adapter. The scheduled P-17 acceptance run used the local evidence adapter through the same runtime contract.',
        zh: '这里画的是 Pi 适配器的调用过程。P-17 定时验收通过同一运行时契约调用本地证据适配器。',
      }}>
      <Tabs value={value} className="agent-runtime-tabs" onValueChange={(next: Stage) => { setValue(next); setTouched(true); }}>
        <TabsList className="agent-runtime-switch" aria-label={language === 'zh' ? '运行时步骤' : 'Runtime steps'}>
          {steps.map(step => <TabsTab key={step.id} value={step.id}><Text {...step.label} /></TabsTab>)}
        </TabsList>
        <div className="agent-runtime-map" data-step={value} aria-hidden="true">
          <div className="runtime-node" data-node="engine"><Workflow size={20} /><strong><Text en="Workflow engine" zh="工作流引擎" /></strong></div>
          <RuntimeWire key={'engine-' + value} lit={value === 'context' || value === 'commit'} reverse={value === 'commit'} animated={animate} />
          <div className="runtime-node" data-node="pi"><Layers3 size={20} /><strong>Pi Agent</strong></div>
          <RuntimeWire key={'tools-' + value} lit={value === 'tool'} reverse={false} bidirectional={value === 'tool'} animated={animate} />
          <div className="runtime-node" data-node="tool"><Wrench size={20} /><strong><Text en="Read tool" zh="读取工具" /></strong></div>
          <RuntimeWire key={'storage-' + value} lit={value === 'commit' || value === 'resume'} reverse={value === 'resume'} vertical animated={animate} />
          <div className="runtime-node" data-node="sqlite"><Database size={18} /><strong>SQLite</strong></div>
        </div>
        {steps.map(step => (
          <TabsPanel className="agent-runtime-panel" key={step.id} value={step.id}>
            <strong><Text {...step.title} /></strong>
            <p><Text {...step.detail} /></p>
            <code>{step.payload}</code>
          </TabsPanel>
        ))}
      </Tabs>
      <a className="agent-runtime-source" href="https://github.com/earendil-works/pi/tree/main/packages/agent" target="_blank" rel="noreferrer">
        <Text en="Pi Agent Core documentation" zh="Pi Agent Core 文档" />
      </a>
    </Diagram>
  );
}
