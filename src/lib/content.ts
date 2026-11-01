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
  abstract: string; featured: boolean; image?: string; imageAlt: string; imageCaption: string;
  paper: string; code?: string; bibtex: string;
};
export const papers: Paper[] = [
  {
    slug: 'tide', shortTitle: 'TIDE', title: 'TIDE: Trajectory-Aware Watermark Propagation for Text-to-Image Diffusion Models',
    venue: 'NeurIPS', year: 2026, topic: 'Watermarking', featured: true,
    authors: ['Yihan Meng', 'Suping Xu', 'Yanfeng Wu', 'Chongjun Wang', 'Lin Shang'],
    summary: 'Watermarking diffusion images while preserving the picture the model set out to create.',
    abstract: 'TIDE injects a learnable watermark into an intermediate latent and jointly optimizes it with an auxiliary watermark condition. During sampling, it estimates recent text-guidance directions and redirects watermark guidance toward the residual component less aligned with this local text subspace. This reduces interference with semantic generation. Verification uses null-prompt partial inversion to recover the injection latent and match its masked coefficients to the target watermark. Experiments evaluate verification, robustness under common attacks, and visual fidelity.',
    image: '/images/tide-results-original.webp', imageAlt: 'Published qualitative comparison of clean, Tree-Ring, ROBIN, and TIDE images across five prompts.',
    imageCaption: 'Figure 2 from the TIDE camera-ready paper. The cover uses two unmodified image crops from the TIDE row.',
    paper: '/files/tide-neurips-2026.pdf',
    bibtex: '@inproceedings{meng2026tide,\n  title={TIDE: Trajectory-Aware Watermark Propagation for Text-to-Image Diffusion Models},\n  author={Meng, Yihan and Xu, Suping and Wu, Yanfeng and Wang, Chongjun and Shang, Lin},\n  booktitle={Advances in Neural Information Processing Systems},\n  year={2026}\n}',
  },
  {
    slug: 'sasbo', shortTitle: 'SASBO', title: 'SASBO: Sparse Attack via Stochastic Binary Optimization',
    venue: 'PAKDD', year: 2024, topic: 'Adversarial learning', featured: true,
    authors: ['Yihan Meng', 'Weitao Li', 'Lin Shang'],
    summary: 'Studying sparse adversarial perturbations through stochastic binary optimization.',
    abstract: 'SASBO studies adversarial attacks that change a limited set of image coordinates. It uses stochastic binary optimization to model the selection of perturbed coordinates and their perturbation values. The original qualitative figure contrasts the resulting images and sparse perturbations with a greedy attack.',
    image: '/images/sasbo-original.webp', imageAlt: 'Original SASBO figure comparing clean images, SASBO perturbations, and GreedyF perturbations for a dog and flower.',
    imageCaption: 'Original qualitative figure from this homepage’s public repository. Full paper available from Springer.',
    paper: 'https://link.springer.com/chapter/10.1007/978-981-97-2242-6_10',
    bibtex: '@inproceedings{meng2024sasbo,\n  title={SASBO: Sparse Attack via Stochastic Binary Optimization},\n  author={Meng, Yihan and Li, Weitao and Shang, Lin},\n  booktitle={Pacific-Asia Conference on Knowledge Discovery and Data Mining},\n  year={2024},\n  doi={10.1007/978-981-97-2242-6_10}\n}',
  },
  {
    slug: 'sparse-meta-learning', shortTitle: 'Sparse Attack with Meta-Learning', title: 'Sparse Attack with Meta-Learning',
    venue: 'IJCNN', year: 2024, topic: 'Adversarial learning', featured: false,
    authors: ['Weitao Li', 'Mingqian Lin', 'Yihan Meng', 'Yangdai Si', 'Lin Shang'],
    summary: 'Exploring meta-learning for sparse adversarial attack optimization.',
    abstract: 'This work investigates the use of meta-learning in sparse adversarial attacks. It was presented at IJCNN 2024. The publisher page contains the full abstract and paper.',
    imageAlt: '', imageCaption: 'A dedicated cover is pending. The index uses a typographic placeholder.',
    paper: 'https://ieeexplore.ieee.org/abstract/document/10650867',
    bibtex: '@inproceedings{li2024sparse,\n  title={Sparse Attack with Meta-Learning},\n  author={Li, Weitao and Lin, Mingqian and Meng, Yihan and Si, Yangdai and Shang, Lin},\n  booktitle={International Joint Conference on Neural Networks},\n  year={2024},\n  url={https://ieeexplore.ieee.org/document/10650867}\n}',
  },
];
export const projects = [{
  slug: 'epub-toolkit', title: 'EPUB Toolkit', category: 'Open-source software', year: 2026,
  summary: 'A small workspace for the books you want to keep together.',
  description: 'Merge EPUB volumes, recover individual books, and inspect their contents. Files are processed on your device. The web application supports English and Chinese, offline use, and light and dark themes.',
  image: '/images/epub-workspace.webp', imageAlt: 'Actual EPUB Toolkit interface with book queue, output settings, table of contents preview, and download.',
  gallery: ['/images/epub-workspace.webp', '/images/epub-empty.webp'],
  repo: 'https://github.com/yumizhi/lightweight_epub_merge_tool',
  demo: 'https://yumizhi.github.io/lightweight_epub_merge_tool/',
  release: 'https://github.com/yumizhi/lightweight_epub_merge_tool/releases',
  features: ['Merge volumes with a rebuilt table of contents.', 'Split a previously merged collection back into books.', 'Inspect metadata, chapters, and archive contents.', 'Use the web app offline, or run a Python or Node CLI.'],
  technology: 'TypeScript, React, Vite, Motion, Python, and local EPUB processing.',
}];
export type Resource = { id: string; title: string; type: 'Paper'|'CV'|'Slides'|'Poster'; year: number; file: string; preview: string; size: string; description: string };
export const resources: Resource[] = [
  {id:'tide',title:'TIDE — NeurIPS 2026',type:'Paper',year:2026,file:'/files/tide-neurips-2026.pdf',preview:'/images/tide-page.webp',size:'3.5 MB',description:'Camera-ready paper · 26 pages'},
  {id:'cv',title:'Yihan Meng — Curriculum Vitae',type:'CV',year:2026,file:'/files/yihan-meng-cv.pdf',preview:'/images/cv-page.webp',size:'PDF',description:'Education, publications, experience, and contact'},
];
export const education = [
  {period:'2023 — Present',title:'Ph.D. in Computer Science and Technology',institution:'Nanjing University',detail:'Advised by Associate Professor Lin Shang.'},
  {period:'2019 — 2023',title:'B.S. in Computer Science and Technology',institution:'Nanjing University',detail:'Department of Computer Science and Technology.'},
];
export const experience = [{period:'2025 — Present',title:'Research Intern',institution:'Guodian Nanjing Automation Co., Ltd.',detail:'Nanjing, China. Enterprise joint training.'}];
export const awards = [{year:'2025',title:'Outstanding Graduate Student'},{year:'2023',title:"President’s Scholarship"},{year:'2022',title:"People’s Scholarship"}];
