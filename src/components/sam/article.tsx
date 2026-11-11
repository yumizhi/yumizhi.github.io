import { Article, Callout, Equation, Figure, M, P, Section, Summary } from '@/components/article';
import { Localized } from '@/components/language';
import type { Paper } from '@/lib/content';
import { asset } from '@/lib/paths';
import { TaskLab } from './task-lab';
import { TransferChart } from './transfer';

const contents = [
  { id: 'problem', en: 'Attacking a model you cannot see', zh: '攻击一个看不见的模型' },
  { id: 'difficulty', en: 'Sparse attacks overfit', zh: '稀疏攻击容易过拟合' },
  { id: 'tasks', en: 'Rehearsing the black box', zh: '预演黑盒攻击' },
  { id: 'projection', en: 'Keeping k pixels', zh: '只保留 k 个像素' },
  { id: 'results', en: 'Results', zh: '实验结果' },
  { id: 'limits', en: 'Limits', zh: '局限' },
  { id: 'citation', en: 'Cite', zh: '引用' },
];

const authors = [
  { name: 'Weitao Li', marks: '1' },
  { name: 'Mingqian Lin', marks: '1' },
  { name: 'Yihan Meng', marks: '1' },
  { name: 'Yangdai Si', marks: '2' },
  { name: 'Lin Shang', marks: '1' },
];

const affiliations = [
  'Department of Computer Science and Technology, Nanjing University',
  'Huazhong University of Science and Technology',
];

function SamBanner({ paper }: { paper: Paper }) {
  return (
    <figure className="sam-banner">
      <div className="sam-banner-art">
        <img src={asset(paper.image!)} width={paper.imageWidth} height={paper.imageHeight} alt={paper.imageAlt} />
      </div>
      <figcaption>
        <Localized
          en="Figure 1 of the paper: the meta-learning setup the method borrows. Episodes are split into a support set to learn from and a query set to be tested on. SAM applies the same split to classifiers instead of images."
          zh="论文图 1：本方法借用的元学习设定。每个 episode 分为用于学习的支持集和用于检验的查询集。SAM 把同样的划分用在分类器上，而不是图像上。"
        />
      </figcaption>
    </figure>
  );
}

