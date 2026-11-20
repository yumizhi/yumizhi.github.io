'use client';

import { useId, useState, type CSSProperties } from 'react';
import { AppWindow, Cpu, Database, FileCheck2, ShieldCheck } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { FilterTabs } from './filter-tabs';
import { Localized, useLanguage } from './language';
import { projectArchitecture } from '@/lib/project-architecture';
import './project-architecture.css';

type Architecture = (typeof projectArchitecture)[string];
type ArchitectureNode = Architecture['nodes'][number];

const icons = {
  entry: AppWindow,
  compute: Cpu,
  record: Database,
  output: FileCheck2,
  check: ShieldCheck,
};

function NodeText({ node }: { node: ArchitectureNode }) {
  const Icon = icons[node.kind];
  return (
    <>
      <Icon className="architecture-node-icon" size={15} strokeWidth={1.65} aria-hidden="true" />
      <div>
        <strong><Localized {...node.title} /></strong>
        <small><Localized {...node.detail} /></small>
      </div>
    </>
  );
}

export function ProjectArchitecture({ slug }: { slug: string }) {
  const view = projectArchitecture[slug];
  const [selected, setSelected] = useState(view.routes[0].id);
  const [hasSwitched, setHasSwitched] = useState(false);
  const id = useId();
  const reducedMotion = useReducedMotion();
  const { language } = useLanguage();
  const route = view.routes.find(item => item.id === selected) ?? view.routes[0];
  const highlighted = new Set(route.stages.flat());

  return (
    <figure className="architecture-figure" data-project={slug} aria-labelledby={`${id}-caption`}>
      <figcaption className="architecture-header">
        <span id={`${id}-caption`} className="architecture-title"><Localized {...view.title} /></span>
        <FilterTabs
          className="architecture-routes"
          label={language === 'zh' ? '架构图路径' : 'Architecture route'}
          value={selected}
          onChange={next => {
            setSelected(next);
            setHasSwitched(true);
          }}
          options={view.routes.map(item => ({ value: item.id, label: <Localized {...item.label} /> }))}
        />
      </figcaption>

      <div className="architecture-canvas" data-route={selected} aria-hidden="true"
        style={{ '--architecture-height': view.height } as CSSProperties}>
        <svg viewBox={`0 0 960 ${view.height}`} preserveAspectRatio="none" className="architecture-wiring">
          <defs>
            {[false, true].map(active => (
              <marker key={String(active)} id={`${id}-arrow-${active}`} viewBox="0 0 8 8" refX="8" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M1 1L7 4L1 7" fill="none" stroke="currentColor" strokeWidth="1.4" data-active={active} />
              </marker>
            ))}
          </defs>
          {view.edges.map(edge => {
            const active = edge.routes.includes(selected);
            return (
              <path key={edge.path} d={edge.path} data-edge="" data-active={active} data-secondary={edge.secondary}
                markerEnd={`url(#${id}-arrow-${active})`} />
            );
          })}
          {hasSwitched && !reducedMotion && view.edges.filter(edge => edge.routes.includes(selected) && !edge.secondary).map(edge => (
            <motion.path key={selected + edge.path} d={edge.path} data-accent=""
              initial={{ pathLength: 0, opacity: .85 }} animate={{ pathLength: 1, opacity: 0 }}
              transition={{ duration: .48, ease: 'easeOut' }} />
          ))}
        </svg>
        {view.nodes.map(node => (
          <div key={node.id} className="architecture-node" data-kind={node.kind} data-active={highlighted.has(node.id)}
            style={{ '--column': node.column, '--row': node.row } as CSSProperties}>
            <NodeText node={node} />
          </div>
        ))}
      </div>

      <ol className="architecture-stages" role="list" aria-label={route.label[language]} key={selected}>
        {route.stages.map(stage => (
          <li key={stage.join('-')}>
            {stage.map(nodeId => {
              const node = view.nodes.find(item => item.id === nodeId)!;
              return (
                <div key={node.id} className="architecture-node" data-kind={node.kind} data-active="true">
                  <NodeText node={node} />
                </div>
              );
            })}
          </li>
        ))}
      </ol>

      <div className="architecture-reading">
        <p aria-live="polite"><Localized {...route.description} /></p>
        <span className="architecture-key">
          <i aria-hidden="true" /><Localized en="Record or reference" zh="记录或引用" />
        </span>
      </div>
    </figure>
  );
}
