'use client';
import {createContext,useContext,useEffect,useMemo,useRef,useState} from 'react';
import {ReactFlow,BaseEdge,Handle,Position,getSmoothStepPath,getViewportForBounds,MarkerType,type EdgeProps,type NodeProps,type ReactFlowInstance,type Node,type Edge} from '@xyflow/react';
import {gsap} from 'gsap';
import {DrawSVGPlugin} from 'gsap/DrawSVGPlugin';
import {motion,AnimatePresence,useReducedMotion} from 'motion/react';
import {asset} from '@/lib/paths';
import {generationState} from './generation-story';
import SamplingSequence from './sequence';
import GuidancePanel from './guidance-panel';
import type {Method} from './story';
import '@xyflow/react/dist/style.css';
gsap.registerPlugin(DrawSVGPlugin);

type View={time:number;mode:Method;zh:boolean;step:number;stage:string;injected:boolean;split:number;turn:number};
const Scene=createContext<View>(null!);
const media='/media/tide/sampling/';

function Ports(){return <><Handle type="target" position={Position.Left} id="in"/><Handle type="source" position={Position.Right} id="out"/><Handle type="target" position={Position.Top} id="condition"/><Handle type="target" position={Position.Bottom} id="time"/><Handle type="source" position={Position.Bottom} id="down"/><Handle type="source" position={Position.Top} id="up"/><Handle type="target" position={Position.Bottom} id="return"/></>;}
function StateNode({data}:NodeProps){
 const {mode,step,zh,time}=useContext(Scene),final=data.kind==='image',next=data.kind==='next',verify=data.kind==='query',current=final||verify?50:next&&step>0?Math.min(50,step+1):step;
 return <div className={`architecture-state ${final||verify?'is-image':'is-latent'}`} data-lit={!final||time>=30}><Ports/><div className="architecture-state-image"><img src={asset(media+(final||verify?`${mode}-50.webp`:'gaussian.webp'))} alt=""/>{!final&&!verify&&<SamplingSequence mode={mode} step={current}/>}</div><strong>{final?(zh?'图像':'Image'):verify?(zh?'待检图像':'Query image'):next?(zh?'下一步潜变量':'Next latent'):(zh?'当前潜变量':'Current latent')}</strong></div>;
}
function ModuleNode({data}:NodeProps){
 const {zh,time,stage,mode,injected}=useContext(Scene),kind=String(data.kind),names:Record<string,[string,string]>={encoder:['Text encoder','文本编码器'],sampler:['Scheduler','采样更新'],decoder:['VAE decoder','VAE 解码器'],encode:['VAE encoder','VAE 编码器'],time:['Timestep embedding','时间步编码'],inverse:['DDIM inversion','DDIM 反演'],match:['Masked comparison','掩膜内匹配']};
 if(kind==='prompt')return <div className="architecture-prompt"><Ports/><small>{zh?'文本提示':'TEXT PROMPT'}</small><p>“Giant robot in a futuristic city”</p></div>;
 if(kind==='text-embedding')return <div className="architecture-conditions"><Ports/><span className="text-condition">{zh?'文本嵌入':'Text embedding'}</span></div>;
 if(kind==='learned-condition')return <div className="architecture-conditions"><Ports/><span className="watermark-condition" data-lit={injected}>{zh?'学习的水印条件':'Learned watermark condition'}</span></div>;
 if(kind==='conditions')return <div className="architecture-conditions"><Ports/><span>{zh?'空条件':'Empty'}</span><span className="text-condition">{zh?'文本嵌入':'Text embedding'}</span>{mode==='tide'&&<span className="watermark-condition" data-lit={injected}>{zh?'水印嵌入':'Watermark embedding'}</span>}</div>;
 if(kind==='watermark')return <div className="architecture-watermark" data-lit={stage==='inject'||injected}><Ports/><img src={asset(media+(mode==='tree'?'tree':'tide')+'-spectrum-watermark.png')} alt=""/><span>{mode==='tree'?(zh?'起始写入':'Write at start'):(zh?'第 35 步写入':'Write at step 35')}</span></div>;
 if(kind==='guide')return <div className="architecture-module architecture-guide" data-lit><Ports/><strong>{mode==='tide'&&injected?'TIDE':'CFG'}</strong><span>{zh?'组合噪声预测':'Combine predictions'}</span></div>;
 const active=kind==='decoder'?time>=30:kind==='inverse'||kind==='encode'||kind==='match'?time>=33:true;
 return <div className={`architecture-module architecture-${kind}`} data-lit={active}><Ports/><strong>{names[kind][zh?1:0]}</strong>{kind==='encoder'&&<div className="token-strip">{Array.from({length:8},(_,i)=><i key={i}/>)}</div>}{kind==='sampler'&&<span>{zh?'更新潜变量':'Update latent'}</span>}{kind==='decoder'&&<span>{zh?'潜空间 → RGB':'Latent → RGB'}</span>}{kind==='encode'&&<span>RGB → latent</span>}{kind==='time'&&<span>t</span>}{kind==='inverse'&&<><span>{zh?'空提示词':'Empty prompt'}</span><b>{mode==='tree'?'50 → 0':'50 → 35'}</b></>}{kind==='match'&&<span>{zh?'水印距离':'Watermark distance'}</span>}</div>;
}
function ModelNode({data}:NodeProps){
 const {zh,mode,injected,stage}=useContext(Scene),compact=!!data.compact;
 return <div className={`architecture-model ${compact?'is-compact':''}`} data-lit={['noise','denoise','predict','repeat'].includes(stage)}><Ports/>{!compact&&<div className="architecture-model-header"><strong>{zh?'噪声预测网络':'Noise prediction network'}</strong><span>{zh?'冻结参数':'FROZEN'}</span></div>}<img src={asset('/media/tide/flow/unet.svg')} width="1082" height="383" alt={zh?'U-Net：下采样编码、瓶颈、上采样解码及跳跃连接':'U-Net downsampling, bottleneck, upsampling and skip connections'}/>{compact?<strong>U-Net</strong>:<><div className="unet-stages"><span>{zh?'下采样':'Downsample'}</span><span>{zh?'瓶颈':'Bottleneck'}</span><span>{zh?'上采样':'Upsample'}</span></div><div className="unet-attention"><i/><span>Cross-attention</span><i/></div><p>{mode==='tide'&&injected?(zh?'空 / 文本 / 水印条件':'Empty / text / watermark conditions'):(zh?'空 / 文本条件':'Empty / text conditions')}</p></>}</div>;
}
function PredictionNode({data}:NodeProps){
 const {zh,time,mode,injected,stage}=useContext(Scene),kind=String(data.kind),index=kind==='base'?0:kind==='text'?1:2,removed=Math.max(0,Math.min(1,(time-13)/2)),enabled=index<2||mode==='tide'&&injected;
 return <motion.div className={`architecture-prediction prediction-${kind}`} animate={{opacity:enabled?1:.18}} transition={{duration:.4}}><Ports/><div className="sampling-tensor"><i/><i/><img src={asset('/media/tide/flow/'+kind+'.webp')} alt=""/>{kind!=='base'&&<motion.img className="sampling-shared" src={asset('/media/tide/flow/base.webp')} alt="" animate={{opacity:(1-removed)*.6,x:-removed*20,y:-removed*20}} transition={{duration:.12}}/>}</div><strong>{time>=15&&index>0?(zh?['','文本残差','水印残差'][index]:['','Text residual','Watermark residual'][index]):(zh?['无条件预测','文本预测','水印预测'][index]:['Unconditional','Text prediction','Watermark prediction'][index])}</strong>{kind!=='base'&&<small data-visible={time>=13}>{zh?'减去无条件 → 残差':'Subtract unconditional'}</small>}</motion.div>;
}
function GuidanceNode(){
 const {mode,zh,split,turn,stage,step,injected}=useContext(Scene),tide=mode==='tide'&&injected;
 return <div className="sampling-guidance" data-active={['residual','separate','balance','repeat'].includes(stage)}><Ports/><div className="guidance-panel-stack"><AnimatePresence initial={false}><motion.div key={tide?'tide':'cfg'} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.3}}>{tide?<GuidancePanel step={step} split={split} turn={turn} stage={stage} zh={zh} tide/>:<div className="cfg-guidance"><strong>{zh?'文本引导':'Text guidance'}</strong><div className="cfg-residual"><img src={asset('/media/tide/flow/text.webp')} alt=""/><span>−</span><img src={asset('/media/tide/flow/base.webp')} alt=""/></div><p>{zh?'文本预测 − 无条件预测':'Text prediction − unconditional prediction'}</p><div className="cfg-weight"><i/></div><span>{zh?'加权后，与无条件预测合成':'Weight the residual and add it to the unconditional prediction'}</span></div>}</motion.div></AnimatePresence></div></div>;
}
function MatchNode(){
 const {zh,mode,time}=useContext(Scene),progress=Math.max(0,Math.min(1,(time-35)/2));
 return <div className="architecture-match"><Ports/><strong>{zh?'傅里叶域匹配':'Fourier-domain matching'}</strong><div className="match-spectra"><div><img src={asset(media+(mode==='tree'?'tree':'tide')+'-spectrum-unmasked.png')} alt=""/><motion.img className="match-mask" src={asset(media+(mode==='tree'?'tree':'tide')+'-spectrum-selected.png')} alt="" animate={{opacity:.3+.7*progress}}/><span>{zh?'提取掩膜内系数':'Extract masked coefficients'}</span></div><b>↔</b><div><img src={asset(media+(mode==='tree'?'tree':'tide')+'-spectrum-watermark.png')} alt=""/><span>{zh?'目标水印':'Target watermark'}</span></div></div><p>{zh?'比较掩膜内的系数':'Compare coefficients inside the mask'}</p></div>;
}
const nodeTypes={state:StateNode,module:ModuleNode,model:ModelNode,prediction:PredictionNode,guidance:GuidanceNode,match:MatchNode};
function FlowEdge(props:EdgeProps){
 const {time,stage,step,mode,injected}=useContext(Scene),highlight=useRef<SVGPathElement>(null),animation=useRef<gsap.core.Tween|null>(null),kind=String(props.data?.kind??'flow'),returning=kind==='return';
 const [path]=getSmoothStepPath({...props,borderRadius:18,offset:returning?35:15});
 useEffect(()=>{const ctx=gsap.context(()=>{animation.current=gsap.fromTo(highlight.current,{drawSVG:'0% 14%'},{drawSVG:'86% 100%',duration:1,ease:'none',paused:true});});return()=>ctx.revert();},[path]);
 let active=step<50,progress=(time*.7)%1;
 if(kind==='watermark')active=mode==='tide'&&injected&&step<50;
 if(kind==='write')active=stage==='inject';
 if(kind==='decode')active=time>=30&&time<33;
 if(kind==='verify')active=time>=33&&time<37;
 const color=kind==='watermark'||kind==='write'?'#9362a8':kind==='decode'?'#9b855c':'#638ca8';
 useEffect(()=>{animation.current?.progress(progress);gsap.set(highlight.current,{opacity:active?1:0});},[progress,active]);
 return <><BaseEdge path={path} markerEnd={props.markerEnd} style={{stroke:returning?'#c5b9ce':'#cbd2d8',strokeWidth:1.3,strokeDasharray:returning?'4 5':undefined}}/><path ref={highlight} d={path} stroke={color} strokeWidth="2.4" fill="none" strokeLinecap="round"/></>;
}
const edgeTypes={flow:FlowEdge};
const overviewNodes:Node[]=[
 {id:'prompt',type:'module',position:{x:0,y:0},style:{width:190},data:{kind:'prompt'}},
 {id:'encoder',type:'module',position:{x:225,y:5},style:{width:130},data:{kind:'encoder'}},
 {id:'conditions',type:'module',position:{x:405,y:4},style:{width:150},data:{kind:'text-embedding'}},
 {id:'learned',type:'module',position:{x:610,y:4},style:{width:200},data:{kind:'learned-condition'}},
 {id:'current',type:'state',position:{x:10,y:110},style:{width:82},data:{kind:'current'}},
 {id:'model',type:'model',position:{x:180,y:111},style:{width:160},data:{compact:true}},
 {id:'guidance',type:'module',position:{x:420,y:124},style:{width:125},data:{kind:'guide'}},
 {id:'sampler',type:'module',position:{x:600,y:124},style:{width:135},data:{kind:'sampler'}},
 {id:'next',type:'state',position:{x:795,y:110},style:{width:82},data:{kind:'next'}},
 {id:'decoder',type:'module',position:{x:930,y:124},style:{width:125},data:{kind:'decoder'}},
 {id:'image',type:'state',position:{x:1110,y:105},style:{width:92},data:{kind:'image'}},
 {id:'watermark',type:'module',position:{x:5,y:252},style:{width:180},data:{kind:'watermark'}},
];
const overviewEdges:Edge[]=[
 {id:'prompt-encoder',source:'prompt',target:'encoder'},
 {id:'encoder-conditions',source:'encoder',target:'conditions'},
 {id:'learned-model',source:'learned',target:'model',sourceHandle:'down',targetHandle:'condition',data:{kind:'watermark'}},
 {id:'conditions-model',source:'conditions',target:'model',sourceHandle:'down',targetHandle:'condition'},
 {id:'current-model',source:'current',target:'model'},
 {id:'model-guidance',source:'model',target:'guidance'},
 {id:'guidance-sampler',source:'guidance',target:'sampler'},
 {id:'sampler-next',source:'sampler',target:'next'},
 {id:'next-decoder',source:'next',target:'decoder',data:{kind:'decode'}},
 {id:'decoder-image',source:'decoder',target:'image',data:{kind:'decode'}},
 {id:'repeat',source:'next',target:'current',sourceHandle:'down',targetHandle:'return',data:{kind:'return'}},
 {id:'write',source:'watermark',target:'current',sourceHandle:'out',targetHandle:'time',data:{kind:'write'}},
].map((e:Edge)=>({...e,type:'flow',sourceHandle:e.sourceHandle??'out',targetHandle:e.targetHandle??'in',markerEnd:{type:MarkerType.ArrowClosed,width:13,height:13,color:'#b8c3cb'}}));
const detailNodes:Node[]=[
 {id:'current',type:'state',position:{x:0,y:140},style:{width:90},data:{kind:'current'}},
 {id:'conditions',type:'module',position:{x:145,y:0},style:{width:325},data:{kind:'conditions'}},
 {id:'model',type:'model',position:{x:145,y:85},style:{width:325},data:{}},
 {id:'time',type:'module',position:{x:210,y:350},style:{width:195},data:{kind:'time'}},
 {id:'base',type:'prediction',position:{x:545,y:0},style:{width:100},data:{kind:'base'}},
 {id:'text',type:'prediction',position:{x:545,y:130},style:{width:100},data:{kind:'text'}},
 {id:'watermark',type:'prediction',position:{x:545,y:260},style:{width:100},data:{kind:'watermark'}},
 {id:'guidance',type:'guidance',position:{x:740,y:0},style:{width:360},data:{}},
];
const detailEdges:Edge[]=[
 {id:'current-model',source:'current',target:'model'},
 {id:'conditions-model',source:'conditions',target:'model',sourceHandle:'down',targetHandle:'condition'},
 {id:'time-model',source:'time',target:'model',sourceHandle:'up',targetHandle:'time'},
 ...['base','text','watermark'].map(kind=>({id:`model-${kind}`,source:'model',target:kind,data:{kind:kind==='watermark'?'watermark':'flow'}})),
 ...['base','text','watermark'].map(kind=>({id:`${kind}-guidance`,source:kind,target:'guidance',data:{kind:kind==='watermark'?'watermark':'flow'}})),
].map((e:Edge)=>({...e,type:'flow',sourceHandle:e.sourceHandle??'out',targetHandle:e.targetHandle??'in',markerEnd:{type:MarkerType.ArrowClosed,width:12,height:12,color:'#b8c3cb'}}));
const verifyNodes:Node[]=[
 {id:'query',type:'state',position:{x:10,y:90},style:{width:115},data:{kind:'query'}},
 {id:'encode',type:'module',position:{x:190,y:108},style:{width:140},data:{kind:'encode'}},
 {id:'inverse',type:'module',position:{x:395,y:96},style:{width:160},data:{kind:'inverse'}},
 {id:'match',type:'match',position:{x:640,y:0},style:{width:360},data:{}},
];
const verifyEdges:Edge[]=[{id:'query-encode',source:'query',target:'encode'},{id:'encode-inverse',source:'encode',target:'inverse'},{id:'inverse-match',source:'inverse',target:'match'}].map((e:Edge)=>({...e,type:'flow',sourceHandle:'out',targetHandle:'in',data:{kind:'verify'},markerEnd:{type:MarkerType.ArrowClosed,width:13,height:13,color:'#b8c3cb'}}));

