import type {Method} from './story';
export const generationDuration=38;
export const injectionStep=35;
export const decodeAt=30;
export const generationChapters=[{at:0,label:'Model',zh:'模型'},{at:5,label:'Inject',zh:'注入'},{at:10,label:'Predict',zh:'预测'},{at:15,label:'Guide',zh:'引导'},{at:24,label:'Sample',zh:'采样'},{at:33,label:'Verify',zh:'验证'}];
const ramp=(t:number,start:number,length:number)=>Math.max(0,Math.min(1,(t-start)/length));
export function generationState(time:number,mode:Method){
 let step=0;
 if(time>=1&&time<5)step=ramp(time,mode==='tree'?1.8:1,mode==='tree'?3.2:4)*injectionStep;
 if(time>=5&&time<24)step=injectionStep;
 if(time>=24)step=injectionStep+ramp(time,24,decodeAt-24)*(50-injectionStep);
 let stage='noise';
 if(time>=1)stage='denoise';
 if(mode==='tree'&&time<1.8)stage='inject';
 if(time>=5&&time<9.5)stage=mode==='tide'?'inject':'denoise';
 if(time>=9.5)stage='predict';
 if(time>=13)stage='residual';
 if(time>=15)stage=mode==='tide'?'separate':'residual';
 if(time>=20)stage='balance';
 if(time>=24)stage='repeat';
 if(time>=decodeAt)stage='decode';
 if(time>=33)stage=mode==='original'?'complete':'verify';
 if(time>=37)stage='complete';
 const injecting=stage==='inject',injectionProgress=mode==='tree'?ramp(time,0,1.8):ramp(time,5,4.5),injected=mode==='tree'?time>=1.8:mode==='tide'&&time>=9.5;
 return {step,stage,injecting,injectionProgress,injected,repeating:stage==='repeat',expanded:time>=9.5&&time<30,separation:ramp(time,15,3.4),turn:stage==='balance'?ramp(time,20,1.5)*(1-ramp(time,22,2)):0,cycle:step%1};
}
