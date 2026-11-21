import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react';
import { Localized } from '../language';
import { PaperEquation } from './paper-equation';
import './evidence-figure.css';
import './worked-figures.css';

const tex = String.raw;

export function SamTaskMath() {
  return <>
    <PaperEquation number="2–3" math={tex`\begin{aligned}
      G_{i,j}&=\sum_{s\in S_i}w_s\nabla_x\mathcal L_s(x_{i,j}) \\
      x_{i,j+1}&=x_{i,j}+\alpha\,\operatorname{sign}(G_{i,j})
    \end{aligned}`} />
    <p className="tide-prose"><Localized
      en="Each support model supplies a gradient with respect to the same current image. At an entry where two models disagree, their weighted sum reduces the contribution of the conflicting directions. The sign is taken after that sum. When all the gradients at an entry share a sign, the weighted sum retains that sign. The calculation updates the image while keeping the classifiers fixed."
      zh="每个支持模型都对同一张当前图像求输入梯度。在某个位置上，如果两种模型的梯度方向相反，加权和会抵消一部分，再对这个和取符号。在方向一致的位置，更新就沿共同方向走。这一步始终在改图像，分类器及其训练得到的参数保持冻结。"
    /></p>
    <p className="tide-prose"><Localized
      en="After K such updates, the query model supplies a gradient at the image proposed by the support models. SAM keeps the distinction between where this gradient is measured and where it is applied. Write vᵢ for the image before projection. In the outer update, the support proposal appears inside the gradient; the starting image for the new move is still xᵢ."
      zh="支持模型完成 K 次更新后，查询模型在它们提出的图像上求梯度。SAM 区分了梯度在哪里计算，以及计算出的改动加到哪里。把投影前的图记为 vᵢ，外层式子的梯度在支持组提出的图像上计算，新一轮更新却还是从原来的 xᵢ 出发。"
    /></p>
    <PaperEquation number="5, Alg. 1" math={tex`\begin{aligned}
      q_i &= \nabla_x\mathcal L_{q}(x_{i,K}) \\
      v_i &= x_i + \beta\,\operatorname{sign}(q_i) \\
      x_{i+1} &= \mathcal P(v_i)
    \end{aligned}`} />
    <SamMethod />
    <p className="tide-prose"><Localized
      en="For example, one support model may push on an edge that another model barely uses. If the blended support update changes that edge, the query model re-evaluates the perturbed image with its own loss. Its gradient can point somewhere else. Applying this signal to the saved state avoids directly accumulating every temporary support step."
      zh="例如，某个支持模型可能主要依赖一条边缘，另一个模型却很少用它。支持组的合并更新动了这条边缘以后，查询模型会在改过的图上用自己的损失重新评估，得到的梯度可能指向别处。SAM 把查询信号加回本轮的起始图像，支持组的临时更新只用来确定求梯度的位置。"
    /></p>
  </>;
}

function SamMethod() {
  return (
    <figure id="handoff-figure" className="paper-evidence-figure worked-figure sam-handoff">
      <div className="worked-panel sam-board">
        <div className="sam-evaluate">
          <div>
            <span className="sam-math">x<sub>i</sub></span>
            <strong><Localized en="Start of task" zh="本轮起点" /></strong>
          </div>
          <ArrowRight aria-hidden="true" size={16} />
          <div>
            <span className="sam-math">x<sub>i,K</sub></span>
            <strong><Localized en="Support proposal" zh="支持组提案" /></strong>
          </div>
          <ArrowRight aria-hidden="true" size={16} />
          <div data-query>
            <span className="sam-math">q<sub>i</sub></span>
            <strong><Localized en="Query gradient" zh="查询梯度" /></strong>
          </div>
        </div>
        <div className="sam-query-signal" aria-hidden="true"><ArrowDown size={16} /></div>
        <div className="sam-commit">
          <div>
            <span className="sam-math">x<sub>i</sub> + β sign(q<sub>i</sub>)</span>
            <strong><Localized en="Update the saved image" zh="更新保留的起点图像" /></strong>
          </div>
          <ArrowRight aria-hidden="true" size={16} />
          <div>
            <span className="sam-math">x<sub>i+1</sub></span>
            <strong><Localized en="Project to budget" zh="投影回预算内" /></strong>
          </div>
          <ArrowRight aria-hidden="true" size={16} />
          <div className="sam-next-task">
            <ArrowUp aria-hidden="true" size={14} />
            <strong><Localized en="Resample roles" zh="下一轮重新分组" /></strong>
          </div>
        </div>
      </div>
      <figcaption><Localized en="One SAM task. The query gradient is measured at the proposal and applied to the saved starting image." zh="一次 SAM 任务。查询梯度在支持组的提案上计算，再加回本轮保留的起点图像。" /></figcaption>
    </figure>
  );
}

const projection = [
  { id: 'A', proposed: ['a', '0', '0'], clipped: ['ε', '0', '0'], saved: <>2aε − ε<sup>2</sup></> },
  { id: 'B', proposed: ['ε', 'ε', 'ε'], clipped: ['ε', 'ε', 'ε'], saved: <>3ε<sup>2</sup></> },
];

