import type { Paper } from '@/lib/content';
import { ArrowUpRight } from 'lucide-react';
import { asset } from '@/lib/paths';
import { Localized } from './language';
import { PaperArticle } from './paper-article';
import { SparseResults } from './sparse-results';
import { SparseMethodComparison } from './sparse-method-comparison';

const studies = {
  sasbo:{
    notes:['','','*'],
    affiliations:['State Key Laboratory for Novel Software Technology, Department of Computer Science and Technology, Nanjing University'],
    breaks:/ (?=In this paper,|Once the perturbed coordinates )/,
    method:{en:'Choosing where to perturb an image',zh:'稀疏攻击中的坐标选择'},
    problem:{en:'A small change and a sparse change are different constraints. An attack can alter almost every pixel by a tiny amount, or change only a few locations more substantially. In the sparse case, choosing those locations is a discrete search problem: a pixel is either selected or left untouched. Ordinary gradient descent does not directly optimize that decision.',
      zh:'改动很小与改动很少，是两种不同的约束。前者可以在几乎所有像素上施加微小扰动，后者则要求只动极少的位置。稀疏攻击的难点因此落在位置选择上：一个像素要么被选中，要么不变，这是一个无法直接用普通梯度下降处理的离散搜索问题。'},
    mechanism:{en:'Separate the location from the magnitude',zh:'把改动位置与改动幅度分开'},
    insight:{en:'ARM estimates the gradient of the expected attack objective with respect to the Bernoulli parameters. SASBO ranks the resulting probabilities and selects coordinates using a threshold set by the sparsity budget. It alternates these discrete selections with continuous magnitude updates.',
      zh:'ARM 估计期望攻击目标相对于伯努利参数的梯度。SASBO 对更新后的概率排序，按稀疏预算确定阈值，选出离散坐标，再与连续的幅度更新交替进行。'},
    lead:{en:'A sparse attack has two choices to make at each pixel: whether to change it and by how much. SASBO models the first choice as a Bernoulli variable and uses an ARM gradient estimate to learn its probability. With the coordinates fixed, gradient descent then adjusts the perturbation magnitudes.',
      zh:'每个像素都有两个选择：改不改，以及改多少。SASBO 用一个二值随机变量表示前者，通过 ARM 梯度估计学习它被选中的概率。位置确定后，再用梯度下降调整这些位置上的扰动幅度。'},
    detail:{en:'The final binary search reduces the coordinate budget while checking attack success. In the original paper figure above, black regions remain unchanged and colored points identify perturbed channels.',
      zh:'最后通过二分搜索缩减坐标预算，并检查攻击是否仍然成功。上方原论文图中，坐标图的黑色区域保持不变，彩色点表示受到扰动的颜色通道。'},
    optimization:{en:'Turning probabilities into a sparse attack',zh:'从概率得到稀疏扰动'},
    optimizationText:{en:'The probability model makes coordinate learning possible, but the attack still needs a concrete set of coordinates. SASBO sorts the probabilities and applies a threshold determined by the current budget. Magnitudes are then optimized at the selected coordinates, subject to the amplitude limit. Alternating these updates lets the method revisit the selection as the perturbation changes.',
      zh:'概率模型让坐标选择可以学习，但实际攻击仍需要一组确定的位置。SASBO 对概率排序，依据当前预算设置阈值；再在选中的坐标上优化幅度，并限制每次改动的大小。交替更新使位置选择能够随扰动变化重新调整。'},
    discussion:{en:'What sparsity tells us',zh:'稀疏性说明了什么'},
    discussionText:{en:'The comparison separates two requirements: reaching an adversarial class and doing so with fewer altered entries. It does not make magnitude irrelevant. With ε reduced from 255 to 10 on CIFAR-10, SASBO’s mean ℓ₀ for untargeted attacks rises from 3.95 to 144.21, while success remains 100%. A sparse result should therefore be read together with its amplitude constraint.',
      zh:'这组对比分开了两个要求：让分类器出错，以及用更少的非零扰动做到这一点。幅度限制仍然重要。在 CIFAR-10 的非定向攻击中，将 ε 从 255 收紧到 10 后，SASBO 的平均 ℓ₀ 从 3.95 增至 144.21，成功率仍为 100%。因此，阅读稀疏性结果时需要同时看幅度约束。'},
    scope:{en:'The method assumes white-box access to the attacked classifier. Its coordinate search is evaluated on CIFAR-10 and ImageNet; the paper does not establish transferability to unseen classifiers or a running-time advantage. The related SAM study examines the separate problem of transfer across models.',
      zh:'方法需要访问被攻击分类器的输出与梯度。论文在 CIFAR-10 与 ImageNet 上评估坐标优化，没有据此建立对未知模型的迁移能力或运行速度优势。相关工作 SAM 进一步研究的是跨模型迁移这一问题。'},
    result:{en:'Sparsity at the same attack success rate',zh:'相同成功率下的扰动数量'},
    interpretation:{en:'These experiments hold the dataset, attack objective and magnitude allowance fixed. Since every method succeeds, mean ℓ₀ measures the remaining difference: how many perturbation entries are nonzero. Targeted attacks require a prescribed class; untargeted attacks accept any incorrect class.',
      zh:'实验固定数据集、攻击目标与幅度限制。各方法均能成功时，平均 ℓ₀ 用于比较扰动中非零元素的数量。定向攻击要求分类结果变为指定类别；非定向攻击只要求出现错误分类。'},
  },
  sam:{
    notes:['1','1','1','2','1'],
    affiliations:['Department of Computer Science and Technology, Nanjing University','Huazhong University of Science and Technology'],
    breaks:/ (?=SAM leverages|Experimental evaluations )/,
    method:{en:'Learning a perturbation that transfers',zh:'让稀疏扰动迁移到未知模型'},
    problem:{en:'A white-box attack can follow a classifier’s gradients directly. A transfer attack has a harder requirement: the resulting image must also fool a model whose gradients were never available. With only a few pixels to change, concentrating all the optimization on one surrogate can waste that limited budget on its particular weaknesses.',
      zh:'白盒攻击可以直接沿分类器的梯度寻找扰动。迁移攻击多了一层要求：生成的图像还要让无法获取梯度的模型出错。当只能修改少量像素时，如果始终围绕单一替代模型优化，有限的预算就可能集中在该模型特有的弱点上。'},
    mechanism:{en:'Cross-model feedback during optimization',zh:'在优化中引入跨模型反馈'},
    insight:{en:'The support and query roles change as tasks are sampled. The held-out query model is still a known surrogate, so its gradient can inform the meta-update; it simulates transfer within the optimization process. The truly unseen target models are reserved for the final evaluation. What is optimized here is the adversarial input, not a newly trained classifier.',
      zh:'随着任务重新采样，模型轮流承担支持与查询角色。查询模型仍是已知替代模型，可以用它的梯度完成元更新；它的作用是在优化内部模拟迁移。真正未知的目标模型只用于最终评估。这里优化的是对抗输入，而不是重新训练一个分类器。'},
    lead:{en:'A perturbation tuned to one classifier can lose its effect on another. SAM repeatedly samples a task from a pool of surrogate models, combines the support models’ gradients, then tests the update on a model held out from that support set. The figure illustrates the meta-training and meta-testing idea behind this design.',
      zh:'针对一个分类器优化的扰动，换个模型就可能失效。SAM 从替代模型池中反复抽取任务，先综合支持模型的梯度来更新扰动，再用这一轮留出的模型检验更新方向。下图展示了这种做法借用的元训练与元测试思想。'},
    detail:{en:'After an update, the perturbation is projected back into the pixel and magnitude budgets. The projection retains the pixels that would incur the largest error if removed. The black-box targets used for evaluation sit outside the surrogate pool.',
      zh:'每次更新后，算法将扰动投影回像素数量和幅度约束内，优先保留删除后会带来最大投影误差的位置。最终评估迁移能力的黑盒模型独立于替代模型池。'},
    optimization:{en:'Keeping the pixel budget through every task',zh:'在每个任务后满足像素预算'},
    optimizationText:{en:'The support updates and query feedback first produce a dense adversarial input. Projection clips each channel to the allowed magnitude, then scores a pixel by how much of that dense change it would retain. Only the highest-scoring k pixels keep their clipped values; all remaining pixels return to the original image. This projected input becomes the starting point of the next sampled task.',
      zh:'支持集更新与查询反馈先得到一个稠密对抗输入。投影把每个通道裁剪到允许的幅度，再根据保留一个像素能够还原多少稠密改动来打分。只有得分最高的 k 个像素保留裁剪后的值，其余位置恢复原图；得到的稀疏输入继续参与下一个采样任务。'},
    discussion:{en:'Fitting one model versus transferring to others',zh:'单模型拟合与跨模型迁移'},
    discussionText:{en:'The ablation keeps the gradient attack and sparsification procedure, but removes meta-training and meta-testing. Its SA baseline uses VGG19 alone. At the 50-pixel budget, SA is slightly stronger on VGG19 itself (91.8% versus 89.9%), while SAM is stronger on all six unseen targets. The gain is in transfer, rather than a higher score on the model that supplied the gradients.',
      zh:'消融实验保留梯度攻击与稀疏化过程，移除元训练和元测试，得到只使用 VGG19 的 SA 基线。50 像素预算下，SA 在 VGG19 本身略高（91.8% 对 89.9%），SAM 则在六个未知目标模型上都更高。这里的收益体现在迁移能力，而不是提供梯度的模型上的攻击分数。'},
    scope:{en:'SAM requires several accessible surrogate classifiers. The pixel budget is specified in advance, and the paper evaluates untargeted attacks on standard classifiers. It does not search for the minimum pixel count separately for each image or report the additional runtime of the sampled-model updates.',
      zh:'SAM 需要多个可访问的替代分类器，并预先指定像素预算。论文评估的是标准分类器上的非定向攻击，没有逐图搜索最少像素数量，也没有报告多模型任务更新带来的额外运行时间。'},
    result:{en:'Transfer to unseen classifiers',zh:'未参与优化的模型上的攻击成功率'},
    interpretation:{en:'The two settings expose the trade-off between location count and change size. A 50-pixel attack permits large individual changes; the 300-pixel setting allows more locations but caps the magnitude at 16. In both cases the relevant score is success on models outside the surrogate pool, rather than success on the models that supplied the optimization gradients.',
      zh:'这两组设置体现了位置数量与改动幅度之间的取舍。50 像素设置允许较大的单点变化；300 像素设置允许动更多位置，但将幅度限制为 16。两者关注的都是替代模型池之外的攻击成功率，而不是提供优化梯度的那些模型上的表现。'},
  },
};

