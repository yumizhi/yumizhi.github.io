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
      en="At frequencies outside M, the transformed latent retains its original coefficient. Inside M, the learned coefficient W replaces it. Conjugate symmetry ensures that the inverse Fourier transform yields a real-valued latent."
          zh="在掩码 M 以外的频率上，变换后的潜变量沿用原系数。掩码内的频率则以学到的水印系数 W 替换。实现中维持共轭对称性，以保证逆傅里叶变换得到实值潜变量。"
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
      en="The inverse transform spreads the contributions of those selected coefficients across the latent. What DDIM receives is the reconstructed latent, so the write changes the input to the next step. Training uses the matched clean run to judge the change immediately after injection and at the end of sampling."
      zh="逆变换把这些频率系数的贡献分布到整个潜变量上，随后 DDIM 从重建后的潜变量继续更新。训练用同一次无水印采样作参照，分别衡量刚写入时的变化和完整采样结束时的变化。"
    /></p>
  </>;
}

export function TideTrainingMath() {
  return <>
    <PaperEquation number="3–4" math={tex`\begin{aligned}
      \widehat z_{0,\tau}^{\mathrm{wm}}
        &=\frac{\widetilde z_\tau
        -\sqrt{1-\bar\alpha_\tau}\,\widehat\epsilon_\tau^{\mathrm{wm}}}
        {\sqrt{\bar\alpha_\tau}} \\
      \widehat x_{0,\tau}^{\mathrm{wm}}
        &=\operatorname{Dec}(\widehat z_{0,\tau}^{\mathrm{wm}})
    \end{aligned}`} />
    <p className="tide-prose"><Localized
      en="At the injection step, the U-Net estimates the noise in the modified latent. Subtracting the scaled noise estimate and dividing by the signal scale gives a prediction of the clean latent. The VAE decodes it for the image losses. The clean branch uses the same estimator. Its one-step prediction may differ from its finished image because a full run updates the noise prediction at every subsequent step."
          zh="在注入步，U-Net 估计修改后潜变量中的噪声。按当前步噪声尺度扣除预测噪声，再除以信号尺度，得到干净潜变量的单步预测。VAE 将预测解码，用于计算图像损失。无水印分支采用相同的估计器；由于完整去噪会逐步更新噪声预测，单步预测与最终成图可能有差异。"
    /></p>
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
      en="The pixel term reacts to changes in decoded values. The SSIM term also pulls on local structure. Both losses start from the same decoded one-step watermarked prediction, so their distinction lies in the target on the right. A small short-term loss says that the immediate predictions still resemble each other. The clean prediction at that step can itself have imperfect structure, so the finished clean image provides a second anchor. The detection margin asks whether the masked coefficients remain distinguishable even when the decoded images look alike."
      zh="像素项会响应解码值的变化，SSIM 项则同时约束局部结构。两项损失左边都是同一张带水印的单步预测，区别在右边的比较对象。短程损失小说明注入后的即时预测仍然接近无水印预测。可这个时刻的无水印预测本身也可能有结构误差，所以还要用完整的无水印成图作为第二个参照。检测间隔则用来区分两张外观接近的图像在掩码内的系数。"
    /></p>
    <PaperEquation number="9" math={tex`\begin{aligned}
      D^+ &= D_{\mathrm{wm}}(\widehat z^{\mathrm{wm}}_{0,\tau}; W,M) \\
      D^- &= D_{\mathrm{wm}}(\widehat z^{\mathrm{clean}}_{0,\tau}; W,M) \\
      \mathcal L_{\mathrm{det}} &= \max(0, m + D^+ - D^-)
    \end{aligned}`} />
    <p className="tide-prose"><Localized
      en="The margin loss is zero when the unwatermarked estimate lies at least m farther from the template than the marked estimate. A smaller separation contributes a positive penalty. Training measures the two distances on latents from the same step. At verification, only the received image is available, and the decision threshold is calibrated on unwatermarked images."
          zh="当无水印预测与模板的距离比带水印预测至少大 m 时，间隔损失为零。距离差小于 m 时产生惩罚。训练在同一步的配对潜变量上计算两项距离。实际验证只处理收到的图像，决策阈值另由无水印样本校准。"
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
      en="Bₜ spans the recent text residuals. Subtracting the projection eliminates any watermark component in that span. An orthogonal component survives projection in full and can still have a large magnitude. The budget rule scales this remaining component before it enters the denoising update."
          zh="Bₜ 张成近期文本残差所在的子空间。减去投影以后，水印残差落在该子空间内的部分被消除。与子空间正交的部分完整保留，其幅度仍可能较大，因此预算规则还要调整这部分残差进入去噪更新时的权重。"
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
      en="The weights sum to s at every step and reserve a minimum share for the text condition. DDIM advances the latent using the combined noise prediction. The resulting displacement depends on both residuals and the timestep coefficients. Orthogonality to recent text directions is a local constraint and does not guarantee convergence to the unwatermarked image."
          zh="每一步两路权重之和均为 s，文本条件始终保有预留的最低份额。DDIM 根据合成噪声预测推进潜变量，实际位移由两路残差及当前步系数共同决定。与近期文本方向正交只是局部约束，无法保证最终恢复到原本的无水印图像。"
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
      en="The verifier averages the absolute spectral mismatch over the coefficients selected by M. A close match has a small distance. Calibration places the cutoff in the lower tail of the clean-image distance distribution. The reported true-positive rate is the fraction of marked images below that cutoff."
          zh="验证器在掩码 M 选中的系数上计算频谱差值的平均绝对量，距离越小表示与模板越接近。判定阈值取自无水印图像距离分布的低端。实验报告的真阳性率是带水印图像中距离低于该阈值的比例。"
    /></p>
  </>;
}
