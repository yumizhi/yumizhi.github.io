export type DiffusionMode='original'|'tree'|'tide';
export const methodNames={original:'Original Generation',tree:'Tree-Rings',tide:'TIDE'};
export const durations={original:16,tree:28,tide:46};
// [time, denoising, spectrum, coefficient replacement, residual fields, projection removal, adaptive budget, IFFT]
export const storyFrames:Record<DiffusionMode,number[][]>={
 original:[[0,0,0,0,0,0,0,0],[.10,0,0,0,0,0,0,0],[.22,.12,0,0,.6,0,0,0],[.36,.28,0,0,0,0,0,0],[.64,.66,0,0,0,0,0,0],[.94,1,0,0,0,0,0,0],[1,1,0,0,0,0,0,0]],
 tree:[[0,0,0,0,0,0,0,0],[.07,0,0,0,0,0,0,0],[.17,0,1,0,0,0,0,0],[.23,0,1,0,0,0,0,0],[.32,0,1,1,0,0,0,0],[.36,0,1,1,0,0,0,0],[.44,0,0,1,0,0,0,1],[.50,.05,0,1,0,0,0,0],[.60,.25,0,1,.55,0,0,0],[.71,.5,0,1,0,0,0,0],[.94,1,0,1,0,0,0,0],[1,1,0,1,0,0,0,0]],
 tide:[[0,0,0,0,0,0,0,0],[.04,0,0,0,0,0,0,0],[.18,.3,0,0,0,0,0,0],[.21,.3,0,0,0,0,0,0],[.28,.3,1,0,0,0,0,0],[.31,.3,1,0,0,0,0,0],[.38,.3,1,1,0,0,0,0],[.41,.3,1,1,0,0,0,0],[.46,.3,0,1,0,0,0,1],[.49,.31,0,1,1,0,0,0],[.54,.32,0,1,1,0,0,0],[.62,.34,0,1,1,1,0,0],[.67,.38,0,1,1,1,1,0],[.82,.76,0,1,.8,1,1,0],[.90,.92,0,1,0,1,1,0],[.96,1,0,1,0,1,1,0],[1,1,0,1,0,1,1,0]],
};
export function sampleStory(mode:DiffusionMode,p:number,verify=false){
 p=Math.max(0,Math.min(1,p));
 if(verify){const target=mode==='tide'?.3:0,reverse=Math.max(0,Math.min(1,(p-.12)/.48)),spectrum=Math.max(0,Math.min(1,(p-.63)/.14)),write=Math.max(0,Math.min(1,(p-.80)/.1));return {denoise:1-reverse*(1-target),spectrum,write,field:0,remove:0,budget:0,ifft:0,fieldFrame:0};}
 const frames=storyFrames[mode];let index=frames.findIndex(f=>f[0]>p);if(index<0)index=frames.length-1;if(index===0)index=1;
 const a=frames[index-1],b=frames[index],t=(p-a[0])/(b[0]-a[0]);const eased=t*t*(3-2*t),value=a.slice(1).map((v,i)=>v+(b[i+1]-v)*(i===0?t:eased));
 return {denoise:value[0],spectrum:value[1],write:value[2],field:value[3],remove:value[4],budget:value[5],ifft:value[6],fieldFrame:Math.max(0,Math.min(24,(p-(mode==='tide'?.46:.1))*46))};
}
export type Chapter={at:number;label:string;zh:string;title:string;titleZh:string;body:string;bodyZh:string;formula?:string};
export const chapters:Record<DiffusionMode,Chapter[]>={
 original:[
  {at:0,label:'Noise',zh:'初始噪声',title:'Every image begins as noise.',titleZh:'每幅图像，从噪声开始。',body:'A fixed Gaussian noise field is the starting point. The prompt supplies a direction, not a finished picture.',bodyZh:'固定的高斯噪声是共同起点。文本提供生成方向，而不是一张现成的图像。'},
  {at:.14,label:'Text guidance',zh:'文本引导',title:'The prompt gives noise a direction.',titleZh:'文本，让去噪有了方向。',body:'The same frozen U-Net predicts noise with and without the prompt. Classifier-free guidance strengthens their difference.',bodyZh:'同一个冻结 U-Net 分别进行无条件与文本条件预测。CFG 放大两者的差值，引导生成。',formula:'ε̂ = εu + s (εt − εu)'},
  {at:.36,label:'Denoise',zh:'逐步去噪',title:'Structure first. Detail follows.',titleZh:'结构先浮现，细节随后清晰。',body:'Repeated guided updates reveal the composition, then contours and texture. This is an illustrative view of the latent process.',bodyZh:'反复引导更新，构图逐步浮现，随后恢复轮廓与纹理。这是潜空间去噪过程的教学可视化。'},
  {at:.90,label:'Image',zh:'生成结果',title:'A latent becomes an image.',titleZh:'潜变量，解码为图像。',body:'The VAE decoder maps the final latent to pixels. This endpoint is the unwatermarked result published in TIDE Figure 2.',bodyZh:'VAE 解码器将最终潜变量映射为像素。这里的终点是 TIDE Figure 2 中的真实无水印结果。'},
 ],
 tree:[
  {at:0,label:'Noise',zh:'初始噪声',title:'Same starting point. A hidden key.',titleZh:'同一起点，准备写入来源标记。',body:'Tree-Rings identifies generated images by placing a structured key in the initial noise, before denoising starts.',bodyZh:'Tree-Rings 在去噪开始前，将结构化密钥嵌入初始噪声，以便识别生成图像的来源。'},
  {at:.08,label:'FFT',zh:'频域变换',title:'Look inside the noise.',titleZh:'进入噪声的频域。',body:'A Fourier transform reveals the coefficients of this same field. Brightness represents log magnitude; low frequencies are at the center.',bodyZh:'对同一噪声场作 Fourier 变换。亮度表示对数幅度，中心对应低频。',formula:'zT → F(zT)'},
  {at:.23,label:'Ring key',zh:'环形密钥',title:'Write the key into frequency coefficients.',titleZh:'把密钥写入选定频率。',body:'Concentric rings encode the Tree-Rings key. Only selected coefficients change; the rest of the spectrum stays in place.',bodyZh:'Tree-Rings 密钥具有同心环结构。仅替换被选中的系数，其他频谱系数保留。',formula:'F(zT) ⊙ (1 − M) + W ⊙ M'},
  {at:.36,label:'IFFT',zh:'返回空间域',title:'Still noise. Now carrying a key.',titleZh:'仍然是噪声，但已携带密钥。',body:'The inverse Fourier transform returns to the spatial field. The resulting initial latent begins ordinary text-guided sampling.',bodyZh:'逆 Fourier 变换返回空间域。修改后的初始潜变量进入常规文本引导采样。'},
  {at:.49,label:'Denoise',zh:'常规采样',title:'The ordinary sampler takes over.',titleZh:'接下来，使用常规采样。',body:'Prompt guidance proceeds as usual. The watermark propagates through the whole trajectory without a dedicated guidance controller.',bodyZh:'文本引导照常进行。水印经历完整去噪轨迹，其后续传播没有专门的引导控制器。',formula:'ε̂ = εu + s (εt − εu)'},
  {at:.90,label:'Compare',zh:'对照结果',title:'What if we could control propagation?',titleZh:'能否在生成中主动控制水印传播？',body:'Tree-Rings is a robust baseline. This published example shows content changing after initial-noise injection. TIDE addresses that trade-off during sampling.',bodyZh:'Tree-Rings 是有效且鲁棒的基线。这个论文示例展示了初始注入后的内容变化，TIDE 则在采样中调节这一权衡。'},
 ],
 tide:[
  {at:0,label:'Generate',zh:'开始生成',title:'Let the composition begin to emerge.',titleZh:'先让图像结构开始形成。',body:'Before the injection step τ, TIDE follows ordinary text-guided denoising from the shared Gaussian noise.',bodyZh:'在注入步 τ 之前，TIDE 从共同高斯噪声出发，沿常规文本引导轨迹去噪。'},
  {at:.18,label:'Intermediate',zh:'中间状态',title:'Inject midway through generation.',titleZh:'在生成的中间阶段注入。',body:'The image has begun to take shape. TIDE intervenes at an intermediate latent zτ, rather than at the initial noise.',bodyZh:'图像结构已开始形成。TIDE 在中间潜变量 zτ 介入，而非在初始噪声处写入。'},
  {at:.23,label:'Write W',zh:'写入 W',title:'A learned watermark, in the right place.',titleZh:'在选定频率中，写入学习到的水印。',body:'Replace coefficients inside the annular mask with W. Conjugate symmetry keeps the inverse transform real. TIDE jointly learns W and an auxiliary condition cwm.',bodyZh:'以 W 替换环形掩码内的系数，并通过共轭对称保证逆变换为实数。TIDE 联合优化 W 与辅助条件 cwm。',formula:'z̃τ = F⁻¹((1 − M) ⊙ F(zτ) + M ⊙ W)'},
  {at:.41,label:'Return',zh:'继续生成',title:'Return to the same developing image.',titleZh:'回到同一幅正在形成的图像。',body:'An inverse Fourier transform returns the modified latent. Subsequent updates now carry both text and watermark guidance.',bodyZh:'逆 Fourier 变换得到修改后的潜变量，后续更新同时考虑文本与水印引导。'},
  {at:.48,label:'Remove overlap',zh:'减去重叠',title:'Subtract the overlapping part. Keep the rest.',titleZh:'减去重叠的方向，留下互补的部分。',body:'One frozen U-Net supplies εu, εt and εw. Recent text residuals span Bₜ; remove the watermark component in Bₜ and retain its orthogonal complement.',bodyZh:'同一个冻结 U-Net 提供 εu、εt 与 εw。近期文本残差构成子空间 Bₜ，移除水印残差在 Bₜ 中的投影，保留正交互补分量。',formula:'Δwm,null = Δwm − ΠB(Δwm)'},
  {at:.64,label:'Adjust strength',zh:'调节强度',title:'Coordinate two kinds of guidance.',titleZh:'让两种引导协调工作。',body:'Overlap, trajectory curvature and relative residual strength determine the watermark share. Text retains the remaining budget and a reserved minimum.',bodyZh:'根据语义重叠、轨迹曲率与残差相对强度，动态分配水印预算。文本获得其余份额，并保留最低预算。',formula:'ε̂ = εu + gtxt Δtxt + gwm Δwm,null'},
  {at:.89,label:'Image',zh:'生成结果',title:'A watermarked image, ready to verify.',titleZh:'图像生成完成，可以检测水印。',body:'After the remaining denoising steps, the VAE decodes the image. Compare the published results, or follow the watermark verification process.',bodyZh:'完成后续去噪，由 VAE 解码图像。可以比较论文中的真实结果，或继续查看水印检测过程。'},
 ],
};
export const verificationChapters:Chapter[]=[
 {at:0,label:'Encode',zh:'编码',title:'Start with a query image.',titleZh:'从待检图像出发。',body:'The VAE encoder maps pixels back to a latent. No original text prompt is needed for verification.',bodyZh:'VAE 编码器将像素映射回潜变量。检测不需要知道原始文本 prompt。'},
 {at:.12,label:'Invert',zh:'反演',title:'Trace the trajectory backward.',titleZh:'沿轨迹反向追溯。',body:'Empty-prompt DDIM inversion returns to the injection point: the initial noise for Tree-Rings, the intermediate step τ for TIDE.',bodyZh:'使用空 prompt 进行 DDIM 反演：Tree-Rings 回到初始噪声，TIDE 仅回到中间注入步 τ。'},
 {at:.63,label:'Spectrum',zh:'频谱',title:'Look for evidence in the selected frequencies.',titleZh:'在选定频率中寻找水印证据。',body:'Transform the recovered latent and compare the masked coefficients with the stored template. The spectrum here is a numerical teaching example.',bodyZh:'变换恢复的潜变量，在掩码内与存储的模板比较。这里的频谱来自数值教学示例。'},
 {at:.84,label:'Distance',zh:'距离',title:'Measure agreement with the key.',titleZh:'计算与密钥的一致程度。',body:'This synthetic recovery matches its example key. The photograph has not been passed through a browser-based detector; real thresholds require unwatermarked calibration data.',bodyZh:'该合成恢复结果与示例密钥匹配。网页未对论文照片实际运行检测；真实阈值需使用无水印数据校准。',formula:'Dwm = meanM | F(ẑ) − W |'},
];