export function SparsePaper({paper}:{paper:Paper}){
  const id=paper.slug==='sasbo'?'sasbo':'sam';
  const study=studies[id];
  return <PaperArticle paper={paper} authorNotes={study.notes} affiliations={study.affiliations} abstractBreaks={study.breaks}>
    <section id="method" className="tide-method-band"><div className="tide-bound">
      <header className="tide-chapter-head"><p className="tide-kicker"><Localized en="Method" zh="研究方法"/></p>
        <h2><Localized {...study.method}/></h2></header>
      <p className="tide-prose"><Localized {...study.problem}/></p>
      <h3 className="paper-subsection"><Localized {...study.mechanism}/></h3>
      <p className="tide-prose"><Localized {...study.lead}/></p>
      {paper.image&&<figure className="tide-overview sparse-figure">
        <img loading="lazy" width={paper.imageWidth} height={paper.imageHeight} src={asset(paper.image)} alt={paper.imageAlt}/>
        <figcaption>
          <span lang="en">{paper.imageCaption}</span>
          <span className="paper-figure-actions">
            <a href={asset(paper.image)} target="_blank" rel="noreferrer"><Localized en="Open full-size figure" zh="查看完整原图" /><ArrowUpRight size={13} aria-hidden="true" /></a>
          </span>
        </figcaption>
      </figure>}
      <p className="tide-prose tide-demo-intro"><Localized {...study.insight}/></p>
      <SparseMethodComparison study={id}/>
      <p className="tide-prose tide-demo-intro"><Localized {...study.detail}/></p>
      <h3 className="paper-subsection"><Localized {...study.optimization}/></h3>
      <p className="tide-prose"><Localized {...study.optimizationText}/></p>
    </div></section>
    <section id="examples" className="tide-results tide-bound">
      <header className="tide-chapter-head"><p className="tide-kicker"><Localized en="Results" zh="实验结果"/></p>
        <h2><Localized {...study.result}/></h2></header>
      <SparseResults study={id}/>
      <p className="tide-prose tide-demo-intro"><Localized {...study.interpretation}/></p>
    </section>
    <section id="discussion" className="tide-results tide-bound">
      <header className="tide-chapter-head"><p className="tide-kicker"><Localized en="Discussion" zh="讨论"/></p>
        <h2><Localized {...study.discussion}/></h2></header>
      <p className="tide-prose"><Localized {...study.discussionText}/></p>
      <p className="tide-prose"><Localized {...study.scope}/></p>
    </section>
  </PaperArticle>;
}
