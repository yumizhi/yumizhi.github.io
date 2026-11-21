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
      en="A coordinate in this formulation is one entry of the flattened image tensor. Neighboring channels can therefore behave independently. If the selected entry belongs to the red channel of a pixel, the green and blue entries at the same location need not change with it. The dog comparison above shows the result of this design visually. The altered locations are scattered, and even at a marked location the edit may live in a single channel."
      zh="这里的一个坐标是展平后图像张量中的一项，因此同一像素的不同通道可以独立变化。如果选中的是某个像素的红色通道，同一处的绿色和蓝色通道可以保持原值。前面的狗图里，改动位置散落在图上。即使在标出的位置，也可能只有一个通道被改。"
    /></p>
    <p className="tide-prose"><Localized
      en="Keeping the two variables separate also changes the search problem. With the mask fixed, every admitted amplitude can slide continuously between two bounds. With the amplitudes fixed, switching one gate changes the classifier input by the full amount assigned to that entry. A derivative with respect to the binary gate is unavailable. We can instead make its probability continuous, while still sending genuine binary masks to the classifier."
      zh="把两类变量分开后，搜索也分成了两个性质不同的问题。固定掩码，允许改动的幅度能在上下界之间连续调整。固定幅度，打开一处开关就会立刻把该处的整个改动加到分类器输入上。二值开关无法直接求导，但可以改为调整开关打开的概率，真正送给分类器的仍是二值掩码。"
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
      en="Both tests select the coordinate with probability pⱼ. They share the same draw, so the lower and upper shaded intervals determine which two settings will be compared. In the special case where every other coordinate is held fixed, a draw in the overlap selects the entry in both masks. A draw outside both intervals selects it in neither. Those cases contribute zero to the loss difference. The informative draws switch the entry on in one mask and off in the other."
      zh="两种测试选中该坐标的概率都是 pⱼ，而且用的都是同一个随机数。图中下端和上端的阴影分别决定两张掩码选哪些位置。先固定其他坐标，只看这一项。随机数落进重叠区时，两张掩码都打开开关。落在两个区间之外时，两个开关都关闭。这两种情况下损失之差都是零。有效的比较来自只打开其中一个开关的抽样。"
    /></p>

    <PaperEquation number="5, 8" math={tex`\begin{aligned}
      R(\phi)&=\mathbb E_M[F(M)] + \sum_j e_j p_j
    \end{aligned}`} />
    <p className="tide-prose"><Localized
      en="Each evaluation of F sees one masked image. The coordinate update instead tries to decrease its expectation under the current probabilities, alongside the amplitude-weighted probability penalty written in the paper. A probability can be optimized continuously even as the sampled masks remain discrete. The penalty already has an explicit derivative through the sigmoid. It is the classifier-loss expectation that calls for a sampling estimator."
      zh="每次 F 都在一张具体的掩码图上算损失。更新坐标时，优化的是当前概率下的期望损失，再加上论文里的幅度加权概率惩罚。掩码始终是离散的，它的选择概率却可以连续优化。惩罚项能直接通过 sigmoid 求导，需要通过抽样来估计梯度的是分类损失的期望。"
    /></p>
    <PaperEquation number="7" math={tex`\begin{aligned}
      &\nabla_\phi\,\mathbb E_M[F(M)] \\
      &\quad=\mathbb E_u\!\left[\big(F(M^+)-F(M^-)\big)
      \left(u-\tfrac12\right)\right]
    \end{aligned}`} />
    <p className="tide-prose"><Localized
      en="Here F is the classifier loss for a sampled mask at the current amplitudes. For a single gate, call the two possible loss values L₀ and L₁. The mean is a mixture of those two values. Differentiating the mixture gives a small calculation against which to check the estimator."
      zh="这里 F 是固定当前幅度时，一张抽样掩码得到的分类损失。如果只有一个开关，记两种状态的损失为 L₀ 和 L₁，期望损失就是这两项的加权平均。直接对它求导，可以用来核对估计式。"
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
      en="We can check the expectation directly when p is less than one half. Only the two tails contribute. In the lower tail, the loss difference is L₀−L₁. Integrating the centered draw over that tail gives negative one half of p(1−p). In the upper tail the two signs reverse, giving an equal contribution. Their sum gives the derivative above. With p above one half, the overlap contributes zero and the two exclusive intervals have length 1−p, which gives the same result."
      zh="当 p 小于一半时，可以把期望直接算一遍。只有两个尾部区间有贡献。下端的损失差是 L₀−L₁，居中后的随机数在这个区间积分，结果为 −p(1−p) 的一半。上端的两个符号同时反过来，贡献正好相等。两项相加就是上面的导数。p 大于一半时，中间的重叠区贡献为零，两边独占区长度都变成 1−p，算出的导数依然相同。"
    /></p>
    <PaperEquation math={tex`\begin{aligned}
      \int_{0}^{p}(u-\tfrac12)\,du &= -\tfrac12 p(1-p) \\
      \int_{1-p}^{1}(u-\tfrac12)\,du &= \phantom{-}\tfrac12 p(1-p)
    \end{aligned}`} />
    <p className="tide-prose"><Localized
      en="Being unbiased is a property of the average over draws. A single pair is still noisy, and sampled masks do not directly produce the final sparse budget. The probability update learns which positions to try. Ranking then makes a firm choice before the continuous magnitude step, and the final classifier evaluation checks that the proposed sparse image actually changes the decision."
      zh="无偏说的是许多次抽样的平均值。单次估计仍会波动，随机掩码里的激活数量也不会刚好等于最终预算。概率更新学的是哪些位置值得试。幅度更新前，先按排名选定坐标。最终这张稀疏图是否改变了判断，还要重新交给分类器核对。"
    /></p>
    <p className="tide-prose"><Localized
      en="The paired estimate needs only forward loss evaluations for the mask step. The amplitude step differentiates the classifier with respect to the input, so the complete algorithm still assumes white-box access."
      zh="掩码更新里，配对估计只需要前向计算损失。SASBO 整体仍是白盒方法，因为幅度更新要对分类器输入求梯度。ARM 处理的是白盒优化里的离散部分，估计时无需穿过二值抽样做反向传播。"
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
      en="Every term that depends on a particular amplitude sees it through MⱼEⱼ. If B is masked off in the earlier example, adjusting its candidate amplitude has no effect on either objective term. With the mask held fixed, the optimization spends its useful updates on A and D. In the next mask update, the classifier sees a different set of candidates, so a change that previously helped in combination with A can lose its value once A is absent."
      zh="与某个幅度有关的项，都通过 MⱼEⱼ 接收它。回到前面的例子，B 被掩掉以后，调整 B 的候选幅度不会影响目标函数的两项。固定掩码时，有效的梯度更新都花在 A 和 D 上。到了下一轮掩码更新，分类器会看到新的坐标组合。先前和 A 搭配有效的坐标，等 A 被移除后也可能没那么有用了。"
    /></p>
    <p className="tide-prose"><Localized
      en="The final pruning starts with a mask that already works. It orders the learned probabilities and tries successively smaller prefixes, checking the classifier again for each candidate. A failed prefix can still have high-ranked entries individually; what it lacks is a combination sufficient to change the decision. The resulting count describes what survived this search over a learned ranking. A wholly different combination of low-ranked entries is outside the search."
      zh="最后的压缩从已经有效的掩码出发。算法按学到的概率排序，尝试缩短前缀，并把每个候选结果重新交给分类器。失败的前缀里，每一项仍可能排得很靠前，只是剩下的组合不足以改变决策。最终计数描述的是这次按排名搜索后保留下来的改动。由一组排名靠后的位置组成的全新组合不在这轮搜索范围内。"
    /></p>
  </>;
}
