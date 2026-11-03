'use client';
import {useId} from 'react';
import {MotionPathPlugin} from 'gsap/MotionPathPlugin';
import {guidanceAt,guidanceSteps} from './guidance-trace';

function curve(values:number[],x:number,y:number,width:number,height:number){
 const points=values.flatMap((v,i)=>[x+i*width/(values.length-1),y-v*height]);
 return MotionPathPlugin.rawPathToString([MotionPathPlugin.pointsToSegment(points,1)]);
}
export default function GuidancePanel({step,split,turn,stage,zh,tide}:{step:number;split:number;turn:number;stage:string;zh:boolean;tide:boolean}){
 const id=useId().replace(/:/g,''),frame=guidanceAt(step),amount=stage==='predict'?0:stage==='separate'||stage==='residual'||stage==='repeat'?split:1,adaptive=stage==='balance'||stage==='repeat',angle=turn*1.5,gain=adaptive?Math.exp(Math.cos(angle)-1):1,share=tide?frame.watermarkWeight*gain/7.5:0,progress=Math.max(0,Math.min(1,(step-35)/14));
 const wmScale=Math.max(...guidanceSteps.flatMap(item=>[...item.raw,...item.complement].map(Math.abs))),projectionScale=Math.max(...guidanceSteps.flatMap(item=>item.projected.map(Math.abs)));
 const history=[3,2,1].map(back=>guidanceAt(Math.max(35,step-back)).text),source=curve(frame.raw.map(v=>v/wmScale),0,110,126,38),kept=curve(frame.complement.map(v=>v/wmScale),196,110,126,38),removed=curve(frame.projected.map(v=>v/projectionScale),0,110,126,25),weights=guidanceSteps.map(item=>item.watermark_weight),low=Math.min(...weights),high=Math.max(...weights),trend=curve(weights.map(v=>(v-low)/(high-low||1)),0,30,320,24);
 // Rotate the current direction, keeping its norm. The turn control changes curvature, not signal amplitude.
 const next=guidanceAt(step+1).text,norm=frame.text.reduce((sum,v)=>sum+v*v,0),projection=next.reduce((sum,v,i)=>sum+v*frame.text[i],0)/norm,perpendicular=next.map((v,i)=>v-projection*frame.text[i]),scale=Math.sqrt(norm/(perpendicular.reduce((sum,v)=>sum+v*v,0)||1));
 const current=frame.text.map((v,i)=>v*Math.cos(angle)+perpendicular[i]*scale*Math.sin(angle)),focus=stage==='separate'||stage==='residual';
 return <div className="tide-guidance-panel" data-split={amount.toFixed(2)} data-share={share.toFixed(4)} data-guidance-step={Math.floor(step)}>
  <div className="guidance-panel-title"><strong>{tide?'TIDE':zh?'文本引导':'Text guidance'}</strong><span>{zh?'每一步':'EVERY STEP'}</span></div>
  <div className="guidance-history"><label>{zh?'近期文本方向':'Recent text directions'}</label><svg viewBox="0 0 320 48" aria-hidden="true">{history.map((values,i)=><path key={i} d={curve(values,0,27,320,25)} fill="none" stroke="#7f9bb4" strokeWidth="1.1" opacity={.17+i*.15}/>)}<path d={curve(current,0,27,320,25)} fill="none" stroke="#4e7b9b" strokeWidth="2"/></svg></div>
  {tide&&<div className="guidance-peel" data-removing={focus||stage==='repeat'}>
   <svg viewBox="0 0 322 151" role="img" aria-label={zh?'从水印引导中移除文本对齐分量，保留互补分量':'Remove the text-aligned component from watermark guidance; keep its complement'}>
    <defs><linearGradient id={`${id}-purple`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#9b72b7" stopOpacity=".65"/><stop offset="1" stopColor="#9b72b7" stopOpacity=".06"/></linearGradient><linearGradient id={`${id}-blue`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#6f98b5" stopOpacity=".65"/><stop offset="1" stopColor="#6f98b5" stopOpacity=".1"/></linearGradient></defs>
    <text x="0" y="15">{zh?'水印引导':'Watermark guidance'}</text><text x="196" y="15">{zh?'保留互补分量':'Keep complement'}</text>
    <path d={`${source} L126 133 L0 133Z`} fill={`url(#${id}-purple)`}/><path d={source} fill="none" stroke="#a689ba" strokeWidth="1.5"/>
    <path d="M145 110H175m-6-5 6 5-6 5" fill="none" stroke="#8d8296" strokeWidth="1.2"/>
    <g style={{transform:`translate(${amount*65}px,${-amount*65}px)`,opacity:1-amount*.55}}><path d={`${removed} L126 133 L0 133Z`} fill={`url(#${id}-blue)`}/><path d={removed} stroke="#5982a2" strokeWidth="1.5" fill="none"/></g>
    <g opacity={amount}><path d={`${kept} L322 133 L196 133Z`} fill={`url(#${id}-purple)`}/><path d={kept} stroke="#8d5da9" strokeWidth="2" fill="none"/></g>
    <text x="204" y="45" className="peel-removed-label" opacity={amount}>{zh?'文本对齐部分':'Text-aligned'}<tspan x="204" dy="13">{zh?'已移除':'removed'}</tspan></text><path d="m190 46 6 6m0-6-6 6" stroke="#62839e" strokeWidth="1.3" opacity={amount}/>
   </svg>
  </div>}
  <div className="guidance-allocation" data-active={adaptive}><label>{tide?(zh?'重新分配引导':'Reallocate guidance'):(zh?'文本引导':'Text guidance')}</label><div className="guidance-budget" role="img" aria-label={zh?'文本与水印的引导份额随轨迹调整':'Text and watermark guidance shares adapt to the trajectory'}><i style={{width:`${(1-share)*100}%`}}/><b style={{width:`${share*100}%`}}/></div><div className="guidance-budget-key"><span>{zh?'文本':'Text'}</span>{tide&&<span>{zh?'水印':'Watermark'}</span>}</div>{tide&&<><svg viewBox="0 0 320 36" className="guidance-trend" aria-hidden="true"><path d={trend} fill="none" stroke="#dfd5e5" strokeWidth="1.5"/><clipPath id={`${id}-history`}><rect width={320*progress} height="36"/></clipPath><path d={trend} fill="none" stroke="#9a78b1" strokeWidth="2" clipPath={`url(#${id}-history)`}/><path d={`M${320*progress} 0v36`} stroke="#9a78b1" strokeWidth="1"/></svg><div className="guidance-trend-key"><span>35</span><span>{zh?'水印引导的变化':'Watermark guidance over time'}</span><span>50</span></div></>}</div>
 </div>;
}
