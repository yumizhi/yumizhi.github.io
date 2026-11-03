export type PipelineMode='original'|'tree'|'tide';
export const pipelineDuration=48;
export const pipelineSteps=[
 {at:0,label:'Watermark injection',zh:'水印注入'},
 {at:8,label:'Conditioned predictions',zh:'条件预测'},
 {at:22,label:'Guidance',zh:'引导计算'},
 {at:36,label:'Sampling loop',zh:'采样迭代'},
];
export function pipelineCaption(mode:PipelineMode,time:number,zh:boolean){
 if(time<8){
  if(mode==='original')return zh?['从噪声出发','普通生成不写入水印。当前 latent 和文本条件进入 U-Net，开始一次去噪更新。']:['Start with noise','Without a watermark, the current latent and the text condition go straight into the denoising step.'];
  if(mode==='tree')return zh?['在初始噪声中写入水印','先做 FFT，在选定频率写入环形密钥，再通过 IFFT 返回潜空间。后续使用普通文本引导。']:['Write into the initial noise','FFT exposes the frequency coefficients. Replace the selected frequencies with a ring key, then return through IFFT. Ordinary text guidance follows.'];
  return zh?['生成途中，只替换选定的频率','先进行普通去噪，到 τ 时将 latent 变换到频域。在掩码 M 内写入学习到的 W，保留其余频率，再返回采样流程。']:['Write partway through generation','Denoise normally until τ. Transform the latent to the frequency domain, write the learned W inside mask M, and preserve the remaining coefficients.'];
 }
 if(time<22)return zh?[mode==='tide'?'同一个 U-Net，三种条件':'同一个 U-Net，两种条件',mode==='tide'?'相同 latent 分别搭配空条件、文本条件和学习到的水印条件 cwm，得到 εu、εt、εw。模型权重保持冻结。':'相同 latent 分别搭配空条件和文本条件，得到 εu 和 εt。它们的差给出文本引导方向。']:[mode==='tide'?'One U-Net. Three conditions.':'One U-Net. Two conditions.',mode==='tide'?'Evaluate the same latent with an empty condition, the text prompt, and the learned watermark condition cwm. This gives εu, εt, and εw without changing the model weights.':'Evaluate the same latent with an empty condition and the text prompt. The difference between their predictions supplies the text guidance.'];
 if(time<28)return zh?['先取出条件带来的变化',mode==='tide'?'各自减去无条件预测 εu，得到文本残差 Δtxt 和水印残差 Δwm。接下来处理的是这些残差，不是直接修改 RGB 图片。':'从文本预测中减去无条件预测，得到 Δtxt，再按文本引导强度组合。'] : ['Isolate what each condition adds',mode==='tide'?'Subtract εu to obtain the text residual Δtxt and watermark residual Δwm. The next operation acts on these tensors, not on RGB pixels.':'Subtract the unconditional prediction from the text prediction, then scale the text residual.'];
 if(time<33&&mode==='tide')return zh?['去掉与近期文本方向重合的分量','近期文本残差构成子空间 B。将 Δwm 投影到 B，再减去这一投影，留下互补分量 Δ⊥。']:['Remove the text-aligned component','Recent text residuals form a subspace B. Project Δwm onto B, then subtract that projection. The remaining Δ⊥ carries the watermark update.'];
 if(time<36)return zh?[mode==='tide'?'按当前轨迹重新分配权重':'组合文本引导',mode==='tide'?'根据方向重合程度、轨迹弯曲和残差相对强度，调低或调高水印权重。文本与水印共享总引导预算。':'将 εu 与加权的文本残差相加，形成采样器需要的噪声预测。']:[mode==='tide'?'Reallocate the guidance budget':'Combine the text guidance',mode==='tide'?'Adjust watermark strength using overlap, trajectory curvature, and relative residual strength. Text and watermark weights share one total guidance budget.':'Add the weighted text residual to εu to obtain the noise prediction used by the sampler.'];
 return zh?['更新 latent，回到下一步','合成的噪声预测和当前 latent 一起进入采样器，得到下一步 latent。重复这一过程，最后经 VAE 解码为图像。']:['Update the latent. Repeat.','The sampler combines the guided prediction with the current latent to produce the next latent. Repeat the loop, then decode the final latent through the VAE.'];
}
