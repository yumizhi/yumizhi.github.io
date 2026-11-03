export const tideColors={text:'#3e77a4',watermark:'#c87336',complement:'#38876b',ink:'#302c35',muted:'#827986'};
export const tideScenes=[
 {id:'injection',label:'Injection',labelZh:'嵌入',title:'Embed at an intermediate step.',titleZh:'从中间状态嵌入水印。',body:'Denoising begins with ordinary text guidance. At step τ, only the masked Fourier coefficients are replaced by the learned watermark W. The remaining coefficients are retained.',bodyZh:'先沿文本条件正常去噪。在中间步 τ，仅将 Fourier mask 选中的系数替换为学习得到的水印 W，其余系数保留。',equation:String.raw`\widetilde z_\tau=\mathcal F^{-1}\!\left((1-M)\odot\mathcal F(z_\tau)+M\odot W\right)`,reference:'§3.2 · Eq. (1)'},
 {id:'guidance',label:'Direction',labelZh:'方向分解',title:'Separate what overlaps with text.',titleZh:'分离与文本引导重叠的方向。',body:'Recent text residuals define a local subspace Bₜ. Project the watermark residual onto it, subtract that projection, and use the complementary component for subsequent guidance.',bodyZh:'近期文本残差构成局部子空间 Bₜ。将水印残差投影到该子空间，再减去投影，只使用互补分量继续引导。',equation:String.raw`\Delta_{t,\mathrm{null}}^{\mathrm{wm}}=\Delta_t^{\mathrm{wm}}-\Pi_{B_t}\!\left(\Delta_t^{\mathrm{wm}}\right)`,reference:'§3.3 · Eqs. (14)–(15)'},
 {id:'budget',label:'Budget',labelZh:'预算分配',title:'Share the guidance budget.',titleZh:'按当前状态分配引导预算。',body:'Overlap, curvature and relative residual strength regulate ηₜ. Watermark guidance receives a variable share; text guidance keeps the rest, including a reserved minimum.',bodyZh:'语义重叠、轨迹曲率与残差相对强度共同调节 ηₜ。水印获得动态份额，文本分支获得其余预算，并保留最低份额。',equation:String.raw`\eta_t=(1-c_t)e^{-\kappa_t}\min\!\left(1,\frac{1}{r_t+\varepsilon}\right)`,reference:'§3.3 · Eqs. (16)–(21)'},
 {id:'verification',label:'Verification',labelZh:'检测',title:'Recover the evidence.',titleZh:'通过部分反演恢复水印证据。',body:'Encode the query image, then partially invert it to τ with an empty prompt. Compare recovered Fourier coefficients with W inside M. Smaller masked distance means stronger agreement.',bodyZh:'将查询图像编码，使用空 prompt 部分反演至 τ。在 M 内比较恢复的 Fourier 系数与 W，距离越小，说明与水印模板越一致。',equation:String.raw`D_{\mathrm{wm}}=\frac{1}{|M|}\left\|M\odot\bigl(\mathcal F(\widehat z_\tau)-W\bigr)\right\|_1`,reference:'§3.4 · Eqs. (8), (22)'},
];
export const tidePresets=[{label:'Balanced',zh:'平衡',x:1.05,y:1.9,angle:20,turn:10,strength:1.6},{label:'High overlap',zh:'高重叠',x:2.1,y:.28,angle:0,turn:10,strength:1.6},{label:'Sharp turn',zh:'急转弯',x:1.05,y:1.9,angle:20,turn:110,strength:1.6},{label:'Strong residual',zh:'强残差',x:.3,y:2.5,angle:0,turn:10,strength:.65}];

export function tideProjection(x:number,y:number,angle:number){
 const a=angle*Math.PI/180,bx=Math.cos(a),by=Math.sin(a),dot=x*bx+y*by,px=dot*bx,py=dot*by,nx=x-px,ny=y-py;
 return {x,y,bx,by,px,py,nx,ny,raw:Math.hypot(x,y),projected:Math.hypot(px,py),complement:Math.hypot(nx,ny)};
}
export function tideBudget(x:number,y:number,angle:number,turn:number,strength:number,total=7.5,reserve=2){
 const p=tideProjection(x,y,angle),epsilon=1e-8,c=(p.projected/Math.SQRT2)/(p.raw/Math.SQRT2+epsilon),curvature=1-Math.cos(turn*Math.PI/180),r=(p.complement/Math.SQRT2)/(strength/Math.SQRT2+epsilon),eta=(1-c)*Math.exp(-curvature)*Math.min(1,1/(r+epsilon)),watermark=(total-reserve)*eta;
 return {c,curvature,r,eta,watermark,text:total-watermark,total,reserve};
}
export const demoWatermark:[[number,number],...[number,number][]]=[[.8,.1],[.45,.7],[-.2,.9],[-.75,.4],[-.8,-.2],[-.35,-.8],[.3,-.75],[.7,-.35]];
export const demoRecovered=demoWatermark.map(([r,i],n)=>[r+.08*Math.cos(n),i+.1*Math.sin(n+.3)] as [number,number]);
export const demoDifferent=demoWatermark.map(([r,i],n)=>[-.45*r+.25*Math.sin(n),-.6*i-.2] as [number,number]);
export const demoThreshold=.32;
export function maskedFourierDistance(candidate:readonly number[][],watermark:readonly number[][]=demoWatermark){return candidate.reduce((sum,[re,im],i)=>sum+Math.hypot(re-watermark[i][0],im-watermark[i][1]),0)/watermark.length;}
