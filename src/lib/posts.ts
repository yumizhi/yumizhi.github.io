export type WritingEntry = {slug:string; title:string; description:string; category:string; href:string; date?:string; external?:boolean; language:'en'|'zh'};
export function getWritingEntries(): WritingEntry[] {
  return [{
    slug:'understand-diffusion-model',
    title:'Diffusion Model的直观理解、数学原理和代码实现',
    description:'从图像的概率分布出发，理解扩散模型如何学习与生成图像。',
    category:'Research notes',
    href:'https://lappland-saluzzo.notion.site/understand-diffusion-model',
    external:true,
    language:'zh',
  }];
}
