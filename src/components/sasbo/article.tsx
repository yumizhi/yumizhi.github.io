import { Article, Callout, Equation, Figure, M, P, Section, Summary } from '@/components/article';
import type { Paper } from '@/lib/content';
import { asset } from '@/lib/paths';
import { SasboBanner } from './banner';
import { MaskLab } from './mask-lab';
import { SparsityChart } from './results';

const contents = [
  { id: 'problem', en: 'How few pixels?', zh: '最少要改多少像素？' },
  { id: 'difficulty', en: 'Counting is not differentiable', zh: '计数不可微' },
  { id: 'idea', en: 'Where and how much', zh: '改哪里，改多少' },
  { id: 'coordinates', en: 'Learning the coordinates', zh: '学习扰动坐标' },
  { id: 'discretize', en: 'From probabilities to pixels', zh: '从概率到像素' },
  { id: 'results', en: 'Results', zh: '实验结果' },
  { id: 'limits', en: 'Limits', zh: '局限' },
  { id: 'citation', en: 'Cite', zh: '引用' },
];

const authors = [
  { name: 'Yihan Meng', marks: '1' },
  { name: 'Weitao Li', marks: '1' },
  { name: 'Lin Shang', marks: '1,*' },
];

const affiliations = ['State Key Laboratory for Novel Software Technology, Department of Computer Science and Technology, Nanjing University'];

