'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {gsap} from 'gsap';
import {useGSAP} from '@gsap/react';
import {MotionPathPlugin} from 'gsap/MotionPathPlugin';
import {DrawSVGPlugin} from 'gsap/DrawSVGPlugin';
import {asset} from '@/lib/paths';
import type {PipelineMode} from '@/lib/pipeline-story';
gsap.registerPlugin(useGSAP,MotionPathPlugin,DrawSVGPlugin);

export function PipelineFlow({mode,time,zh,onStep}:{mode:PipelineMode;time:number;zh:boolean;onStep:(time:number)=>void}){
 const root=useRef<HTMLDivElement>(null),movie=useRef<gsap.core.Timeline|null>(null),uid=useId().replaceAll(':',''),[mobile,setMobile]=useState(false);
 const tide=mode==='tide',stage=time<8?0:time<22?1:time<36?2:3,sub=time<28?0:time<33?1:2;
 useEffect(()=>{const mq=matchMedia('(max-width:640px)'),resize=()=>setMobile(mq.matches);resize();mq.addEventListener('change',resize);return()=>mq.removeEventListener('change',resize);},[]);
 useEffect(()=>{for(let i=0;i<=50;i++){const image=new Image();image.src=asset(`/images/pipeline/${mode}-${String(i).padStart(2,'0')}.webp`);}},[mode]);
 const input=mobile?[77,98]:[88,222],network=mobile?[315,98]:[338,222],heads=mobile?[[85,270],[240,270],[395,270]]:[[582,116],[582,222],[582,328]],guide=mobile?[240,429]:[815,222],output=mobile?[240,588]:[1064,222];
 const [ix,iy]=input,[nx,ny]=network,[gx,gy]=guide,[ox,oy]=output;
 const paths=[
  `M ${ix+49} ${iy} H ${nx-108}`,
  ...heads.map(([x,y])=>mobile?`M ${nx+107} ${ny} H 439 Q 456 ${ny} 456 ${ny+17} V 192 Q 456 209 439 209 H ${x+16} Q ${x} 209 ${x} 225 V ${y-27}`:y===ny?`M ${nx+107} ${ny} H ${x-31}`:`M ${nx+107} ${ny} H 474 Q 488 ${ny} 488 ${ny+(y<ny?-14:14)} V ${y+(y<ny?14:-14)} Q 488 ${y} 502 ${y} H ${x-31}`),
  ...heads.map(([x,y])=>mobile?x===gx?`M ${x} ${y+65} V ${gy-62}`:`M ${x} ${y+65} V 347 Q ${x} 359 ${x+(x<gx?12:-12)} 359 H ${gx+(x<gx?-38:38)} V ${gy-62}`:y===gy?`M ${x+72} ${y} H ${gx-103}`:`M ${x+72} ${y} H 684 Q 697 ${y} 697 ${y+(y<gy?13:-13)} V ${gy+(y<gy?-13:13)} Q 697 ${gy} 710 ${gy} H ${gx-103}`),
  mobile?`M ${gx} ${gy+64} V ${oy-49}`:`M ${gx+103} ${gy} H ${ox-53}`,
  mobile?`M ${ox-49} ${oy} H 42 Q 23 ${oy} 23 ${oy-19} V ${iy+19} Q 23 ${iy} 42 ${iy} H ${ix-49}`:`M ${ox} ${oy+54} V 403 Q ${ox} 425 ${ox-22} 425 H ${ix+22} Q ${ix} 425 ${ix} 403 V ${iy+54}`,
 ];
 const generation=Math.max(0,Math.min(1,(time-36)/12)),frame=stage===3?Math.min(50,(tide?15:0)+Math.floor(generation*(tide?35:50))):mode==='tide'?15:0;
 const frameURL=(n:number)=>asset(`/images/pipeline/${mode}-${String(n).padStart(2,'0')}.webp`);
 useGSAP(()=>{
  const q=gsap.utils.selector(root),tl=gsap.timeline({paused:true});movie.current=tl;
  gsap.set(q('.flow-trace'),{drawSVG:0});gsap.set(q('.flow-packet'),{opacity:0});
  tl.to({}, {duration:48},0);
  const arrivals=[8.4,10.5,14.5,18.5,23,24,25,36.4,38.4];
  paths.forEach((_,i)=>{
   if(!tide&&(i===3||i===6))return;
   const path=root.current!.querySelector<SVGPathElement>(`[data-path="${i}"] .flow-base`)!,trace=q(`[data-path="${i}"] .flow-trace`),packet=q(`[data-packet="${i}"]`);
   tl.to(trace,{drawSVG:'100%',duration:i===8?2:1.25,ease:'power2.inOut'},arrivals[i]);
   tl.set(packet,{opacity:1},arrivals[i]).to(packet,{motionPath:{path,align:path,alignOrigin:[.5,.5]},duration:i===8?2:1.25,ease:'power2.inOut'},arrivals[i]).set(packet,{opacity:0},arrivals[i]+(i===8?2:1.25));
  });
  [9,13,17].slice(0,tide?3:2).forEach(at=>{tl.fromTo(q('.network-sweep'),{x:0,opacity:0},{x:270,opacity:.8,duration:1.4,ease:'power2.inOut'},at).to(q('.network-sweep'),{opacity:0,duration:.25},at+1.2);});
  tl.fromTo(q('.frequency-key'),{y:48,opacity:0},{y:0,opacity:1,duration:1.6,ease:'power3.inOut'},2.4);
  tl.fromTo(q('.frequency-written'),{opacity:0},{opacity:1,duration:1.2},4.2);
  tl.fromTo(q('.detail-residual'),{opacity:.28,y:10},{opacity:1,y:0,stagger:.55,duration:1},23);
  tl.fromTo(q('.projection-removed img'),{opacity:1},{opacity:.12,duration:2},29);
  tl.fromTo(q('.complement-kept img'),{opacity:.28},{opacity:1,duration:2},30);
  tl.fromTo(q('.budget-wm'),{scaleX:.62},{scaleX:.25,transformOrigin:'right center',duration:2.2,ease:'power2.inOut'},33.5);
  tl.fromTo(q('.budget-text'),{scaleX:.38},{scaleX:.75,transformOrigin:'left center',duration:2.2,ease:'power2.inOut'},33.5);
  for(const at of [40.5,43.5,46.2]){tl.fromTo(q('[data-path="8"] .flow-trace'),{drawSVG:'0% 12%'},{drawSVG:'88% 100%',duration:1.5,ease:'none'},at);tl.to(q('.unet-material'),{opacity:.65,duration:.3,yoyo:true,repeat:1},at+.25);}
  tl.time(time);
  return()=>{tl.kill();};
 },{scope:root,dependencies:[mode,mobile],revertOnUpdate:true});
 useEffect(()=>{movie.current?.time(time);},[time]);
 useGSAP(()=>{
  const map=root.current!.querySelector('.pipeline-map'),detail=root.current!.querySelector('.pipeline-detail');
  const camera=mobile?(stage===1?'0 0 480 380':'0 0 480 670'):(stage===1?'155 25 575 370':'0 0 1160 475');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.to(map,{attr:{viewBox:camera},height:mobile?(stage===1?330:stage===2?245:450):(stage===1?380:stage===2?210:365),duration:reduced?0:1.1,ease:'power3.inOut',overwrite:true});
  gsap.to(detail,{paddingTop:stage===2?20:0,duration:reduced?0:.8,ease:'power3.inOut'});
 },{scope:root,dependencies:[stage,mobile],revertOnUpdate:false});
 return <div ref={root} className="pipeline-flow" data-stage={stage} data-mode={mode} data-layout={mobile?'vertical':'horizontal'}>
  <svg className="pipeline-map" viewBox={mobile?'0 0 480 670':'0 0 1160 475'} role="img" aria-label={zh?'从 latent 经 U-Net、条件预测和引导计算，到下一步 latent 的流程':'Latent to U-Net, conditioned predictions, guidance, and next latent'}>
   <defs><linearGradient id={`${uid}-layer`} x2="1" y2="1"><stop stopColor="#344354"/><stop offset="1" stopColor="#161d26"/></linearGradient><clipPath id={`${uid}-tile`}><rect x="-47" y="-47" width="94" height="94" rx="14"/></clipPath><marker id={`${uid}-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1 7 4 1 7" fill="none" stroke="#a396af" strokeWidth="1.3"/></marker></defs>
   <g fill="none" strokeLinecap="round" strokeLinejoin="round">{paths.map((d,i)=><g key={i} data-path={i} opacity={!tide&&(i===3||i===6)?0:1}><path className="flow-base" d={d} stroke="#c3bacb" strokeWidth="1.5" markerEnd={`url(#${uid}-arrow)`}/><path className="flow-trace" d={d} stroke={i===3||i===6?'#805090':i===2||i===5?'#5c7e9c':'#9d8eae'} strokeWidth="2.5"/></g>)}</g>
   <g transform={`translate(${ix} ${iy})`} className="flow-input"><rect x="-52" y="-52" width="104" height="104" rx="18" fill="#e8e1ef"/><image href={frameURL(frame)} x="-47" y="-47" width="94" height="94" clipPath={`url(#${uid}-tile)`}/><text className="flow-math" textAnchor="middle" y="-72">{stage===3?'zₜ':tide?'zτ':'zT'}</text><text className="flow-label" textAnchor="middle" y="76">{zh?'当前 latent':'Current latent'}</text>{!mobile&&<text className="flow-note" textAnchor="middle" y="100">{tide?(zh?'普通去噪 → τ':'Denoise to τ'):(zh?'高斯噪声':'Gaussian noise')}</text>}</g>
   <g transform={`translate(${nx} ${ny})`} className="flow-unet">
    <image className="unet-material" href={asset('/images/pipeline/unet-material.png')} x={mobile?-112:-165} y={mobile?-53:-83} width={mobile?224:330} height={mobile?100:150}/>
    <g className="network-sweep" opacity="0"><rect x="-157" y="-76" width="30" height="140" rx="7" fill="#ffffff" opacity=".5"/></g>
    <text className="flow-model" y={mobile?85:105} textAnchor="middle">U-Net</text><text className="flow-note" y={mobile?106:131} textAnchor="middle">{zh?'同一模型，权重冻结':'One model · frozen weights'}</text>
    {!mobile&&<g><text className="flow-condition" y="-122" textAnchor="middle">{stage===1?(time<13?'∅':time<17.8?'“Giant robot…”':'cwm'):(zh?'条件 + 时间步 t':'condition + time t')}</text><path d="M0 -106 V-80" stroke="#a597b1" markerEnd={`url(#${uid}-arrow)`}/></g>}
   </g>
   {heads.map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`} className={`prediction-head prediction-${i}`} opacity={!tide&&i===2?0:1}>
    <rect x="-29" y="-29" width="58" height="58" rx="10" fill={i===2?'#dfcce9':i===1?'#d5e1ed':'#e3dfe9'} stroke={i===2?'#b692c7':i===1?'#91aabd':'#a99fb5'}/>
    <image href={asset(`/images/pipeline/pred-${i}.webp`)} x="-24" y="-24" width="48" height="48" opacity=".85"/>
    <text className={`flow-math ${i===2?'wm-ink':i===1?'text-ink':''}`} x={mobile?0:45} y={mobile?57:8} textAnchor={mobile?'middle':'start'}>{['εu','εt','εw'][i]}</text>
    <text className={`flow-note ${i===2?'wm-ink':i===1?'text-ink':''}`} x={mobile?0:-30} y={mobile?-44:-44} textAnchor={mobile?'middle':'start'}>{(zh?['空条件 ∅','文本条件','水印条件 cwm']:['Empty ∅','Text prompt','Learned cwm'])[i]}</text>
   </g>)}
   <g transform={`translate(${gx} ${gy})`} className="flow-guidance">
    <g className="guidance-sheets"><rect x="-88" y="-67" width="164" height="119" rx="11" fill="#d8cde6" transform="rotate(-7)"/><rect x="-83" y="-63" width="164" height="119" rx="11" fill="#e6dfef" transform="rotate(-3)"/><rect x="-78" y="-59" width="164" height="119" rx="11" fill="#faf8fc" stroke="#c8b9d8"/></g>
    <text className="guidance-symbol" textAnchor="middle" y="21">ε̂</text>
    <text className="flow-label" textAnchor="middle" y={mobile?87:103}>{tide?(zh?'TIDE 引导':'TIDE guidance'):(zh?'文本引导':'Text guidance')}</text>
    {!mobile&&<text className="flow-note" textAnchor="middle" y="130">{tide?(zh?'分离 · 调权 · 合成':'Separate · weight · combine'):'Classifier-free guidance'}</text>}
   </g>
   <g transform={`translate(${ox} ${oy})`} className="flow-output"><rect x="-52" y="-52" width="104" height="104" rx="18" fill="#e8e1ef"/><image href={frameURL(Math.min(50,frame+1))} x="-47" y="-47" width="94" height="94" clipPath={`url(#${uid}-tile)`}/><text className="flow-math" textAnchor="middle" x={mobile?65:0} y={mobile?-60:-72}>zₜ₋₁</text><text className="flow-label" textAnchor="middle" y="76">{zh?'采样器更新':'Sampler update'}</text>{!mobile&&<text className="flow-note" textAnchor="middle" y="100">ε̂ + zₜ → zₜ₋₁</text>}</g>
   <g className="flow-loop-caption"><rect x={mobile?24:414} y={mobile?424:408} width={mobile?39:332} height={mobile?74:32} rx="10" fill="#f6f3f8"/><text x={mobile?44:580} y={mobile?450:429} className="flow-note" textAnchor="middle">{mobile?'↻':zh?'重复：更新后的 latent 回到 U-Net':'Repeat with the updated latent'}</text>{mobile&&<text x="44" y="478" className="flow-note" textAnchor="middle">{zh?'迭代':'Loop'}</text>}</g>
   {paths.map((_,i)=><g key={i} className="flow-packet" data-packet={i} aria-hidden="true"><rect x="-7" y="-7" width="14" height="14" rx="4" fill={i===3||i===6?'#835193':'#6a85a5'} stroke="#fff" strokeWidth="1"/></g>)}
  </svg>
  <div className="pipeline-detail" data-detail={stage}>
   <div className="pipeline-detail-title"><span className="pipeline-detail-dot"/>{stage===0?(zh?'注入位置':'Where the watermark enters'):stage===1?(zh?'同一输入，改变条件':'Same input, different conditions'):stage===2?(zh?'展开引导模块':'Inside the guidance block'):(zh?'实际采样过程':'The sampling sequence')}</div>
   <div className="pipeline-detail-scenes">
    <div className="pipeline-detail-scene injection-detail" hidden={stage!==0}>
     {mode==='original'?<div className="plain-path"><img src={frameURL(0)} alt="Initial latent"/><span>→</span><strong>{zh?'直接进入 U-Net':'Straight into U-Net'}</strong><p>{zh?'此路径没有水印注入。':'No watermark injection on this path.'}</p></div>:<div className="injection-chain">
      <figure><img src={asset(`/images/pipeline/original-${tide?'15':'00'}.webp`)} alt="Latent before injection"/><figcaption>{tide?'zτ':'zT'}</figcaption></figure><span className="operation-arrow">FFT<svg viewBox="0 0 50 12"><path d="M0 6H47M41 1 47 6 41 11"/></svg></span>
      <figure className="frequency-tile"><img src={asset(`/images/pipeline/${tide?'tide-frequency-before':'original-frequency'}.webp`)} alt="Frequency coefficients"/><img className="frequency-written" src={asset(`/images/pipeline/${mode}-frequency.webp`)} alt=""/><span className="frequency-key">W ↘ M</span><figcaption>{zh?'只替换 M 内的系数':'Replace inside M'}</figcaption></figure><span className="operation-arrow">IFFT<svg viewBox="0 0 50 12"><path d="M0 6H47M41 1 47 6 41 11"/></svg></span>
      <figure><img src={frameURL(tide?15:0)} alt="Latent after frequency injection"/><figcaption>{zh?'回到采样流程':'Back to the sampler'}</figcaption></figure>
     </div>}
    </div>
    <div className="pipeline-detail-scene conditions-detail" hidden={stage!==1}>
     {(tide?[0,1,2]:[0,1]).map((i)=><div className={`condition-reading condition-${i}`} data-active={Math.min(tide?2:1,Math.floor((time-8)/4.6))===i} key={i}><span>{(zh?['无条件','文本条件','水印条件']:['Unconditional','Text-conditioned','Watermark-conditioned'])[i]}</span><p><b>{['∅','ctxt','cwm'][i]}</b><span>→</span><strong>ε{['u','t','w'][i]}</strong></p><small>{(zh?['提供共同基准','描述希望生成的内容','训练得到的连续向量']:['Provides the shared baseline','Describes the desired image','A learned continuous embedding'])[i]}</small></div>)}
    </div>
    <div className="pipeline-detail-scene guidance-detail" hidden={stage!==2}>
     <nav aria-label={zh?'引导计算细节':'Guidance operations'} className="guidance-substeps"><button aria-current={sub===0?'step':undefined} onClick={()=>onStep(23)}>{zh?'残差':'Residuals'}</button>{tide&&<><span>→</span><button aria-current={sub===1?'step':undefined} onClick={()=>onStep(28.2)}>{zh?'分离':'Separate'}</button></>}<span>→</span><button aria-current={sub===2?'step':undefined} onClick={()=>onStep(33.2)}>{zh?'组合':'Combine'}</button></nav>
     <div className="residual-equations" hidden={sub!==0}><div className="detail-residual text-ink"><span>εt</span><i>−</i><span>εu</span><i>=</i><strong>Δtxt</strong><small>{zh?'文本带来的变化':'Text residual'}</small></div>{tide&&<div className="detail-residual wm-ink"><span>εw</span><i>−</i><span>εu</span><i>=</i><strong>Δwm</strong><small>{zh?'水印带来的变化':'Watermark residual'}</small></div>}</div>
     <div className="projection-chain" hidden={sub!==1||!tide}><figure><img src={asset('/images/pipeline/residual-raw.webp')} alt="Watermark residual tensor illustration"/><figcaption>Δwm<small>{zh?'水印残差':'Watermark residual'}</small></figcaption></figure><span>−</span><figure className="projection-removed"><img src={asset('/images/pipeline/residual-projected.webp')} alt="Projection onto recent text directions"/><figcaption>P<sub>B</sub> Δwm<small>{zh?'文本方向上的投影':'Text-aligned component'}</small></figcaption></figure><span>=</span><figure className="complement-kept"><img src={asset('/images/pipeline/residual-null.webp')} alt="Retained watermark complement"/><figcaption>Δ⊥<small>{zh?'保留的互补分量':'Retained complement'}</small></figcaption></figure><p><span className="text-ink">B</span> ← {zh?'近期文本残差的方向':'Directions of recent text residuals'}</p></div>
     <div className="combine-detail" hidden={sub!==2&&(sub!==1||tide)}><div className="combined-equation"><span>εu</span><i>+</i><span className="text-ink">g<sub>txt</sub> Δtxt</span>{tide&&<><i>+</i><span className="wm-ink">g<sub>wm</sub> Δ⊥</span></>}<i>→</i><strong>ε̂</strong></div>{tide?<><div className="guidance-budget" aria-label={zh?'文本和水印权重共享引导预算':'Text and watermark share the guidance budget'}><span className="budget-text"/><span className="budget-wm"/></div><p><span className="text-ink">{zh?'文本':'Text'}</span><span>g<sub>txt</sub> + g<sub>wm</sub> = s</span><span className="wm-ink">{zh?'水印':'Watermark'}</span></p></>:<p>{zh?'仅使用文本引导':'Text guidance only'}</p>}</div>
    </div>
    <div className="pipeline-detail-scene sampling-detail" hidden={stage!==3}><div className="sampling-images"><figure><img src={frameURL(Math.max(0,frame-1))} alt="Current decoded intermediate latent"/><figcaption>{Math.max(0,frame-1)} / 50</figcaption></figure><span>→</span><figure><img src={frameURL(frame)} alt="Next decoded intermediate latent"/><figcaption>{frame} / 50</figcaption></figure><span>→</span><figure><img src={asset(`/images/pipeline/${mode}-final.webp`)} alt="Robot generated on the server"/><figcaption>{zh?'最终图像':'Final image'}</figcaption></figure></div><p>{zh?'服务器实际中间 latent，经 VAE 解码显示':'Actual server-sampled latents, decoded through the VAE'}</p></div>
   </div>
  </div>
 </div>;
}
