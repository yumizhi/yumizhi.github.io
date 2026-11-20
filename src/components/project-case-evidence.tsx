import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from './ui/coss/accordion';
import { Localized } from './language';
import type { ProjectStory } from '@/lib/project-stories';

export function ProjectCaseEvidence({ checks }: { checks: ProjectStory['checks'] }) {
  return (
    <Accordion className="case-checks" defaultValue={[checks[0].title.en]}>
      {checks.map(check => (
        <AccordionItem key={check.title.en} value={check.title.en}>
          <AccordionTrigger><Localized {...check.title} /></AccordionTrigger>
          <AccordionPanel><p><Localized {...check.body} /></p></AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
