export const site = {
  name: 'Yihan Meng', chineseName: '蒙一涵', url: 'https://yumizhi.github.io',
  email: 'mengyihan@smail.nju.edu.cn',
  scholar: 'https://scholar.google.com/citations?user=sMZ0X6sAAAAJ',
  github: 'https://github.com/yumizhi', analytics: 'G-7YW0Y81D8',
  description: 'Ph.D. candidate at Nanjing University. Research on generative models, watermarking, and adversarial learning.',
};
export type Paper = {
  slug: string; shortTitle: string; title: string; venue: string; year: number;
  topic: 'Watermarking' | 'Adversarial learning'; authors: string[]; summary: string;
  abstract: string; featured: boolean; image?: string; imageWidth?: number; imageHeight?: number; imageAlt: string; imageCaption: string;
  paper: string; publisher?: string; code?: string; bibtex: string;
};
export const papers: Paper[] = [
  {
    slug: 'tide', shortTitle: 'TIDE', title: 'TIDE: Trajectory-Aware Watermark Propagation for Text-to-Image Diffusion Models',
    venue: 'NeurIPS', year: 2026, topic: 'Watermarking', featured: true,
    authors: ['Yihan Meng', 'Suping Xu', 'Yanfeng Wu', 'Chongjun Wang', 'Lin Shang'],
    summary: 'Trajectory-aware watermarking that reduces interference with diffusion image generation.',
    abstract: "Watermarking text-to-image diffusion models provides a practical mechanism for provenance tracking and responsible deployment. Post-processing methods are easy to deploy but vulnerable to image-space transformations. In-processing methods improve robustness by embedding the watermark within the denoising trajectory. Yet most existing methods inject the signal into the initial noise or a fixed intermediate latent, without controlling how it evolves during the remaining denoising steps. This can entangle watermark preservation with text-guided generation, risking weaker verification or degraded content fidelity. We propose TIDE, a trajectory-aware watermarking method for text-to-image diffusion models. TIDE injects a learnable watermark into an intermediate latent and jointly optimizes it with an auxiliary watermark condition, using preservation and detection objectives to limit deviation from the unwatermarked reference while maintaining separable watermark evidence. During sampling, TIDE estimates recent text-guidance directions and redirects watermark guidance toward the residual component less aligned with this local text subspace, reducing avoidable interference with semantic generation. Verification uses null-prompt partial inversion to recover the injection latent and match its masked coefficients to the target watermark. Experiments show that TIDE achieves reliable verification on unattacked images, improves robustness under common attacks, and better preserves semantic and visual fidelity.",
    image: '/images/tide-results-original.webp', imageWidth: 1422, imageHeight: 1120, imageAlt: 'Published qualitative comparison of clean, Tree-Ring, ROBIN, and TIDE images across five prompts.',
    imageCaption: 'Figure 2: Qualitative comparison of different methods.',
    paper: '/files/tide-neurips-2026.pdf',
    bibtex: '@inproceedings{meng2026tide,\n  title={TIDE: Trajectory-Aware Watermark Propagation for Text-to-Image Diffusion Models},\n  author={Meng, Yihan and Xu, Suping and Wu, Yanfeng and Wang, Chongjun and Shang, Lin},\n  booktitle={Advances in Neural Information Processing Systems},\n  year={2026}\n}',
  },
  {
    slug: 'sasbo', shortTitle: 'SASBO', title: 'SASBO: Sparse Attack via Stochastic Binary Optimization',
    venue: 'PAKDD', year: 2024, topic: 'Adversarial learning', featured: true,
    authors: ['Yihan Meng', 'Weitao Li', 'Lin Shang'],
    summary: 'Sparse adversarial attacks through stochastic binary optimization.',
    abstract: "Deep Neural Networks have shown vulnerability to sparse adversarial attack, which involves perturbing only a limited number of pixels. Identifying the coordinates requiring perturbation in sparse attacks poses a significant computational challenge. Existing solutions predominantly rely on heuristic methods or relax the ℓ0-norm to the ℓ1-norm. In this paper, we present an efficient algorithm for conducting sparse attacks. Our algorithm factorizes the perturbation at each pixel to the product of the perturbation coordinates and the perturbation magnitudes and then optimizes them alternately. We reformulate the ℓ0-norm as a stochastic binary optimization problem, assuming that each pixel’s perturbation status is associated with a stochastic binary variable. This stochastic binary variable follows a Bernoulli distribution, with a parameter value that ranges from 0 to 1, signifying the probability of pixel disturbance. To tackle this stochastic binary optimization challenge, we employ an unbiased gradient estimator known as Augment-Reinforce-Merge (ARM). Once the perturbed coordinates are determined, we optimize the perturbation magnitudes with gradient descent. Furthermore, we incorporate a binary search algorithm to eliminate redundant pixels to enhance sparsity. Comprehensive experiments demonstrate the superiority of our proposed method over several state-of-the-art sparse attack methods.",
    image: '/images/sasbo-original.webp', imageWidth: 782, imageHeight: 341, imageAlt: 'Original SASBO figure comparing clean images, SASBO perturbations, and GreedyF perturbations for a dog and flower.',
    imageCaption: 'Fig. 1. Visualization of nontargeted attack under perturbation threshold ε = 10. The images in each row, from left to right, are clean images, our adversarial example, our perturbation coordinates, GreedyFool’s adversarial example, and GreedyFool’s perturbation coordinates. In the figures of perturbation coordinates, black pixels denote no perturbation; white pixels denote perturbing all three RGB channels; pure red, green, and blue pixels represent perturbing a single channel. (Color figure online)',
    paper: '/files/sasbo-pakdd-2024.pdf',
    publisher:'https://link.springer.com/chapter/10.1007/978-981-97-2242-6_10',
    bibtex: '@inproceedings{meng2024sasbo,\n  title={SASBO: Sparse Attack via Stochastic Binary Optimization},\n  author={Meng, Yihan and Li, Weitao and Shang, Lin},\n  booktitle={Pacific-Asia Conference on Knowledge Discovery and Data Mining},\n  year={2024},\n  doi={10.1007/978-981-97-2242-6_10}\n}',
  },
  {
    slug: 'sparse-meta-learning', shortTitle: 'Sparse Attack with Meta-Learning', title: 'Sparse Attack with Meta-Learning',
    venue: 'IJCNN', year: 2024, topic: 'Adversarial learning', featured: true,
    authors: ['Weitao Li', 'Mingqian Lin', 'Yihan Meng', 'Yangdai Si', 'Lin Shang'],
    summary: 'Meta-learning and perturbation projection for transferable sparse adversarial attacks.',
    abstract: "Black-box attacks pose a significant challenge due to the restricted access to target model information, hindering the generation of impactful adversarial samples. This paper introduces a method that combines sparse attacks and metalearning to alleviate the issue of low success rates in blackbox attacks. SAM leverages the knowledge transfer capabilities inherent in meta-learning to augment the transferability of adversarial samples. The method integrates meta-learning with gradient-based attack techniques, effectively transforming the approach into a white-box attack. By aggregating multiple sampled models, SAM enhances the stability of adversarial samples. During meta-testing, simulated black-box attacks help mitigate gradient discrepancies across diverse models, consequently enhancing transferability. To further improve sparsity and preserve transferability, SAM incorporates a projection strategy that selectively sparsifies global adversarial perturbations. Experimental evaluations conducted on two image datasets substantiate SAM’s superiority in terms of both sparsity and attack success rate. Ablation experiments confirm the effectiveness of integrating meta-learning into the proposed method. SAM extends the applicability of generated adversarial samples, advancing the domain of adversarial attacks in scenarios with limited target model information. The proposed approach exhibits promise in enhancing the success rate of attacks while preserving sparsity, contributing to the broader understanding of black-box attacks and their implications.",
    image: '/images/sam-meta-learning.webp', imageWidth: 964, imageHeight: 604,
    imageAlt: 'Meta-learning illustration showing sampled training episodes and support and query sets during meta-testing.',
    imageCaption: 'Fig. 1. Meta-learning',
    paper: '/files/sparse-meta-learning-ijcnn-2024.pdf',
    publisher:'https://ieeexplore.ieee.org/abstract/document/10650867',
    bibtex: '@inproceedings{li2024sparse,\n  title={Sparse Attack with Meta-Learning},\n  author={Li, Weitao and Lin, Mingqian and Meng, Yihan and Si, Yangdai and Shang, Lin},\n  booktitle={International Joint Conference on Neural Networks},\n  year={2024},\n  url={https://ieeexplore.ieee.org/document/10650867}\n}',
  },
];
export type Project = {
 slug:string;title:string;category:string;year:number;summary:string;description:string;image:string;imageAlt:string;gallery:string[];
 repo:string;demo?:string;release?:string;features:{title:string;titleZh:string;description:string;descriptionZh:string}[];technology:string;categoryZh?:string;summaryZh?:string;descriptionZh?:string;technologyZh?:string;
 previews?:{id:string;label:string;labelZh?:string;image:string;width:number;height:number;mobile?:string;mobileWidth?:number;mobileHeight?:number;alt:string;caption?:string;captionZh?:string}[];
};
export const projects:Project[] = [{
  slug: 'epub-toolkit', title: 'EPUB Toolkit', category: 'Open-source software', categoryZh:'开源软件', year: 2026,
  summaryZh:'合并 EPUB 分卷、还原单册，查看书籍目录与元数据。文件在浏览器中处理，无需上传。',
  summary: 'Combine EPUB volumes, restore individual books, and inspect their contents. Files are processed in your browser, without uploads.',
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
  features: [
    {title:'Merge',titleZh:'合并分卷',description:'Arrange books in reading order and combine them into one EPUB, with a grouped or continuous table of contents.',descriptionZh:'调整书籍的阅读顺序，合并为一个 EPUB。目录可以按书分组，也可以使用连续的章节列表。'},
    {title:'Split',titleZh:'还原单册',description:'Restore the individual volumes of a collection previously merged with this toolkit.',descriptionZh:'将本工具合并的合集拆回单册，单独下载或打包保存。'},
    {title:'Inspect',titleZh:'查看结构',description:'Explore a book’s metadata, chapter navigation, and packaged files.',descriptionZh:'查看书名、作者等元数据，以及章节导航和书籍内部的文件结构。'},
  ],
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
