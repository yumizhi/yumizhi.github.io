import type { Paper } from '@/lib/content';
import { asset } from '@/lib/paths';
import { Localized } from './language';
import { PaperArticle } from './paper-article';
import { SparseResults } from './sparse-results';

const studies = {
  sasbo:{
    notes:['','','*'],
    affiliations:['State Key Laboratory for Novel Software Technology, Department of Computer Science and Technology, Nanjing University'],
    breaks:/ (?=In this paper,|Once the perturbed coordinates )/,
    method:{en:'Choosing where to perturb an image',zh:'哪些像素值得修改？'},
    lead:{en:'A sparse attack has two choices to make at each pixel: whether to change it and by how much. SASBO models the first choice as a Bernoulli variable and uses an ARM gradient estimate to learn its probability. With the coordinates fixed, gradient descent then adjusts the perturbation magnitudes.',
      zh:'每个像素都有两个选择：改不改，以及改多少。SASBO 用一个二值随机变量表示前者，通过 ARM 梯度估计学习它被选中的概率。位置确定后，再用梯度下降调整这些位置上的扰动幅度。'},
    detail:{en:'A final binary search tests how many locations can be removed while the attack still succeeds. In the figure, black regions in the coordinate maps stay untouched. Colored points identify the channels that changed.',
      zh:'最后通过二分搜索逐步删去多余位置，直到再删就无法维持攻击。图中坐标图的黑色区域没有改动，彩色点标出发生变化的颜色通道。'},
    result:{en:'Sparsity at the same attack success rate',zh:'同样的成功率，需要改动多少？'},
  },
  sam:{
    notes:['1','1','1','2','1'],
    affiliations:['Department of Computer Science and Technology, Nanjing University','Huazhong University of Science and Technology'],
    breaks:/ (?=SAM leverages|Experimental evaluations )/,
    method:{en:'Learning a perturbation that transfers',zh:'让稀疏扰动迁移到未知模型'},
    lead:{en:'A perturbation tuned to one classifier can lose its effect on another. SAM repeatedly samples a task from a pool of surrogate models, combines the support models’ gradients, then tests the update on a model held out from that support set. The figure illustrates the meta-training and meta-testing idea behind this design.',
      zh:'针对一个分类器优化的扰动，换个模型就可能失效。SAM 从替代模型池中反复抽取任务，先综合支持模型的梯度来更新扰动，再用这一轮留出的模型检验更新方向。下图展示了这种做法借用的元训练与元测试思想。'},
    detail:{en:'After an update, the perturbation is projected back into the pixel and magnitude budgets. The projection retains the pixels that would incur the largest error if removed. The black-box targets used for evaluation sit outside the surrogate pool.',
      zh:'每次更新后，算法将扰动投影回像素数量和幅度约束内，优先保留删除后会带来最大投影误差的位置。最终评估迁移能力的黑盒模型独立于替代模型池。'},
    result:{en:'Transfer to unseen classifiers',zh:'在未参与优化的模型上，攻击还能成功吗？'},
  },
};

export function SparsePaper({paper}:{paper:Paper}){
  const id=paper.slug==='sasbo'?'sasbo':'sam';
  const study=studies[id];
  return <PaperArticle paper={paper} authorNotes={study.notes} affiliations={study.affiliations} abstractBreaks={study.breaks}>
    <section id="method" className="tide-method-band"><div className="tide-bound">
      <header className="tide-chapter-head"><p className="tide-kicker"><Localized en="Method" zh="研究方法"/></p>
        <h2><Localized {...study.method}/></h2></header>
      <p className="tide-prose"><Localized {...study.lead}/></p>
      {paper.image&&<figure className="tide-overview sparse-figure">
        <a href={asset(paper.image)} target="_blank" rel="noreferrer"><img loading="lazy" width={paper.imageWidth} height={paper.imageHeight}
          src={asset(paper.image)} alt={paper.imageAlt}/></a>
        <figcaption lang="en">{paper.imageCaption}</figcaption>
      </figure>}
      <p className="tide-prose tide-demo-intro"><Localized {...study.detail}/></p>
    </div></section>
    <section id="examples" className="tide-results tide-bound">
      <header className="tide-chapter-head"><p className="tide-kicker"><Localized en="Results" zh="实验结果"/></p>
        <h2><Localized {...study.result}/></h2></header>
      <SparseResults study={id}/>
    </section>
  </PaperArticle>;
}
