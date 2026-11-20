import { ArrowRight } from 'lucide-react';
import { Localized } from '../language';
import { PaperEquation } from './paper-equation';
import './evidence-figure.css';
import './worked-figures.css';

const tex = String.raw;

export function TideInjectionMath() {
  return <>
    <PaperEquation number="1" math={tex`\begin{aligned}
      Z_\tau &= \mathcal F(z_\tau) \\
      \widetilde z_\tau &= \mathcal F^{-1}\!\big((1-M)\odot Z_\tau + M\odot W\big)
    \end{aligned}`} />
    <p className="tide-prose"><Localized
      en="Read the multiplication one frequency at a time. At an unmasked position, the first term supplies the original coefficient and the second vanishes. At a masked position, the first vanishes and the second supplies the learned coefficient. The diagram traces the two cases through the write. In the implementation, conjugate coefficients are kept symmetric so the inverse transform returns a real-valued latent."
      zh="逐个频率来看这次乘法。掩码外，第一项留下原系数，第二项为零。掩码内，第一项为零，第二项填入学到的系数。下图把这两种位置并排展开。实现中还要维持共轭系数的对称性，逆变换才能得到实值潜变量。"
    /></p>
    <figure className="paper-evidence-figure worked-figure">
      <div className="worked-panel tide-spectrum">
        <div>
          <strong><Localized en="Original spectrum" zh="原频谱" /></strong>
          <div className="spectrum-strip" aria-label="Original coefficients">
            {['a', 'b', 'c', 'd', 'e'].map((label, i) => <span key={label} data-masked={i === 1 || i === 2}><i>Z<sub>{label}</sub></i></span>)}
          </div>
        </div>
        <ArrowRight aria-hidden="true" size={18} />
        <div>
          <strong><Localized en="After the masked write" zh="掩码写入后" /></strong>
          <div className="spectrum-strip" aria-label="Spectrum with watermark coefficients">
            {['a', 'b', 'c', 'd', 'e'].map((label, i) => <span key={label} data-masked={i === 1 || i === 2}><i>{i === 1 || i === 2 ? 'W' : 'Z'}<sub>{label}</sub></i></span>)}
          </div>
        </div>
      </div>
      <figcaption><Localized en="Only the highlighted coefficients are replaced. The other entries carry over from the current denoising state." zh="高亮位置由水印系数替换，其余位置沿用当前去噪状态的系数。" /></figcaption>
    </figure>
    <p className="tide-prose"><Localized
      en={<>The inverse transform mixes the changed coefficients throughout the latent. For the next denoising step, this is an actual change of input. One prompt and seed therefore yield a useful pair: run the text-only sampler once for the clean reference, then write the template into the matching intermediate state. The pair isolates the consequence of the write and the steps that follow from it. There is a second use for the pair during training, when the model needs an inexpensive way to tell whether the two samples are already drifting apart.</>}
      zh={<>逆变换会把发生变化的频率混合回整个潜变量，下一步去噪接收到的输入随之改变。固定提示词和种子，就能做出一组对照：跑一次纯文本引导得到无水印参考，再从同一个中间状态写入模板。这组对照把差异限定在写入与余下的采样步骤。训练时也能利用它，以较低开销判断两张图在注入当下是否已经开始偏离。</>}
    /></p>
  </>;
}

