'use client';

// Adapted from the MIT-licensed CupertinoUI macOS Select registry component.
import { LensRefraction } from './glass-optics';
import { Select } from '@base-ui/react/select';
import { Check, ChevronDown, type LucideIcon } from 'lucide-react';

type Option = { value: string; label: string };

export function GlassChoice({ label, value, items, onChange, icon: Icon }: {
  label: string;
  value: string;
  items: Option[];
  onChange: (value: string) => void;
  icon?: LucideIcon;
}) {
  const current = items.find(item => item.value === value);
  return (
    <Select.Root modal={false} items={items} value={value} onValueChange={next => { if (next !== null) onChange(next); }}>
      <Select.Trigger className="reader-glass glass-trigger" aria-label={`${label}, ${current?.label ?? value}`}>
        <LensRefraction />
        {Icon && <Icon size={16} aria-hidden="true" />}
        <Select.Value />
        <Select.Icon><ChevronDown size={13} /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner className="glass-positioner" alignItemWithTrigger={false} side="top" sideOffset={6} align="start">
          <Select.Popup className="reader-glass glass-menu">
            <Select.List aria-label={label}>
              {items.map(item => (
                <Select.Item key={item.value} value={item.value} className="glass-option">
                  <Select.ItemText>{item.label}</Select.ItemText>
                  <Select.ItemIndicator><Check size={15} aria-hidden="true" /></Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
