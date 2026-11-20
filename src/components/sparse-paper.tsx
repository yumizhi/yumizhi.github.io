import type { Paper } from '@/lib/content';
import { asset } from '@/lib/paths';
import { Localized } from './language';
import { PaperArticle } from './paper-article';
import { SparseResults } from './sparse-results';
import { SamMethod } from './paper-figures/sam-method';
import { SasboEvidence } from './paper-figures/sasbo-evidence';
import { SasboArm } from './paper-figures/sasbo-arm';
import { EssayProse } from './paper-figures/essay-prose';
import { sasboChapters, samChapters } from './paper-figures/essay-chapters';
import { sasboEvidence, samEvidence } from './paper-figures/essay-evidence';

const studies = {
  sasbo:{
    notes:['','','*'],
    affiliations:['State Key Laboratory for Novel Software Technology, Department of Computer Science and Technology, Nanjing University'],
    breaks:/ (?=In this paper,|Once the perturbed coordinates )/,
    method:{en:'Choosing where to perturb an image',zh:'稀疏攻击中的坐标选择'},
    problem:{en:'Once a location is chosen, the gradient proposes a direction for changing its value. Replacing that location with another changes the set of allowed coordinates. SASBO assigns a separate variable to each decision, which lets the search revisit where to act as well as how much to change.',
      zh:'一个位置选定后，梯度可以告诉我们往哪个方向调整它的值。若想换到另一个位置，变的就是整组允许改动的坐标。SASBO 用两类变量分别表示位置和幅度，让两者在搜索中都可以重新调整。'},
    discussion:{en:'Tighter amplitude limits spread the changes',zh:'幅度收紧，扰动分散到更多位置'},
    discussionText:{en:'The CIFAR-10 results put the two budgets in perspective. Tightening the amplitude cap from 255 to 10 leaves untargeted success at 100%, but raises SASBO’s mean ℓ₀ from 3.95 to 144.21. Under the tighter cap, the successful changes are spread across more coordinates. The reported sparsity therefore needs to be read alongside the permitted change at each coordinate.',
      zh:'CIFAR-10 的结果显示了两种约束怎样相互影响。把幅度上限从 255 收紧到 10，SASBO 的非定向攻击成功率仍为 100%，平均 ℓ₀ 却由 3.95 升至 144.21。单点能改动的幅度越小，要达到同样的成功率，就需要动用更多坐标。'},
    scope:{en:'The method assumes white-box access to the attacked classifier. Its coordinate search is evaluated on CIFAR-10 and ImageNet; the paper does not establish transferability to unseen classifiers or a running-time advantage. The related SAM study examines the separate problem of transfer across models.',
      zh:'方法需要访问被攻击分类器的输出与梯度。论文在 CIFAR-10 与 ImageNet 上评估坐标优化，没有据此建立对未知模型的迁移能力或运行速度优势。相关工作 SAM 进一步研究的是跨模型迁移这一问题。'},
    result:{en:'Sparsity at the same attack success rate',zh:'相同成功率下的扰动数量'},
    interpretation:{en:'These experiments hold the dataset, attack objective and magnitude allowance fixed. Since every method succeeds, mean ℓ₀ measures the remaining difference: how many perturbation entries are nonzero. Targeted attacks require a prescribed class; untargeted attacks accept any incorrect class.',
      zh:'实验固定数据集、攻击目标与幅度限制。各方法均能成功时，平均 ℓ₀ 用于比较扰动中非零元素的数量。定向攻击要求分类结果变为指定类别；非定向攻击只要求出现错误分类。'},
    resultContext:{en:'This setup makes the outcome interesting even when the success column is identical. In the untargeted CIFAR-10 comparison at the same amplitude limit, GreedyFool reaches the same success rate with a mean of 12.29 nonzero entries, and SASBO uses 3.95. In the targeted setting, both counts rise. A fixed destination class limits the choices of successful changes, which gives the coordinate search a harder job.',
      zh:'成功率相同也能看出差别。相同幅度限制下，CIFAR-10 的非定向实验里，GreedyFool 平均改动 12.29 个非零元素，SASBO 平均为 3.95。切到定向实验，两者的改动数量都上升了。指定了目标类别之后，能够让分类器走到那个结果的改动组合更受限，坐标搜索也就更难。'},
  },
  sam:{
    notes:['1','1','1','2','1'],
    affiliations:['Department of Computer Science and Technology, Nanjing University','Huazhong University of Science and Technology'],
    breaks:/ (?=SAM leverages|Experimental evaluations )/,
    method:{en:'Learning a perturbation that transfers',zh:'让稀疏扰动迁移到未知模型'},
    problem:{en:'The support models see the same image. SAM averages their gradients with weights to get a shared update direction. A held-out query model then evaluates the image after those updates and supplies feedback for the next round.',
      zh:'支持集里的模型各自看到同一张输入图像。SAM 将它们的梯度加权平均，得到用于这组模型的更新方向。支持集更新结束后，留出的查询模型再评价这张图，并提供下一轮更新所需的反馈。'},
    discussion:{en:'The gains appear on unseen models',zh:'收益出现在未见过的模型上'},
    discussionText:{en:'The ablation shows where the cross-model feedback helps. SA, which uses only VGG19 and the same sparsification procedure, reaches 91.8% on VGG19 with a 50-pixel budget. SAM reaches 89.9% there and surpasses SA on all six held-out target models. Changing the evaluation model reverses the comparison.',
      zh:'消融实验显示了跨模型反馈的收益在哪里。SA 只用 VGG19，沿用相同的稀疏化过程。在 50 像素预算下，SA 在 VGG19 上的成功率为 91.8%，SAM 为 89.9%。换到独立评估的六个目标模型，SAM 的成功率都更高。'},
    scope:{en:'SAM requires several accessible surrogate classifiers. The pixel budget is specified in advance, and the paper evaluates untargeted attacks on standard classifiers. It does not search for the minimum pixel count separately for each image or report the additional runtime of the sampled-model updates.',
      zh:'SAM 需要多个可访问的替代分类器，并预先指定像素预算。论文评估的是标准分类器上的非定向攻击，没有逐图搜索最少像素数量，也没有报告多模型任务更新带来的额外运行时间。'},
    result:{en:'Transfer to unseen classifiers',zh:'未参与优化的模型上的攻击成功率'},
    interpretation:{en:'The two settings expose the trade-off between location count and change size. A 50-pixel attack permits large individual changes; the 300-pixel setting allows more locations but caps the magnitude at 16. In both cases the relevant score is success on models outside the surrogate pool, rather than success on the models that supplied the optimization gradients.',
      zh:'这两组设置体现了位置数量与改动幅度之间的取舍。50 像素设置允许较大的单点变化；300 像素设置允许动更多位置，但将幅度限制为 16。两者关注的都是替代模型池之外的攻击成功率，而不是提供优化梯度的那些模型上的表现。'},
    resultContext:{en:'The ablation changes the source of feedback while keeping the pixel and amplitude budgets matched. The stricter amplitude setting makes the effect easy to see. The VGG19-only baseline is stronger on its own source model, but several of the independent targets see much lower success with those same images. With cross-model feedback, even the weaker transfer results in this six-model panel improve over the corresponding single-model results.',
      zh:'消融实验匹配了位置数量与幅度限制，改变的是反馈来自哪里。幅度约束较紧的那组尤其明显。只使用 VGG19 的基线在它自己身上更强，但把同一批图交给独立模型后，几个模型上的成功率明显下降。引入跨模型反馈之后，即使在这六个目标中相对难迁移的模型上，结果也比对应的单模型实验更高。'},
  },
};

