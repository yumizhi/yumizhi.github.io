'use client';
import {gsap} from 'gsap';
import {asset} from '@/lib/paths';

const ease=gsap.parseEase('power2.inOut');
const phase=(value:number,start:number,length:number)=>ease(Math.max(0,Math.min(1,(value-start)/length)));
export default function FourierWrite({progress,tree,zh}:{progress:number;tree:boolean;zh:boolean}){
 const remove=phase(progress,.18,.24),write=phase(progress,.52,.30),finish=phase(progress,.85,.15),x=65+180*finish,source=tree?'tree':'tide';
 const label=progress<.18?(zh?'变换到傅里叶域':'Transform to frequency space'):progress<.52?(zh?'移除掩膜内的原始系数':'Remove the masked coefficients'):progress<.85?(zh?'用水印系数填入空位':'Replace with watermark coefficients'):(zh?'逆变换，继续去噪':'Transform back. Resume denoising.');
 return <div className="sampling-injection fourier-write" data-testid="fourier-write" data-removed={remove.toFixed(2)} data-written={write.toFixed(2)}>
  <div className="fourier-steps"><span data-active={progress<.18}>FFT</span><i/><span data-active={progress>=.18&&progress<.85}>{zh?'替换系数':'Replace coefficients'}</span><i/><span data-active={progress>=.85}>IFFT</span></div>
  <svg viewBox="0 0 720 283" role="img" aria-label={zh?'选定频带中的旧系数被移走，学习得到的水印被填入，其他系数保持不变':'Old coefficients leave the selected frequency band. Learned watermark coefficients take their place. Other coefficients stay fixed.'}>
   <g transform={`translate(${x} 9)`}>
    <rect x="-9" y="-9" width="258" height="258" rx="14" fill="#fff" stroke="#e4dfe8"/>
    <image href={asset(`/media/tide/sampling/${source}-spectrum-unmasked.png`)} width="240" height="240"/>
    <g style={{transform:`translate(${-remove*8}px,${-remove*55}px) rotate(${-remove*5}deg)`,transformOrigin:'120px 120px',opacity:1-remove}}><image href={asset(`/media/tide/sampling/${source}-spectrum-selected.png`)} width="240" height="240"/></g>
    <text x="120" y="273" textAnchor="middle">{write>.98?(zh?'水印已写入':'Watermark written'):(zh?'当前频谱':'Current spectrum')}</text>
   </g>
   <g opacity={(1-write)*(1-finish)}><path d="M425 127h-65m7-7-7 7 7 7" fill="none" stroke="#b5a3c2" strokeWidth="1.5"/><text x="392" y="164" textAnchor="middle" className="fourier-arrow-label">{remove>.8?(zh?'填入':'replace'):(zh?'选定频带':'masked band')}</text></g>
   <image href={asset(`/media/tide/sampling/${source}-spectrum-watermark.png`)} x={x+(460-x)*(1-write)} y={9+26*(1-write)-Math.sin(write*Math.PI)*24} width={240-60*(1-write)} height={240-60*(1-write)}/>
   <text x="550" y="249" textAnchor="middle" opacity={1-write}>{tree?(zh?'环状密钥':'Ring key'):(zh?'学习得到的水印':'Learned watermark')}</text>
  </svg>
  <p>{label}</p>
 </div>;
}