export function TideTrainingMath() {
  return <>
    <PaperEquation number="5–7" math={tex`\begin{gathered}
      \begin{aligned}
      d(x,y)&=\lambda_{\mathrm{pix}}\Vert x-y\Vert_2^2 \\
        &\quad+\lambda_{\mathrm{str}}(1-\operatorname{SSIM}(x,y))
      \end{aligned} \\[5pt]
      \begin{aligned}
      \mathcal L_{\mathrm{short}} &= d(\widehat x^{\mathrm{wm}}_{0,\tau},\widehat x^{\mathrm{clean}}_{0,\tau}) \\
      \mathcal L_{\mathrm{long}} &= d(\widehat x^{\mathrm{wm}}_{0,\tau},x_{\mathrm{ref}})
      \end{aligned}
    \end{gathered}`} />
    <p className="tide-prose"><Localized
      en="The pixel term reacts to changes in decoded values. The SSIM term also pulls on local structure. Both losses start from the same decoded one-step watermarked prediction, so their distinction lies in the target on the right. A small short-term loss says that the immediate predictions still resemble each other. The clean prediction at that step can itself have imperfect structure, so the finished clean image provides a second anchor. The detection margin creates a different constraint: a nearly unchanged image can still be useful if its masked coefficients are easier to distinguish from those of its clean counterpart."
      zh="像素项会响应解码值的变化，SSIM 项则同时约束局部结构。两项损失左边都是同一张带水印的单步预测，区别在右边的比较对象。短程损失小说明注入后的即时预测仍然接近无水印预测。可这个时刻的无水印预测本身也可能有结构误差，所以还要用完整的无水印成图作为第二个参照。检测间隔关心的是另一件事：即使图像看着几乎一样，只要掩码内的系数更容易区分，水印仍有用。"
    /></p>
  </>;
}

export function TideGuidanceMath() {
  return <>
    <PaperEquation number="13, 15" math={tex`\begin{aligned}
      \Delta_t^{\mathrm{txt}} &= \epsilon_t-\epsilon_u \\
      \Delta_t^{\mathrm{wm}} &= \epsilon_w-\epsilon_u \\
      \Delta_{t,\mathrm{null}}^{\mathrm{wm}} &=
      \Delta_t^{\mathrm{wm}}-\Pi_{B_t}\!\left(\Delta_t^{\mathrm{wm}}\right)
    \end{aligned}`} />
    <p className="tide-prose"><Localized
      en="The basis Bₜ spans the text residuals from recent steps of this run. Removing the projection makes the retained watermark update orthogonal to that span. As an extreme case, a watermark residual lying entirely in the span leaves nothing to add. A residual already orthogonal to the span survives intact, although it can still be too strong for the current step. This is why the projection and the budgeting rule are separate operations."
      zh="Bₜ 张成这次采样最近几步文本残差所在的子空间。减去投影以后，保留的水印更新与这片子空间正交。极端情况下，水印残差整个落在子空间里，减完就没有可加的分量。若它本来就与子空间正交，就会完整保留，但强度仍可能过大。这就是为什么先决定水印能沿哪些方向更新，再决定加多少。"
    /></p>
    <PaperEquation number="16–18" math={tex`\begin{aligned}
      c_t &= \frac{\operatorname{RMS}(\Pi_{B_t}\Delta_t^{\mathrm{wm}})}
        {\operatorname{RMS}(\Delta_t^{\mathrm{wm}})+\varepsilon} \\
      \kappa_t &= 1-\cos(\Delta_t^{\mathrm{txt}},\Delta_{t+1}^{\mathrm{txt}}) \\
      r_t &= \frac{\operatorname{RMS}(\Delta_{t,\mathrm{null}}^{\mathrm{wm}})}
        {\operatorname{RMS}(\Delta_t^{\mathrm{txt}})+\varepsilon}
    \end{aligned}`} />
    <PaperEquation number="19–20" math={tex`\begin{aligned}
      \eta_t &= (1-c_t)e^{-\kappa_t}\min\!\left(1,\frac{1}{r_t+\varepsilon}\right) \\
      g_t^{\mathrm{wm}} &= (s-\widehat s)\eta_t \\
      g_t^{\mathrm{txt}} &= s-g_t^{\mathrm{wm}}
    \end{aligned}`} />
    <p className="tide-prose"><Localized
      en="The conflict score cₜ is the share of the watermark residual’s RMS magnitude removed by projection. The curvature κₜ is one minus the cosine between the current and previous text residuals. A sharp change of direction reduces the budget through the exponential factor. The ratio rₜ compares the retained watermark magnitude with the text magnitude. Once that ratio is large, the last factor lowers the weight, so a large residual does not automatically buy a large update."
      zh="冲突量 cₜ 是投影去掉的分量占原水印残差 RMS 幅度的比例。曲率 κₜ 由当前步与上一步的文本残差计算，方向转折越大，指数因子就压得越低。比值 rₜ 比较保留的水印分量和文本分量的 RMS 幅度。水印残差已经很强时，最后这个因子会再收紧权重，幅度大并不会自动带来更强的引导。"
    /></p>
    <figure className="paper-evidence-figure worked-figure">
      <div className="worked-panel tide-budget">
        <div className="budget-heading">
          <strong><Localized en="Same total guidance s" zh="同一份总引导预算 s" /></strong>
          <div className="budget-key">
            <span><i data-branch="text" aria-hidden="true" /><Localized en="Text" zh="文本" /></span>
            <span><i data-branch="watermark" aria-hidden="true" /><Localized en="Watermark" zh="水印" /></span>
          </div>
        </div>
        <div className="budget-rows">
          <div><span><Localized en="Text direction holds" zh="文本方向稳定" /></span><div className="budget-rail" data-step="steady" aria-hidden="true"><i /><i /></div></div>
          <div><span><Localized en="Text direction turns" zh="文本方向转折" /></span><div className="budget-rail" data-step="turn" aria-hidden="true"><i /><i /></div></div>
        </div>
      </div>
      <figcaption><Localized en="With overlap and residual strength held fixed, a larger turn gives the watermark less weight. Its unused share returns to text guidance." zh="在重叠程度和残差强度相同的示意中，转折较大的那一步给水印的权重更低，余下份额回到文本引导。" /></figcaption>
    </figure>
    <PaperEquation number="21" math={tex`\begin{aligned}
      \widehat\epsilon_t = \epsilon_u
       &+g_t^{\mathrm{txt}}\Delta_t^{\mathrm{txt}} \\
       &+g_t^{\mathrm{wm}}\Delta^{\mathrm{wm}}_{t,\mathrm{null}}
    \end{aligned}`} />
    <p className="tide-prose"><Localized
      en="The two weights always add to s, and the prompt keeps at least its reserved share. This is a statement about weights, not a bound on how far the next latent travels. Each residual has a different magnitude, and DDIM still applies its timestep-dependent update. The rule limits competition with recent text directions. Agreement with the clean image distribution is evaluated using paired images and distribution-level metrics."
      zh="两路权重始终加起来等于 s，文本至少得到预留的份额。这个等式约束的是权重，下一步潜变量走多远还要看两路残差的幅度，以及 DDIM 在当前步如何更新。引导规则约束的是水印与近期文本方向的竞争；成图分布是否仍接近无水印结果，要靠逐图对照和分布指标来检验。"
    /></p>
  </>;
}

