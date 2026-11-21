import type { Paper } from '@/lib/content';
import { asset } from '@/lib/paths';
import { Localized } from './language';
import { PaperArticle } from './paper-article';
import { SamTransfer } from './paper-figures/sam-transfer';
import { SasboArm } from './paper-figures/sasbo-arm';
import { SparseResults } from './sparse-results';
import { SamMethod, SamProjectionMath, SamTaskMath } from './paper-figures/sam-method';
import { SasboEvidence } from './paper-figures/sasbo-evidence';
import { SasboAmplitudeMath, SasboArmMath, SasboMaskMath } from './paper-figures/sasbo-math';
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
    interpretation:{en:'Within each comparison, the dataset, attack objective and amplitude limit are held fixed. When success rates match, mean ℓ₀ shows how many nonzero entries each method needs. A targeted attack must reach a prescribed class. An untargeted attack can reach any incorrect class.',
      zh:'实验固定数据集、攻击目标与幅度限制。各方法均能成功时，平均 ℓ₀ 用于比较扰动中非零元素的数量。定向攻击要求分类结果变为指定类别；非定向攻击只要求出现错误分类。'},
    resultContext:{en:'This setup makes the outcome interesting even when the success column is identical. In the untargeted CIFAR-10 comparison at the same amplitude limit, GreedyFool reaches the same success rate with a mean of 12.29 nonzero entries, and SASBO uses 3.95. In the targeted setting, both counts rise. A fixed destination class limits the choices of successful changes, which gives the coordinate search a harder job.',
      zh:'成功率相同也能看出差别。相同幅度限制下，CIFAR-10 的非定向实验里，GreedyFool 平均改动 12.29 个非零元素，SASBO 平均为 3.95。切到定向实验，两者的改动数量都上升了。指定了目标类别之后，能够让分类器走到那个结果的改动组合更受限，坐标搜索也就更难。'},
  },
  sam:{
    notes:['1','1','1','2','1'],
    affiliations:['Department of Computer Science and Technology, Nanjing University','Huazhong University of Science and Technology'],
    breaks:/ (?=SAM leverages|Experimental evaluations )/,
    method:{en:'Learning a perturbation that transfers',zh:'让稀疏扰动迁移到未知模型'},
    discussion:{en:'Scope of the evaluation',zh:'评估范围'},
    discussionText:{en:'The ablation shows where the cross-model feedback helps. SA, which uses only VGG19 and the same sparsification procedure, reaches 91.8% on VGG19 with a 50-pixel budget. SAM reaches 89.9% there and surpasses SA on all six held-out target models. Changing the evaluation model reverses the comparison.',
      zh:'消融实验显示了跨模型反馈的收益在哪里。SA 只用 VGG19，沿用相同的稀疏化过程。在 50 像素预算下，SA 在 VGG19 上的成功率为 91.8%，SAM 为 89.9%。换到独立评估的六个目标模型，SAM 的成功率都更高。'},
    scope:{en:'SAM requires several accessible surrogate classifiers. The pixel budget is specified in advance, and the paper evaluates untargeted attacks on standard classifiers. It does not search for the minimum pixel count separately for each image or report the additional runtime of the sampled-model updates.',
      zh:'SAM 需要多个可访问的替代分类器，并预先指定像素预算。论文评估的是标准分类器上的非定向攻击，没有逐图搜索最少像素数量，也没有报告多模型任务更新带来的额外运行时间。'},
    result:{en:'Transfer to unseen classifiers',zh:'未参与优化的模型上的攻击成功率'},
    interpretation:{en:'The experiment pairs a 50-pixel budget with a looser amplitude limit. The 300-pixel setting allows more locations and caps the amplitude at 16. For each budget, transfer is measured on classifiers outside the surrogate pool.',
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
      {id==='sasbo' ? <>
        <p className="tide-prose"><Localized {...studies.sasbo.problem}/></p>
        <p className="tide-prose"><Localized en="The two decisions have different lifetimes. A location can look promising in an early estimate and become redundant once other coordinates change. SASBO alternates the location and magnitude estimates, then tests smaller subsets of the resulting support. The count reported in the results belongs to that final subset." zh="两种决定会互相影响。某处坐标在早期看来重要，等其他位置也发生改变，它可能已经多余。SASBO 交替估计位置与幅度，再检查较小的坐标子集。实验最后报告的计数来自仍能维持改判的子集。" /></p>
        <SasboArm/>
        <details className="study-notes"><summary><Localized en="Binary masks, paired evaluations and pruning" zh="深入阅读 · 二元掩码、配对估计与冗余坐标" /></summary>
          <SasboMaskMath/><EssayProse chapters={sasboChapters.slice(0, 1)}/><SasboArmMath/><EssayProse chapters={sasboChapters.slice(1)}/><SasboAmplitudeMath/>
        </details>
      </> : <>
        <p className="tide-prose"><Localized en="The experiment gives the same sparse image two audiences. Accessible models take turns in support and query roles while the perturbation is being learned. After that process ends, six separate classifiers evaluate the resulting images. Their errors provide the transfer evidence." zh="论文把模型分成两个层次。优化期间，可访问的模型轮流进入支持组和查询组，帮助选择能够跨模型保留作用的改动。优化结束后，另外六个分类器只负责测试，论文以它们的错误分类衡量迁移能力。" /></p>
        <SamMethod/>
        <details className="study-notes"><summary><Localized en="Support and query objectives and the pixel budget" zh="深入阅读 · 支持与查询目标及像素预算" /></summary>
          <EssayProse chapters={samChapters.slice(0, 1)}/><SamTaskMath/><SamProjectionMath/><EssayProse chapters={samChapters.slice(1)}/>
        </details>
      </>}
    </div></section>
    <section id="examples" className="tide-results tide-bound">
      <header className="tide-chapter-head">
        <h2><Localized {...study.result}/></h2></header>
      <p className="tide-prose"><Localized {...study.interpretation}/></p>
      {id === 'sasbo' ? <p className="tide-prose"><Localized en="The paper evaluates a Network in Network classifier on 5,000 CIFAR-10 test images and VGG19 on 2,000 ImageNet validation images. Targeted comparisons use the same randomly chosen destination label for all methods on each image." zh="实验在 5,000 张 CIFAR-10 测试图上评估 Network in Network 分类器，在 2,000 张 ImageNet 验证图上评估 VGG19。定向实验对每张图随机指定一个目标类别，所有比较方法沿用同一目标。" /></p> : <SamTransfer/>}
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
