import type { Paper } from '@/lib/content';
import { asset } from '@/lib/paths';
import { Localized } from './language';
import { PaperArticle } from './paper-article';
import { SasboFramework } from './paper-figures/study-frameworks';
import { SamTransfer } from './paper-figures/sam-transfer';
import { SasboArm } from './paper-figures/sasbo-arm';
import { SparseAmplitudeTable, SparseResults } from './sparse-results';
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
    method:{en:'Binary support and continuous amplitudes',zh:'二值位置与连续幅度'},
    problem:{en:'At a chosen coordinate the classifier gradient describes the local effect of changing its value. Replacing that coordinate changes the set of permissible perturbations. SASBO represents support and amplitude with separate variables and updates each against the current estimate of the other.',
      zh:'对于已经选中的坐标，分类器梯度描述了该处数值变化对损失的局部影响。换一个坐标，则改变了可行扰动的集合。SASBO 分别表示位置与幅度，在每类变量的当前估计下更新另一类变量。'},
    discussion:{en:'Tighter amplitude limits spread the changes',zh:'幅度收紧，扰动分散到更多位置'},
    discussionText:{en:'On CIFAR-10, reducing the amplitude cap from 255 to 10 keeps untargeted success at 100% but raises mean ℓ₀ from 3.95 to 144.21. On ImageNet the corresponding mean rises from 50.87 to 1051.24. In both cases a tighter per-entry limit distributes the change across more coordinates.',
      zh:'当幅度上限由 255 收紧至 10，CIFAR-10 上的非定向成功率保持 100%，平均 ℓ₀ 由 3.95 升至 144.21；ImageNet 上的平均值由 50.87 升至 1051.24。两个数据集上，限制单点幅度都会使最终改动分散到更多坐标。'},
    scope:{en:'The method assumes white-box access to the attacked classifier. Its coordinate search is evaluated on CIFAR-10 and ImageNet; the paper does not establish transferability to unseen classifiers or a running-time advantage. The related SAM study examines the separate problem of transfer across models.',
      zh:'方法需要访问被攻击分类器的输出与梯度。论文在 CIFAR-10 与 ImageNet 上评估坐标优化，没有据此建立对未知模型的迁移能力或运行速度优势。相关工作 SAM 进一步研究的是跨模型迁移这一问题。'},
    result:{en:'Sparsity at the same attack success rate',zh:'相同成功率下的扰动数量'},
    interpretation:{en:'Within each comparison, the dataset, attack objective and amplitude limit are held fixed. When success rates match, mean ℓ₀ shows how many nonzero entries each method needs. A targeted attack must reach a prescribed class. An untargeted attack can reach any incorrect class.',
      zh:'实验固定数据集、攻击目标与幅度限制。各方法均能成功时，平均 ℓ₀ 用于比较扰动中非零元素的数量。定向攻击要求分类结果变为指定类别；非定向攻击只要求出现错误分类。'},
    resultContext:{en:'At ε = 255 on CIFAR-10, GreedyFool and SASBO both achieve their untargeted objective on every evaluated image, with mean counts of 12.29 and 3.95. For the same images with a prescribed target class, the respective means rise to 48.99 and 14.88.',
      zh:'在 CIFAR-10、ε = 255 的设置下，GreedyFool 和 SASBO 均在全部测试图像上实现非定向改判，平均分别改变 12.29 和 3.95 个坐标。为同批图像指定目标类别后，两种方法的平均改动数分别升至 48.99 和 14.88。'},
  },
  sam:{
    notes:['1','1','1','2','1'],
    affiliations:['Department of Computer Science and Technology, Nanjing University','Huazhong University of Science and Technology'],
    method:{en:'Optimization across surrogate models',zh:'多替代模型上的稀疏优化'},
    discussion:{en:'Scope of the evaluation',zh:'评估范围'},
    discussionText:{en:'At a budget of 50 pixels, the single-model baseline reaches 91.8% on VGG19 and SAM reaches 89.9%. SAM nevertheless obtains higher success on every held-out classifier at that budget. The improvement is specific to transfer, with a small reduction in the score on the original source model.',
      zh:'在 50 像素预算下，单模型基线在源模型 VGG19 上的成功率为 91.8%，SAM 为 89.9%。SAM 在相同预算下取得更高的跨模型迁移率，代价是源模型上的成功率略有下降。'},
    scope:{en:'SAM requires several accessible surrogate classifiers. The pixel budget is specified in advance, and the paper evaluates untargeted attacks on standard classifiers. It does not search for the minimum pixel count separately for each image or report the additional runtime of the sampled-model updates.',
      zh:'SAM 需要多个可访问的替代分类器，并预先指定像素预算。论文评估的是标准分类器上的非定向攻击，没有逐图搜索最少像素数量，也没有报告多模型任务更新带来的额外运行时间。'},
    result:{en:'Transfer to unseen classifiers',zh:'未参与优化的模型上的攻击成功率'},
    interpretation:{en:'On CIFAR-10, the authors compare a 50-pixel budget at ε = 255 and a 300-pixel budget at ε = 16. Each pair of SA and SAM results uses the same images, amplitude limit and number of permitted spatial positions.',
      zh:'CIFAR-10 消融采用两组预算：ε = 255 时最多 50 个像素，ε = 16 时最多 300 个像素。每组内 SA 和 SAM 使用相同的样本、幅度上限与允许改动的位置数。'},
    resultContext:{en:'The per-model gain at 50 pixels ranges from 9.0 percentage points on MnasNet1.0 to 23.8 points on ResNet50. Transfer increases across the panel, with a substantial dependence on the architecture receiving the image.',
      zh:'在 50 像素预算下，各独立模型的成功率增幅介于 9.0 与 23.8 个百分点之间，两端分别为 MnasNet1.0 和 ResNet50。同一批图像在六种架构上的迁移收益并不相同。'},
  },
};