export function SamProjectionMath() {
  return <>
    <h3 className="paper-subsection"><Localized en="Projection onto the pixel budget" zh="按像素预算投影" /></h3>
    <p className="tide-prose"><Localized
      en="The outer step can propose changes throughout the image, including at pixels that were untouched in the previous task. To compress that proposal, compare two possible outcomes at each pixel. We can restore all three channels to the original values, or we can keep the proposed changes after clipping each channel to the allowed amplitude. The choice is made for the whole pixel because SAM counts a changed spatial position once, even if all three channels at that position change."
      zh="外层更新可以在整张图上提出改动，包括上一轮还未动过的位置。要把这次提案压回预算内，每个像素有两种去处。一种是把三个通道全部恢复到原值，另一种是把各通道的改动裁剪到允许的幅度再保留。这个决策以整个像素为单位，因为在 SAM 里，同一个位置即使改了三个通道，也只占一份像素预算。"
    /></p>
    <PaperEquation number="7" math={tex`\begin{aligned}
      \min_z\;&\Vert v-z\Vert_F^2 \\
      \text{s.t. }&|z_{ij}-x_{ij}|\le\epsilon, \\
      &\#\{i:z_{i,:}\ne x_{i,:}\}\le k
    \end{aligned}`} />
    <p className="tide-prose"><Localized
      en="The squared distance in this objective is between the new sparse image z and the candidate v. Both constraints use the original image x as their reference. Keeping those references separate helps explain the clipping rule. A candidate channel already within its allowed interval can be copied exactly, giving zero distance to the proposal there. If the proposal crosses either boundary, the closest allowed value is that boundary. For a chosen pixel, clipping performs this calculation for each of its three channels."
      zh="目标函数的平方距离量的是新稀疏图 z 和提案 v 的差，两项约束量的却是 z 相对原图 x 的改动。分清参照，就能看出为什么用裁剪。若候选通道仍在允许区间里，可以照用，离提案的距离就是零。越过上界或下界时，离提案最近的可行值就是那条边界。对于选中的像素，裁剪分别落实到它的三个通道。"
    /></p>
    <PaperEquation number="9–10" math={tex`\begin{aligned}
      d_{ij} &= v_{ij}-x_{ij} \\
      \bar d_{ij} &= \operatorname{clip}_{[-\epsilon,\epsilon]}(d_{ij}) \\
      S_i &= \sum_{j\in\{R,G,B\}}\!
        \left[d_{ij}^{\,2}-(d_{ij}-\bar d_{ij})^2\right]
    \end{aligned}`} />
    <p className="tide-prose"><Localized
      en="In this formula, x is the original image and v is the dense candidate. If a pixel is dropped, its squared error from the candidate is the sum of the squared proposed changes. If it is kept, the error is the excess left over after clipping. Subtracting the two errors gives the saving Sᵢ. Savings add across pixels. Choosing the k biggest savings therefore gives a closest feasible image for this projection objective. A candidate selection that omits a larger saving in favor of a smaller one can always improve by swapping them."
      zh="这里 x 是原图，v 是稠密提案。丢掉一个像素时，与提案的平方误差是三个通道改动量的平方和。保留该像素时，误差来自裁剪后剩下的超出部分。两种误差之差就是 Sᵢ，表示把一个名额给这个像素能少掉多少误差。像素间的收益可以直接相加，所以选收益最大的 k 个，就能得到这个投影目标下距离最近的可行图像。如果舍弃了高收益的位置、选了一个低收益的位置，交换它们就能让距离更小。"
    /></p>
    <figure id="projection-example" className="paper-evidence-figure worked-figure">
      <div className="worked-panel sam-projection">
        <div className="projection-heading">
          <strong><Localized en="Two pixels, one slot" zh="两个像素，一个保留名额" /></strong>
          <span className="sam-math">ε &lt; a &lt; 2ε</span>
        </div>
        <table>
          <thead><tr>
            <th scope="col"><Localized en="Pixel" zh="像素" /></th>
            <th scope="col"><Localized en="Proposed RGB" zh="RGB 提案" /></th>
            <th scope="col"><Localized en="Clipped RGB" zh="裁剪后 RGB" /></th>
            <th scope="col"><Localized en="Error saved" zh="减少的误差" /></th>
          </tr></thead>
          <tbody>{projection.map(({ id, proposed, clipped, saved }) => (
            <tr key={id} data-retained={id === 'B'}>
              <th scope="row">{id}</th>
              <td><ChannelGroup values={proposed} /></td>
              <td><ChannelGroup values={clipped} /></td>
              <td><span className="sam-math">{saved}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <figcaption><Localized en="B keeps the slot. The biggest individual channel belongs to A, but retaining B saves more squared error across all three channels." zh="保留 B。最大的单通道改动出现在 A，但保留 B 能在三个通道合计减少更多平方误差。" /></figcaption>
    </figure>
    <p className="tide-prose"><Localized
      en="For pixel A, the saving is a²−(a−ε)². Since a is below twice the cap, that saving is less than the three squared channel changes that can be kept at B. The comparison explains how a pixel with three moderate changes can beat one with a single stronger change. It also identifies what the projection optimizes. The score measures closeness to the dense candidate. Transfer comes from the feedback used to build that candidate and must still be checked on independent classifiers."
      zh="对 A 来说，保留它省下的误差是 a²−(a−ε)²。因为 a 小于两倍上限，这个差比 B 可以完整留下的三个通道改动平方和更小。于是，即使 A 有一个更强的单通道改动，也会输给 B 的三处中等幅度改动。这同时说明了投影究竟在优化什么。收益衡量的是与稠密提案的距离。提案能否迁移，取决于构造它时用的反馈，仍要在独立分类器上检验。"
    /></p>
  </>;
}

function ChannelGroup({ values }: { values: string[] }) {
  return (
    <span className="channel-group">
      {values.map((value, channel) => (
        <span key={channel} data-channel={channel} data-zero={value === '0'}>{value}</span>
      ))}
    </span>
  );
}