export function SparsePaper({paper}:{paper:Paper}){
  const id=paper.slug==='sasbo'?'sasbo':'sam';
  const study=studies[id];
  const evidence = id === 'sasbo' ? sasboEvidence : samEvidence;
  return <PaperArticle paper={paper} authorNotes={study.notes} affiliations={study.affiliations}
    abstractBreaks={study.breaks} overviewFigure={id==='sasbo' && paper.image && <SasboEvidence original={paper.image}/>}>
    <section id="method" className="tide-method-band"><div className="tide-bound">
      <header className="tide-chapter-head">
        <h2><Localized {...study.method}/></h2></header>
      <p className="tide-prose"><Localized {...study.problem}/></p>
      {id==='sasbo' ? <>
        <EssayProse chapters={sasboChapters.slice(0, 1)}/>
        <SasboArm/>
        <p className="tide-prose"><Localized
          en="For a coordinate with selection probability p, the same uniform draw u enters both masks. The lower mask selects it when u is below p. The upper mask selects it when u is above 1 − p. Each mask has the same marginal selection probability. They are coupled because both tests use the same draw."
          zh="设一个坐标的选择概率为 p，两张掩码都使用同一个均匀随机样本 u。低端掩码在 u 小于 p 时选中它，高端掩码在 u 大于 1 − p 时选中它。单看任何一张掩码，选中该坐标的概率都是 p。两张掩码使用的是同一份随机样本，因此它们的选择是相关的。"/></p>
        <p className="tide-prose"><Localized
          en="During this estimate, the magnitudes stay fixed. The classifier is evaluated on each masked image, yielding two loss values. Their difference, weighted by each centered draw, estimates how the expected loss changes with the selection logit. This part uses forward loss evaluations. The overall method also uses classifier gradients when it subsequently optimizes the magnitudes."
          zh="这次估计里，扰动幅度先保持固定。分类器分别计算两张掩码图的损失。把两次损失之差乘以各坐标居中后的随机样本，就能估计改变坐标选择参数会怎样影响期望损失。这里用的是前向损失值。完整方法在后续优化扰动幅度时还会用到分类器的梯度。"/></p>
        <EssayProse chapters={sasboChapters.slice(1)}/>
      </> : <>
        <EssayProse chapters={samChapters.slice(0, 2)}/>
        <SamMethod original={paper.image}/>
        <EssayProse chapters={samChapters.slice(2)}/>
      </>}
    </div></section>
    <section id="examples" className="tide-results tide-bound">
      <header className="tide-chapter-head">
        <h2><Localized {...study.result}/></h2></header>
      <p className="tide-prose"><Localized {...study.interpretation}/></p>
      {id==='sasbo' ? <SparseResults/> : <p className="tide-prose">
        <Localized en="At the 50-pixel budget, average success on the six held-out classifiers rises from 68.4% with SA to 85.5% with SAM." zh="在 50 像素预算下，六个独立分类器的平均成功率从单模型 SA 的 68.4% 升到 SAM 的 85.5%。"/>{' '}
        <a href={asset(paper.paper)} target="_blank" rel="noreferrer"><Localized en="Table VI in the paper" zh="论文表 VI"/></a>
      </p>}
      <p className="tide-prose tide-demo-intro"><Localized {...study.resultContext}/></p>
      <EssayProse chapters={evidence}/>
    </section>
    <section id="discussion" className="tide-results tide-bound">
      <header className="tide-chapter-head">
        <h2><Localized {...study.discussion}/></h2></header>
      <p className="tide-prose"><Localized {...study.discussionText}/></p>
      <p className="tide-prose"><Localized {...study.scope}/></p>
    </section>
  </PaperArticle>;
}
