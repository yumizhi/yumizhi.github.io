export const site = {
  name: 'Yihan Meng', chineseName: '蒙一涵', url: 'https://yumizhi.github.io',
  email: 'mengyihan@smail.nju.edu.cn',
  scholar: 'https://scholar.google.com/citations?user=sMZ0X6sAAAAJ',
  github: 'https://github.com/yumizhi', analytics: 'G-7YW0Y81D8',
  description: 'Ph.D. candidate at Nanjing University. Research on generative models, watermarking, and adversarial learning.',
};
type PaperCopy = { en: string; zh: string };

export type Paper = {
  slug: string; shortTitle: string; title: string; venue: string; year: number;
  topic: 'Watermarking' | 'Adversarial learning'; authors: string[]; summary: string; summaryZh?: string;
  introduction: { title: PaperCopy; paragraphs: PaperCopy[] };
  abstract: string; featured: boolean; image?: string; imageWidth?: number; imageHeight?: number; imageAlt: string; imageCaption: PaperCopy;
  paper: string; publisher?: string; code?: string; bibtex: string;
};
export const papers: Paper[] = [
  {
    slug: 'tide', shortTitle: 'TIDE', title: 'TIDE: Trajectory-Aware Watermark Propagation for Text-to-Image Diffusion Models',
    venue: 'NeurIPS', year: 2026, topic: 'Watermarking', featured: true,
    authors: ['Yihan Meng', 'Suping Xu', 'Yanfeng Wu', 'Chongjun Wang', 'Lin Shang'],
    summary: 'A watermark written during diffusion still has to survive the rest of sampling. TIDE uses the recent denoising trajectory to carry that signal forward while keeping the scene close to the unwatermarked reference.',
    summaryZh: '扩散过程中写入的水印，还要经历余下的去噪。TIDE 根据近期去噪轨迹调整水印引导，让信号留下来，同时尽量保留原本的画面。',
    introduction: {
      title: { en: 'Sampling continues after the watermark goes in', zh: '写入水印之后，采样还在继续' },
      paragraphs: [
        {
          en: 'In Figure 2, the same prompt and random seed produce two views of a red sports car. The unwatermarked image shows the hood and front wheel, while the Tree-Ring image shows the rear. Both images fit the prompt. The change in viewpoint tells us how far the result can move from the unwatermarked reference.',
          zh: '论文图 2 里有一辆红色跑车。用同样的提示词和随机种子，无水印图像里能看到车头和前轮，Tree-Ring 的样例却拍到了车尾。两张图都符合提示词，但视角已经变了。',
        },
        {
          en: 'TIDE starts from the steps that remain after injection. Those steps can carry the signal into the final image, and they are still shaping the scene. Recent text-guidance updates give a local estimate of the directions the watermark is most likely to compete with. We use that estimate to redirect the watermark update and adjust its strength as denoising proceeds.',
          zh: 'TIDE 从注入之后的步骤入手。余下的去噪既能把水印带进最终图像，也还在塑造画面。最近几步的文本引导表明采样正在往哪些方向走。用它作参考，就可以在每一步调整水印引导的方向和强度，减少两种更新之间的干扰。',
        },
      ],
    },
    abstract: "Watermarking text-to-image diffusion models provides a practical mechanism for provenance tracking and responsible deployment. Post-processing methods are easy to deploy but vulnerable to image-space transformations. In-processing methods improve robustness by embedding the watermark within the denoising trajectory. Yet most existing methods inject the signal into the initial noise or a fixed intermediate latent, without controlling how it evolves during the remaining denoising steps. This can entangle watermark preservation with text-guided generation, risking weaker verification or degraded content fidelity. We propose TIDE, a trajectory-aware watermarking method for text-to-image diffusion models. TIDE injects a learnable watermark into an intermediate latent and jointly optimizes it with an auxiliary watermark condition, using preservation and detection objectives to limit deviation from the unwatermarked reference while maintaining separable watermark evidence. During sampling, TIDE estimates recent text-guidance directions and redirects watermark guidance toward the residual component less aligned with this local text subspace, reducing avoidable interference with semantic generation. Verification uses null-prompt partial inversion to recover the injection latent and match its masked coefficients to the target watermark. Experiments show that TIDE achieves reliable verification on unattacked images, improves robustness under common attacks, and better preserves semantic and visual fidelity.",
    image: '/images/tide-results-original.webp', imageWidth: 1422, imageHeight: 1120, imageAlt: 'Published qualitative comparison of clean, Tree-Ring, ROBIN, and TIDE images across five prompts.',
    imageCaption: { en: 'Generations from the same prompt. The unwatermarked image is the reference.', zh: '同一提示词下的生成结果。无水印图像作为参考。' },
    paper: '/files/tide-neurips-2026.pdf',
    bibtex: '@inproceedings{meng2026tide,\n  title={TIDE: Trajectory-Aware Watermark Propagation for Text-to-Image Diffusion Models},\n  author={Meng, Yihan and Xu, Suping and Wu, Yanfeng and Wang, Chongjun and Shang, Lin},\n  booktitle={Advances in Neural Information Processing Systems},\n  year={2026}\n}',
  },
  {
    slug: 'sasbo', shortTitle: 'SASBO', title: 'SASBO: Sparse Attack via Stochastic Binary Optimization',
    venue: 'PAKDD', year: 2024, topic: 'Adversarial learning', featured: true,
    authors: ['Yihan Meng', 'Weitao Li', 'Lin Shang'],
    summary: 'With a tight perturbation budget, the choice of coordinates can matter as much as the size of each change. SASBO learns that discrete choice through a probability attached to each coordinate.',
    summaryZh: '能改动的位置很少时，选中哪些坐标就成了问题的核心。SASBO 给每个坐标一个被选中的概率，让这个离散选择也能从分类器的反馈中学习。',
    introduction: {
      title: { en: 'A few changed coordinates can change the verdict', zh: '只动少数坐标，也能改变分类结果' },
      paragraphs: [
        {
          en: 'The dog in the first row of Figure 1 looks much the same after perturbation. The map beside it makes the changes visible. Most of it stays black, with colored points showing the changed channels. Under an amplitude limit, making a classifier change its decision with so few edits depends on choosing those coordinates well.',
          zh: '图 1 第一行里的狗在施加扰动前后看起来差别很小。旁边的扰动图更容易看出变化，大部分区域是黑色，零星的彩色点标出被改动的通道。每个位置能改多少是有限的，用这么少的改动改变分类结果，坐标就得选得准。',
        },
        {
          en: 'The location and the magnitude call for different kinds of search. SASBO learns a probability for each discrete selection and uses it to choose where to perturb. It can return to that choice after the magnitudes change.',
          zh: '选位置和调幅度需要两种不同的搜索。SASBO 给每个坐标一个可学习的选择概率，据此确定改动的位置。幅度更新后，位置也可以再选。',
        },
      ],
    },
    abstract: "Deep Neural Networks have shown vulnerability to sparse adversarial attack, which involves perturbing only a limited number of pixels. Identifying the coordinates requiring perturbation in sparse attacks poses a significant computational challenge. Existing solutions predominantly rely on heuristic methods or relax the ℓ0-norm to the ℓ1-norm. In this paper, we present an efficient algorithm for conducting sparse attacks. Our algorithm factorizes the perturbation at each pixel to the product of the perturbation coordinates and the perturbation magnitudes and then optimizes them alternately. We reformulate the ℓ0-norm as a stochastic binary optimization problem, assuming that each pixel’s perturbation status is associated with a stochastic binary variable. This stochastic binary variable follows a Bernoulli distribution, with a parameter value that ranges from 0 to 1, signifying the probability of pixel disturbance. To tackle this stochastic binary optimization challenge, we employ an unbiased gradient estimator known as Augment-Reinforce-Merge (ARM). Once the perturbed coordinates are determined, we optimize the perturbation magnitudes with gradient descent. Furthermore, we incorporate a binary search algorithm to eliminate redundant pixels to enhance sparsity. Comprehensive experiments demonstrate the superiority of our proposed method over several state-of-the-art sparse attack methods.",
    image: '/images/sasbo-original.webp', imageWidth: 782, imageHeight: 341, imageAlt: 'Original SASBO figure comparing clean images, SASBO perturbations, and GreedyF perturbations for a dog and flower.',
    imageCaption: { en: 'SASBO and GreedyFool under the same amplitude cap (ε = 10). Columns (c) and (e) show the changed channels. White marks all three RGB channels.', zh: 'SASBO 与 GreedyFool 使用相同的幅度上限（ε = 10）。第 (c)、(e) 列显示被改动的通道，白点表示 RGB 三个通道都有变化。' },
    paper: '/files/sasbo-pakdd-2024.pdf',
    publisher:'https://link.springer.com/chapter/10.1007/978-981-97-2242-6_10',
    bibtex: '@inproceedings{meng2024sasbo,\n  title={SASBO: Sparse Attack via Stochastic Binary Optimization},\n  author={Meng, Yihan and Li, Weitao and Shang, Lin},\n  booktitle={Pacific-Asia Conference on Knowledge Discovery and Data Mining},\n  year={2024},\n  doi={10.1007/978-981-97-2242-6_10}\n}',
  },
  {
    slug: 'sparse-meta-learning', shortTitle: 'Sparse Attack with Meta-Learning', title: 'Sparse Attack with Meta-Learning',
    venue: 'IJCNN', year: 2024, topic: 'Adversarial learning', featured: true,
    authors: ['Weitao Li', 'Mingqian Lin', 'Yihan Meng', 'Yangdai Si', 'Lin Shang'],
    summary: 'A sparse perturbation tuned to one classifier can lose its effect on another. SAM brings that change of model into the optimization by rotating which surrogate supplies the training signal and which checks the update.',
    summaryZh: '在一个分类器上有效的稀疏扰动，换个模型可能就失效。SAM 在优化中轮换替代模型，让暂时留出的模型也来评价这次更新。',
    introduction: {
      title: { en: 'The same image meets a different classifier', zh: '同一张图，换一个分类器' },
      paragraphs: [
        {
          en: 'In the CIFAR-10 experiment, the baseline’s perturbed images fool VGG19 more often than DenseNet161. The images are the same in both tests. What changes is the classifier, and the baseline had optimized every one of its input changes against VGG19.',
          zh: '在 CIFAR-10 实验中，基线方法生成的扰动图像更容易骗过 VGG19，在 DenseNet161 上的成功率则低得多。两次测试用的是同一批图，只换了分类器。此前，图像上的每一处改动都由 VGG19 的反馈决定。',
        },
        {
          en: 'SAM rehearses that handoff during optimization. For each sampled task, one group of accessible classifiers proposes the update and another model from the same surrogate pool checks how well it carries over. The roles rotate between tasks. Separate black-box targets come in at evaluation, where they measure the transfer this procedure was meant to encourage.',
          zh: 'SAM 把换模型这件事提前到优化里。每轮先用一组可访问的分类器给出更新方向，再用替代模型池里暂时留出的另一个模型检验这次更新。下一轮重新分配角色。最后用独立的黑盒模型评估这些改动能迁移多远。',
        },
      ],
    },
    abstract: "Black-box attacks pose a significant challenge due to the restricted access to target model information, hindering the generation of impactful adversarial samples. This paper introduces a method that combines sparse attacks and meta-learning to alleviate the issue of low success rates in black-box attacks. SAM leverages the knowledge transfer capabilities inherent in meta-learning to augment the transferability of adversarial samples. The method integrates meta-learning with gradient-based attack techniques, effectively transforming the approach into a white-box attack. By aggregating multiple sampled models, SAM enhances the stability of adversarial samples. During meta-testing, simulated black-box attacks help mitigate gradient discrepancies across diverse models, consequently enhancing transferability. To further improve sparsity and preserve transferability, SAM incorporates a projection strategy that selectively sparsifies global adversarial perturbations. Experimental evaluations conducted on two image datasets substantiate SAM’s superiority in terms of both sparsity and attack success rate. Ablation experiments confirm the effectiveness of integrating meta-learning into the proposed method. SAM extends the applicability of generated adversarial samples, advancing the domain of adversarial attacks in scenarios with limited target model information. The proposed approach exhibits promise in enhancing the success rate of attacks while preserving sparsity, contributing to the broader understanding of black-box attacks and their implications.",
    image: '/images/sam-meta-learning.webp', imageWidth: 964, imageHeight: 604,
    imageAlt: 'Meta-learning illustration showing sampled training episodes and support and query sets during meta-testing.',
    imageCaption: { en: 'The support and query split in meta-learning. SAM assigns those roles to classifiers.', zh: '元学习中的支持集与查询集。SAM 把这两种角色分给不同的分类器。' },
    paper: '/files/sparse-meta-learning-ijcnn-2024.pdf',
    publisher:'https://ieeexplore.ieee.org/abstract/document/10650867',
    bibtex: '@inproceedings{li2024sparse,\n  title={Sparse Attack with Meta-Learning},\n  author={Li, Weitao and Lin, Mingqian and Meng, Yihan and Si, Yangdai and Shang, Lin},\n  booktitle={International Joint Conference on Neural Networks},\n  year={2024},\n  url={https://ieeexplore.ieee.org/document/10650867}\n}',
  },
];
export type Project = {
 slug:string;title:string;category:string;year:number;summary:string;description:string;image:string;imageAlt:string;gallery:string[];
 repo?:string;demo?:string;release?:string;technology:string;categoryZh?:string;summaryZh?:string;descriptionZh?:string;technologyZh?:string;
 cardSummary?:{en:string;zh:string};
 previews?:{id:string;label:string;labelZh?:string;image:string;width:number;height:number;mobile?:string;mobileWidth?:number;mobileHeight?:number;alt:string;caption?:string;captionZh?:string}[];
};
export const projects:Project[] = [{
  slug: 'epub-toolkit', title: 'EPUB Toolkit', category: 'Open-source software', categoryZh:'开源软件', year: 2026,
  summaryZh:'在浏览器内重写 EPUB 的资源路径与目录，把拆分映射写入合集。单凭输出文件即可重建各卷，浏览器、Node 与 Python 读取同一种记录。',
  cardSummary: { en: 'Merge EPUB volumes and split collections back into individual books in your browser.', zh: '在浏览器里合并 EPUB 分卷，也可以把合集拆回单册。' },
  summary: 'Rebuild an EPUB collection in the browser and embed the source map in the output. Browser, Node and Python clients can reconstruct the volumes from that archive.',
  description: 'Arrange volumes in reading order, choose a grouped or continuous table of contents, then download a single EPUB. A collection merged with the toolkit can later be split back into individual books.',
  descriptionZh: '按阅读顺序排列分卷，选择按书分组或连续的章节目录，导出一个 EPUB。使用本工具合并的合集，还可以重新拆分为单册。',
  image: '/images/epub-workspace.webp', imageAlt: 'Actual EPUB Toolkit interface with book queue, output settings, table of contents preview, and download.',
  gallery: ['/images/epub-workspace.webp', '/images/epub-empty.webp'],
  previews: [
    {id:'merge',label:'Merge',labelZh:'合并',image:'/images/epub-panel-merge.webp',width:762,height:429,mobile:'/images/epub-panel-merge-mobile.webp',mobileWidth:686,mobileHeight:752,alt:'Real EPUB Toolkit book queue with two volumes ready to merge',caption:'Arrange volumes before merging.',captionZh:'调整分卷顺序，准备合并。'},
    {id:'output',label:'Output',labelZh:'输出',image:'/images/epub-panel-output.webp',width:352,height:363,alt:'Actual rebuilt EPUB contents and completed download',caption:'Review the contents and download the collection.',captionZh:'核对合集目录，下载合并结果。'},
    {id:'split',label:'Split',labelZh:'拆分',image:'/images/epub-panel-split.webp',width:860,height:513,alt:'Actual split result with the two recovered original volumes',caption:'Recover the original volumes from a collection.',captionZh:'从合集中还原原始分卷。'},
    {id:'inspect',label:'Inspect',labelZh:'检查',image:'/images/epub-panel-inspect.webp',width:620,height:470,mobile:'/images/epub-inspect-mobile.webp',mobileWidth:293,mobileHeight:533,alt:'Actual EPUB metadata, chapter structure, and package information',caption:'Check metadata and chapter structure.',captionZh:'检查元数据与章节结构。'},
  ],
  repo: 'https://github.com/yumizhi/lightweight_epub_merge_tool',
  demo: 'https://yumizhi.github.io/lightweight_epub_merge_tool/',
  release: 'https://github.com/yumizhi/lightweight_epub_merge_tool/releases',
  technology: 'The web app supports offline use. Python and Node.js command-line tools are also available.',
  technologyZh:'支持离线使用，也提供 Python 和 Node.js 命令行工具。',

}, {
  slug: 'originmark', title: 'OriginMark', category: 'Image provenance', categoryZh: '图像溯源', year: 2026,
  summary: 'Bind image releases to the exact bytes that pass watermark recovery and credential verification, across separate CPU, GPU and research runtimes.',
  summaryZh: '统一接入 CPU、GPU 与研究模型，在签发前对最终文件回读水印并验签。每份发布记录绑定通过核验的文件与证据。',
  description: 'OriginMark brings image generation and provenance into one workflow. Generate a marked image with TIDE or protect an existing image, then inspect what a verifier can recover from the resulting file.',
  descriptionZh: 'OriginMark 将图像生成和溯源串成一个工作流。用 TIDE 生成带水印的图像，或给已有图片添加保护，再检查验证工具能从输出文件中找回哪些证据。',
  image: '/images/projects/originmark-cover.webp',
  imageAlt: 'A ceramic teapot and pitcher from the OriginMark demonstration workspace',
  gallery: [],
  previews: [
    { id: 'generate', label: 'Generate', labelZh: '生成', image: '/images/projects/originmark-generate.webp', width: 868, height: 716,
      alt: 'OriginMark comparison canvas with clean and watermarked TIDE outputs', caption: 'A clean and watermarked pair in the demo workspace.', captionZh: '演示空间中的无水印与带水印图像对照。' },
    { id: 'verify', label: 'Verify', labelZh: '验证', image: '/images/projects/originmark-verify.webp', width: 972, height: 690,
      alt: 'OriginMark verification preview with separate watermark and content-credential results', caption: 'Watermark evidence and content credentials are reported separately.', captionZh: '水印证据和内容凭证分别呈现。' },
  ],
  technology: 'Source code is private.',
  technologyZh: '源码暂未公开。',
}, {
  slug: 'personal-agent', title: 'Personal Agent', category: 'Agent workspace', categoryZh: '智能体工作台', year: 2026,
  cardSummary: { en: 'An agent that watches sources over time and keeps the evidence behind a report, even after someone corrects it.', zh: '持续关注订阅变化，也能复核一份巡检报告。从更正后的结论，仍能找回原始依据与工单。' },
  summary: 'A self-hosted workspace for recurring research and reviewable work. Follow a release feed, or trace a corrected inspection report back to the clause, calculation and approval behind it.',
  summaryZh: '一个自托管的智能体工作台。个人可以持续跟进订阅来源，项目成员可以复核巡检报告，沿着一次更正找回适用条款、计算过程和写入审批。',
  description: 'The member workspace handles subscriptions, priorities and delivery. The studio runs versioned workflows with evidence, approvals and linked corrections.',
  descriptionZh: '个人工作台管理订阅、优先级和投递，开发者工作室将条款检索、工单审批和报告复核编入可回放的版本化工作流。',
  image: '/images/projects/agent-review.webp',
  imageAlt: 'Inspection handoff report with the elapsed time, cited agreement and reviewer decision',
  gallery: [],
  previews: [
    { id: 'studio', label: 'Workflow studio', labelZh: '工作流编排', image: '/images/projects/agent-studio.webp', width: 2160, height: 1350,
      mobile: '/images/projects/agent-studio-mobile.webp', mobileWidth: 585, mobileHeight: 1266,
      alt: 'Inspection workflow in Studio with eight connected steps from handoff intake to the project inbox.',
      caption: 'The inspection template connects eight steps. On a phone, the same graph opens as an ordered list.', captionZh: '巡检模板把登记、核算、审批和投递连成八步。手机按相同顺序展示节点。' },
    { id: 'review', label: 'Reviewed report', labelZh: '复核原稿', image: '/images/projects/agent-review.webp', width: 1524, height: 971,
      mobile: '/images/projects/agent-review-mobile.webp', mobileWidth: 549, mobileHeight: 983,
      alt: 'Original inspection report showing 54 minutes elapsed, a 45-minute allowance and a request to check the timestamp.',
      caption: 'The reviewer queries the time entry. The original calculation and both cited passages remain on screen.', captionZh: '复核人要求核实录入时间。屏幕上保留原计算和两条引用。' },
    { id: 'corrected', label: 'Corrected run', labelZh: '更正重跑', image: '/images/projects/agent-corrected.webp', width: 1524, height: 725,
      mobile: '/images/projects/agent-corrected-mobile.webp', mobileWidth: 549, mobileHeight: 737,
      alt: 'Report from the corrected run showing 39 minutes elapsed, zero minutes overdue and a new business receipt.',
      caption: 'The corrected run records 39 minutes and its own approved work order.', captionZh: '更正后重新计算为 39 分钟，报告附上本次审批产生的新工单回执。' },
    { id: 'watch', label: 'Source watch', labelZh: '长期关注', image: '/images/projects/agent-watch.webp', width: 750, height: 1245,
      mobile: '/images/projects/agent-watch-mobile.webp', mobileWidth: 585, mobileHeight: 1260,
      alt: 'Member workspace showing a SQLite update, its original source link and controls to adjust priority or save the method.',
      caption: 'A reader can change the priority of similar updates and save the reading method for another task.', captionZh: '读者可以调整相似更新的优先级，也能把这次阅读方法留给下一个任务。' },
  ],
  technology: 'Development preview · PR #17. Source code is private.',
  technologyZh: '开发预览 · PR #17。源码暂未公开。',
}];
export type Resource = { id: string; title: string; type: 'Paper'|'CV'|'Slides'|'Poster'; year: number; file: string; preview: string; size: string; description: string };
export const resources: Resource[] = [
  {id:'tide',title:'TIDE — NeurIPS 2026',type:'Paper',year:2026,file:'/files/tide-neurips-2026.pdf',preview:'/images/tide-page.webp',size:'3.5 MB',description:'NeurIPS 2026 · 33 pages'},
  {id:'sasbo',title:'SASBO — PAKDD 2024',type:'Paper',year:2024,file:'/files/sasbo-pakdd-2024.pdf',preview:'/images/sasbo-pakdd-2024-page.webp',size:'797 KB',description:'PAKDD 2024 · 13 pages'},
  {id:'sparse-meta-learning',title:'Sparse Attack with Meta-Learning — IJCNN 2024',type:'Paper',year:2024,file:'/files/sparse-meta-learning-ijcnn-2024.pdf',preview:'/images/sparse-meta-learning-ijcnn-2024-page.webp',size:'1.1 MB',description:'IJCNN 2024 · 8 pages'},
  {id:'cv',title:'Yihan Meng — Curriculum Vitae',type:'CV',year:2026,file:'/files/yihan-meng-cv.pdf',preview:'/images/cv-page.webp',size:'PDF',description:'Education, research, experience, and open-source software'},
];
export const education = [
  {period:'2023 — Present',dates:'Sep 2023 — Present',degree:'Ph.D. candidate',title:'Ph.D. candidate in Computer Science and Technology',institution:'Nanjing University',detail:'Advised by Associate Professor Lin Shang.'},
  {period:'2019 — 2023',dates:'Sep 2019 — Jun 2023',degree:'B.S.',title:'B.S. in Computer Science and Technology',institution:'Nanjing University',detail:'Department of Computer Science and Technology.'},
];
export const experience = [{period:'2025 — Present',dates:'Jul 2025 — Present',title:'Research Intern',institution:'Guodian Nanjing Automation Co., Ltd.',detail:'Nanjing, China.'}];
export const awards = [
  {year:'2026',title:'National Scholarship for Graduate Students',titleZh:'研究生国家奖学金'},
  {year:'2025',title:'Outstanding Graduate Student',titleZh:'南京大学优秀研究生'},
  {year:'2025',title:'Guodian Nanjing Automation Scholarship',titleZh:'国电南自奖学金'},
  {year:'2023',title:'President’s Scholarship',titleZh:'南京大学校长奖学金'},
  {year:'2022',title:'People’s Scholarship',titleZh:'南京大学人民奖学金'},
];
