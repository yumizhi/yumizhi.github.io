import {papers, projects} from './content';

export type CVText = {en:string; zh:string};
export type CVBullet = {label:CVText; text:CVText};
export const cvResearch = [
 {
  paper:papers[0],
  keywords:{zh:'条件嵌入优化 · 子空间投影 · 自适应引导 · DDIM 反演',en:'Condition embedding optimization · Subspace projection · Adaptive guidance · DDIM inversion'},
  topic:{zh:'扩散模型的条件学习与轨迹控制',en:'Condition learning and trajectory control for diffusion models'},
  role:{zh:'第一作者',en:'First author'},
  intro:{zh:'针对水印信号在扩散去噪过程中逐步衰减，以及额外水印引导与原有文本条件发生干扰的问题，提出联合条件学习与轨迹感知控制的生成式水印方法，在保持文本语义与生成质量的同时提升水印鲁棒性。',en:'Proposed a generative watermarking method combining condition learning with trajectory-aware control to address signal decay during diffusion denoising and interference between watermark guidance and text conditioning, improving robustness while preserving text semantics and generation quality.'},
  bullets:[
   {label:{zh:'参数高效的水印条件学习',en:'Parameter-efficient watermark condition learning'},text:{zh:'在扩散中间时刻的潜变量频域注入水印，冻结预训练 VAE、U-Net 和文本编码器，联合学习水印频谱与辅助条件嵌入；结合短程水印重建、完整采样内容一致性、检测间隔和扰动能量约束，使水印信号在后续去噪过程中持续保留。',en:'Injected a Fourier-domain watermark into an intermediate diffusion latent. Froze the pretrained VAE, U-Net, and text encoder while jointly learning the watermark spectrum and an auxiliary condition embedding. Combined short-horizon reconstruction, full-sampling content consistency, detection-margin, and perturbation-energy constraints to retain the signal through subsequent denoising.'}},
   {label:{zh:'基于引导分解的轨迹控制',en:'Trajectory control through guidance decomposition'},text:{zh:'将无条件、文本和水印三路噪声预测分解为独立引导残差，利用历史文本引导方向估计局部语义更新子空间，通过投影抑制水印残差中的冲突分量；进一步根据轨迹曲率、方向重叠与残差强度动态调整水印引导预算，减少附加条件对原始生成方向的干扰。',en:'Decomposed unconditional, text, and watermark noise predictions into separate guidance residuals. Estimated a local semantic-update subspace from past text-guidance directions and projected out conflicting watermark components. Adapted the watermark guidance budget to trajectory curvature, directional overlap, and residual strength to reduce interference with the original generation direction.'}},
   {label:{zh:'反演检测与跨模型验证',en:'Inversion-based detection & cross-model evaluation'},text:{zh:'从最终图像执行部分 DDIM 反演，恢复水印注入时刻的潜变量并进行频域匹配检测。在 Stable Diffusion 1.5/2/2.1 上验证不同提示词分布与注入时刻的适用性；其中 SD 2.1 七类攻击下，平均 **TPR@1%FPR 达 98.6%**，较 ROBIN 的 82.5% 提升 **16.1 个百分点**，CLIP 为 0.403，与无水印生成相当。',en:'Applied partial DDIM inversion to the final image to recover the injection-time latent for frequency-domain matching. Evaluated different prompt distributions and injection times on Stable Diffusion 1.5/2/2.1. Across seven attacks on SD 2.1, mean **TPR@1%FPR reached 98.6%**, exceeding ROBIN’s 82.5% by **16.1 percentage points**; CLIP was 0.403, comparable to unwatermarked generation.'}},
  ],
 },
 {
  paper:papers[1],
  keywords:{zh:'随机二值优化 · ARM 梯度估计 · ℓ₀ 约束 · 二分剪枝',en:'Stochastic binary optimization · ARM gradient estimation · ℓ₀ constraints · Binary-search pruning'},
  topic:{zh:'离散像素选择与连续扰动的联合优化',en:'Joint optimization of discrete selection and continuous perturbation'},
  role:{zh:'第一作者 · Oral',en:'First author · Oral'},
  intro:{zh:'针对稀疏攻击中位置搜索不可直接求导、且与扰动幅度相互耦合的问题，将 ℓ₀ 优化转化为随机二值优化，直接学习像素选择概率。',en:'Reformulated the ℓ₀ objective as stochastic binary optimization to address non-differentiable pixel selection and its coupling with perturbation magnitude.'},
  bullets:[
   {label:{zh:'随机优化',en:'Stochastic optimization'},text:{zh:'将扰动分解为伯努利二值掩码与连续幅度，以 ARM 无偏梯度估计更新选择概率，与幅度梯度下降交替求解；使离散位置搜索与连续更新共同优化攻击目标。',en:'Factorized perturbations into Bernoulli masks and continuous magnitudes. Alternated unbiased ARM gradient estimates for selection probabilities with gradient descent on magnitudes, jointly optimizing location and strength.'}},
   {label:{zh:'稀疏约束与求解',en:'Sparsity-constrained solver'},text:{zh:'基于第 k 大选择概率构造动态阈值，再通过二分搜索剪除冗余修改；在扰动幅度约束下保持攻击成功，并在 CIFAR-10、ImageNet 上验证定向与非定向攻击。',en:'Used the k-th largest selection probability as a dynamic threshold and binary search to prune redundant changes. Evaluated targeted and untargeted attacks on CIFAR-10 and ImageNet under magnitude constraints.'}},
  ],
  result:{zh:'CIFAR-10 定向攻击、ε = 255 下，攻击成功率 100%；平均修改量 ℓ₀ 从 GreedyFool 的 48.99 降至 14.88，减少 69.6%。',en:'On targeted CIFAR-10 at ε = 255, achieved 100% success with mean ℓ₀ of 14.88 versus GreedyFool’s 48.99—a 69.6% reduction.'},
 },
];

