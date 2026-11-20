export type WritingEntry = {slug:string; title:string; description:string; category:string; href:string; date?:string; external?:boolean; language:'en'|'zh'};
export function getWritingEntries(): WritingEntry[] {
  return [{
    slug:'understand-diffusion-model',
    title:'Diffusion Model的直观理解、数学原理和代码实现',
    description:'从图像概率分布出发，梳理扩散模型的加噪与去噪过程，并结合数学推导和代码说明生成过程。',
    category:'Research notes',
    href:'https://lappland-saluzzo.notion.site/understand-diffusion-model',
    external:true,
    language:'zh',
  }];
}
