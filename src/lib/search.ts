import { papers, projects } from './content';
export type SearchItem={title:string;kind:string;href:string;keywords:string};
export const coreSearch:SearchItem[]=[
  ...papers.map(p=>({title:p.title,kind:'Research',href:`/research/${p.slug}/`,keywords:`${p.shortTitle} ${p.venue} ${p.year} ${p.topic}`})),
  ...projects.map(p=>({title:p.title,kind:'Projects',href:`/projects/${p.slug}/`,keywords:p.description})),
  {title:'Curriculum Vitae',kind:'About',href:'/cv/',keywords:'education experience resume 蒙一涵'},
  {title:'Papers, slides, and documents',kind:'Resources',href:'/resources/',keywords:'PDF poster CV download'},
];
