'use client';

import type { RefObject } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowUpRight, BookOpen, FileText, FolderOpen, X } from 'lucide-react';
import { Button } from '@/components/ui/coss/button';
import {
  Command, CommandCollection, CommandDialog, CommandDialogPopup, CommandDialogPrimitive,
  CommandEmpty, CommandFooter, CommandGroup, CommandGroupLabel, CommandInput, CommandItem,
  CommandList, CommandPanel,
} from '@/components/ui/coss/command';
import { Kbd } from '@/components/ui/coss/kbd';
import { Localized, useLanguage } from './language';
import type { SearchItem } from '@/lib/search';

const categories = [
  ['Research', '研究'], ['Projects', '项目'], ['Writing', '写作'],
  ['Resources', '资料'], ['About', '关于'],
] as const;

type SearchGroup = { value: string; label: string; items: SearchItem[] };

export default function SiteSearch({ index, open, onOpenChange, trigger }: {
  index: SearchItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: RefObject<HTMLButtonElement | null>;
}) {
  const { language } = useLanguage();
  const router = useRouter();
  const en = language === 'en';
  const groups: SearchGroup[] = categories.map(([kind, zh]) => ({
    value: kind,
    label: en ? kind : zh,
    items: index.filter(item => item.kind === kind),
  }));

  function select(item: SearchItem) {
    onOpenChange(false);
    if (item.external) window.open(item.href, '_blank', 'noopener,noreferrer');
    else router.push(item.href);
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandDialogPopup className="site-command" finalFocus={trigger}>
        <CommandDialogPrimitive.Title className="sr-only">
          {en ? 'Search this site' : '站内搜索'}
        </CommandDialogPrimitive.Title>
        <CommandDialogPrimitive.Description className="sr-only">
          {en ? 'Find research, projects, writing, and resources.' : '搜索研究、项目、文章与文档。'}
        </CommandDialogPrimitive.Description>
        <Command items={groups} itemToStringValue={(item: SearchItem) => item.title}
          filter={(item: SearchItem, query) => {
            const match = `${item.title} ${item.keywords}`.toLocaleLowerCase();
            return query.trim().toLocaleLowerCase().split(/\s+/).every(term => match.includes(term));
          }}>
          <CommandInput
            aria-label={en ? 'Search query' : '搜索关键词'}
            placeholder={en ? 'Search papers, projects, and writing…' : '搜索论文、项目与文章…'}
          />
          <CommandDialogPrimitive.Close render={
            <Button variant="ghost" size="icon-sm" className="site-command-close"
              aria-label={en ? 'Close search' : '关闭搜索'} />
          }>
            <X aria-hidden="true" />
          </CommandDialogPrimitive.Close>
          <CommandPanel className="site-command-results">
            <CommandEmpty>
              <Localized en="No results. Try TIDE, EPUB, or CV." zh="暂无结果。试试 TIDE、EPUB 或 CV。" />
            </CommandEmpty>
            <CommandList>
              {(group: SearchGroup) => (
                <CommandGroup key={group.value} items={group.items}>
                  <CommandGroupLabel>{group.label}</CommandGroupLabel>
                  <CommandCollection>
                    {(item: SearchItem) => {
                      const Icon = item.kind === 'Research' ? FileText : item.kind === 'Projects' ? FolderOpen : BookOpen;
                      const Arrow = item.external ? ArrowUpRight : ArrowRight;
                      return (
                        <CommandItem key={item.href} value={item} onClick={() => select(item)}>
                          <Icon aria-hidden="true" />
                          <span className="flex-1">{item.title}</span>
                          <Arrow aria-hidden="true" />
                        </CommandItem>
                      );
                    }}
                  </CommandCollection>
                </CommandGroup>
              )}
            </CommandList>
          </CommandPanel>
          <CommandFooter className="site-command-footer">
            <span><Kbd>↑</Kbd> <Kbd>↓</Kbd> <Localized en="Navigate" zh="选择" /></span>
            <span><Kbd>↵</Kbd> <Localized en="Open" zh="打开" /></span>
            <span><Kbd>Esc</Kbd> <Localized en="Close" zh="关闭" /></span>
          </CommandFooter>
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  );
}
