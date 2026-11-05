'use client';

import * as Tabs from '@radix-ui/react-tabs';
import { ArrowUpRight } from 'lucide-react';
import { asset } from '@/lib/paths';
import { Localized } from '../language';

const variants = [
  {id:'clean', en:'Unwatermarked', zh:'无水印'},
  {id:'tree', en:'Tree-Ring', zh:'Tree-Ring'},
  {id:'robin', en:'ROBIN', zh:'ROBIN'},
  {id:'tide', en:'TIDE', zh:'TIDE'},
];
const scenes = [
  ['car', 'Crimson sports car'], ['interior', 'Victorian interior'],
  ['guitar', 'Guitarist'], ['street', 'City streetscape'], ['robot', 'Giant robot'],
];

export function TideComparison({original}:{original:string}){
  return <Tabs.Root className="tide-comparison" defaultValue="tide">
    <Tabs.List aria-label="Watermark method" className="tide-variant-list">
      {variants.map(v=><Tabs.Trigger key={v.id} value={v.id}><Localized en={v.en} zh={v.zh}/></Tabs.Trigger>)}
    </Tabs.List>
    <div className="tide-strip-window">
    {variants.map(v=><Tabs.Content key={v.id} value={v.id} className="tide-example-strip">
      {scenes.map(([file,subject])=><img key={file} width="226" height="226"
        src={asset('/images/tide-paper/'+v.id+'-'+file+'.webp')} alt={subject+' · '+v.en}/>)}
    </Tabs.Content>)}
    </div>
    <div className="tide-figure-note">
      <span lang="en">Figure 2: Qualitative comparison of different methods.</span>
      <a href={asset(original)} target="_blank" rel="noreferrer"><Localized en="Full figure" zh="完整原图"/><ArrowUpRight size={13}/></a>
    </div>
  </Tabs.Root>;
}
