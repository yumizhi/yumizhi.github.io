'use client';

import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { asset } from '@/lib/paths';
import { Localized } from '../language';

const methods = [{id:'tree',name:'Tree-Ring'}, {id:'robin',name:'ROBIN'}, {id:'tide',name:'TIDE'}];
const scenes = [
  {id:'car',en:'Sports car',zh:'跑车'}, {id:'interior',en:'Interior',zh:'室内'},
  {id:'guitar',en:'Guitarist',zh:'吉他手'}, {id:'street',en:'Street',zh:'街景'},
  {id:'robot',en:'Robot',zh:'机器人'},
];
function sample(method:string,scene:string){return asset('/images/tide-paper/'+method+'-'+scene+'.webp');}

export function TideComparison({original}:{original:string}){
  const [scene,setScene] = useState(scenes[0]);
  const [method,setMethod] = useState('tide');
  const reduced = useReducedMotion();
  return <LayoutGroup><figure className="tide-comparison">
    <Tabs.Root className="tide-method-tabs" value={method} onValueChange={setMethod}>
      <div className="tide-compare-tools">
        <span className="tide-figure-label"><Localized en="Image comparison" zh="图像对照"/></span>
        <Tabs.List aria-label="Watermark method" className="tide-variant-list">
          {methods.map(m=><Tabs.Trigger value={m.id} key={m.id}>
            {method===m.id&&<motion.i layoutId="watermark-method" transition={{duration:reduced?0:.24}}/>}
            <span>{m.name}</span>
          </Tabs.Trigger>)}
        </Tabs.List>
      </div>
      <div className="tide-pair">
        <div className="tide-sample">
          <img width={226} height={226} src={sample('clean',scene.id)} alt={'Unwatermarked · '+scene.en}/>
          <b><Localized en="Unwatermarked" zh="无水印"/></b>
        </div>
        <div className="tide-sample tide-versions">
          {methods.map(m=><Tabs.Content key={m.id} value={m.id} forceMount
            aria-hidden={m.id!==method} tabIndex={m.id===method?0:-1} className="tide-version">
            <motion.div initial={false} animate={{opacity:m.id===method?1:0}} transition={{duration:reduced?0:.25}}>
              <img width={226} height={226} src={sample(m.id,scene.id)} alt={m.name+' · '+scene.en}/>
              <b>{m.name}</b>
            </motion.div>
          </Tabs.Content>)}
        </div>
      </div>
    </Tabs.Root>
    <div className="tide-scene-picker" role="group" aria-label="Image prompt">
      {scenes.map(s=><button key={s.id} type="button" aria-pressed={s.id===scene.id} onClick={()=>setScene(s)}>
        <img src={sample('clean',s.id)} alt="" width={32} height={32}/>
        <span><Localized en={s.en} zh={s.zh}/></span>
      </button>)}
    </div>
    <figcaption className="tide-figure-note">
      <span lang="en"><strong>Figure 2.</strong> Qualitative comparison of different methods.</span>
      <a href={asset(original)} target="_blank" rel="noreferrer"><Localized en="Full figure" zh="完整原图"/><ArrowUpRight size={14}/></a>
    </figcaption>
  </figure></LayoutGroup>;
}
