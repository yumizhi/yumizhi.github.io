import trace from '../../../public/media/tide/sampling/guidance-trace.json';

export const guidanceSteps=trace.steps;
// Interpolate one capture, in a common coordinate system, without changing its decomposition.
export function guidanceAt(step:number){
 const index=Math.max(0,Math.min(guidanceSteps.length-1,step-35)),a=guidanceSteps[Math.floor(index)],b=guidanceSteps[Math.ceil(index)],t=index%1;
 return {text:a.text.map((v,i)=>v+(b.text[i]-v)*t),raw:a.raw.map((v,i)=>v+(b.raw[i]-v)*t),projected:a.projected.map((v,i)=>v+(b.projected[i]-v)*t),complement:a.complement.map((v,i)=>v+(b.complement[i]-v)*t),overlap:a.semantic_conflict+(b.semantic_conflict-a.semantic_conflict)*t,curvature:a.trajectory_curvature+(b.trajectory_curvature-a.trajectory_curvature)*t,ratio:a.residual_ratio+(b.residual_ratio-a.residual_ratio)*t,watermarkWeight:a.watermark_weight+(b.watermark_weight-a.watermark_weight)*t,textWeight:a.text_weight+(b.text_weight-a.text_weight)*t};
}
