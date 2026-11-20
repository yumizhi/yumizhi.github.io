import type { Paper } from '@/lib/content';
import { ArrowUpRight } from 'lucide-react';
import { asset } from '@/lib/paths';
import { Localized } from '../language';
import { PaperArticle } from '../paper-article';
import { PaperTitle } from '../paper-title';
import { TideComparison } from './comparison';
import { InjectionStudy } from '../research-experiment';
import { GuidanceComparison } from './guidance-comparison';
import { ComparisonChart } from '../comparison-chart';

const authorNotes = ['1,2', '1,3', '4', '1,2', '1,2,*'];
const affiliations = [
  'State Key Laboratory of Novel Software Technology, Nanjing University',
  'School of Computer Science, Nanjing University',
  'School of Management, Nanjing University of Posts and Telecommunications',
  'Guodian Nanjing Automation Co., Ltd.',
];
// SD 2.1, Table 1. Attacked values are the means over seven settings.
const verification = [
  ['Tree-Ring (key)', '1.000', '0.694', '0.975'],
  ['Tree-Ring (paired)', '1.000', '0.765', '0.962'],
  ['ROBIN', '1.000', '0.825', '0.981'],
  ['TIDE', '1.000', '0.986', '0.999'],
];

export function TidePaper({paper}:{paper:Paper}){
  const [methodTitle, modelScope] = paper.title.split(' for ');
  return <PaperArticle paper={paper} authorNotes={authorNotes} affiliations={affiliations}
    abstractBreaks={/ (?=We propose TIDE,|Verification uses )/}
    title={<><PaperTitle>{methodTitle}</PaperTitle> <span className="tide-title-scope">for <PaperTitle>{modelScope}</PaperTitle></span></>}>
    <section id="method" className="tide-method-band">
      <div className="tide-bound">
        <header className="tide-chapter-head">
          <p className="tide-kicker"><Localized en="Method" zh="研究方法"/></p>
          <h2><Localized en="Preserving a signal without changing the scene" zh="保留水印，也保留原本的画面"/></h2>
        </header>
        <p className="tide-prose"><Localized
          en={<>Once a watermark enters the latent, the remaining denoising steps can weaken it. Strengthening it indiscriminately can also pull the image away from the prompt. TIDE learns a watermark and an auxiliary condition together, then uses <strong>the recent direction of text guidance</strong> to decide how much of the watermark update to keep at each step.</>}
          zh={<>水印写入潜变量之后，还要经过多步去噪。这个过程可能削弱水印，而一味加大水印引导，又可能改变提示词原本要生成的内容。TIDE 联合学习水印和辅助条件，再根据<strong>最近几步的文本引导方向</strong>，决定每一步保留哪些水印更新分量。</>}/></p>
        <p className="tide-prose"><Localized
          en="Moving the watermark to an intermediate step protects the early stages in which the scene takes shape. But choosing an injection time does not settle what happens next. The latent keeps changing, and a fixed watermark-guidance weight cannot respond when the text and watermark updates begin to overlap. TIDE addresses both parts: learning a signal that can persist, and controlling its contribution as sampling continues."
          zh="把水印推迟到中间步骤，可以避开图像内容初步成形的阶段。但选好注入时刻，并没有解决后面的问题：潜变量仍在变化，文本与水印的更新方向也在变化，固定的水印引导权重无法随之调整。TIDE 因此同时处理两件事：学习能够保留下来的水印信号，以及控制它在后续采样中的作用。"/></p>
        <h3 className="paper-subsection" id="learning"><Localized en="Learned parameters and frozen components" zh="学习参数与冻结模块"/></h3>
        <p className="tide-prose"><Localized
          en={<>The VAE, U-Net, and text encoder stay frozen. Training changes only <strong>the watermark spectrum and an auxiliary condition embedding</strong>. At the chosen step, selected Fourier coefficients of the latent are replaced by the learned watermark. The auxiliary condition gives the existing U-Net a way to support that signal during the remaining denoising steps.</>}
          zh={<>VAE、U-Net 和文本编码器保持冻结，只学习<strong>水印频谱和一个辅助条件嵌入</strong>。到达选定的采样步骤后，用学到的水印替换潜变量频域中指定位置的系数；辅助条件则让原有 U-Net 在后续去噪时提供维持水印的引导。</>}/></p>
        <figure className="tide-overview">
          <img loading="lazy" width="1800" height="1383" src={asset('/images/tide-paper/overview.webp')}
            alt="TIDE architecture: intermediate watermark injection, trajectory-aware guidance and inversion-based verification."/>
          <figcaption>
            <span lang="en"><strong>Figure 1: Overview of TIDE.</strong> A learnable watermark is injected into an intermediate latent state. After injection, TIDE projects the watermark residual away from recent text-guidance directions and assigns an adaptive guidance budget. Verification partially inverts a queried image with an empty prompt and matches the recovered Fourier coefficients to the target watermark.</span>
            <span className="paper-figure-actions">
              <a href={asset('/images/tide-paper/overview.webp')} target="_blank" rel="noreferrer"><Localized en="Open full-size figure" zh="查看完整原图" /><ArrowUpRight size={13} aria-hidden="true" /></a>
            </span>
          </figcaption>
        </figure>
        <p className="tide-prose tide-demo-intro"><Localized
          en="Training constrains both image content and watermark detection. Short-term reconstruction limits the immediate change caused by injection; a second preservation loss compares the predicted image with the final unwatermarked reference. A detection margin separates watermarked and clean predictions in the verification space. An energy constraint on the watermark prevents the spectrum from growing arbitrarily strong or collapsing."
          zh="训练目标需要兼顾可见内容与可检测信号。短程重建约束注入当下造成的变化，另一项内容保持损失将预测图像与完整采样得到的无水印参考图比较。检测间隔损失拉开水印与无水印预测在验证空间中的距离，频谱能量约束则避免水印强度无限增大或退化。"/></p>
        <h3 className="paper-subsection" id="guidance"><Localized en="Three predictions, one controlled update" zh="三路预测，形成一次受控更新"/></h3>
        <p className="tide-prose"><Localized
          en="At each step after injection, the same U-Net is evaluated with an empty condition, the text prompt, and the learned watermark condition. Subtracting the unconditional prediction isolates what each condition adds. Recent text residuals define a local subspace; TIDE removes the watermark residual’s projection onto that subspace and retains its complementary component."
          zh="注入后的每一步，同一个 U-Net 分别接收空条件、文本条件和水印条件。用两路条件预测分别减去无条件预测，就得到文本与水印各自增加的引导残差。TIDE 用近期文本残差估计局部子空间，去掉水印残差在其中的投影，保留互补分量。"/></p>
        <GuidanceComparison/>
        <p className="tide-prose"><Localized
          en={<>Direction is only half the decision. TIDE also adjusts <strong>how much guidance the watermark receives</strong>. Greater overlap, a sharper turn in the text trajectory, or an already strong complementary residual lowers the watermark budget. The total budget is shared with the text branch, which always retains a reserved minimum. This calculation repeats at every remaining step.</>}
          zh={<>选好方向之后，还需要决定<strong>水印引导占多少预算</strong>。与文本方向重合越多、局部轨迹转弯越明显，或互补残差本身越强，分给水印的预算就越低。总预算在文本与水印之间重新分配，同时为文本保留最低额度。这套计算会在注入后的每一步重复执行。</>}/></p>
        <h3 className="paper-subsection" id="verification"><Localized en="Recovering the signal from an image" zh="从最终图像中找回水印"/></h3>
        <p className="tide-prose"><Localized
          en="Verification starts with the image being checked. It is encoded into latent space and partially inverted to the injection step using an empty prompt. The detector then compares the recovered Fourier coefficients with the learned watermark in the selected region. A smaller distance means stronger evidence of the watermark; the decision threshold is calibrated using unwatermarked images. Neither the original prompt nor a clean reference image is needed at query time."
          zh="检测从待验证图像开始：先编码为潜变量，再使用空提示词执行部分 DDIM 反演，回到水印注入时刻。随后在指定频域区域内，将恢复的系数与水印模板比较。距离越小，匹配证据越强；判定阈值由无水印图像校准。实际查询时不需要原提示词，也不需要对应的无水印参考图。"/></p>
        <figure className="paper-mechanism">
          <figcaption><Localized en="Verification follows the generation path back to the injection step" zh="沿生成轨迹回溯到水印注入时刻"/></figcaption>
          <div className="paper-flow">
            <div><b>01</b><strong><Localized en="Query image" zh="待验证图像"/></strong><p><Localized en="Encode with the frozen VAE" zh="使用冻结的 VAE 编码"/></p></div><span aria-hidden="true">→</span>
            <div><b>02</b><strong><Localized en="Partial inversion" zh="部分反演"/></strong><p><Localized en="Return to the injection step with an empty prompt" zh="以空提示词回到注入步骤"/></p></div><span aria-hidden="true">→</span>
            <div><b>03</b><strong><Localized en="Frequency matching" zh="频域匹配"/></strong><p><Localized en="Compare the masked spectrum with the watermark" zh="在掩码区域与水印模板比较"/></p></div>
          </div>
        </figure>
      </div>
    </section>
    <section id="examples" className="tide-results tide-bound">
      <header className="tide-chapter-head">
        <p className="tide-kicker"><Localized en="Results" zh="实验结果"/></p>
        <h2><Localized en="Image content after watermarking" zh={<>加入水印后，<span className="tide-heading-phrase">图像内容的变化</span></>}/></h2>
      </header>
      <p className="tide-prose"><Localized en="Look at the sports car. Tree-Ring shows it from behind, while TIDE retains the front wheel and the viewpoint of the unwatermarked image. Select another prompt to compare the composition and finer details." zh="先看跑车。Tree-Ring 生成的是车尾，TIDE 则保留了无水印图像中的前轮和车头视角。换一组提示词，可以继续对照主体的位置、构图和纹理。"/></p>
      {paper.image&&<TideComparison original={paper.image}/>}
      <p className="tide-prose tide-demo-intro"><Localized
        en="Content preservation is evaluated against the image generated without a watermark. In Table 2, TIDE’s CLIP score is 0.403, matching the unwatermarked baseline, while LPIPS to the clean reference is 0.147 versus ROBIN’s 0.157. Prompt alignment and reference similarity measure different aspects of preservation, so both matter here."
        zh="内容保持以同一设置下生成的无水印图像为参考。论文表 2 中，TIDE 的 CLIP 得分为 0.403，与无水印基线相当；相对无水印参考图的 LPIPS 为 0.147，ROBIN 为 0.157。前者反映提示词对齐，后者衡量参考图像相似性，需要结合来看。"/></p>
      <div className="tide-quant">
        <h3><Localized en="Detection after image edits" zh="图像编辑后的水印检测"/></h3>
        <p className="tide-prose"><Localized
          en={<>Without edits, both ROBIN and TIDE detect all watermarked images at a 1% false-positive rate. Across seven attack settings on Stable Diffusion 2.1, mean detection at the same false-positive rate is <strong>82.5% for ROBIN and 98.6% for TIDE</strong>.</>}
          zh={<>在 1% 的假阳性率下，ROBIN 和 TIDE 都能检出全部未经编辑的水印图像。差别出现在编辑之后：在 Stable Diffusion 2.1 的七类攻击设置下，同一假阳性率下的平均检出率分别为 <strong>82.5% 和 98.6%</strong>。</>}/></p>
        <ComparisonChart title={{en:'Detection before and after editing',zh:'编辑前后的水印检出率'}}
          note={{en:'SD 2.1 · TPR at 1% FPR · after editing: mean of seven attacks',zh:'SD 2.1 · TPR@1%FPR · 编辑后数值为七类攻击的均值'}}
          series={[{label:{en:'No attack',zh:'未经编辑'}},{label:{en:'After attack',zh:'编辑后'},accent:true}]}
          rows={verification.map(([label,clean,attacked])=>({label,values:[Number(clean)*100,Number(attacked)*100]}))} maximum={100}/>
        <details className="result-data"><summary><Localized en="View TPR and AUC values" zh="查看 TPR 与 AUC 数值"/></summary>
        <div className="tide-table-wrap">
          <table>
            <caption><Localized en="Table 1 · Selected verification results on SD 2.1" zh="表 1 · SD 2.1 水印检测结果节选"/></caption>
            <thead>
              <tr><th rowSpan={2} scope="col"><Localized en="Method" zh="方法"/></th><th scope="colgroup"><Localized en="No attack" zh="无攻击"/></th><th colSpan={2} scope="colgroup"><Localized en="After attack · mean" zh="攻击后 · 均值"/></th></tr>
              <tr><th scope="col">TPR¹</th><th scope="col">TPR¹</th><th scope="col">AUC</th></tr>
            </thead>
            <tbody>{verification.map(([name,clean,attacked,auc])=><tr key={name}><th scope="row">{name}</th><td>{clean}</td><td>{attacked}</td><td>{auc}</td></tr>)}</tbody>
          </table>
          <p><Localized en="¹ True positive rate at 1% false positives." zh="¹ 假阳性率为 1% 时的真阳性率。"/></p>
        </div>
        </details>
        <p className="tide-prose tide-demo-intro"><Localized
          en="The seven settings cover blur, additive noise, JPEG compression, rotation, cropping, and two VAE reconstruction attacks. Each verification run uses 5,000 watermarked and 5,000 unwatermarked images. Reporting detection at a fixed false-positive rate makes the comparison meaningful: a method cannot improve this score simply by declaring more images watermarked."
          zh="七类设置涵盖模糊、加噪、JPEG 压缩、旋转、裁剪与两种 VAE 重建攻击。每轮验证使用 5,000 张水印图像和 5,000 张无水印图像。固定假阳性率后比较检出率，避免方法仅靠放宽判定条件，就把更多图像判为带水印。"/></p>
      </div>
    </section>
    <section id="timing" className="tide-method-band">
      <div className="tide-bound">
        <header className="tide-chapter-head">
          <p className="tide-kicker"><Localized en="Ablation study" zh="消融实验"/></p>
          <h2><Localized en="When to write, and how to guide" zh="何时写入，如何引导"/></h2>
        </header>
        <p className="tide-prose"><Localized
          en="Early injection gives the model more steps to carry the watermark, but also more opportunities to change the scene. Late injection protects the composition, while leaving fewer steps for the signal to persist. The experiment below moves the same learned watermark and auxiliary condition to five injection points in a 50-step sampler. Both were trained at step 35; they are not retrained at each point."
          zh="较早注入，水印有更多步骤参与生成，也有更多机会改变画面；较晚注入，构图已经稳定，但可用于保持信号的步骤变少了。下面的实验将同一组水印与辅助条件放到 50 步采样中的五个不同位置。二者均在第 35 步训练，移动注入点时不重新训练。"/></p>
        <InjectionStudy/>
        <p className="tide-prose tide-demo-intro"><Localized
          en={<>At step 35, the mean TPR across five image transformations is <strong>98.3% with adaptive guidance</strong>, 86.6% with a fixed budget, and 93.4% without watermark guidance. A fixed auxiliary signal can therefore be worse than no auxiliary signal. At step 45, all three strategies lose robustness, even though the image remains close to its reference. These results separate the effect of the injection time from the way the remaining trajectory is guided.</>}
          zh={<>第 35 步注入时，五种图像变换下的平均 TPR 为：<strong>自适应引导 98.3%</strong>、固定预算 86.6%、无水印引导 93.4%。固定施加辅助信号，甚至可能不如不施加。到第 45 步，三种策略的鲁棒性都明显下降，尽管图像仍然接近参考结果。这组实验将注入时刻的影响与后续引导的作用区分开来。</>}/></p>
      </div>
    </section>
    <section id="discussion" className="tide-results tide-bound">
      <header className="tide-chapter-head">
        <p className="tide-kicker"><Localized en="Discussion" zh="讨论"/></p>
        <h2><Localized en="From injection to propagation" zh="从注入信号，到控制传播"/></h2>
      </header>
      <p className="tide-prose"><Localized
        en="The central result is about the steps after the watermark has been written. Injection establishes the signal; trajectory-aware guidance determines how it is carried into the image. Learning the watermark and condition together, then controlling their interaction with text guidance, improves the balance between detection and content preservation."
        zh="这项工作的重点，是水印写入以后还会发生什么。注入建立信号，轨迹感知引导则控制它怎样进入最终图像。联合学习水印与辅助条件，再逐步控制它们与文本引导的相互作用，才能同时改善检测能力与内容保持。"/></p>
      <p className="tide-prose"><Localized
        en="Verification currently assumes access to the generation model and a compatible inversion procedure. Third-party verification would need a service or public verifier. The experiments establish watermark detection, rather than a large multi-bit payload; the paper also leaves adaptive attacks against the inversion path as an open problem."
        zh="目前的检测需要访问生成模型，并使用兼容的反演过程；第三方使用还需要验证服务或公开验证器。现有实验验证的是水印检测能力，并未建立大容量多比特载荷的结论。针对反演过程设计的自适应攻击，也仍是论文指出的待解决问题。"/></p>
    </section>
  </PaperArticle>;
}
