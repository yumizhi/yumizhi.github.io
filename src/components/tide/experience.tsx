'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {gsap} from 'gsap';
import {LayoutGroup,motion,AnimatePresence,useReducedMotion} from 'motion/react';
import * as Tabs from '@radix-ui/react-tabs';
import {Play,Pause,RotateCcw,Scan} from 'lucide-react';
import SamplingFlow,{SamplingOverview} from './sampling-flow';
import FourierWrite from './fourier-write';
import {generationChapters,generationDuration,generationState} from './generation-story';
import type {Method} from './story';
import {useLanguage} from '../language';
import '@/app/tide-experience.css';

export default function TideExperience({autoPlay=false}:{autoPlay?:boolean}){
 const root=useRef<HTMLElement>(null),clock=useRef({time:0}),movie=useRef<gsap.core.Tween|null>(null),gesture=useRef<gsap.core.Tween|null>(null),control=useRef({split:0,turn:0}),id=useId(),reduced=useReducedMotion(),{language}=useLanguage(),zh=language==='zh';
 const [mode,setMode]=useState<Method>('tide'),[time,setTime]=useState(0),[playing,setPlaying]=useState(false),[split,setSplit]=useState(-1),[turn,setTurn]=useState(-1),[overview,setOverview]=useState(false);
 const state=generationState(time,mode),duration=mode==='original'?34:generationDuration,effectiveSplit=split<0?state.separation:split,effectiveTurn=turn<0?state.turn:turn;
 function pause(){movie.current?.pause();setPlaying(false);}
 function play(){gesture.current?.kill();movie.current?.kill();setSplit(-1);setTurn(-1);if(clock.current.time>=duration)clock.current.time=0;setPlaying(true);movie.current=gsap.to(clock.current,{time:duration,duration:duration-clock.current.time,ease:'none',onUpdate:()=>setTime(clock.current.time),onComplete:()=>setPlaying(false)});}
 function seek(value:number){movie.current?.kill();gesture.current?.kill();setPlaying(false);setSplit(-1);setTurn(-1);clock.current.time=value;setTime(value);}
 function separate(){pause();control.current.split=effectiveSplit;gesture.current?.kill();gesture.current=gsap.to(control.current,{split:effectiveSplit>.5?0:1,duration:reduced?0:1,ease:'power2.inOut',onUpdate:()=>setSplit(control.current.split)});}
 function bend(){pause();control.current.turn=effectiveTurn;gesture.current?.kill();gesture.current=gsap.to(control.current,{turn:effectiveTurn>.5?0:1,duration:reduced?0:1,ease:'power2.inOut',onUpdate:()=>setTurn(control.current.turn)});}
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)pause();},{threshold:.05});observer.observe(root.current!);const hide=()=>{if(document.hidden)pause();};document.addEventListener('visibilitychange',hide);return()=>{observer.disconnect();document.removeEventListener('visibilitychange',hide);movie.current?.kill();gesture.current?.kill();};},[]);
 useEffect(()=>{if(autoPlay&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)play();return()=>{movie.current?.kill();};},[autoPlay]);
 const chapters=generationChapters.filter(c=>!(mode==='original'&&(c.at===5||c.at===33))),active=chapters.findLastIndex(c=>time>=c.at),view=state.injecting?'inject':time>=33&&mode!=='original'?'verify':'model';
 const headings:Record<string,[string,string]>={noise:['Conditioned denoising','条件去噪'],denoise:['Conditioned denoising','条件去噪'],inject:['Fourier watermark injection','傅里叶域水印注入'],predict:['Three noise predictions','三路噪声预测'],residual:['Subtract the unconditional prediction','减去无条件预测'],separate:['Remove the text-aligned component','移除文本对齐分量'],balance:['Allocate guidance along the trajectory','沿文本轨迹分配引导'],repeat:['Propagate through every remaining step','在后续每一步传播水印'],decode:['Decode the final latent','解码最终潜变量'],verify:['Recover and match the watermark','恢复并匹配水印'],complete:['Watermark verification','水印验证']};
 const heading=mode!=='tide'&&['separate','balance','repeat'].includes(state.stage)?(zh?'文本引导采样':'Text-guided sampling'):mode!=='tide'&&state.stage==='predict'?(zh?'两路噪声预测':'Two noise predictions'):mode==='original'&&state.stage==='complete'?(zh?'生成图像':'Generated image'):headings[state.stage][zh?1:0];
 return <section ref={root} className="tide-experience sampling-film" data-testid="tide-experience" data-mode={mode} data-time={time.toFixed(2)} data-step={state.step.toFixed(2)} data-stage={state.stage} data-playing={playing} aria-labelledby={`${id}-title`}>
 <LayoutGroup id={id}><Tabs.Root className="sampling-shell" value={mode} onValueChange={v=>{pause();setMode(v as Method);}}>
  <header className="tide-film-top"><strong>TIDE</strong><Tabs.List className="tide-methods" aria-label={zh?'生成方法':'Generation method'}>{(['original','tree','tide'] as const).map(value=><Tabs.Trigger key={value} value={value}>{mode===value&&<motion.i layoutId="method" className="tide-method-pill" transition={{duration:reduced?0:.3,ease:[.22,1,.36,1]}}/>}<span>{value==='original'?(zh?'普通生成':'Original'):value==='tree'?'Tree-Ring':'TIDE'}</span></Tabs.Trigger>)}</Tabs.List></header>
  <Tabs.Content className="sampling-content" value={mode} forceMount tabIndex={-1}>
   <div className="sampling-overview" data-open={overview}><SamplingOverview time={time} mode={mode} zh={zh}/></div>
   <div className="sampling-heading"><h2 id={`${id}-title`}>{heading}</h2><span className="sampling-step-count">{String(Math.floor(state.step)).padStart(2,'0')}<small> / 50</small></span><button className="sampling-overview-toggle" onClick={()=>setOverview(!overview)} aria-pressed={overview} aria-label={zh?'完整生成回路':'Full generation loop'}><Scan size={17}/></button></div>
   <div className="sampling-stage" data-view={view}>
    <motion.div className="sampling-detail-layer" animate={{opacity:view==='inject'?0:1}} transition={{duration:reduced?0:.35}}><SamplingFlow time={time} mode={mode} split={effectiveSplit} turn={effectiveTurn} zh={zh}/></motion.div>
    <AnimatePresence>{view==='inject'&&<motion.div className="sampling-injection-layer" initial={{opacity:0,y:reduced?0:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduced?0:-8}} transition={{duration:.35,ease:'easeOut'}}><FourierWrite progress={state.injectionProgress} tree={mode==='tree'} zh={zh}/></motion.div>}</AnimatePresence>
   </div>
   <div className="tide-film-interaction">{mode==='tide'&&['separate','balance','repeat'].includes(state.stage)&&<><button onClick={separate} aria-pressed={effectiveSplit>.5}>{effectiveSplit>.5?(zh?'还原重合分量':'Restore overlap'):(zh?'移除重合分量':'Remove overlap')}<RotateCcw size={12}/></button><button onClick={bend} aria-pressed={effectiveTurn>.5}>{effectiveTurn>.5?(zh?'恢复文本轨迹':'Restore trajectory'):(zh?'改变文本轨迹':'Bend the trajectory')}<RotateCcw size={12}/></button></>}</div>
  </Tabs.Content>
  <nav className="tide-chapter-nav" aria-label={zh?'生成过程':'Generation chapters'}>{chapters.map((item,index)=><button key={item.label} onClick={()=>seek(item.at)} aria-current={active===index?'step':undefined}>{active===index&&<motion.i layoutId="chapter" transition={{duration:reduced?0:.3,ease:[.22,1,.36,1]}}/>}<span>{zh?item.zh:item.label}</span></button>)}</nav>
  <div className="tide-transport"><button className="tide-play" onClick={()=>playing?pause():play()} aria-label={zh?(playing?'暂停动画':'播放动画'):(playing?'Pause animation':'Play animation')}>{playing?<Pause size={17}/>:<Play size={17}/>}</button><div className="tide-scrubber"><input aria-label={zh?'动画进度':'Story progress'} type="range" min="0" max={duration} step=".1" value={Math.min(time,duration)} onChange={e=>seek(+e.target.value)}/><span className="tide-scrubber-fill" style={{width:`${Math.min(time/duration,1)*100}%`}}/></div><button className="tide-replay" aria-label={zh?'重播动画':'Replay animation'} onClick={()=>{seek(0);if(!reduced)play();}}><RotateCcw size={16}/></button></div>
 </Tabs.Root></LayoutGroup>
 </section>;
}