export const cvIndustry = {
 title:{zh:'变电巡检视觉分析系统关键技术自主化研究与应用',en:'IS-6000/VAS · Visual analysis for substation inspection'},
 scope:{zh:'视觉算法开发 · 国产化视觉分析系统',en:'Visual algorithm development · Domestic hardware and software'},
 intro:{zh:'面向变电站复杂设备场景中弱隐缺陷特征不显著、环境变化引发误检以及不同站点模型泛化能力不足等问题，开展工业视觉算法研究与系统研发，支撑 IS-6000/VAS 在国产软硬件环境下的训练、评测与现场应用。',en:'Researched industrial vision algorithms and developed the IS-6000/VAS system to address inconspicuous defects in complex substation equipment, false alarms under environmental changes, and limited cross-site generalization, supporting training, evaluation, and field use on domestic hardware and software.'},
 bullets:[
  {label:{zh:'领域先验驱动的视觉特征增强',en:'Domain-prior-driven visual feature enhancement'},text:{zh:'针对弱隐缺陷样本稀缺、局部异常容易被设备纹理与背景信息淹没的问题，将站点场景、设备结构和缺陷语义组织为动态文本条件，经文本编码与领域适配形成先验表示，并与视觉特征融合；结合多帧上下文对候选缺陷证据进行补充与校正，提高复杂成像条件下的识别稳定性。',en:'Addressed scarce subtle-defect samples and local anomalies obscured by equipment textures and backgrounds. Organized site context, equipment structure, and defect semantics into dynamic text conditions; used text encoding and domain adaptation to form priors for visual-feature fusion. Added multi-frame context to supplement and correct candidate-defect evidence, improving recognition stability under complex imaging conditions.'}},
  {label:{zh:'多专家表征解耦与联合判识',en:'Multi-expert representation disentanglement & joint inference'},text:{zh:'围绕设备部件语义、缺陷判别和运行状态构建差异化特征表示，减少设备固有结构、背景纹理与光照变化对缺陷判断的干扰；结合跨层级特征校验、多任务协同推理和置信度融合，对候选缺陷进行联合判识，抑制复杂背景造成的误检漏检。',en:'Built distinct representations for component semantics, defect discrimination, and operating states to reduce interference from equipment structure, background textures, and lighting changes. Combined cross-level feature checks, multi-task inference, and confidence fusion to assess candidate defects and reduce false alarms and missed detections in complex backgrounds.'}},
  {label:{zh:'跨场景适配与工程应用',en:'Cross-site adaptation & engineering application'},text:{zh:'将场景特征与模型能力画像关联，衔接模型评测、灰度发布、现场推理及问题样本回流，支持不同站点的模型选择与持续迭代。系统已在新疆、山东、辽宁等地区试点应用；2026 年 6 月通过中国电机工程学会鉴定，项目技术成果获评**“国际领先水平”**。',en:'Linked scene features to model capability profiles, connecting evaluation, staged deployment, field inference, and difficult-sample feedback to support model selection and iteration across sites. Piloted in Xinjiang, Shandong, and Liaoning; appraised by the Chinese Society for Electrical Engineering in June 2026, with the project’s technical achievements rated **“internationally leading.”**'}},
 ],
};

