'use client';
import {useEffect,useRef} from 'react';
import {asset} from '@/lib/paths';
import {sampleStory,type DiffusionMode} from '@/lib/diffusion-story';

type Props={mode:DiffusionMode;progress:number;verify?:boolean;inspect?:boolean;complement?:boolean;visualState?:ReturnType<typeof sampleStory>;weights?:{text:number;watermark:number};onReady?:()=>void};
export function DiffusionCanvas({mode,progress,verify=false,inspect=false,complement=true,visualState,weights,onReady}:Props){
 const canvas=useRef<HTMLCanvasElement>(null),cache=useRef(new Map<string,HTMLImageElement>()),draw=useRef(()=>{}),latest=useRef({mode,progress,verify,inspect,complement,visualState,weights});
 latest.current={mode,progress,verify,inspect,complement,visualState,weights};
 useEffect(()=>{
  let active=true;const el=canvas.current!,ctx=el.getContext('2d')!;
  function image(name:string){
   const found=cache.current.get(name);if(found)return found.complete&&found.naturalWidth?found:null;
   const img=new Image();cache.current.set(name,img);img.onload=()=>{if(active){draw.current();onReady?.();}};img.src=asset('/images/diffusion/'+name+'.webp');return null;
  }
  function layer(name:string,x:number,y:number,w:number,h:number,alpha=1,cover=false){
   const img=image(name);if(!img||alpha<=0)return;ctx.globalAlpha=alpha;
   if(cover){const ratio=w/h,iw=img.width,ih=img.height,sw=Math.min(iw,ih*ratio),sh=Math.min(ih,iw/ratio);ctx.drawImage(img,(iw-sw)/2,(ih-sh)/2,sw,sh,x,y,w,h);}else ctx.drawImage(img,x,y,w,h);
   ctx.globalAlpha=1;
  }
  draw.current=()=>{
   const {mode,progress,verify,inspect,complement,visualState,weights}=latest.current,s=visualState||sampleStory(mode,progress,verify),f=s.denoise*48,frame=Math.floor(f),mix=f-frame;
   const w=1080,h=el.height,frequency=s.spectrum,rectH=h-72,rectW=1008-(1008-rectH)*frequency,x=(w-rectW)/2,y=28,explaining=mode==='tide'&&!verify&&progress>=.48&&progress<.64;
   ctx.clearRect(0,0,w,h);ctx.fillStyle='#111113';ctx.fillRect(0,0,w,h);
   const halo=ctx.createRadialGradient(540,325,30,540,325,590);halo.addColorStop(0,frequency>0?'#292230':'#242224');halo.addColorStop(1,'#111113');ctx.fillStyle=halo;ctx.fillRect(0,0,w,h);
   ctx.save();ctx.beginPath();ctx.roundRect(x,y,rectW,rectH,18);ctx.clip();
   // Preserve the full robot. The side wash extends only its neutral background.
   ctx.save();ctx.filter='blur(35px)';layer(`${mode}-${String(frame).padStart(2,'0')}`,x-30,y-30,rectW+60,rectH+60,.2,true);ctx.restore();
   const photoSize=Math.min(rectW,rectH),photoX=540-photoSize/2;
   layer(`${mode}-${String(frame).padStart(2,'0')}`,photoX,y,photoSize,photoSize,1);
   if(mix>0)layer(`${mode}-${String(Math.min(frame+1,48)).padStart(2,'0')}`,photoX,y,photoSize,photoSize,mix);
   if(s.ifft>0)layer(`${mode}-ifft`,x,y,rectW,rectH,s.ifft*.85,true);
   // The image remains visible underneath the conditional fields.
   if(explaining){ctx.fillStyle='rgba(8,10,18,.96)';ctx.fillRect(x,y,rectW,rectH);}
   if(s.field>0&&!explaining){
    ctx.fillStyle=`rgba(7,10,19,${s.field*.28})`;ctx.fillRect(x,y,rectW,rectH);
    const k=Math.floor(s.fieldFrame),a=s.fieldFrame-k;
    const blue=s.field*.25*(.95-s.budget*.3*(weights?weights.watermark/7.5:0)),purple=mode==='tide'?s.field*.3:0,removed=complement?s.remove:0;
    ctx.globalCompositeOperation='screen';
    for(const [name,strength] of [['text',blue],['projected',purple*(1-removed)*.9],['null',purple*(.6+.4*removed)*(1-s.budget*.5*(weights?weights.text/7.5:0))]] as [string,number][]){
     layer(`field-${name}-${String(k).padStart(2,'0')}`,x,y,rectW,rectH,strength*(1-a));
     if(a>0)layer(`field-${name}-${String(Math.min(k+1,24)).padStart(2,'0')}`,x,y,rectW,rectH,strength*a);
    }
    ctx.globalCompositeOperation='source-over';
   }
   if(frequency>0){
    const kind=mode==='original'?'tide':mode,zoom=inspect?1.38:1,sw=rectH*zoom,sx=540-sw/2,sy=y+(rectH-sw)/2;
    layer(`${kind}-spectrum-before`,sx,sy,sw,sw,frequency);
    // Replacement propagates across the very same coefficient field; no extra discs.
    if(s.write>0){ctx.save();ctx.beginPath();ctx.rect(x,y,rectW*s.write,rectH);ctx.clip();layer(`${kind}-spectrum-${verify?'recovered':'after'}`,sx,sy,sw,sw,frequency);ctx.restore();}
   }
   ctx.restore();
   if(frequency>.8&&!verify&&h<800){
    const kind=mode==='tree'?'tree':'tide',travel=s.write*s.write*(3-2*s.write),size=164+(rectH-164)*travel,kx=854+(540-854)*travel,ky=200+(y+rectH/2-200)*travel;
    layer(`${kind}-key`,kx-size/2,ky-size/2,size,size,frequency*(1-travel*.8));
    const radius=(mode==='tree'?10:30)/64*rectH;
    ctx.strokeStyle=mode==='tree'?'#e2be77':'#c4a1e5';ctx.lineWidth=1.2;ctx.globalAlpha=(1-s.write)*frequency*.8;ctx.beginPath();ctx.arc(540,y+rectH/2,radius,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
   }
   // Quiet framing, never a second diagram around the image.
   ctx.strokeStyle='#ffffff12';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(x+.5,y+.5,rectW-1,rectH-1,18);ctx.stroke();
   for(let j=Math.max(0,frame-1);j<=Math.min(48,frame+3);j++)image(`${mode}-${String(j).padStart(2,'0')}`);
   if(frequency>.1){image(`${mode}-spectrum-before`);image(`${mode}-spectrum-after`);}
  };
  const observer=new ResizeObserver(()=>{el.height=window.matchMedia('(max-width:600px)').matches?1080:560;draw.current();});observer.observe(el);
  draw.current();return()=>{active=false;observer.disconnect();draw.current=()=>{};cache.current.clear();};
 },[]); // Canvas owns image decoding; the scalar playhead can be replaced by recorded model frames.
 useEffect(()=>{draw.current();},[mode,progress,verify,inspect,complement,visualState,weights]);
 return <canvas ref={canvas} width={1080} height={560} className="diffusion-canvas" role="img" aria-label={verify?'Illustration of inversion and Fourier watermark verification':`${mode==='original'?'Original generation':mode==='tree'?'Tree-Rings':'TIDE'}: illustrative diffusion generation, Fourier injection and guidance`}/>;
}