export function SparsePaper({paper}:{paper:Paper}){
  const id=paper.slug==='sasbo'?'sasbo':'sam';
  const study=studies[id];
  const evidence = id === 'sasbo' ? sasboEvidence : samEvidence;
  return <PaperArticle paper={paper} authorNotes={study.notes} affiliations={study.affiliations}
    overviewFigure={id==='sasbo' && paper.image && <SasboEvidence original={paper.image}/>}>
    <section id="method" className="tide-method-band"><div className="tide-bound">
      <header className="tide-chapter-head">
        <h2><Localized {...study.method}/></h2></header>
      {id==='sasbo' ? <>
        <p className="tide-prose"><Localized {...studies.sasbo.problem}/></p>
        <p className="tide-prose"><Localized en="Coordinates selected early in the search can become redundant after other amplitudes change. Once the alternating updates have produced a successful mask, SASBO tests smaller subsets of its support. The reported count refers to the final subset."
          zh="其他位置的幅度调整后，先前选入的坐标可能变得多余。交替更新得到有效掩码后，SASBO 继续检验较小的坐标子集。实验报告的计数取自最终保留的子集。" /></p>
        <SasboFramework/>
          <SasboMaskMath/><EssayProse chapters={sasboChapters.slice(0, 1)}/><SasboArmMath/><SasboArm/><EssayProse chapters={sasboChapters.slice(1)}/><SasboAmplitudeMath/>
      </> : <>
        <p className="tide-prose"><Localized en="Each SAM task uses a support group and one query model drawn from the accessible classifiers. The support group determines a temporary proposal. The query model supplies the feedback used for the update that is retained between tasks."
          zh="SAM 每轮从可访问的分类器中抽取支持组和一个查询模型。支持组决定本轮的临时候选图，查询模型提供用于跨轮更新的反馈。" /></p>
        <SamMethod/>
          <EssayProse chapters={samChapters.slice(0, 1)}/><SamTaskMath/><SamProjectionMath/><EssayProse chapters={samChapters.slice(1)}/>
      </>}
    </div></section>
    <section id="examples" className="tide-results tide-bound">
      <header className="tide-chapter-head">
        <h2><Localized {...study.result}/></h2></header>
      <p className="tide-prose"><Localized {...study.interpretation}/></p>
      {id === 'sasbo' ? <p className="tide-prose"><Localized en="The paper evaluates a Network in Network classifier on 5,000 CIFAR-10 test images and VGG19 on 2,000 ImageNet validation images. Targeted comparisons use the same randomly chosen destination label for all methods on each image." zh="实验在 5,000 张 CIFAR-10 测试图上评估 Network in Network 分类器，在 2,000 张 ImageNet 验证图上评估 VGG19。定向实验对每张图随机指定一个目标类别，所有比较方法沿用同一目标。" /></p> : <><p className="tide-prose"><Localized en="The study samples 5,000 test images from CIFAR-10, balanced across its ten classes, and 1,000 images from ILSVRC2012. The accessible pool contains VGG19, VGG16, ResNet101, ResNet152, DenseNet201 and DenseNet169. A second group of six architectures supplies the transfer scores. SA uses VGG19 alone and retains the same sparsification procedure, making it the closest control for the cross-model feedback." zh="论文从 CIFAR-10 测试集十个类别中均衡抽取 5,000 张图，从 ILSVRC2012 抽取 1,000 张。替代模型池包括 VGG19、VGG16、ResNet101、ResNet152、DenseNet201 和 DenseNet169，迁移成绩由另一组独立的六种架构给出。消融基线 SA 只用 VGG19，保留同样的稀疏化过程，因此可以直接比较引入多模型反馈前后的变化。"/></p><SamTransfer/></>}
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
      {id === 'sasbo' && <SparseAmplitudeTable/>}
      <p className="tide-prose"><Localized {...study.scope}/></p>
    </section>
  </PaperArticle>;
}
