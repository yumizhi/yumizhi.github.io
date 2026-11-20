import type { Paper } from '@/lib/content';
import { ArrowUpRight } from 'lucide-react';
import { asset } from '@/lib/paths';
import { Localized } from './language';
import { PaperArticle } from './paper-article';
import { SparseResults } from './sparse-results';
import { SparseMethodComparison } from './sparse-method-comparison';
import { SamHandoffFigure, SparseMaskFigure } from './paper-figures/sparse-mechanisms';

const studies = {
  sasbo:{
    notes:['','','*'],
    affiliations:['State Key Laboratory for Novel Software Technology, Department of Computer Science and Technology, Nanjing University'],
    breaks:/ (?=In this paper,|Once the perturbed coordinates )/,
    method:{en:'Choosing where to perturb an image',zh:'稀疏攻击中的坐标选择'},
    problem:{en:'Once a location is chosen, a gradient can tell us which way to change its value. Replacing that location with another changes the set of coordinates the attack is allowed to use. SASBO gives those two decisions separate variables so the search can revisit either one.',
      zh:'一个位置选定后，梯度可以告诉我们往哪个方向调整它的值。若想换到另一个位置，变的就是整组允许改动的坐标。SASBO 用两类变量分别表示位置和幅度，让两者在搜索中都可以重新调整。'},
    context:{en:'Think of the perturbation map above as a record of the decisions the optimizer had to make. Its dark background matters: every zero saves a slot in the budget. A penalty on the sum of absolute changes can reduce their total size while spreading them across many locations. The count of nonzero coordinates asks for a different outcome. It gives the search a reason to commit to some locations and leave most of the image exactly as it was.',
      zh:'上面的扰动图也可以读成一张决策记录。黑底同样有意义，每一个零都省下了一个坐标名额。若只惩罚改动绝对值的总和，许多位置各改一点也能让总和变小。直接计算非零坐标的数量，得到的是另一种约束。它要求搜索把预算用在少数位置上，把图像的大部分还原成原来的值。'},
    mechanism:{en:'Separate the location from the magnitude',zh:'把改动位置与改动幅度分开'},
    insight:{en:'Each sampled mask is binary, but its expected objective varies with the selection probabilities. ARM estimates the gradient of that expectation with respect to the Bernoulli parameters. The mask can then be revised as the attack learns which coordinates are useful.',
      zh:'每次采样得到的掩码都是二值的，但它的期望目标会随选择概率连续变化。ARM 估计这个期望对伯努利参数的梯度，使搜索能随着优化进展重新选择坐标。'},
    lead:{en:'Giving each coordinate a selection probability turns the mask into a distribution over possible selections. Each candidate mask can still be applied to the image and evaluated on its own.',
      zh:'给每个坐标一个被选中的概率，就能在多种位置组合之间搜索。每次抽出的掩码仍是一组确定的坐标，可以直接应用到图像上，交给分类器判断。'},
    significance:{en:'The key is that a probability is continuous even when a drawn mask is discrete. A sample tells us the loss for one set of active coordinates. The expected loss asks how that objective changes as the optimizer puts more weight on parts of the search space. ARM estimates that change from a coupled pair of masks drawn using shared randomness. It gives the probability variables a training signal from evaluations of actual binary choices.',
      zh:'掩码虽然只有开和关，产生它的概率却可以连续变化。一次采样告诉我们某组活跃坐标对应的损失。期望损失进一步刻画了概率偏向另一批候选时，目标会怎样变。ARM 用共享随机性的成对掩码估计这种变化，让分类器对实际掩码的反馈也能用来学习位置选择。'},
    optimization:{en:'Turning probabilities into a sparse attack',zh:'从概率得到稀疏扰动'},
    optimizationText:{en:'At each round SASBO ranks the probabilities and takes the highest-ranked coordinates allowed by the budget. It updates their magnitudes within the amplitude limit, then revisits the selection. A final binary search checks whether a smaller budget still produces a successful perturbation.',
      zh:'SASBO 每轮按概率排序，选出预算允许的最高排名坐标。在幅度上限内更新这些坐标的值之后，再重新选择位置。最后用二分搜索检查，换成更小的坐标预算能否仍让分类器出错。'},
    optimizationDetail:{en:'The threshold follows the budget, which is why the same absolute probability can produce different decisions on two images. A coordinate enters if its ranking places it within the current allowance. The continuous update then has a simpler job. With the mask fixed, it trades classification loss against the size of the perturbation, keeping every change inside the allowed range. The updated magnitudes give the next mask search a different starting point.',
      zh:'这里的阈值由预算决定。同样的概率，落到两张图上可能得到不同的选择，因为它在各自候选中的排名不同。掩码固定后，连续优化只需在分类损失和改动幅度之间取舍，并把每一处扰动限制在允许范围内。幅度更新完，再次选择位置时，搜索面对的就已经是另一组候选扰动。'},
    discussion:{en:'Tighter amplitude limits spread the changes',zh:'幅度收紧，扰动分散到更多位置'},
    discussionText:{en:'The CIFAR-10 results put the two budgets in perspective. Tightening the amplitude cap from 255 to 10 leaves untargeted success at 100%, but raises SASBO’s mean ℓ₀ from 3.95 to 144.21. Under the tighter cap, the successful changes are spread across more coordinates. Both quantities are needed to describe how sparse the attack actually is.',
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
    problem:{en:'The support models each see the same input. SAM takes a weighted average of their gradients to find a direction useful across that group. After the support updates, the held-out query model evaluates the resulting image and supplies a correction for the next round.',
      zh:'支持集里的模型各自看到同一张输入图像。SAM 将它们的梯度加权平均，得到用于这组模型的更新方向。支持集更新结束后，留出的查询模型再评价这张图，并提供下一轮更新所需的反馈。'},
    context:{en:'The two sparse attack papers place the budget in different parts of the problem. In SASBO, location selection is itself the search problem. Here the first concern is transfer. A gradient from one classifier can strongly favor a change that exposes a feature of that classifier alone. In SAM, several accessible models share responsibility for proposing the change, and a separate member of the pool gets to assess the proposed image in each task.',
      zh:'两篇稀疏攻击论文对预算的用法不一样。SASBO 把选位置本身当作搜索问题。这篇先关注迁移。单个分类器的梯度可能强烈偏向某处改动，而那个改动恰好利用了它独有的特征。SAM 让多个可访问模型共同提出改动，并在每轮任务里留出另一个模型，接手评价已经更新过的图像。'},
    mechanism:{en:'Cross-model feedback during optimization',zh:'在优化中引入跨模型反馈'},
    insight:{en:'The query model comes from the accessible surrogate pool, so its gradients can inform the next update. The classifiers stay fixed throughout. What changes from one sampled task to the next is the perturbation and the assignment of support and query roles.',
      zh:'查询模型来自可访问的替代模型池，它的梯度也可以参与下一次更新。整个过程中分类器都保持固定。随着任务重新采样，变化的是图像扰动，以及各模型承担的角色。'},
    lead:{en:'The paper figure shows the split that motivates this design. In a meta-learning task, the support set supplies an update and the query set tests it. SAM gives those roles to classifiers and uses the query model’s feedback to refine the image perturbation.',
      zh:'下图画出了这项设计借用的元学习分工。支持集提供更新，查询集检验这次更新。SAM 将这两种角色分给不同的分类器，再用查询模型的反馈修正图像扰动。'},
    significance:{en:'The order matters. Averaging all the gradients at one point would collect several opinions of the same image. In the sampled task, the query model sees the image after the support update, so it responds to a perturbation that has already moved toward the support group. The perturbation carries over between tasks. As the roles change, the current query model can become part of the next support set.',
      zh:'反馈出现的时机很重要。若在同一个位置平均所有梯度，得到的是多个模型对同一张图的看法。在采样任务里，查询模型看到的是支持集更新之后的图像，因此能评价一组已经向着支持模型移动过的扰动。跨任务延续的是图像扰动，模型角色会重抽。这轮被留出的查询模型，在下一轮也可能进入支持集。'},
    optimization:{en:'Keeping the pixel budget through every task',zh:'在每个任务后满足像素预算'},
    optimizationText:{en:'The support updates and query feedback first produce a dense adversarial input. Projection clips each channel to the allowed magnitude, then scores a pixel by how much of that dense change it would retain. Only the highest-scoring k pixels keep their clipped values; all remaining pixels return to the original image. This projected input becomes the starting point of the next sampled task.',
      zh:'支持集更新与查询反馈先得到一个稠密对抗输入。投影把每个通道裁剪到允许的幅度，再根据保留一个像素能够还原多少稠密改动来打分。只有得分最高的 k 个像素保留裁剪后的值，其余位置恢复原图；得到的稀疏输入继续参与下一个采样任务。'},
    optimizationDetail:{en:'At each pixel, projection weighs two possibilities: restore the original RGB pixel or keep its clipped change. Keeping it saves some of the squared error to the dense proposal. That difference in error is the pixel’s score, and the budget goes to the highest scores. Applying the projection every round means the next group of models sees an image that already fits the budget, so it can adjust the sparse solution directly.',
      zh:'投影对每个像素比较两种选择：恢复成原来的 RGB 值，或者保留裁剪后的改动。后者可以减少与稠密结果之间的平方误差，少掉的误差就是这个像素的得分。有限的名额留给得分最高的位置。每轮都做投影，下一组模型接手时看到的已是一张满足预算的图像，可以在这个结果上继续调整。'},
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
  const originalFigure = paper.image && (
      <figure className="tide-overview sparse-figure">
        <img loading="lazy" width={paper.imageWidth} height={paper.imageHeight} src={asset(paper.image)} alt={paper.imageAlt}/>
        <figcaption>
          <span><strong><Localized en="Figure 1." zh="图 1。" /></strong>{' '}<Localized {...paper.imageCaption}/></span>
          <span className="paper-figure-actions">
            <a href={asset(paper.image)} target="_blank" rel="noreferrer"><Localized en="Open full-size figure" zh="查看完整原图" /><ArrowUpRight size={13} aria-hidden="true" /></a>
          </span>
        </figcaption>
      </figure>
  );
  return <PaperArticle paper={paper} authorNotes={study.notes} affiliations={study.affiliations}
    abstractBreaks={study.breaks} overviewFigure={id==='sasbo' && originalFigure}>
    <section id="method" className="tide-method-band"><div className="tide-bound">
      <header className="tide-chapter-head">
        <h2><Localized {...study.method}/></h2></header>
      <p className="tide-prose"><Localized {...study.problem}/></p>
      <p className="tide-prose"><Localized {...study.context}/></p>
      <h3 className="paper-subsection"><Localized {...study.mechanism}/></h3>
      <p className="tide-prose"><Localized {...study.lead}/></p>
      {id==='sasbo' ? <SparseMaskFigure/> : <SamHandoffFigure/>}
      <p className="tide-prose"><Localized {...study.significance}/></p>
      {id==='sam' && originalFigure}
      <p className="tide-prose tide-demo-intro"><Localized {...study.insight}/></p>
      <SparseMethodComparison study={id}/>
      <h3 className="paper-subsection"><Localized {...study.optimization}/></h3>
      <p className="tide-prose"><Localized {...study.optimizationText}/></p>
      <p className="tide-prose"><Localized {...study.optimizationDetail}/></p>
    </div></section>
    <section id="examples" className="tide-results tide-bound">
      <header className="tide-chapter-head">
        <h2><Localized {...study.result}/></h2></header>
      <SparseResults study={id}/>
      <p className="tide-prose tide-demo-intro"><Localized {...study.interpretation}/></p>
      <p className="tide-prose"><Localized {...study.resultContext}/></p>
    </section>
    <section id="discussion" className="tide-results tide-bound">
      <header className="tide-chapter-head">
        <h2><Localized {...study.discussion}/></h2></header>
      <p className="tide-prose"><Localized {...study.discussionText}/></p>
      <p className="tide-prose"><Localized {...study.scope}/></p>
    </section>
  </PaperArticle>;
}