export const cvProject = {
 project:projects[0],
 topic:{zh:'跨运行时 EPUB 内容重组与处理引擎',en:'A cross-runtime EPUB restructuring and processing engine'},
 intro:{zh:'面向多卷电子书重组与跨平台交付，设计兼容 EPUB 2/3 的文档处理引擎，支持目录重建、资源去重、结构可逆拆分及浏览器本地执行。',en:'Designed an EPUB 2/3 document processing engine for multi-volume restructuring and cross-platform delivery, supporting navigation reconstruction, resource deduplication, reversible structural splitting, and local browser execution.'},
 bullets:[
  {label:{zh:'内容重组与可逆恢复',en:'Content restructuring & reversible recovery'},text:{zh:'基于 OPF Manifest、Spine 和 NCX/Nav 建立统一内容模型，设计资源重映射与来源元数据记录机制，解决多卷合并中的章节顺序、目录层级及资源路径冲突，实现合并后按原卷结构恢复。',en:'Built a unified content model from OPF Manifest, Spine, and NCX/Nav. Designed resource remapping and provenance metadata to resolve chapter ordering, navigation hierarchy, and path conflicts across volumes, enabling restoration of their original structure.'}},
  {label:{zh:'资源处理与内存优化',en:'Resource processing & memory optimization'},text:{zh:'设计两阶段资源处理流程，基于媒体类型与 SHA-256 对图片、字体进行内容去重，对 XHTML/CSS/SVG 中的相对引用进行解析与重写；采用逐资源解压、按需写入与分阶段处理，减少中间解码对象的内存占用。',en:'Designed two-stage resource processing: deduplicated images and fonts by media type and SHA-256, then parsed and rewrote relative references in XHTML/CSS/SVG. Decompressed resources individually and used incremental writing and staged processing to reduce memory held by intermediate decoded objects.'}},
  {label:{zh:'跨端执行与一致性验证',en:'Cross-runtime execution & consistency verification'},text:{zh:'基于共享 TypeScript Core 支持浏览器和 Node.js，通过 Web Worker、任务代际标记和取消机制管理异步处理；提供无第三方运行时依赖的 Python CLI，结合 EPUBCheck、Vitest 和 Playwright 建立格式合规、跨语言互操作与端到端回归验证。',en:'Shared a TypeScript core across browser and Node.js, managing asynchronous processing with a Web Worker, generation markers, and cancellation. Delivered a standard-library-only Python CLI and combined EPUBCheck, Vitest, and Playwright for format compliance, cross-language interoperability, and end-to-end regression verification.'}},
 ],
};
