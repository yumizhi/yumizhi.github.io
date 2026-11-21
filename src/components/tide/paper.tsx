import type { Paper } from '@/lib/content';
import { ArrowUpRight } from 'lucide-react';
import { asset } from '@/lib/paths';
import { Localized } from '../language';
import { PaperArticle } from '../paper-article';
import { PaperTitle } from '../paper-title';
import { TideComparison } from './comparison';
import { InjectionStudy } from '../research-experiment';
import { ComparisonChart } from '../comparison-chart';
import { TideTrajectory } from '../paper-figures/tide-trajectory';
import { TideGuidanceMath, TideInjectionMath, TideTrainingMath, TideVerificationMath } from '../paper-figures/tide-math';

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
          en="Tree-Ring changes the starting noise, so the updates that establish viewpoint and composition already incorporate the watermark. ROBIN writes into an intermediate latent after some of the scene has taken shape. With the prompt and initial noise fixed, that gives us a shared early sampling path and a clear point at which the clean and marked runs begin to differ."
          zh="Tree-Ring 改动起始噪声，决定视角和构图的早期更新也会受到水印影响。ROBIN 把写入推迟到中间的潜变量，让部分画面先成形。固定提示词和起始噪声以后，两次生成共用同一段早期轨迹，到注入那一步才分开。"/></p>
        <p className="tide-prose"><Localized
          en="In the schematic, the jump marks the write. The denoiser receives a different latent from that step onward, so even the same prompt can lead to a different noise prediction. TIDE uses the remaining updates to carry the signal forward while limiting interference with text guidance."
          zh="示意图中的跳跃对应这次写入。从这一步起，去噪模型接收到的潜变量变了，同一句提示词也可能得出不同的噪声预测。TIDE 利用余下的更新维持水印信号，同时减少对文本引导的干扰。"/></p>
        <TideTrajectory/>
        <p className="tide-prose"><Localized en="The method has a training path and a verification path. Training establishes a signal the frozen generator can sustain. During sampling, recent text-guidance directions provide a reference for steering that signal. After publication, the verifier works backwards from an image to the place in the trajectory where the two paths first diverged." zh="训练先学出冻结的生成器能够维持的信号。实际采样时，最近几步的文本引导提供参照方向，让水印尽量避开仍在塑造画面的更新。图像发布以后，验证器从成图回溯到分岔处，在同一位置寻找写入的证据。" /></p>
        <figure className="tide-overview">
          <img loading="lazy" width="1800" height="1383" src={asset('/images/tide-paper/overview.webp')}
            alt="TIDE architecture: intermediate watermark injection, trajectory-aware guidance and inversion-based verification."/>
          <figcaption>
            <span><Localized en="Figure 1. Follow the sampling path to the injection step, then through the guided denoising updates. The verification branch starts with the finished image and works back to the latent where the watermark was written." zh="论文图 1。采样沿原轨迹到达注入步，写入水印后继续接受引导。验证分支从成图出发，反演回当初写入信号的潜空间位置。" /></span>
            <span className="paper-figure-actions">
              <a href={asset('/images/tide-paper/overview.webp')} target="_blank" rel="noreferrer"><Localized en="Open full-size figure" zh="查看完整原图" /><ArrowUpRight size={13} aria-hidden="true" /></a>
            </span>
          </figcaption>
        </figure>
        <h3 className="paper-subsection" id="learning"><Localized en="Watermark injection and training" zh="水印注入与训练"/></h3>
        <p className="tide-prose"><Localized
          en={<>The VAE, U-Net, and text encoder stay frozen. Training changes only <strong>the watermark spectrum and an auxiliary condition embedding</strong>. At the chosen step, selected Fourier coefficients of the latent are replaced by the learned watermark. The auxiliary condition guides the frozen U-Net to carry that signal across the remaining denoising steps.</>}
          zh={<>VAE、U-Net 和文本编码器保持冻结，只学习<strong>水印频谱和一个辅助条件嵌入</strong>。到达选定的采样步骤后，用学到的水印替换潜变量频域中指定位置的系数；辅助条件则让原有 U-Net 在后续去噪时提供维持水印的引导。</>}/></p>
        <details className="study-notes"><summary><Localized en="The frequency mask and the written latent" zh="深入阅读 · 频域掩码与写入后的潜变量" /></summary><TideInjectionMath/></details>

        <p className="tide-prose tide-demo-intro"><Localized
          en="A strong signal can be easy to detect at injection and still fade during denoising or leave a visible change. Training compares the marked prediction with clean references in image space and checks for the watermark in frequency space. A separate energy term regulates the strength of the learned spectrum."
          zh="强信号在注入时容易识别，后续去噪仍可能削弱它，或在画面上留下可见改动。训练会在图像空间比较带水印预测与无水印参照，再到频域检查水印。另有一项能量约束用来控制学到的频谱强度。"/></p>
        <details className="study-notes"><summary><Localized en="Training objectives and clean references" zh="深入阅读 · 训练目标与无水印参照" /></summary><TideTrainingMath/></details>
        <div id="guidance-comparison">
          <h3 className="paper-subsection" id="guidance"><Localized en="Guidance after injection" zh="注入后的引导"/></h3>
          <p className="tide-prose"><Localized
            en="At each step the same frozen U-Net makes an unconditional, a text-conditioned and a watermark-conditioned prediction. Subtracting the first from the other two isolates the contribution of each condition. TIDE uses recent text residuals as a local reference for deciding which part of the watermark residual to keep."
            zh="每一步都由同一个冻结的 U-Net 分别给出无条件、文本条件和水印条件下的预测。后两项分别减去无条件预测，就得到各自新增的分量。TIDE 参考最近几步的文本残差，决定保留水印残差的哪一部分。"/></p>
          <details className="study-notes"><summary><Localized en="Recent text directions and the adaptive budget" zh="深入阅读 · 文本方向与自适应预算" /></summary><TideGuidanceMath/></details>
        </div>
        <h3 className="paper-subsection" id="verification"><Localized en="Watermark verification" zh="水印验证"/></h3>
        <p className="tide-prose"><Localized
          en="By the time an image reaches the detector, its watermark has been through the rest of sampling and possibly an edit. The detector looks for the signal where it was written. It encodes the image and runs partial DDIM inversion with an empty prompt, stopping at the injection step. There, the distance between the recovered spectrum and the watermark template indicates how closely they match. Unwatermarked images calibrate the decision threshold, so the query can be scored from the image alone."
          zh="图像到达检测器时，水印已经历余下的去噪，也可能经历过编辑。检测回到当初写入信号的位置：将图像编码为潜变量，用空提示词做部分 DDIM 反演，在注入步骤停下。恢复的频谱与水印模板越接近，匹配证据就越强。判定阈值用无水印图像校准，查询时只需提交待检测图像。"/></p>
        <details className="study-notes"><summary><Localized en="The inversion score and its threshold" zh="深入阅读 · 反演得分与判定阈值" /></summary><TideVerificationMath/></details>
      </div>
    </section>
    <section id="examples" className="tide-results tide-bound">
      <header className="tide-chapter-head">
        <h2><Localized en="Image fidelity and watermark survival" zh="图像保真度与水印检出率"/></h2>
      </header>
      <p className="tide-prose"><Localized
        en="The sports car comparison calls for two measurements. CLIP scores how well an image matches its prompt, which both views of the car can do. LPIPS measures perceptual distance to the unwatermarked image, so a change of viewpoint matters there. In Table 2, TIDE matches the unwatermarked CLIP score of 0.403. Its LPIPS is 0.147, compared with 0.157 for ROBIN."
        zh="跑车的视角变化需要结合两项指标来读。CLIP 衡量图像和提示词是否相符，车头和车尾都能符合「跑车」。LPIPS 衡量与无水印图像的感知距离，会反映视角这类变化。论文表 2 中，TIDE 的 CLIP 为 0.403，与无水印基线相同。TIDE 的 LPIPS 为 0.147，ROBIN 为 0.157。"/></p>
      <p className="tide-prose"><Localized
        en="FID puts the reference at a different scale. The paper reports it against a set of real images and also against the corresponding unwatermarked generations, which it marks FID†. Those two comparisons ask about different kinds of distance. The first asks how close the generated set remains to the real-image set. The second asks how much watermarking moves the collection away from the outputs of its own generator. In Table 2, TIDE obtains 25.80 on the first and 5.90 on the second, alongside the paired LPIPS result above."
        zh="FID 把参照换成了整组图像。论文一项对真实图像集计算，另一项对对应的无水印生成图集计算，并标记为 FID†。前者看生成图集离真实图像集有多远，后者看水印让整组图像离自家生成器的无水印结果偏了多少。表 2 中，TIDE 在这两种计算下分别得到 25.80 和 5.90。逐图的 LPIPS 和这两项 FID 分别反映了配对图像的变化与图像集合的变化。"/></p>
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
          en="The seven settings cover blur, additive noise, JPEG compression, rotation, cropping, and two VAE reconstruction attacks. Each verification run uses 5,000 watermarked and 5,000 unwatermarked images. Using the same false-positive rate gives each method the same allowance for incorrectly flagging clean images."
          zh="七类设置涵盖模糊、加噪、JPEG 压缩、旋转、裁剪与两种 VAE 重建攻击。每轮验证使用 5,000 张水印图像和 5,000 张无水印图像。固定假阳性率后比较检出率，避免方法仅靠放宽判定条件，就把更多图像判为带水印。"/></p>
      </div>
    </section>
    <section id="timing" className="tide-method-band">
      <div className="tide-bound">
        <header className="tide-chapter-head">
          <h2><Localized en="Injection timing" zh="注入时刻"/></h2>
        </header>
        <p className="tide-prose"><Localized
          en="Early injection gives the model more steps to carry the watermark, but also more opportunities to change the scene. Late injection protects the composition, while leaving fewer steps for the signal to persist. The experiment below moves the same learned watermark and auxiliary condition to five injection points in a 50-step sampler. Both are trained at step 35 and reused at each test point."
          zh="较早注入，水印有更多步骤参与生成，也有更多机会改变画面；较晚注入，构图已经稳定，但可用于保持信号的步骤变少了。下面的实验将同一组水印与辅助条件放到 50 步采样中的五个不同位置。二者均在第 35 步训练，移动注入点时不重新训练。"/></p>
        <InjectionStudy/>
        <p className="tide-prose tide-demo-intro"><Localized
          en={<>At step 35, the mean TPR across five image transformations is <strong>98.3% with adaptive guidance</strong>, 86.6% with a fixed budget, and 93.4% without watermark guidance. A fixed auxiliary signal can therefore be worse than no auxiliary signal. At step 45, all three strategies lose robustness, even though the image remains close to its reference. These results separate the effect of the injection time from the way the remaining trajectory is guided.</>}
          zh={<>第 35 步注入时，五种图像变换下的平均 TPR 为：<strong>自适应引导 98.3%</strong>、固定预算 86.6%、无水印引导 93.4%。固定施加辅助信号，甚至可能不如不施加。到第 45 步，三种策略的鲁棒性都明显下降，尽管图像仍然接近参考结果。这组实验将注入时刻的影响与后续引导的作用区分开来。</>}/></p>
        <p className="tide-prose"><Localized
          en="The fixed-budget run is a particularly informative control. It receives auxiliary guidance at every remaining step, yet detects fewer edited images than the run that simply lets the injected signal propagate. The gap shows why the design matters. Adding another condition creates a potential source of interference, and its effect depends on where and when it enters the update. In the cross-step experiment, blur and rotation expose the largest loss from very late injection."
          zh="固定预算这一组尤其值得单独看。它每一步都有辅助引导，编辑后的检出率却低于只写入水印、让信号随采样自然传播的实验组。辅助条件参与更新之后，还可能与文本方向发生干扰，注入时刻与引导方向都会影响最后的结果。跨注入时刻的对比也显示，写入非常晚时，模糊与旋转带来的检出损失最明显。"/></p>
      </div>
    </section>
    <section id="discussion" className="tide-results tide-bound">
      <header className="tide-chapter-head">
        <h2><Localized en="Watermark strength depends on the remaining trajectory" zh="给水印留下足够的去噪步数"/></h2>
      </header>
      <p className="tide-prose"><Localized
        en="The late-injection result puts the mechanism in perspective. Adaptive guidance helped at step 35, when the sampler still had time to incorporate the watermark. At step 45, even adaptive guidance had less room to work. In these experiments, the benefit comes from giving the watermark enough steps to settle into the image and using those steps selectively."
        zh="最后一组注入实验给引导的作用划出了边界。第 35 步写入时，后面还留着足够的去噪步骤，自适应引导能提高检出率。到了第 45 步，连自适应引导的余地也变小了。实验中的收益来自两者配合：给水印留下参与生成的时间，再根据每一步的情况分配引导。"/></p>
      <p className="tide-prose"><Localized
        en="Verification currently assumes access to the generation model and a compatible inversion procedure. Third-party verification would need a service or public verifier. The experiments establish watermark detection, rather than a large multi-bit payload; the paper also leaves adaptive attacks against the inversion path as an open problem."
        zh="目前的检测需要访问生成模型，并使用兼容的反演过程。第三方验证还需要相应的服务或公开工具。现有实验验证的是水印检测能力，并未建立大容量多比特载荷的结论。针对反演过程设计的自适应攻击，也仍是论文指出的待解决问题。"/></p>
    </section>
  </PaperArticle>;
}
