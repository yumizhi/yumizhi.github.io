import { Localized } from '../language';
import { PaperEquation } from './paper-equation';
import './evidence-figure.css';
import './worked-figures.css';

const tex = String.raw;

const maskStrip = [
  { label: { en: 'Gate M', zh: '开关 M' }, cells: ['1', '0', '0', '1'] },
  { label: { en: 'Amplitude E', zh: '候选幅度 E' }, cells: ['+a', '−b', '+c', '−d'] },
  { label: { en: 'Applied δ', zh: '实际扰动 δ' }, cells: ['+a', '0', '0', '−d'] },
];

export function SasboMaskMath() {
  return <>
    <PaperEquation number="2" math={tex`\delta=M\odot E,\qquad M_j\in\{0,1\}`} />
    <figure className="paper-evidence-figure worked-figure">
      <div className="worked-panel sasbo-product">
        <table>
          <thead><tr>
            <th scope="col"><Localized en="Coordinate" zh="坐标" /></th>
            {['A', 'B', 'C', 'D'].map(label => <th scope="col" key={label}>{label}</th>)}
          </tr></thead>
          <tbody>{maskStrip.map(({ label, cells }, row) => (
            <tr key={label.en} data-result={row === 2}>
              <th scope="row"><Localized {...label} /></th>
              {cells.map((cell, i) => <td key={i} data-active={i === 0 || i === 3}>{cell}</td>)}
            </tr>
          ))}</tbody>
        </table>
      </div>
      <figcaption><Localized en="The mask leaves the signs and amplitudes at A and D intact. B and C have candidate amplitudes, but contribute zero to the image." zh="掩码留下 A 和 D 的符号与幅度。B 和 C 虽然也有候选幅度，实际加到图像上的改动却为零。" /></figcaption>
    </figure>
    <p className="tide-prose"><Localized
      en="SASBO counts entries in the flattened image tensor. Changing only the red channel of one pixel adds one to ℓ₀. Changing red and green at that same pixel adds two. This is why the perturbation map in the dog example distinguishes individual channels."
      zh="论文按图像张量的元素计算 ℓ₀。某个像素只有红色通道被改动，计作一项；同一像素的红、绿两个通道都变了，就计作两项。狗图的扰动位置用不同颜色标记，正是为了区分这些情况。"
    /></p>
    <p className="tide-prose"><Localized
      en="With M fixed, an amplitude can vary continuously within its bounds. Changing one entry of M instead switches the entire corresponding amplitude on or off. SASBO assigns each entry a probability and optimizes that probability while using binary masks for every classifier evaluation."
      zh="掩码固定时，选中位置的扰动幅度可以在上下界之间连续变化。位置的取舍则是离散的，一旦撤掉一个坐标，它的整项扰动就会消失。SASBO 为每个位置引入一个可优化的选择概率，每次计算分类损失时仍使用二值掩码。"
    /></p>
  </>;
}