export function SasboArticle({ paper }: { paper: Paper }) {
  return (
    <Article
      paper={paper}
      hue="attack"
      kicker={{ en: 'PAKDD 2024 · Adversarial robustness', zh: 'PAKDD 2024 · 对抗鲁棒性' }}
      deck={{
        en: 'A sparse attack has to decide which pixels to touch before it can decide how to change them. SASBO turns that discrete choice into probabilities it can optimize.',
        zh: '稀疏攻击必须先决定改动哪些像素，才能决定如何改动。SASBO 把这个离散选择变成了可以优化的概率。',
      }}
      authors={authors}
      affiliations={affiliations}
      banner={<SasboBanner />}
      contents={contents}
    >
      <Summary>
        <P
          en={<>SASBO writes a sparse perturbation as a binary mask times a magnitude, treats each mask entry as a Bernoulli variable, and optimizes the probabilities with the unbiased ARM gradient estimator. On CIFAR-10 with unrestricted magnitude it fools the classifier by changing <strong>3.95 pixels on average, against 12.29 for GreedyFool</strong>, with a 100% success rate in every setting tested.</>}
          zh={<>SASBO 把稀疏扰动写成二值掩码与幅度的乘积，将掩码的每个元素视为伯努利变量，并用无偏的 ARM 梯度估计优化其概率。在 CIFAR-10 上、幅度不受限时，它平均只需改动 <strong>3.95 个像素即可使分类器出错，GreedyFool 需要 12.29 个</strong>；在所有测试设置下攻击成功率均为 100%。</>}
        />
      </Summary>

      <Section id="problem" number="01" title={{ en: 'How few pixels?', zh: '最少要改多少像素？' }}>
        <P
          en="An adversarial example is an input that has been changed slightly so that a classifier gets it wrong. Most attacks spread a small change over every pixel. A sparse attack does the opposite: it may change a pixel by any amount, but it is judged by how many pixels it touches."
          zh="对抗样本是经过轻微改动、使分类器判断出错的输入。多数攻击把微小的改动分散到每个像素上。稀疏攻击正好相反：单个像素可以改动任意幅度，衡量标准是改动了多少个像素。"
        />
        <P
          en={<>Writing the clean image as <M tex="x" />, the perturbation as <M tex="\delta" />, the classifier as <M tex="f" /> and the attack loss as <M tex="\mathcal{L}" />, the goal is</>}
          zh={<>记原图为 <M tex="x" />，扰动为 <M tex="\delta" />，分类器为 <M tex="f" />，攻击损失为 <M tex="\mathcal{L}" />，目标是</>}
        />
        <Equation tex="\min_{\delta}\ \lVert\delta\rVert_0+\lambda\,\mathcal{L}\big(f(x+\delta),\,y_t\big)\quad\text{s.t.}\quad x+\delta\in[0,1]" label="Minimise the number of perturbed entries plus lambda times the attack loss, keeping the image in range." />
        <P
          en={<>The <M tex="\ell_0" /> norm counts the non-zero entries of <M tex="\delta" />. The number it returns is a direct measure of how fragile the model is: the image at the top of this page changes class after single-channel edits to a small fraction of its pixels, which the eye does not register.</>}
          zh={<><M tex="\ell_0" /> 范数统计 <M tex="\delta" /> 中非零元素的个数。这个数字直接反映了模型的脆弱程度：本页顶部的图像只有一小部分像素的单个通道被改动，肉眼无法察觉，分类结果却已改变。</>}
        />
      </Section>

      <Section id="difficulty" number="02" title={{ en: 'Counting is not differentiable', zh: '计数不可微' }}>
        <P
          en={<>The difficulty is the <M tex="\ell_0" /> term. It is piecewise constant, so it has no useful gradient, and choosing the best subset of pixels is NP-hard. Earlier methods work around this in two ways. Some search heuristically, adding and removing pixels by a saliency score, as SparseFool and GreedyFool do. Others replace <M tex="\ell_0" /> with <M tex="\ell_1" />, which is differentiable but optimizes a different quantity.</>}
          zh={<>困难在于 <M tex="\ell_0" /> 项。它是分段常数，没有可用的梯度，而选出最优像素子集是 NP 难问题。已有方法有两种绕行方式：一类用启发式搜索，按显著性分数增删像素，如 SparseFool 与 GreedyFool；另一类用 <M tex="\ell_1" /> 代替 <M tex="\ell_0" />，可微，但优化的已是另一个量。</>}
        />
        <P
          en="Both leave pixels on the table. A greedy search commits to pixels one at a time and cannot easily undo an early choice; a relaxed norm tends to produce many small changes where a few large ones would do."
          zh="两种做法都会留下多余的像素。贪心搜索逐个确定像素，很难撤回早期的选择；松弛后的范数则倾向于产生许多小改动，而少数几处大改动本可达到同样的效果。"
        />
      </Section>

      <Section id="idea" number="03" title={{ en: 'Where and how much', zh: '改哪里，改多少' }}>
        <P
          en="SASBO separates the two questions a sparse attack has to answer. The perturbation is factorized into a binary mask of coordinates and a vector of magnitudes:"
          zh="SASBO 把稀疏攻击要回答的两个问题拆开。扰动被分解为一个二值坐标掩码和一个幅度向量："
        />
        <Equation tex="\delta = M\odot E,\qquad M\in\{0,1\}^N,\quad E\in\mathbb{R}^N" label="Delta equals M element-wise times E, where M is binary and E is real-valued." />
        <P
          en={<>With <M tex="M" /> fixed, finding <M tex="E" /> is an ordinary dense attack restricted to the chosen pixels: minimize <M tex="\lVert M\odot E\rVert_2+\lambda\mathcal{L}" /> by gradient descent and clip to <M tex="[-\epsilon,\epsilon]" /> after every step. The hard part is <M tex="M" />, and that is where the method's name comes from.</>}
          zh={<>固定 <M tex="M" /> 后，求 <M tex="E" /> 就是限制在所选像素上的普通稠密攻击：用梯度下降最小化 <M tex="\lVert M\odot E\rVert_2+\lambda\mathcal{L}" />，并在每一步后裁剪到 <M tex="[-\epsilon,\epsilon]" />。难点在于 <M tex="M" />，方法的名字也由此而来。</>}
        />
        <P
          en="The two are optimized in alternation: five steps on the coordinates, ten on the magnitudes, repeated until the attack converges."
          zh="两者交替优化：坐标更新五步，幅度更新十步，如此反复直至攻击收敛。"
        />
      </Section>

      <Section id="coordinates" number="04" title={{ en: 'Learning the coordinates', zh: '学习扰动坐标' }}>
        <P
          en={<>Each mask entry is treated as a coin flip, <M tex="m_j\sim\mathrm{Bern}(\pi_j)" /> with <M tex="\pi_j=\sigma(\varphi_j)" />. Because the minimum of a function is never larger than its expectation under any distribution, minimizing the expected objective over the probabilities gives an upper bound on the original problem:</>}
          zh={<>掩码的每个元素被看作一次抛硬币：<M tex="m_j\sim\mathrm{Bern}(\pi_j)" />，其中 <M tex="\pi_j=\sigma(\varphi_j)" />。由于函数的最小值不会超过它在任意分布下的期望，对概率最小化期望目标，就得到原问题的一个上界：</>}
        />
        <Equation tex="\min_{\varphi}\ \mathbb{E}_{M\sim\mathrm{Bern}(\sigma(\varphi))}\Big[\lambda\,\mathcal{L}\big(f(x+M\odot E),\,y_t\big)\Big]+\sum_{j=1}^{N}e_j\,\sigma(\varphi_j)" label="Minimise over phi the expected attack loss under masks sampled from sigma of phi, plus the sum of magnitudes times probabilities." />
        <P
          en={<>The second term is the relaxed sparsity penalty and is differentiable. The first is an expectation over <M tex="2^N" /> masks. SASBO estimates its gradient with Augment-Reinforce-Merge (ARM), which needs only two evaluations of the objective per draw of uniform noise <M tex="u" />:</>}
          zh={<>第二项是松弛后的稀疏惩罚，可微。第一项是对 <M tex="2^N" /> 个掩码取期望。SASBO 用 Augment-Reinforce-Merge（ARM）估计它的梯度，每抽取一次均匀噪声 <M tex="u" />，只需计算两次目标函数：</>}
        />
        <Equation tex="\nabla_{\varphi}\,\mathbb{E}=\mathbb{E}_{u\sim\mathrm{Uni}(0,1)}\Big[\big(F(\mathbb{1}_{[u>\sigma(-\varphi)]})-F(\mathbb{1}_{[u<\sigma(\varphi)]})\big)\big(u-\tfrac12\big)\Big]" label="The ARM estimator: the difference of the objective at two antithetic masks, times u minus one half, averaged over uniform u." />
        <P
          en="The two masks are built from the same noise and are negatively correlated, which is why the estimator is unbiased yet has low variance. No gradient has to pass through the discrete mask."
          zh="两个掩码由同一份噪声构造且负相关，因此估计量无偏而方差较低。梯度无需穿过离散的掩码。"
        />
        <Figure
          number="1"
          kind="concept"
          width="wide"
          caption={{
            en: 'A toy 16 × 16 image. Drag the first slider to see probabilities separate into a few confident pixels and many near zero. The grid is scripted for illustration and is not the output of an attack.',
            zh: '一幅 16 × 16 的示意图像。拖动第一个滑块，可以看到概率逐渐分化为少数确定的像素和大量接近零的像素。网格为演示而预设，并非真实攻击的输出。',
          }}
        >
          <MaskLab />
        </Figure>
      </Section>

      <Section id="discretize" number="05" title={{ en: 'From probabilities to pixels', zh: '从概率到像素' }}>
        <P
          en={<>After optimization each <M tex="\sigma(\varphi_j)" /> is the probability that pixel <M tex="j" /> should be perturbed, and a threshold turns probabilities into a mask. A fixed threshold is fragile: set high, it leaves too few pixels for some images and the attack fails; set low, it keeps redundant ones. SASBO sets the threshold per image at the <M tex="k" />-th largest probability, so exactly <M tex="k" /> pixels survive.</>}
          zh={<>优化结束后，每个 <M tex="\sigma(\varphi_j)" /> 表示像素 <M tex="j" /> 应被扰动的概率，再用阈值把概率变为掩码。固定阈值并不可靠：设得高，某些图像剩下的像素太少，攻击失败；设得低，又会保留冗余像素。SASBO 对每幅图像把阈值设为第 <M tex="k" /> 大的概率，于是恰好保留 <M tex="k" /> 个像素。</>}
        />
        <P
          en={<><M tex="k" /> is only an upper bound. Once the attack succeeds, a binary search between 1 and <M tex="k" /> looks for the smallest number of top-ranked pixels that still changes the prediction, and the rest are dropped.</>}
          zh={<><M tex="k" /> 只是上界。攻击成功后，算法在 1 到 <M tex="k" /> 之间做二分搜索，找出仍能改变预测结果的最少的高概率像素数，其余像素被舍弃。</>}
        />
        <Callout title={{ en: 'The whole procedure', zh: '完整流程' }}>
          <P
            en={<>Initialize <M tex="\varphi\sim\mathcal{N}(0,0.01)" /> and <M tex="E=0.01" />. Repeat: five ARM steps on <M tex="\varphi" /> (learning rate 0.01), threshold at the <M tex="k" />-th largest probability, ten gradient steps on <M tex="E" /> (learning rate 0.1) with clipping. Then binary-search the pixel count. The attack loss is the C&amp;W loss with <M tex="\lambda=1" />.</>}
            zh={<>初始化 <M tex="\varphi\sim\mathcal{N}(0,0.01)" />、<M tex="E=0.01" />。循环：对 <M tex="\varphi" /> 做五步 ARM 更新（学习率 0.01），以第 <M tex="k" /> 大的概率为阈值，对 <M tex="E" /> 做十步梯度下降（学习率 0.1）并裁剪。最后对像素数做二分搜索。攻击损失采用 C&amp;W 损失，<M tex="\lambda=1" />。</>}
          />
        </Callout>
      </Section>

      <Section id="results" number="06" title={{ en: 'Results', zh: '实验结果' }}>
        <P
          en={<>The paper attacks a Network-in-Network classifier on 5,000 CIFAR-10 test images and VGG19 on 2,000 ImageNet validation images, in non-targeted and targeted settings, under three limits on per-pixel magnitude (<M tex="\epsilon" /> = 255, 100, 10). The baselines are PGD-ℓ0+ℓ∞, SparseFool and GreedyFool, run with their official implementations.</>}
          zh={<>论文在 5,000 张 CIFAR-10 测试图像上攻击 Network-in-Network 分类器，在 2,000 张 ImageNet 验证图像上攻击 VGG19，涵盖非定向与定向两种设置，以及三种单像素幅度上限（<M tex="\epsilon" /> = 255、100、10）。对比方法为 PGD-ℓ0+ℓ∞、SparseFool 和 GreedyFool，均使用官方实现。</>}
        />
        <Figure
          number="2"
          kind="data"
          width="wide"
          caption={{
            en: 'Tables 1–4 of the paper. Bars show the mean number of perturbed pixels; the small percentage is that count as a share of the image. Lower is sparser. SparseFool is not reported for targeted attacks.',
            zh: '论文表 1–4。条形表示平均扰动像素数，其后的百分比为占全图像素的比例，数值越低越稀疏。定向攻击未报告 SparseFool 的结果。',
          }}
        >
          <SparsityChart />
        </Figure>
        <P
          en={<>SASBO reaches a 100% success rate in all twelve settings and has the lowest mean <M tex="\ell_0" /> in each of them. The margin is widest when magnitude is unrestricted: 3.95 against 12.29 pixels for non-targeted CIFAR-10, and 14.88 against 48.99 for targeted CIFAR-10, a 69.6% reduction. It narrows as <M tex="\epsilon" /> shrinks, because every method then needs many more pixels: at <M tex="\epsilon=10" /> on ImageNet the gap to GreedyFool is about 5% for non-targeted attacks.</>}
          zh={<>SASBO 在全部十二种设置下攻击成功率均为 100%，平均 <M tex="\ell_0" /> 也都最低。幅度不受限时优势最大：CIFAR-10 非定向攻击为 3.95 对 12.29 个像素，定向攻击为 14.88 对 48.99，减少 69.6%。随着 <M tex="\epsilon" /> 减小，所有方法都需要更多像素，差距随之缩小：ImageNet 上 <M tex="\epsilon=10" /> 的非定向攻击，与 GreedyFool 的差距约为 5%。</>}
        />
        <P
          en={<>Sparsity is not the only norm that improves. SASBO's mean <M tex="\ell_2" /> is the lowest in every setting, while its <M tex="\ell_1" /> is slightly higher than GreedyFool's in two ImageNet non-targeted settings (<M tex="\epsilon" /> = 100 and 10).</>}
          zh={<>改善的不只是稀疏度。SASBO 的平均 <M tex="\ell_2" /> 在所有设置下都最低；其 <M tex="\ell_1" /> 在 ImageNet 非定向攻击的两种设置（<M tex="\epsilon" /> = 100 与 10）下略高于 GreedyFool。</>}
        />
        <Figure
          number="3"
          kind="paper"
          caption={{
            en: 'Figure 1 of the paper, non-targeted attacks at ε = 10. Columns: clean image, SASBO adversarial example, SASBO coordinates, GreedyFool adversarial example, GreedyFool coordinates. White dots mark pixels changed in all three channels; SASBO changes a single channel.',
            zh: '论文图 1，ε = 10 下的非定向攻击。各列依次为：原图、SASBO 对抗样本、SASBO 扰动坐标、GreedyFool 对抗样本、GreedyFool 扰动坐标。白点表示三个通道都被修改的像素；SASBO 只修改单个通道。',
          }}
        >
          <img className="paper-figure" src={asset('/images/sasbo-original.webp')} width={782} height={341} alt={paper.imageAlt} loading="lazy" />
        </Figure>
      </Section>

      <Section id="limits" number="07" title={{ en: 'Limits', zh: '局限' }}>
        <P
          en={<>SASBO is a white-box attack: it needs the model's outputs and gradients, and the paper does not measure how well its examples transfer to other models. The pixel budget <M tex="k" /> is a hyperparameter; in the experiments it is seeded from GreedyFool's average <M tex="\ell_0" /> and then tuned until every attack succeeds.</>}
          zh={<>SASBO 是白盒攻击：需要模型的输出与梯度，论文也没有评估其对抗样本在其他模型上的迁移效果。像素上限 <M tex="k" /> 是超参数；实验中先参考 GreedyFool 的平均 <M tex="\ell_0" /> 取值，再调整到所有攻击都成功。</>}
        />
        <P
          en="The evaluation covers one classifier per dataset and no defended models, and the paper reports no running times. Transfer to unseen models is the subject of the follow-up work on sparse attacks with meta-learning."
          zh="实验中每个数据集只使用一个分类器，不含带防御的模型，论文也未报告运行时间。向未见模型的迁移，是后续工作“基于元学习的稀疏攻击”研究的问题。"
        />
      </Section>
    </Article>
  );
}
