import { ArrowRight, ArrowUpRight, FileText } from 'lucide-react';
import { Button } from './ui/coss/button';
import { Localized } from './language';
import { TransitionLink } from './providers';
import { asset } from '@/lib/paths';
import type { Paper } from '@/lib/content';
import './publication-actions.css';

export function PublicationActions({ paper, fromHome = false }: { paper: Paper; fromHome?: boolean }) {
  const href = `/research/${paper.slug}/${fromHome ? '?from=home' : ''}`;
  return <div className="publication-actions">
    <Button variant="ghost" size="sm" className="publication-action"
      render={<TransitionLink href={href} />}>
      <Localized en="Read the study" zh="阅读研究" /><ArrowRight size={14} aria-hidden="true" />
    </Button>
    <Button variant="ghost" size="sm" className="publication-action publication-file"
      render={<a href={asset(paper.paper)} target="_blank" rel="noreferrer" />}>
      <FileText size={14} aria-hidden="true" />PDF
    </Button>
    {paper.code && <Button variant="ghost" size="sm" className="publication-action publication-file"
      render={<a href={paper.code} target="_blank" rel="noreferrer" />}>Code<ArrowUpRight size={14} aria-hidden="true" /></Button>}
  </div>;
}
