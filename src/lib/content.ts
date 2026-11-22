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
 repo?:string;demo?:string;release?:string;technology?:string;categoryZh?:string;summaryZh?:string;descriptionZh?:string;technologyZh?:string;
 cardSummary?:{en:string;zh:string};
 previews?:{id:string;label:string;labelZh?:string;image:string;width:number;height:number;mobile?:string;mobileWidth?:number;mobileHeight?:number;alt:string;caption?:string;captionZh?:string}[];
};
export const projects:Project[] = [{
  slug: 'personal-agent', title: 'Personal Agent', category: 'Agent workspace', categoryZh: '智能体工作台', year: 2026,
  cardSummary: { en: 'A self-hosted agent workspace for conversations, recurring source watches and published workflows.', zh: '自托管的智能体工作台，支持跨渠道对话、长期订阅和工作流应用。' },
  summary: 'Personal Agent pairs a member workspace with an authoring Studio. Members follow topics and receive reports on the web or in a linked chat. In Studio, authors configure an agent’s tools, connect workflow steps and publish a version that others can run.',
  summaryZh: 'Personal Agent 有个人工作台和 Studio 两个入口。成员可以持续关注一个主题，在网页或绑定的聊天里收取报告。作者在 Studio 配置 Agent 的工具、编排工作流，把选定的版本发布成其他成员可以使用的应用。',
  description: 'Members manage sources, schedules and delivered reports. Studio hosts the agent and workflow editors, evaluations and published applications.',
  descriptionZh: '个人工作台管理订阅、排期和已送达的报告。Studio 提供 Agent 配置、工作流编辑、评测与应用发布。',
  image: '/images/projects/agent-platform-workspace.webp',
  imageAlt: 'Personal Agent member workspace',
  gallery: [],
  previews: [
    { id: 'workspace', label: 'Member workspace', labelZh: '个人工作台', image: '/images/projects/agent-platform-workspace.webp', width: 1330, height: 835,
      mobile: '/images/projects/agent-platform-workspace-mobile.webp', mobileWidth: 390, mobileHeight: 780,
      alt: 'The member workspace with a task composer, delivered results and upcoming work.',
      caption: 'A new request, delivered reports and upcoming work on the member home screen.', captionZh: '个人工作台可以交办新任务，也能直接打开已送达的成果、查看接下来的安排。' },
    { id: 'definition', label: 'Agent editor', labelZh: '智能体编辑器', image: '/images/projects/agent-platform-definition.webp', width: 1330, height: 835,
      mobile: '/images/projects/agent-platform-definition-mobile.webp', mobileWidth: 390, mobileHeight: 780,
      alt: 'Equipment maintenance assistant in the Studio agent editor, with configuration and a test conversation.',
      caption: 'The equipment maintenance assistant. Its instructions, sources and tools can be edited alongside a test conversation.', captionZh: '设备维护分析员的智能体编辑器。作者可以修改回答要求、资料来源和工具，并在试聊区检查回答。' },
    { id: 'workflow', label: 'Workflow editor', labelZh: '工作流编辑器', image: '/images/projects/agent-platform-workflow.webp', width: 1330, height: 835,
      mobile: '/images/projects/agent-platform-workflow-mobile.webp', mobileWidth: 390, mobileHeight: 780,
      alt: 'The Studio workflow editor with connected steps for reviewing an equipment alert.',
      caption: 'The equipment alert workflow has seven connected steps. Selecting the recommendation step brings up its properties.', captionZh: '设备告警复核工作流由七个节点组成，选中“生成建议”可以查看和修改这一步的属性。' },
    { id: 'result', label: 'Report', labelZh: '任务成果', image: '/images/projects/agent-platform-result.webp', width: 1330, height: 835,
      mobile: '/images/projects/agent-platform-result-mobile.webp', mobileWidth: 390, mobileHeight: 780,
      alt: 'Saved source-watch report with a reference to the SQLite transaction documentation.',
      caption: 'In this example a watch uses a hand-picked SQLite reference. The delivered reading note retains its source and can be saved or exported.', captionZh: '示例任务使用人工选定的 SQLite 官方文档。生成的《SQLite 事务阅读笔记》保留了原文链接，可以收藏或导出。' },
  ],
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
