'use client';

import type { ReactNode } from 'react';
import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { SegmentedControl, SegmentedControlItem } from '@/components/ui/coss/segmented-control';

export function FilterTabs({ value, onChange, options, label, className = '' }: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: ReactNode }[];
  label: string;
  className?: string;
}) {
  return (
    <SegmentedControl
      className={`site-segments ${className}`}
      render={
        <ToggleGroup
          value={[value]}
          onValueChange={([next]) => { if (next) onChange(next); }}
          aria-label={label}
        />
      }
    >
      {options.map(option => (
        <SegmentedControlItem
          key={option.value}
          render={<Toggle value={option.value} />}
        >
          {option.label}
        </SegmentedControlItem>
      ))}
    </SegmentedControl>
  );
}
