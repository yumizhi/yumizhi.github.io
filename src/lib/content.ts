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
  abstract: string; featured: boolean; image?: string; imageWidth?: number; imageHeight?: number; imageAlt: string; imageCaption: PaperCopy;
  paper: string; publisher?: string; code?: string; bibtex: string;
};
export const papers: Paper[] = [
  {
    slug: 'tide', shortTitle: 'TIDE', title: 'TIDE: Trajectory-Aware Watermark Propagation for Text-to-Image Diffusion Models',
    venue: 'NeurIPS', year: 2026, topic: 'Watermarking', featured: true,
    authors: ['Yihan Meng', 'Suping Xu', 'Yanfeng Wu', 'Chongjun Wang', 'Lin Shang'],
    summary: 'TIDE writes a watermark partway through denoising. It uses the last few text-guidance updates to steer the watermark away from directions that are shaping the image.',
    summaryZh: 'TIDE 在去噪中途写入水印。后续采样会减弱水印引导与近期文本引导方向重合的分量，尽量保留同一提示词和随机种子原本会生成的画面。',
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
    summary: 'SASBO searches for a small set of image coordinates that can change a classifier’s prediction. On CIFAR-10, its untargeted attack changed 3.95 entries on average at the largest amplitude allowance tested.',
    summaryZh: 'SASBO 寻找足以让分类器改判的一小组坐标。在 CIFAR-10 非定向实验中，单点改动幅度取论文测试的最大值时，每张图平均改动 3.95 个坐标。',
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
    summary: 'A sparse perturbation that fools one classifier often fails on another. SAM holds out one surrogate in each training task to measure how well an update transfers before testing the finished image on independent models.',
    summaryZh: '同一张扰动图像，在一个分类器上会被认错，换个模型却可能恢复原来的判断。SAM 每轮留出一个替代模型检验扰动，最终在未参与优化的分类器上评估迁移效果。',
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
  slug: 'personal-agent', title: 'Personal Agent', category: 'Agent workspace', categoryZh: '智能体工作台', year: 2026,
  cardSummary: { en: 'A self-hosted agent that keeps scheduled tasks running after the browser closes. Reports arrive in the web inbox or a linked chat.', zh: '自托管的个人智能体。关掉网页后，定时任务照常运行，报告送到收件箱或绑定的聊天渠道。' },
  summary: 'Personal Agent shares a task history across a web workspace and linked chats. A daily brief can run while its owner is offline. The delivered report carries a link back to the run, including the tools it used and the material it cited. Recurring workflows are edited and published in Studio.',
  summaryZh: 'Personal Agent 是一个自托管的个人智能体工作台。比如订好一份每日简报，关掉网页后它仍会按时运行。报告送到收件箱或聊天里，点开就能看到这次用过的工具和引用的资料。需要反复执行的流程可以在 Studio 里编辑、发布。',
  description: 'Members manage subscriptions and receive reports in the workspace. Studio keeps each published workflow version and the runs made against it.',
  descriptionZh: '成员在工作台里管理订阅、接收报告。Studio 保存已发布的流程版本，以及每个版本对应的运行记录。',
  image: '/images/projects/agent-member-desk.webp',
  imageAlt: 'Member workspace with a task composer, upcoming work and a delivered report',
  gallery: [],
  previews: [
    { id: 'desk', label: 'Member workspace', labelZh: '成员工作台', image: '/images/projects/agent-member-desk.webp', width: 1440, height: 900,
      mobile: '/images/projects/agent-member-desk-mobile.webp', mobileWidth: 390, mobileHeight: 844,
      alt: 'Member dashboard with a task composer, upcoming schedules, a pending confirmation and a delivered P-17 report.',
      caption: 'The member workspace brings a new request, upcoming work and the latest delivery into one view. The P-17 report is from a demonstration task.', captionZh: '成员在同一个工作台交办新任务、查看排期、打开已经送达的结果。画面中的 P-17 报告来自一项演示任务。' },
    { id: 'execution', label: 'Task run', labelZh: '任务运行', image: '/images/projects/agent-task-log.webp', width: 1440, height: 900,
      mobile: '/images/projects/agent-run-detail.webp', mobileWidth: 482, mobileHeight: 481,
      alt: 'The P-17 run drawer showing completed steps and the web inbox delivery receipt.',
      caption: 'The run drawer records four completed steps and a separate inbox receipt.', captionZh: '运行面板列出四个已完成步骤，下面另有网页收件箱的投递回执。' },
    { id: 'delivery', label: 'Delivered report', labelZh: '已交付报告', image: '/images/projects/agent-task-result.webp', width: 1440, height: 900,
      mobile: '/images/projects/agent-result-detail.webp', mobileWidth: 771, mobileHeight: 441,
      alt: 'Delivered P-17 report with numbered references to the manual and maintenance register.',
      caption: 'The saved report links its recommendation to the manual and the maintenance register used by this run.', captionZh: '报告在巡检建议旁保留了引用，成员可查到这次运行读取的维护手册和设备登记。' },
    { id: 'overview', label: 'Project studio', labelZh: '项目工作室', image: '/images/projects/agent-project-studio.webp', width: 1440, height: 900,
      alt: 'Project studio overview with assistants, workflows, pending work and the project audit feed.',
      caption: 'Project authors publish workflows in Studio. Members run the published application from their own workspace.', captionZh: '项目作者在 Studio 编排并发布流程，成员在自己的工作台调用已发布的应用。' },
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
  technology: 'Development preview · PRs #14–17. Source code is private.',
  technologyZh: '开发预览 · PR #14–17。源码暂未公开。',
}, {
  slug: 'originmark', title: 'OriginMark', category: 'Image provenance', categoryZh: '图像溯源', year: 2026,
  cardSummary: { en: 'A watermarking workspace for generated and existing images. Each signed release keeps the watermark readback for the delivered file.', zh: '给生成图和已有图像写入水印。每次签发都保留交付文件的水印回读结果。' },
  summary: 'OriginMark handles two kinds of input. TIDE can generate an image with a watermark already embedded, and an existing image can be marked before release. The worker reads the watermark back from the finished file. Its release record keeps this result alongside the signature check.',
  summaryZh: 'OriginMark 处理两类图像。新图可以用 TIDE 在生成时写入水印，已有图片也可以在发布前加上保护。签发时，后台会用实际交付的文件回读水印，把检测结果和签名核验结果一起存进发布记录。',
  description: 'The workspace supports TIDE generation, protection of existing images and verification of exported files. Watermark detection and signature integrity have separate results.',
  descriptionZh: '工作台支持 TIDE 生成、已有图像保护及文件核验。一张图是否检出了水印、签名是否完整，各有单独的核验结果。',
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
  slug: 'epub-toolkit', title: 'EPUB Toolkit', category: 'Open-source software', categoryZh:'开源软件', year: 2026,
  summaryZh: '一套电子书的两卷里，都可能有 chapter1.xhtml 和 cover.jpg。合并时，EPUB Toolkit 给每一卷单独安排路径，保留原来的章节顺序。分卷记录就存在合集里，下次拆书时还能找回各卷的内容。',
  cardSummary: { en: 'An offline EPUB editor for collecting volumes in one book and splitting them apart again.', zh: '可以离线使用的 EPUB 小工具，在浏览器里合并分卷，也能拆回单册。' },
  summary: 'Two volumes of an ebook can both have a chapter called chapter1.xhtml and an illustration called cover.jpg. EPUB Toolkit gives each volume its own paths inside the collection and keeps the original book order. A map saved in the EPUB makes the merge reversible.',
  description: 'The merge queue sets the order of the volumes. The exported book supports a grouped or continuous table of contents and carries its own split record.',
  descriptionZh: '合并队列里的排列顺序就是分卷顺序。导出时可以按卷编排目录，也可以让章节连续排列。合集里附有拆分所需的记录。',
  image: '/images/epub-workspace.webp', imageAlt: 'Actual EPUB Toolkit interface with book queue, output settings, table of contents preview, and download.',
  gallery: ['/images/epub-workspace.webp', '/images/epub-empty.webp'],
  previews: [
    {id:'merge',label:'Merge',labelZh:'合并',image:'/images/epub-panel-merge.webp',width:762,height:429,mobile:'/images/epub-panel-merge-mobile.webp',mobileWidth:686,mobileHeight:752,alt:'Real EPUB Toolkit book queue with two volumes ready to merge',caption:'Two volumes queued in reading order.',captionZh:'合并队列中的两册书，按阅读顺序排列。'},
    {id:'output',label:'Output',labelZh:'输出',image:'/images/epub-panel-output.webp',width:352,height:363,alt:'Actual rebuilt EPUB contents and completed download',caption:'The exported collection and its rebuilt table of contents.',captionZh:'合并后的电子书及其重新编排的目录。'},
    {id:'split',label:'Split',labelZh:'拆分',image:'/images/epub-panel-split.webp',width:860,height:513,alt:'Actual split result with the two recovered original volumes',caption:'Two separate books recovered from the collection.',captionZh:'拆分得到的两册电子书。'},
    {id:'inspect',label:'Inspect',labelZh:'检查',image:'/images/epub-panel-inspect.webp',width:620,height:470,mobile:'/images/epub-inspect-mobile.webp',mobileWidth:293,mobileHeight:533,alt:'Actual EPUB metadata, chapter structure, and package information',caption:'Book metadata and chapter order in the inspector.',captionZh:'检查视图中的书籍信息和章节顺序。'},
  ],
  repo: 'https://github.com/yumizhi/lightweight_epub_merge_tool',
  demo: 'https://yumizhi.github.io/lightweight_epub_merge_tool/',
  release: 'https://github.com/yumizhi/lightweight_epub_merge_tool/releases',
  technology: 'The web app supports offline use. Python and Node.js command-line tools are also available.',
  technologyZh:'支持离线使用，也提供 Python 和 Node.js 命令行工具。',

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