export function SamArticle({ paper }: { paper: Paper }) {
  return (
    <Article
      paper={paper}
      hue="meta"
      kicker={{ en: 'IJCNN 2024 · Adversarial transferability', zh: 'IJCNN 2024 · 对抗迁移性' }}
      deck={{
        en: 'An attack built on one classifier rarely fools another when it may change only a few pixels. SAM practises on models it holds back, then keeps the pixels that matter most.',
        zh: '只允许改动少量像素时，针对一个分类器构造的攻击很少能骗过另一个。SAM 先在留出的模型上演练，再只保留最重要的像素。',
      }}
      authors={authors}
      affiliations={affiliations}
      banner={<SamBanner paper={paper} />}
      contents={contents}
    >
      <Summary>
        <P
          en={<>Sparse Attack with Meta-Learning (SAM) builds an adversarial example over many small tasks. Each task attacks a few sampled models together and then takes one step on a model that was held out, as a rehearsal for the black-box case. A projection keeps only the <M tex="k" /> most useful pixels. With 50 pixels on CIFAR-10, mean success on six unseen models rises from <strong>68.4% without the meta-learning stages to 85.5% with them</strong>.</>}
          zh={<>基于元学习的稀疏攻击（SAM）通过许多小任务逐步构造对抗样本。每个任务先联合攻击几个采样到的模型，再在一个留出的模型上走一步，以此预演黑盒情形。随后的投影只保留最有用的 <M tex="k" /> 个像素。在 CIFAR-10 上使用 50 个像素时，六个未见模型上的平均成功率从<strong>不含元学习阶段的 68.4% 提高到 85.5%</strong>。</>}
        />
      </Summary>

      <Section id="problem" number="01" title={{ en: 'Attacking a model you cannot see', zh: '攻击一个看不见的模型' }}>
        <P
          en="In a black-box attack the adversary has no access to the target's weights or gradients. The usual route is transfer: craft the example on models that are available and hope it also fools the one that is not."
          zh="在黑盒攻击中，攻击者无法获得目标模型的权重或梯度。常用的办法是迁移：在可用的模型上构造对抗样本，并期望它也能骗过那个无法访问的模型。"
        />
        <P
          en="Sparse attacks make this harder. They change only a small number of pixels, so there is little room for a perturbation that happens to work on several architectures at once."
          zh="稀疏攻击让这件事更难。它只改动少量像素，留给“恰好对多种结构同时有效”的扰动的空间很小。"
        />
      </Section>

      <Section id="difficulty" number="02" title={{ en: 'Sparse attacks overfit', zh: '稀疏攻击容易过拟合' }}>
        <P
          en="SparseFool and GreedyFool choose pixels from the gradient of a single white-box model. They succeed on that model every time, and that is the problem: the selected pixels are tuned to one decision boundary. On ImageNet with unrestricted magnitude, the paper's examples built on VGG19 fool InceptionV3 in 10.4% of cases for SparseFool and 24.5% for GreedyFool."
          zh="SparseFool 和 GreedyFool 依据单个白盒模型的梯度选择像素。它们在该模型上每次都能成功，而问题正在于此：选出的像素是针对一条决策边界调出来的。在 ImageNet 上、幅度不受限时，论文中基于 VGG19 构造的样本对 InceptionV3 的成功率，SparseFool 为 10.4%，GreedyFool 为 24.5%。"
        />
        <P
          en="Averaging gradients over an ensemble helps, but an ensemble is still a fixed set that the example can fit. What is missing is a signal, during optimization, for how the example behaves on a model that did not help to build it."
          zh="对多个模型的梯度取平均会有帮助，但集成仍是一个固定集合，样本同样可以拟合它。缺少的是优化过程中的一种信号：样本在一个没有参与构造它的模型上表现如何。"
        />
      </Section>

      <Section id="tasks" number="03" title={{ en: 'Rehearsing the black box', zh: '预演黑盒攻击' }}>
        <P
          en={<>SAM borrows the structure of Model-Agnostic Meta-Learning. From a pool of <M tex="N" /> white-box models it samples <M tex="n" /> for each task. The first <M tex="n-1" /> play the support set and the last plays the query set.</>}
          zh={<>SAM 借用了 MAML（Model-Agnostic Meta-Learning）的结构。它从 <M tex="N" /> 个白盒模型中为每个任务采样 <M tex="n" /> 个：前 <M tex="n-1" /> 个充当支持集，最后一个充当查询集。</>}
        />
        <P
          en={<><strong>Meta-training.</strong> For <M tex="K" /> iterations the image moves along the sign of the weighted average of the support models' cross-entropy gradients, so that it does not fit any single one:</>}
          zh={<><strong>元训练。</strong>在 <M tex="K" /> 次迭代中，图像沿支持集各模型交叉熵梯度的加权平均的符号方向移动，避免拟合其中任何一个：</>}
        />
        <Equation tex="x_{i,j+1}=x_{i,j}+\alpha\cdot\operatorname{sign}\Big(\sum_{s=1}^{n-1}w_s\,\nabla^{a_s}x_{i,j}\Big),\qquad w_s\ge 0,\ \sum_s w_s=1" label="The image at iteration j plus one equals the image at iteration j plus alpha times the sign of the weighted sum of the support models' gradients." />
        <P
          en={<><strong>Meta-testing.</strong> The held-out model is then evaluated at the image produced by meta-training, <M tex="x_{i,K}" />, and its gradient is applied to the point where the task started:</>}
          zh={<><strong>元测试。</strong>随后在元训练得到的图像 <M tex="x_{i,K}" /> 上评估留出的模型，并把它的梯度作用在任务的起点上：</>}
        />
        <Equation tex="x_{i+1}=x_i+\beta\cdot\operatorname{sign}\big(\nabla^{a_n}x_{i,K}\big)" label="The next task's image equals the current image plus beta times the sign of the query model's gradient at the meta-trained image." />
        <P
          en="The paper is explicit that this is a simulation: the query model's weights are known. Its role is to stand in for a model the example has not been fitted to, so that across many tasks with different splits the update favours directions that several models share."
          zh="论文明确指出这只是模拟：查询模型的权重是已知的。它的作用是代表一个样本尚未拟合过的模型，这样在多次不同划分的任务中，更新会偏向多个模型共有的方向。"
        />
        <Figure
          number="1"
          kind="concept"
          width="wide"
          caption={{
            en: 'How one task divides the six source models used in the experiments. The paper samples more than one model per task and does not state n; four is used here for illustration, and the sequence of tasks is fixed.',
            zh: '一个任务如何划分实验中使用的六个源模型。论文每个任务采样多于一个模型，但未给出 n 的取值；此处以 4 为例，任务序列为预设。',
          }}
        >
          <TaskLab />
        </Figure>
      </Section>

      <Section id="projection" number="04" title={{ en: 'Keeping k pixels', zh: '只保留 k 个像素' }}>
        <P
          en={<>The update above changes every pixel. To make it sparse, each task ends by projecting the image onto the set of images that differ from the original <M tex="x" /> in at most <M tex="k" /> pixels and by at most <M tex="\epsilon" /> per channel, staying as close as possible to the dense adversarial image <M tex="x^{adv}" />.</>}
          zh={<>上述更新会改动每个像素。为了得到稀疏扰动，每个任务结束时都要把图像投影到这样一个集合上：与原图 <M tex="x" /> 最多相差 <M tex="k" /> 个像素、每个通道的差异不超过 <M tex="\epsilon" />，同时尽量接近稠密对抗图像 <M tex="x^{adv}" />。</>}
        />
        <P
          en="The projection has a closed form. Each channel's change is first clipped to the allowed range, and each pixel is scored by how much of the dense perturbation that clipped change recovers:"
          zh="这个投影有闭式解。先把每个通道的改动裁剪到允许范围内，再按裁剪后的改动能还原多少稠密扰动为每个像素打分："
        />
        <Equation tex="z^{*}_{ij}=x_{ij}+\operatorname{clip}\big(x^{adv}_{ij}-x_{ij},\,-\epsilon,\,\epsilon\big),\qquad \phi_i=\sum_{j=1}^{3}\big(x^{adv}_{ij}-x_{ij}\big)^2-\sum_{j=1}^{3}\big(x^{adv}_{ij}-z^{*}_{ij}\big)^2" label="z star is the original pixel plus the clipped perturbation; phi scores each pixel by the squared perturbation it recovers." />
        <P
          en={<>The <M tex="k" /> pixels with the largest <M tex="\phi_i" /> take their clipped values and all others return to the original. Unlike SparseFool and GreedyFool, which add pixels until the attack succeeds, SAM fixes the pixel count in advance.</>}
          zh={<><M tex="\phi_i" /> 最大的 <M tex="k" /> 个像素取裁剪后的值，其余像素恢复为原值。SparseFool 和 GreedyFool 会不断增加像素直到攻击成功，SAM 则预先固定像素数量。</>}
        />
        <Callout title={{ en: 'One task, three stages', zh: '一个任务，三个阶段' }}>
          <P
            en={<>Sample <M tex="n" /> models; run <M tex="K" /> meta-training steps of size <M tex="\alpha" /> on the first <M tex="n-1" />; take one meta-testing step of size <M tex="\beta" /> with the last; project to <M tex="k" /> pixels. The next task starts from the result, and the output is the image after <M tex="T" /> tasks.</>}
            zh={<>采样 <M tex="n" /> 个模型；在前 <M tex="n-1" /> 个上做 <M tex="K" /> 步步长为 <M tex="\alpha" /> 的元训练；用最后一个做一步步长为 <M tex="\beta" /> 的元测试；投影到 <M tex="k" /> 个像素。下一个任务从该结果出发，<M tex="T" /> 个任务之后的图像即为输出。</>}
          />
        </Callout>
      </Section>

      <Section id="results" number="05" title={{ en: 'Results', zh: '实验结果' }}>
        <P
          en="The experiments use 1,000 ImageNet images and 5,000 CIFAR-10 images. Six classifiers (VGG19, VGG16, ResNet101, ResNet152, DenseNet201, DenseNet169) are available to the attack and six others are used only for evaluation. SparseFool and GreedyFool use VGG19 as their single source model. The metric is attack success rate, with the mean number of perturbed pixels reported alongside."
          zh="实验使用 1,000 张 ImageNet 图像和 5,000 张 CIFAR-10 图像。六个分类器（VGG19、VGG16、ResNet101、ResNet152、DenseNet201、DenseNet169）可供攻击使用，另外六个只用于评估。SparseFool 与 GreedyFool 以 VGG19 作为唯一的源模型。评价指标为攻击成功率，同时报告平均扰动像素数。"
        />
        <P
          en="On ImageNet with unrestricted magnitude and about 3,000 pixels, SAM fools InceptionV3 in 34.7% of cases, against 10.4% and 24.5% for the two baselines. On CIFAR-10 at the same magnitude, success on ResNeXt50 is 88.5% for SAM, 44.0% for SparseFool and 17.8% for GreedyFool, and SAM's rates on unseen models are close to its rates on the source models."
          zh="在 ImageNet 上、幅度不受限且使用约 3,000 个像素时，SAM 对 InceptionV3 的成功率为 34.7%，两种基线分别为 10.4% 和 24.5%。在 CIFAR-10 上相同幅度下，SAM 对 ResNeXt50 的成功率为 88.5%，SparseFool 为 44.0%，GreedyFool 为 17.8%；SAM 在未见模型上的成功率与在源模型上的接近。"
        />
        <Figure
          number="2"
          kind="data"
          width="wide"
          caption={{
            en: 'Table VI of the paper: non-targeted attack success rate (%) on CIFAR-10, with and without the meta-learning stages. SA uses the same gradient attack and projection on VGG19 alone. The black-box mean is computed here from the six target columns.',
            zh: '论文表 VI：CIFAR-10 上非定向攻击的成功率（%），对比有无元学习阶段。SA 仅在 VGG19 上使用相同的梯度攻击与投影。黑盒平均由六个目标模型的数值在此计算得出。',
          }}
        >
          <TransferChart />
        </Figure>
        <P
          en="The ablation isolates what the task structure contributes. With 50 pixels, success on every unseen model rises, by between 9 and 24 points. With 300 pixels limited to ε = 16, the black-box mean goes from 25.6% to 48.2%. The single model where SA is ahead is VGG19, the one it was built on: 91.8% against 89.9%, and 80.6% against 66.4% in the harder setting. SAM gives up some fit to one model in exchange for all the others."
          zh="消融实验分离出了任务结构的贡献。使用 50 个像素时，每个未见模型上的成功率都有提高，幅度在 9 到 24 个百分点之间。使用 300 个像素且限制 ε = 16 时，黑盒平均成功率从 25.6% 提高到 48.2%。SA 唯一领先的模型是 VGG19，也就是它所基于的模型：91.8% 对 89.9%，在更难的设置下为 80.6% 对 66.4%。SAM 放弃了对单个模型的部分拟合，换来了在其他所有模型上的效果。"
        />
      </Section>

      <Section id="limits" number="06" title={{ en: 'Limits', zh: '局限' }}>
        <P
          en="SAM needs several white-box models and a forward and backward pass through each sampled model at every step, where single-model attacks need one. The paper does not report running time. The pixel count is fixed beforehand, so the method does not search for the smallest perturbation for each image."
          zh="SAM 需要多个白盒模型，并且每一步都要对每个采样到的模型做一次前向与反向传播，而单模型攻击只需一个模型。论文没有报告运行时间。像素数量是预先固定的，因此该方法不会为每幅图像搜索最小的扰动。"
        />
        <P
          en="All results are for non-targeted attacks on standard, undefended classifiers. With magnitude limited to ε = 16, success on unseen CIFAR-10 models stays near 50%, so transfer under a tight budget remains far from solved."
          zh="所有结果均针对标准、无防御分类器上的非定向攻击。当幅度限制为 ε = 16 时，在未见 CIFAR-10 模型上的成功率仍在 50% 左右，因此严格预算下的迁移问题远未解决。"
        />
      </Section>
    </Article>
  );
}
