'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Localized, useLanguage } from './language';
import { Tabs, TabsList, TabsPanel, TabsTab } from './ui/coss/tabs';
import type { ProjectStep } from '@/lib/project-stories';

export function ProjectCaseFlow({ steps, title }: { steps: ProjectStep[]; title: { en: string; zh: string } }) {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const [hasChangedStage, setHasChangedStage] = useState(false);

  return (
    <figure className="case-flow">
      <figcaption><Localized {...title} /></figcaption>
      <Tabs defaultValue={steps[0].id} onValueChange={() => setHasChangedStage(true)}>
        <TabsList aria-label={language === 'zh' ? title.zh : title.en} className="case-flow-steps">
          {steps.map((step, index) => (
            <TabsTab key={step.id} value={step.id} className="case-flow-step">
              <Localized {...step.label} />
              {index < steps.length - 1 && <ArrowRight size={14} aria-hidden="true" />}
            </TabsTab>
          ))}
        </TabsList>

        {steps.map(step => (
          <TabsPanel key={step.id} value={step.id} className="case-flow-panel" data-case-step={step.id}>
            <motion.div className="case-flow-reading"
              initial={reduced || !hasChangedStage ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : .18, ease: 'easeOut' }}>
              <div>
                <h3><Localized {...step.title} /></h3>
                <p><Localized {...step.body} /></p>
              </div>
              <dl className="case-flow-output">
                <dt><Localized en="What this step produces" zh="这一步留下什么" /></dt>
                <dd><Localized {...step.output} /></dd>
              </dl>
            </motion.div>
          </TabsPanel>
        ))}
      </Tabs>
    </figure>
  );
}