export function SasboArmMath() {
  return <>
    <h3 className="paper-subsection"><Localized en="Learning selection probabilities" zh="学习坐标选择概率" /></h3>
    <PaperEquation math={tex`\begin{aligned}
      p_j &= \sigma(\phi_j),\quad M_j\sim\operatorname{Bernoulli}(p_j) \\
      M_j^- &= \mathbf 1[u_j<p_j] \\
      M_j^+ &= \mathbf 1[u_j>1-p_j]
    \end{aligned}`} />
    <p className="tide-prose"><Localized
      en="The same uniform draw determines both masks. Each mask includes coordinate j with probability pⱼ, one at the lower end of the interval and the other at the upper end. If all other entries are fixed, only a draw that selects j in exactly one mask can produce a difference between the two losses."
      zh="两张掩码共用一次均匀抽样。对坐标 j，一张取区间的低端，另一张取高端，各自选中它的概率都是 pⱼ。若其余坐标固定，两张掩码都选中 j 或都不选时，分类损失相同。只有一张选中 j 时，损失差才反映这个位置的影响。"
    /></p>

    <PaperEquation number="5, 8" math={tex`\begin{aligned}
      R(\phi)&=\mathbb E_M[F(M)] + \sum_j e_j p_j
    \end{aligned}`} />
    <p className="tide-prose"><Localized
      en="At the current amplitudes, F(M) is the classification loss of a single masked image. The objective averages that loss over masks and adds the amplitude-weighted probability penalty. The penalty has an explicit derivative through the sigmoid. ARM estimates the gradient of the expectation."
      zh="幅度固定时，F(M) 是使用某张掩码所得的分类损失。目标函数取它对掩码的期望，并加上由幅度加权的概率惩罚项。惩罚项可以通过 sigmoid 直接求导，分类损失期望的梯度由 ARM 估计。"
    /></p>
    <PaperEquation number="7" math={tex`\begin{aligned}
      &\nabla_\phi\,\mathbb E_M[F(M)] \\
      &\quad=\mathbb E_u\!\left[\big(F(M^+)-F(M^-)\big)
      \left(u-\tfrac12\right)\right]
    \end{aligned}`} />
    <p className="tide-prose"><Localized
      en="For a single coordinate, let L₀ and L₁ be the losses with the entry absent and present. Its expected loss is (1−p)L₀ + pL₁. Differentiation with respect to the logit gives p(1−p)(L₁−L₀). When including the entry reduces the loss, this derivative is negative, so a descent step raises its selection probability. With many coordinates the two losses come from whole masks, including interactions between entries."
      zh="对单个坐标，L₀ 和 L₁ 分别表示保留原值和加上扰动时的损失。期望损失为 (1−p)L₀ + pL₁，对 logit 求导得到 p(1−p)(L₁−L₀)。若加上扰动后损失更小，导数为负，梯度下降便会提高该位置的选择概率。多个坐标同时参与时，两次损失计算各自使用整张掩码，坐标之间的相互影响也会进入估计。"
    /></p>
    <PaperEquation math={tex`\begin{aligned}
      F_p&=(1-p)L_0+pL_1 \\
      \frac{d F_p}{d\phi}&=p(1-p)(L_1-L_0)
    \end{aligned}`} />
    <p className="tide-prose"><Localized
      en="If opening the gate lowers the loss, then L₁−L₀ is negative. For a draw in the lower-only interval, ARM puts L₁ in the minus mask and the centered draw is negative. In the upper-only interval, the order of the losses flips and so does the sign of the centered draw. Both cases point the logit in the same direction under gradient descent. With many coordinates, each loss evaluation reflects an entire mask, so the paired estimate can sample interactions between gates without evaluating every subset. The sparsity regularizer depends explicitly on the selection probabilities and is differentiated separately."
      zh="如果打开开关能降低损失，L₁−L₀ 就为负。随机数落在只有下端掩码选中的区域时，下端对应 L₁，居中的随机数为负。落在只有上端选中的区域时，两项损失互换，居中的随机数也换成正号。两类抽样得到同号的梯度，经梯度下降会把开关的概率往上推。很多坐标一起参与时，每次损失值来自一整张掩码，因此配对估计能看到开关共同变化的影响，同时免去枚举所有组合。稀疏正则项直接依赖选择概率，单独求导即可。"
    /></p>
    <p className="tide-prose"><Localized
      en="For p below one half, the two tails each have length p. Their loss differences have opposite signs, as do the integrals of the centered draw shown below. The two contributions therefore add to the derivative of the expected loss. For p above one half the tails overlap. The loss difference vanishes on that overlap, leaving two exclusive intervals of length 1−p."
      zh="当 p 小于 ½ 时，两端区间的长度都是 p。两端的损失差符号相反，居中随机数在两端的积分也恰好互为相反数，所以两项贡献相加后正好得到期望损失的导数。当 p 大于 ½，两个区间有一部分重叠，重叠处的损失差为零，两侧各剩下长度为 1−p 的独占区间。"
    /></p>
    <PaperEquation math={tex`\begin{aligned}
      \int_{0}^{p}(u-\tfrac12)\,du &= -\tfrac12 p(1-p) \\
      \int_{1-p}^{1}(u-\tfrac12)\,du &= \phantom{-}\tfrac12 p(1-p)
    \end{aligned}`} />
    <p className="tide-prose"><Localized
      en="A single pair of masks gives a noisy gradient estimate. Averaging over draws recovers the gradient in expectation. The learned probabilities supply a ranking for the amplitude update and subsequent pruning."
      zh="单对掩码给出的估计会有波动，无偏性指的是对随机抽样取期望后的结果。学得的概率决定坐标的排序，后面的幅度优化和剪枝都用得上这份排序。"
    /></p>
    <p className="tide-prose"><Localized
      en="The mask update needs two forward loss evaluations per pair. The amplitude update needs the classifier’s input gradient, which makes SASBO a white-box method."
      zh="每对掩码只需两次前向计算来比较损失。幅度优化仍要用到分类器对输入的梯度，因此 SASBO 整体上是白盒方法。"
    /></p>
  </>;
}

export function SasboAmplitudeMath() {
  return <>
    <PaperEquation number="12" math={tex`\begin{aligned}
      \min_E\; &\Vert M\odot E\Vert_2 \\
        &\quad+ \lambda\,\mathcal L(f(x+M\odot E),y_t) \\
      &\text{subject to } -\epsilon\le E_j\le\epsilon
    \end{aligned}`} />
    <p className="tide-prose"><Localized
      en="When Mⱼ is zero, changing Eⱼ leaves both the norm and the classification loss unchanged. In the four-entry example the amplitude update acts only on A and D. Their values can be optimized jointly until the next mask update changes the support."
      zh="当 Mⱼ 为零时，调整 Eⱼ 不会改变扰动范数，也不会影响分类损失。前面四个坐标的例子里，幅度优化只作用于 A 和 D；两项可以一起调整，直到下一轮掩码更新改变入选位置。"
    /></p>
    <p className="tide-prose"><Localized
      en="Once an attack succeeds, SASBO sorts the selected coordinates by probability. A binary search tests progressively shorter prefixes against the classifier. The final ℓ₀ counts the surviving entries under this ordering. Other combinations with a different ordering could also change the prediction."
      zh="攻击成功后，SASBO 按概率给入选坐标排序，用二分搜索检验缩短前缀后的分类结果。最后报告的 ℓ₀ 是这次排序下保留的项数；换一组坐标，也可能用更少的改动改变判断。"
    /></p>
  </>;
}
