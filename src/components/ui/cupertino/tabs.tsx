// Adapted from CupertinoUI Tabs (MIT). The horizontal control uses the site's palette.
'use client';

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import { cn } from '@/lib/utils';

export function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn('flex flex-col', className)} {...props} />;
}

export function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return <TabsPrimitive.List data-slot="tabs-list" className={cn('inline-flex w-fit items-center', className)} {...props} />;
}

export function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab data-slot="tabs-trigger"
      className={cn('relative inline-flex items-center justify-center whitespace-nowrap', className)}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return <TabsPrimitive.Panel data-slot="tabs-content" className={cn('min-w-0 flex-1', className)} {...props} />;
}
