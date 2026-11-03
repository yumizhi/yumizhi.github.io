'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {gsap} from 'gsap';
import {useGSAP} from '@gsap/react';
import {useReducedMotion} from 'motion/react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import {Play,Pause,RotateCcw,X,ArrowUpRight} from 'lucide-react';
import {PipelineFlow} from './pipeline-flow';
import {pipelineCaption,pipelineDuration,pipelineSteps,type PipelineMode} from '@/lib/pipeline-story';
import {asset} from '@/lib/paths';
import {Localized,useLanguage} from './language';
import '@/app/diffusion-player.css';
gsap.registerPlugin(useGSAP);

export function DiffusionPlayer(){
 const root=useRef<HTMLElement>(null),id=useId(),reduced=useReducedMotion(),{language}=useLanguage(),zh=language==='zh';
 const [mode,setMode]=useState<PipelineMode>('tide'),[time,setTime]=useState(0),[playing,setPlaying]=useState(false);
 const head=useRef({time:0}),movie=useRef<gsap.core.Tween|null>(null),step=time<8?0:time<22?1:time<36?2:3,caption=pipelineCaption(mode,time,zh);
 const {contextSafe}=useGSAP(()=>{
  const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting){movie.current?.pause();setPlaying(false);}},{threshold:.02});observer.observe(root.current!);
  const visibility=()=>{if(document.hidden){movie.current?.pause();setPlaying(false);}};document.addEventListener('visibilitychange',visibility);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',visibility);movie.current?.kill();};
 },{scope:root});
 useGSAP(()=>{
  const pill=root.current?.querySelector('.pipeline-tab-indicator'),active=root.current?.querySelector<HTMLElement>('[role=tab][data-state=active]');
  if(pill&&active)gsap.to(pill,{x:active.offsetLeft,width:active.offsetWidth,duration:reduced||!pill.getAttribute('style')?0:.42,ease:'power3.out'});
 },{dependencies:[mode,language,reduced],scope:root});
 useEffect(()=>{
  const observer=new ResizeObserver(()=>{const pill=root.current?.querySelector('.pipeline-tab-indicator'),active=root.current?.querySelector<HTMLElement>('[role=tab][data-state=active]');if(pill&&active){gsap.killTweensOf(pill);gsap.set(pill,{x:active.offsetLeft,width:active.offsetWidth});}});observer.observe(root.current!);return()=>observer.disconnect();
 },[]);
 const run=contextSafe(()=>{movie.current?.kill();setPlaying(true);movie.current=gsap.to(head.current,{time:pipelineDuration,duration:pipelineDuration-head.current.time,ease:'none',onUpdate:()=>setTime(head.current.time),onComplete:()=>setPlaying(false)});});
 const seek=(value:number)=>{movie.current?.kill();setPlaying(false);head.current.time=value;setTime(value);};
 const play=()=>{if(playing){movie.current?.pause();setPlaying(false);return;}if(head.current.time>=pipelineDuration){head.current.time=0;setTime(0);}run();};
 const change=(next:PipelineMode)=>{seek(0);setMode(next);if(!reduced)run();};
 return <section ref={root} className="diffusion-explainer" id="interactive-method" data-testid="diffusion-player" data-mode={mode} data-progress={(time/pipelineDuration).toFixed(3)} data-playing={playing} aria-labelledby={`${id}-title`}>
  <header className="diffusion-heading"><p className="eyebrow">TIDE · {zh?'交互方法图':'Interactive method'}</p><h2 id={`${id}-title`}>{zh?'走进 TIDE 的生成流程。':'Inside the TIDE pipeline.'}</h2><p>{zh?'从 latent 到条件预测，再看水印引导如何改变下一步。':'From the latent, through conditioned predictions, to the next denoising step.'}</p></header>
  <div className="diffusion-player">
   <div className="pipeline-toolbar"><Tabs.Root value={mode} onValueChange={v=>change(v as PipelineMode)}><Tabs.List className="pipeline-tabs" aria-label={zh?'生成方法':'Generation method'}><span className="pipeline-tab-indicator" aria-hidden="true"/>{(['original','tree','tide'] as const).map(key=><Tabs.Trigger key={key} value={key} aria-controls={`${id}-stage`}>{key==='original'?(zh?'普通生成':'Original'):key==='tree'?'Tree-Rings':'TIDE'}</Tabs.Trigger>)}</Tabs.List></Tabs.Root><span className="pipeline-mode-note">{mode==='tide'?(zh?'途中注入 · 轨迹引导':'Intermediate injection · adaptive guidance'):mode==='tree'?(zh?'初始注入 · 普通引导':'Initial injection · standard guidance'):(zh?'无水印 · 普通引导':'No watermark · standard guidance')}</span></div>
  <div className="pipeline-caption" aria-live={playing?'off':'polite'}><span>0{step+1}</span><div><h3>{caption[0]}</h3><p>{caption[1]}</p></div></div>
   <div id={`${id}-stage`}><PipelineFlow mode={mode} time={time} zh={zh} onStep={seek}/></div>
   <nav className="pipeline-chapters" aria-label={zh?'流程步骤':'Pipeline chapters'}>{pipelineSteps.map((c,i)=><button key={c.at} aria-current={i===step?'step':undefined} onClick={()=>seek(c.at+.1)}><span>0{i+1}</span>{i===0&&mode==='original'?(zh?'初始噪声':'Initial noise'):zh?c.zh:c.label}</button>)}</nav>
   <div className="pipeline-transport"><button className="pipeline-play" onClick={play} aria-label={zh?(playing?'暂停动画':'播放动画'):(playing?'Pause animation':'Play animation')}>{playing?<Pause size={15}/>:<Play size={15}/>}<span>{playing?(zh?'暂停':'Pause'):(zh?'播放':'Play')}</span></button><button className="pipeline-replay" onClick={()=>{seek(0);run();}} aria-label="Replay animation"><RotateCcw size={16}/></button><input type="range" min="0" max="48" step=".1" value={time} aria-label="Animation progress" aria-valuetext={`${Math.round(time)} seconds, ${pipelineSteps[step].label}`} onChange={e=>seek(Number(e.target.value))} style={{'--progress':`${time/pipelineDuration*100}%`} as React.CSSProperties}/><span className="pipeline-time">{Math.floor(time).toString().padStart(2,'0')} / 48</span></div>
  </div>
 </section>;
}

export function DiffusionCover(){
 const [open,setOpen]=useState(false);
 return <Dialog.Root open={open} onOpenChange={setOpen}><Dialog.Trigger asChild><button className="diffusion-cover" aria-label="Explore diffusion watermarking"><img src={asset('/images/diffusion/tide-final.webp')} width="384" height="384" alt="TIDE robot result from Figure 2" loading="lazy"/><span className="diffusion-cover-shade"/><span className="diffusion-cover-eyebrow">TIDE <span>NeurIPS 2026</span></span><span className="diffusion-cover-title"><Localized en="Inside the TIDE pipeline." zh="沿着流程，理解 TIDE。"/></span><span className="diffusion-cover-play"><Play size={14}/><Localized en="Explore the pipeline" zh="查看方法流程"/></span></button></Dialog.Trigger><Dialog.Portal><Dialog.Overlay className="diffusion-dialog-overlay"/><Dialog.Content className="diffusion-dialog" aria-describedby={undefined}><Dialog.Title className="sr-only">Diffusion watermarking interactive explainer</Dialog.Title><Dialog.Close className="diffusion-dialog-close" aria-label="Close animation"><X size={20}/></Dialog.Close>{open&&<DiffusionPlayer/>}</Dialog.Content></Dialog.Portal></Dialog.Root>;
}
