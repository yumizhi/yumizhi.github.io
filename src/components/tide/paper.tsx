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
import { TideTrajectory } from '../paper-figures/tide-trajectory';

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
    overviewFigure={paper.image && <TideComparison original={paper.image} caption={paper.imageCaption}/>}
    title={<><PaperTitle>{methodTitle}</PaperTitle> <span className="tide-title-scope">for <PaperTitle>{modelScope}</PaperTitle></span></>}>
    <section id="method" className="tide-method-band">
      <div className="tide-bound">
        <header className="tide-chapter-head">
          <h2><Localized en="A signal the denoiser can carry" zh="让水印随去噪延续"/></h2>
        </header>
        <p className="tide-prose"><Localized
          en="A watermark written halfway through sampling has two jobs. It must leave a detectable trace in the finished image and give the sampler room to preserve the composition already taking shape. We train the signal together with a condition that the denoiser can use in the steps that follow."
          zh="在采样中途写入的水印，既要在成图里留下可检测的信号，也要给已成形的画面留出继续去噪的余地。为此，我们把水印信号和一种辅助条件一起训练，让去噪模型在余下步骤里也能接续这个信号。"/></p>
        <p className="tide-prose"><Localized
          en="Tree-Ring changes the starting noise. Every step of generation then inherits that change, including the steps that establish viewpoint and composition. ROBIN moves the write to an intermediate state, after some of that structure has formed. The remaining updates still matter. An intermediate write changes the latent that the next step sees, and the effect of keeping that change can vary as the text-guided direction turns."
          zh="Tree-Ring 从起始噪声就写入水印。往后的每一步都受这次改动影响，包括决定主体视角和构图的阶段。ROBIN 将写入推迟到中途，让部分画面先成形。此后，第一步去噪看到的潜变量已经变了，而文本引导方向也在往前走。水印信号怎样延续，取决于这两种变化如何在后续步骤里相遇。"/></p>
        <TideTrajectory/>
        <p className="tide-prose"><Localized
          en="The two views in the sketch operate at different scales. The path shows the effect of intervening midway through a run. The vector diagram zooms in on one subsequent update, where the recent text directions determine what part of the watermark residual to keep. The paper evaluates the resulting images against matched unwatermarked generations and measures whether the watermark survives editing."
          zh="图里左侧是一次采样的全程，右侧放大的是写入之后的其中一步。左侧的跳跃来自频域写入，右侧的分解则说明这一步里水印引导被怎样调整。论文用同一生成设置下的无水印图像衡量最终画面的变化，再通过图像编辑后的检出率检查信号能否留下来。"/></p>
        <h3 className="paper-subsection" id="learning"><Localized en="Learning the watermark and its condition together" zh="一起学习水印和辅助条件"/></h3>
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
        <p className="tide-prose"><Localized
          en="The two reconstruction targets give the optimizer different information. The short-term target comes from a clean prediction at the very same step, so it isolates the local effect of writing the watermark. The final clean reference also accounts for the composition reached by the rest of sampling. The detector has another reference altogether, the learned frequency template. Training therefore puts pressure on the watermark to stay distinguishable in frequency space while the decoded estimates remain visually similar."
          zh="短程和长程目标各看一种变化。短程比较同一步的两次预测，可以把写入当下的影响单独拎出来。长程比较的是完整采样得到的无水印参考图，因而还约束最终成形的画面。检测器使用的是另一个参照，也就是学到的频域模板。这样，图像可以在视觉上保持相近，水印仍有机会在频域里被区分出来。"/></p>
        <h3 className="paper-subsection" id="guidance"><Localized en="Three predictions, one controlled update" zh="三路预测，形成一次受控更新"/></h3>
        <p className="tide-prose"><Localized
          en="At each step after injection, the same U-Net is evaluated with an empty condition, the text prompt, and the learned watermark condition. Subtracting the unconditional prediction isolates what each condition adds. Recent text residuals define a local subspace; TIDE removes the watermark residual’s projection onto that subspace and retains its complementary component."
          zh="注入后的每一步，同一个 U-Net 分别接收空条件、文本条件和水印条件。用两路条件预测分别减去无条件预测，就得到文本与水印各自增加的引导残差。TIDE 用近期文本残差估计局部子空间，去掉水印残差在其中的投影，保留互补分量。"/></p>
        <GuidanceComparison/>
        <p className="tide-prose"><Localized
          en={<>Direction is only half the decision. TIDE also adjusts <strong>how much guidance the watermark receives</strong>. Greater overlap, a sharper turn in the text trajectory, or an already strong complementary residual lowers the watermark budget. The total budget is shared with the text branch, which always retains a reserved minimum. This calculation repeats at every remaining step.</>}
          zh={<>选好方向之后，还需要决定<strong>水印引导占多少预算</strong>。与文本方向重合越多、局部轨迹转弯越明显，或互补残差本身越强，分给水印的预算就越低。总预算在文本与水印之间重新分配，同时为文本保留最低额度。这套计算会在注入后的每一步重复执行。</>}/></p>
        <p className="tide-prose"><Localized
          en="Consider two adjacent steps. A watermark residual can be mostly complementary at the first one. At the next, a turn in the recent text directions makes that same guidance less attractive, even if the watermark residual is similar. Overlap says where the two updates compete, curvature says how quickly the local text direction is changing, and relative residual strength says how much adjustment the remaining watermark component already supplies. These quantities give the sampler a reason to spend its guidance budget differently from step to step."
          zh="把相邻两步放在一起看。上一步的水印残差可能大部分都与文本方向互补。到了下一步，最近的文本方向一转，即使水印残差相似，继续给它同样的引导也未必合适。重合度刻画两种更新在哪些方向上有冲突，曲率反映文本方向变化得有多快，残差强度则反映留下的水印分量已经能提供多大的更新。这三个量一起决定每一步怎样分配预算。"/></p>
        <h3 className="paper-subsection" id="verification"><Localized en="Recovering the signal from an image" zh="从最终图像中找回水印"/></h3>
        <p className="tide-prose"><Localized
          en="By the time an image reaches the detector, its watermark has been through the rest of sampling and possibly an edit. The detector looks for the signal where it was written. It encodes the image and runs partial DDIM inversion with an empty prompt, stopping at the injection step. There, the distance between the recovered spectrum and the watermark template indicates how closely they match. Unwatermarked images calibrate the decision threshold, so the query can be scored from the image alone."
          zh="图像到达检测器时，水印已经历余下的去噪，也可能经历过编辑。检测回到当初写入信号的位置：将图像编码为潜变量，用空提示词做部分 DDIM 反演，在注入步骤停下。恢复的频谱与水印模板越接近，匹配证据就越强。判定阈值用无水印图像校准，查询时只需提交待检测图像。"/></p>
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
        <h2><Localized en="Image fidelity and watermark survival" zh="图像保真度与水印检出率"/></h2>
      </header>
      <p className="tide-prose"><Localized
        en="The sports car comparison calls for two measurements. CLIP scores how well an image matches its prompt, which both views of the car can do. LPIPS measures perceptual distance to the unwatermarked image, so a change of viewpoint matters there. In Table 2, TIDE matches the unwatermarked CLIP score of 0.403. Its LPIPS is 0.147, compared with 0.157 for ROBIN."
        zh="跑车的视角变化说明为什么要同时看两项指标。CLIP 衡量图像和提示词是否相符，车头和车尾都能符合「跑车」。LPIPS 衡量与无水印图像的感知距离，会反映视角这类变化。论文表 2 中，TIDE 的 CLIP 为 0.403，与无水印基线相同。TIDE 的 LPIPS 为 0.147，ROBIN 为 0.157。"/></p>
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
          <h2><Localized en="Injection timing changes what guidance can preserve" zh="注入时刻影响后续引导的余地"/></h2>
        </header>
        <p className="tide-prose"><Localized
          en="Early injection gives the model more steps to carry the watermark, but also more opportunities to change the scene. Late injection protects the composition, while leaving fewer steps for the signal to persist. The experiment below moves the same learned watermark and auxiliary condition to five injection points in a 50-step sampler. Both were trained at step 35; they are not retrained at each point."
          zh="较早注入，水印有更多步骤参与生成，也有更多机会改变画面；较晚注入，构图已经稳定，但可用于保持信号的步骤变少了。下面的实验将同一组水印与辅助条件放到 50 步采样中的五个不同位置。二者均在第 35 步训练，移动注入点时不重新训练。"/></p>
        <InjectionStudy/>
        <p className="tide-prose tide-demo-intro"><Localized
          en={<>At step 35, the mean TPR across five image transformations is <strong>98.3% with adaptive guidance</strong>, 86.6% with a fixed budget, and 93.4% without watermark guidance. A fixed auxiliary signal can therefore be worse than no auxiliary signal. At step 45, all three strategies lose robustness, even though the image remains close to its reference. These results separate the effect of the injection time from the way the remaining trajectory is guided.</>}
          zh={<>第 35 步注入时，五种图像变换下的平均 TPR 为：<strong>自适应引导 98.3%</strong>、固定预算 86.6%、无水印引导 93.4%。固定施加辅助信号，甚至可能不如不施加。到第 45 步，三种策略的鲁棒性都明显下降，尽管图像仍然接近参考结果。这组实验将注入时刻的影响与后续引导的作用区分开来。</>}/></p>
        <p className="tide-prose"><Localized
          en="The fixed-budget run is a particularly informative control. It receives auxiliary guidance at every remaining step, yet detects fewer edited images than the run that simply lets the injected signal propagate. The gap shows why the design matters. Adding another condition creates a potential source of interference, and its effect depends on where and when it enters the update. In the cross-step experiment, blur and rotation expose the largest loss from very late injection."
          zh="固定预算这一组尤其值得单独看。它每一步都有辅助引导，编辑后的检出率却低于只写入水印、让信号随采样自然传播的实验组。辅助条件参与更新之后，还可能与文本方向发生干扰，作用取决于它加在何时、加向哪里。跨注入时刻的对比也显示，写入非常晚时，模糊与旋转带来的检出损失最明显。"/></p>
      </div>
    </section>
    <section id="discussion" className="tide-results tide-bound">
      <header className="tide-chapter-head">
        <h2><Localized en="Watermark strength depends on the remaining trajectory" zh="水印能留下多少，取决于后续轨迹"/></h2>
      </header>
      <p className="tide-prose"><Localized
        en="The late-injection result puts the mechanism in perspective. Adaptive guidance helped at step 35, when the sampler still had time to incorporate the watermark. At step 45, even adaptive guidance had less room to work. In these experiments, the benefit comes from giving the watermark enough steps to settle into the image and using those steps selectively."
        zh="最后一组注入实验给引导的作用划出了边界。第 35 步写入时，后面还留着足够的去噪步骤，自适应引导能提高检出率。到了第 45 步，连自适应引导的余地也变小了。实验中的收益来自两者配合：给水印留下参与生成的时间，再根据每一步的情况分配引导。"/></p>
      <p className="tide-prose"><Localized
        en="Verification currently assumes access to the generation model and a compatible inversion procedure. Third-party verification would need a service or public verifier. The experiments establish watermark detection, rather than a large multi-bit payload; the paper also leaves adaptive attacks against the inversion path as an open problem."
        zh="目前的检测需要访问生成模型，并使用兼容的反演过程；第三方使用还需要验证服务或公开验证器。现有实验验证的是水印检测能力，并未建立大容量多比特载荷的结论。针对反演过程设计的自适应攻击，也仍是论文指出的待解决问题。"/></p>
    </section>
  </PaperArticle>;
}