type Bounds={x:number;y:number;width:number;height:number};
function FlowCanvas({nodes,edges,bounds,mobileBounds,overview=false}:{nodes:Node[];edges:Edge[];bounds:Bounds;mobileBounds:Bounds;overview?:boolean}){
 const box=useRef<HTMLDivElement>(null),[instance,setInstance]=useState<ReactFlowInstance|null>(null),[size,setSize]=useState({width:1000,height:350}),reduced=useReducedMotion(),last=useRef(false);
 useEffect(()=>{const observer=new ResizeObserver(([entry])=>setSize({width:entry.contentRect.width,height:entry.contentRect.height}));observer.observe(box.current!);return()=>observer.disconnect();},[]);
 const area=size.width<650?mobileBounds:bounds;
 useEffect(()=>{if(!instance||!size.width||!size.height)return;const viewport=getViewportForBounds(area,size.width,size.height,.15,1.15,.035);void instance.setViewport(viewport,{duration:!last.current||reduced?0:750});last.current=true;},[instance,size.width,size.height,area.x,area.y,area.width,area.height,reduced]);
 return <div ref={box} className={`sampling-circuit ${overview?'is-overview':''}`}><ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} onInit={setInstance} nodesDraggable={false} nodesConnectable={false} elementsSelectable={false} nodesFocusable={false} edgesFocusable={false} panOnDrag={!overview} zoomOnPinch={!overview} zoomOnScroll={false} zoomOnDoubleClick={false} minZoom={.15} maxZoom={1.8} preventScrolling={false} colorMode="light" proOptions={{hideAttribution:true}}/></div>;
}
export function SamplingOverview({time,mode,zh}:{time:number;mode:Method;zh:boolean}){
 const state=generationState(time,mode),nodes=useMemo(()=>overviewNodes.map(n=>({...n,hidden:n.id==='watermark'&&mode==='original'||n.id==='learned'&&mode!=='tide'})),[mode]);
 return <Scene.Provider value={{time,mode,zh,...state,split:state.separation,turn:state.turn}}><FlowCanvas nodes={nodes} edges={overviewEdges.filter(e=>(e.id!=='write'||mode!=='original')&&(e.id!=='learned-model'||mode==='tide'))} bounds={{x:-15,y:-5,width:1250,height:295}} mobileBounds={{x:-15,y:-5,width:1250,height:295}} overview/></Scene.Provider>;
}
export default function SamplingFlow({time,mode,split,turn,zh}:{time:number;mode:Method;split:number;turn:number;zh:boolean}){
 const state=generationState(time,mode),verify=time>=33&&mode!=='original',detail=state.stage==='residual'||state.stage==='separate'||state.stage==='balance'||state.stage==='repeat';
 const nodes=useMemo(()=>detailNodes.map(n=>({...n,hidden:n.id==='watermark'&&mode!=='tide'})),[mode]);
 const mobile=detail?{x:700,y:-20,width:440,height:445}:{x:100,y:-20,width:590,height:445};
 return <Scene.Provider value={{time,mode,zh,...state,split,turn}}><div className="architecture-detail" data-focus={detail?'guidance':'model'} data-testid="sampling-circuit"><motion.div className="architecture-scene" animate={{opacity:verify?0:1}} transition={{duration:.45}} style={{pointerEvents:verify?'none':'auto'}}><FlowCanvas nodes={nodes} edges={detailEdges.filter(e=>mode==='tide'||!e.id.includes('watermark'))} bounds={{x:-20,y:-18,width:1140,height:445}} mobileBounds={mobile}/></motion.div><motion.div className="architecture-scene" initial={false} animate={{opacity:verify?1:0}} transition={{duration:.45}} style={{pointerEvents:verify?'auto':'none'}}><FlowCanvas nodes={verifyNodes} edges={verifyEdges} bounds={{x:-25,y:-20,width:1070,height:350}} mobileBounds={{x:370,y:-20,width:660,height:350}}/></motion.div></div></Scene.Provider>;
}