export function TideVerificationMath() {
  return <>
    <PaperEquation number="8, 22" math={tex`\begin{aligned}
      \widehat z_\tau &= \mathcal I_\tau(x';\varnothing) \\
      D_{\mathrm{wm}} &=
        \frac{\left\Vert M\odot(\mathcal F(\widehat z_\tau)-W)\right\Vert_1}{|M|}
    \end{aligned}`} />
    <p className="tide-prose"><Localized
      en="Suppose inversion recovers one written coefficient almost exactly, while a second is shifted by an edit. The first contributes almost no error, the second contributes its absolute mismatch, and everything outside the write mask contributes zero. Those errors are averaged over the selected coefficients. The resulting distance is useful only against the clean distribution of the same statistic. A cutoff chosen from its lower tail determines how often an unmarked image can pass; the reported true-positive rate tells us how many watermarked images pass that very cutoff."
      zh="假设反演几乎恢复了第一个写入系数，第二个系数受编辑影响发生偏移。第一处几乎不计误差，第二处计入差值的绝对量，掩码外全部跳过。最后把误差除以选中系数的数量。得到的距离需要和无水印图上的同一统计量对照。阈值取在无水印距离分布的低端，控制无水印图偶然通过的比例；真阳性率则数清带水印的图中有多少能通过同一个阈值。"
    /></p>
  </>;
}
