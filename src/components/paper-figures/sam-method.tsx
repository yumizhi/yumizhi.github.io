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
      en="After K support updates the query model evaluates the proposal xᵢ,ₖ. Its gradient is applied at the saved task input xᵢ. The resulting candidate vᵢ is projected to the pixel budget before the next task begins."
          zh="经过 K 次支持组更新，查询模型在提案 xᵢ,ₖ 处计算梯度。该梯度作用于保留的本轮初始图像 xᵢ，所得候选图 vᵢ 经稀疏投影后进入下一轮。"
    /></p>
    <PaperEquation number="5, Alg. 1" math={tex`\begin{aligned}
      q_i &= \nabla_x\mathcal L_{q}(x_{i,K}) \\
      v_i &= x_i + \beta\,\operatorname{sign}(q_i) \\
      x_{i+1} &= \mathcal P(v_i)
    \end{aligned}`} />

  </>;
}

export function SamMethod() {
  return (
    <figure id="handoff-figure" className="paper-evidence-figure worked-figure sam-handoff">
      <div className="sam-role-path">
        <div><strong><Localized en="Accessible pool" zh="可访问的模型池"/></strong><span><Localized en="Roles in two example tasks" zh="两轮任务中的示意分工"/></span>
          <table><thead><tr><th><Localized en="Task" zh="任务"/></th><th><Localized en="Support" zh="支持模型"/></th><th><Localized en="Query" zh="查询模型"/></th></tr></thead><tbody>
            <tr><th scope="row">i</th><td>A, B</td><td>C</td></tr><tr><th scope="row">i + 1</th><td>B, C</td><td>A</td></tr>
          </tbody></table></div>
        <ArrowRight className="role-transfer-arrow" aria-hidden="true"/>
        <div><strong><Localized en="Independent targets" zh="独立目标模型"/></strong><span><Localized en="Evaluate the final images" zh="只评估最终图像"/></span>
          <p><Localized en="Six classifiers outside the pool measure transfer after the last task." zh="最后一次任务结束后，由池外的六个分类器衡量迁移表现。"/></p></div>
      </div>
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
      <figcaption><Localized en="A, B and C denote accessible classifiers with different roles across two tasks. Inside one task, the query model evaluates the support proposal. Its gradient updates the image retained between tasks." zh="A、B、C 表示两轮任务中交换角色的可访问模型。单轮任务中，查询模型在支持组的候选图上计算梯度，再以该梯度更新轮次间保留的图像。" /></figcaption>
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
      en="The outer update can affect pixels outside the previous support. Projection bounds each channel’s change and retains at most k spatial positions. A location counts once toward the budget whether one, two or all three colour channels change."
          zh="外层更新可以作用于上一轮掩码以外的像素。投影限制每个通道的改动幅度，并最多保留 k 个空间位置。一个位置无论改动了一个、两个还是三个颜色通道，都只占一个像素名额。"
    /></p>
    <PaperEquation number="7" math={tex`\begin{aligned}
      \min_z\;&\Vert v-z\Vert_F^2 \\
      \text{s.t. }&|z_{ij}-x_{ij}|\le\epsilon, \\
      &\#\{i:z_{i,:}\ne x_{i,:}\}\le k
    \end{aligned}`} />
    <p className="tide-prose"><Localized
      en="The objective measures squared distance to the dense proposal v. The bounds are measured relative to the original image x. At a retained pixel, a channel within its permitted interval keeps its proposed value. A channel outside the interval is clipped to the nearest endpoint."
          zh="目标函数衡量稀疏解与稠密提案 v 的平方距离，两项约束以原图 x 为基准。在保留的位置上，位于允许区间内的通道沿用候选值；超出区间的通道裁剪到最近的端点。"
    /></p>
    <PaperEquation number="9–10" math={tex`\begin{aligned}
      d_{ij} &= v_{ij}-x_{ij} \\
      \bar d_{ij} &= \operatorname{clip}_{[-\epsilon,\epsilon]}(d_{ij}) \\
      S_i &= \sum_{j\in\{R,G,B\}}\!
        \left[d_{ij}^{\,2}-(d_{ij}-\bar d_{ij})^2\right]
    \end{aligned}`} />
    <p className="tide-prose"><Localized
      en="Dropping a position incurs the squared magnitude of its proposed RGB change. Keeping the clipped position incurs only the squared excess above the permitted amplitudes. Their difference Sᵢ is the reduction in projection error obtained by retaining that pixel. The objective adds over positions, so the k largest savings minimize the total error at that budget."
          zh="舍弃一个位置时，其误差为三个通道候选改动量的平方和。保留并裁剪该位置时，误差仅来自各通道超出允许幅度的部分。两种误差之差 Sᵢ 是保留该位置带来的误差减少量。目标函数可按空间位置求和，故在给定预算下，选取 Sᵢ 最大的 k 个位置使投影误差最小。"
    /></p>
    <figure id="projection-example" className="paper-evidence-figure worked-figure">
      <div className="worked-panel sam-projection">
        <div className="projection-heading">
          <strong><Localized en="Projection error at two pixels" zh="两个像素的投影误差" /></strong>
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
      <figcaption><Localized en="The largest individual channel change occurs at A. Retaining B produces the greater reduction in squared error summed over channels." zh="最大的单通道改动位于 A。按三个通道合计，保留 B 能减少更多平方误差。" /></figcaption>
    </figure>
    <p className="tide-prose"><Localized
      en="In the example, A saves 2aε − ε² and B saves 3ε². For the displayed interval, the latter is larger. This criterion ranks positions by distance to the candidate. Transfer performance is evaluated separately on independent classifiers."
          zh="示例中，保留 A 可减少 2aε − ε² 的误差，保留 B 可减少 3ε²。在图示区间内，后者较大。这一排序由到候选图的距离决定；图像的迁移性能另由独立分类器评估。"
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
