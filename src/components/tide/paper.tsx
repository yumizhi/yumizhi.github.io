import type { Paper } from '@/lib/content';
import { ArrowUpRight } from 'lucide-react';
import { asset } from '@/lib/paths';
import { Localized } from '../language';
import { PaperArticle } from '../paper-article';
import { PaperTitle } from '../paper-title';
import { TideVerificationPath } from './verification-path';
import { TideQualityTable, TideTimingTable } from './experiment-tables';
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
  ['DwtDct', '0.974', '0.624', '0.574', '0.092'],
  ['DwtDctSvd', '1.000', '1.000', '0.702', '0.262'],
  ['RivaGAN', '0.999', '0.999', '0.854', '0.448'],
  ['Tree-Ring (key)', '1.000', '1.000', '0.975', '0.694'],
  ['Tree-Ring (paired)', '1.000', '1.000', '0.962', '0.765'],
  ['Stable Signature', '1.000', '1.000', '0.820', '0.496'],
  ['Gaussian Shading', '1.000', '1.000', '0.829', '0.682'],
  ['ROBIN', '1.000', '1.000', '0.981', '0.825'],
  ['TIDE', '1.000', '1.000', '0.999', '0.986'],
];

export function TidePaper({paper}:{paper:Paper}){
  const [methodTitle, modelScope] = paper.title.split(' for ');
  return <PaperArticle paper={paper} authorNotes={authorNotes} affiliations={affiliations}
    overviewFigure={paper.image && <TideComparison original={paper.image} caption={paper.imageCaption}/>}
    title={<><PaperTitle>{methodTitle}</PaperTitle> <span className="tide-title-scope">for <PaperTitle>{modelScope}</PaperTitle></span></>}>
    <section id="method" className="tide-method-band">
      <div className="tide-bound">
        <header className="tide-chapter-head">
          <h2><Localized en="Intermediate injection and residual guidance" zh="中途注入与残差引导"/></h2>
        </header>
        <p className="tide-prose"><Localized
          en="For a matched prompt and seed, the clean and marked runs share the same sequence of latents until the injection step. Writing into the latent changes the input of the next U-Net prediction. Even with the original prompt held fixed, the sampler can now follow a different path."
          zh="固定提示词和随机种子，两次生成在注入前具有相同的潜变量序列。写入操作改变了下一次 U-Net 预测的输入，即使文本条件保持不变，后续更新也可能偏离无水印轨迹。"/></p>
        <p className="tide-prose"><Localized
          en="After injection, a run without additional control propagates whatever signal survives ordinary denoising. TIDE adds a watermark-conditioned prediction at each remaining step and limits the part that overlaps recent text guidance. The paths below illustrate these alternatives. Their geometry is schematic."
          zh="写入之后，无额外控制的采样按原去噪规则传播信号。TIDE 在余下各步增加水印条件预测，并限制其中与近期文本引导重叠的分量。图中的路径表示这两种更新方式，路径的几何形状为示意。"/></p>
        <TideTrajectory/>
        <p className="tide-prose"><Localized en="The generator stays frozen while training fits a watermark spectrum and a conditioning embedding. Sampling uses both learned quantities. Verification starts from the received image and tests for the spectrum at the original injection step."
          zh="训练保持生成器冻结，只学习水印频谱和条件嵌入。采样同时使用这两项训练结果。验证以收到的图像为输入，在原注入步检验水印频谱。" /></p>
        <figure className="tide-overview">
          <img loading="lazy" width="1800" height="1383" src={asset('/images/tide-paper/overview.webp')}
            alt="TIDE architecture: intermediate watermark injection, trajectory-aware guidance and inversion-based verification."/>
          <figcaption>
            <span><Localized en="Figure 1. The generation branch writes a frequency-domain watermark at the intermediate latent and continues denoising with adaptive guidance. The verification branch recovers a latent at the same step by partial inversion."
          zh="图 1。生成分支在中间潜变量的频域写入水印，随后以自适应引导继续去噪。验证分支通过部分反演恢复同一步的潜变量。" /></span>
            <span className="paper-figure-actions">
              <a href={asset('/images/tide-paper/overview.webp')} target="_blank" rel="noreferrer"><Localized en="Open full-size figure" zh="查看完整原图" /><ArrowUpRight size={13} aria-hidden="true" /></a>
            </span>
          </figcaption>
        </figure>
        <h3 className="paper-subsection" id="learning"><Localized en="Watermark injection and training" zh="水印注入与训练"/></h3>
        <p className="tide-prose"><Localized
          en={<>The VAE, U-Net, and text encoder stay frozen. Training changes only <strong>the watermark spectrum and an auxiliary condition embedding</strong>. At the chosen step, selected Fourier coefficients of the latent are replaced by the learned watermark. The auxiliary condition guides the frozen U-Net to carry that signal across the remaining denoising steps.</>}
          zh={<>VAE、U-Net 和文本编码器保持冻结，只学习<strong>水印频谱和一个辅助条件嵌入</strong>。到达选定的采样步骤后，用学到的水印替换潜变量频域中指定位置的系数；辅助条件则让原有 U-Net 在后续去噪时提供维持水印的引导。</>}/></p>
        <TideInjectionMath/>

        <p className="tide-prose tide-demo-intro"><Localized
          en="A strong signal can be easy to detect at injection and still fade during denoising or leave a visible change. Training compares the marked prediction with clean references in image space and checks for the watermark in frequency space. A separate energy term regulates the strength of the learned spectrum."
          zh="强信号在注入时容易识别，后续去噪仍可能削弱它，或在画面上留下可见改动。训练会在图像空间比较带水印预测与无水印参照，再到频域检查水印。另有一项能量约束用来控制学到的频谱强度。"/></p>
        <TideTrainingMath/>
        <div id="guidance-comparison">
          <h3 className="paper-subsection" id="guidance"><Localized en="Guidance after injection" zh="注入后的引导"/></h3>
          <p className="tide-prose"><Localized
            en="At each step the same frozen U-Net makes an unconditional, a text-conditioned and a watermark-conditioned prediction. Subtracting the first from the other two isolates the contribution of each condition. TIDE uses recent text residuals as a local reference for deciding which part of the watermark residual to keep."
            zh="每一步都由同一个冻结的 U-Net 分别给出无条件、文本条件和水印条件下的预测。后两项分别减去无条件预测，就得到各自新增的分量。TIDE 参考最近几步的文本残差，决定保留水印残差的哪一部分。"/></p>
          <TideGuidanceMath/>
        </div>
        <h3 className="paper-subsection" id="verification"><Localized en="Watermark verification" zh="水印验证"/></h3>
        <p className="tide-prose"><Localized
          en="By the time an image reaches the detector, its watermark has been through the rest of sampling and possibly an edit. The detector looks for the signal where it was written. It encodes the image and runs partial DDIM inversion with an empty prompt, stopping at the injection step. There, the distance between the recovered spectrum and the watermark template indicates how closely they match. Unwatermarked images calibrate the decision threshold, so the query can be scored from the image alone."
          zh="图像到达检测器时，水印已经历余下的去噪，也可能经历过编辑。检测回到当初写入信号的位置：将图像编码为潜变量，用空提示词做部分 DDIM 反演，在注入步骤停下。恢复的频谱与水印模板越接近，匹配证据就越强。判定阈值用无水印图像校准，查询时只需提交待检测图像。"/></p>
        <TideVerificationPath/>
        <TideVerificationMath/>
      </div>
    </section>
    <section id="examples" className="tide-results tide-bound">
      <header className="tide-chapter-head">
        <h2><Localized en="Image fidelity and watermark survival" zh="图像保真度与水印检出率"/></h2>
      </header>
      <p className="tide-prose"><Localized en="The main experiment uses Stable Diffusion 2.1. The watermark and its auxiliary condition are learned on prompts from the Gustavosta stable-diffusion-prompts collection. Evaluation includes Gustavosta and MS-COCO 2017 prompts, with 5,000 COCO training images as the real-image reference for FID. The comparison includes methods that mark finished pixels and methods that modify the generator or its sampling process." zh="主实验使用 Stable Diffusion 2.1，从 Gustavosta 的 stable-diffusion-prompts 提示词集中学习水印及其辅助条件。评估包含 Gustavosta 和 MS-COCO 2017 的提示词，FID 使用 COCO 训练集的 5,000 张真实图像作为参照。基线既包括在成图上写入的方法，也包括改造生成器或采样过程的方法。"/></p>
      <p className="tide-prose"><Localized
        en="The fidelity evaluation pairs each marked image with an unwatermarked generation from the same prompt and seed. CLIP measures agreement with the prompt and can give similar scores to different viewpoints. LPIPS measures perceptual distance within the pair. TIDE obtains a mean CLIP score of 0.403, the same as the clean reference. Its mean LPIPS is 0.147, compared with 0.157 for ROBIN and 0.501 for Tree-Ring."
          zh="保真度实验固定提示词和种子，将每张水印图与对应的无水印成图配对。CLIP 衡量图文匹配程度，视角不同的两张图也可能得分相近。LPIPS 则衡量成对图像的感知距离。TIDE 的平均 CLIP 得分为 0.403，与无水印参照相同。平均 LPIPS 为 0.147，ROBIN 和 Tree-Ring 分别为 0.157 和 0.501。"/></p>
      <p className="tide-prose"><Localized
        en="The paper also compares whole collections. FID uses real images from MS-COCO as its reference. FID† uses the corresponding unwatermarked generations, isolating the distributional shift associated with writing a watermark. TIDE obtains 25.80 against the real images and 5.90 against the unwatermarked collection. The unwatermarked generator itself scores 25.63 against the real images."
          zh="论文还比较了图像集合的分布。FID 以 MS-COCO 真实图像为参照；FID† 使用对应的无水印生成图，衡量写入操作带来的分布变化。以真实图像为参照，TIDE 的 FID 为 25.80，原生成器为 25.63。以无水印图集为参照，TIDE 的 FID† 为 5.90。"/></p>
      <TideQualityTable/>
      <div className="tide-quant">
        <h3><Localized en="Detection after image edits" zh="图像编辑后的水印检测"/></h3>
        <p className="tide-prose"><Localized
          en={<>Without edits, both ROBIN and TIDE detect all watermarked images at a 1% false-positive rate. Across seven attack settings on Stable Diffusion 2.1, mean detection at the same false-positive rate is <strong>82.5% for ROBIN and 98.6% for TIDE</strong>.</>}
          zh={<>在 1% 的假阳性率下，ROBIN 和 TIDE 都能检出全部未经编辑的水印图像。差别出现在编辑之后：在 Stable Diffusion 2.1 的七类攻击设置下，同一假阳性率下的平均检出率分别为 <strong>82.5% 和 98.6%</strong>。</>}/></p>
        <ComparisonChart title={{en:'Detection before and after editing',zh:'编辑前后的水印检出率'}}
          note={{en:'SD 2.1 · TPR at 1% FPR · after editing: mean of seven attacks',zh:'SD 2.1 · TPR@1%FPR · 编辑后数值为七类攻击的均值'}}
          series={[{label:{en:'No attack',zh:'未经编辑'}},{label:{en:'After attack',zh:'编辑后'},accent:true}]}
          rows={verification.filter(([label]) => ['Tree-Ring (key)', 'Tree-Ring (paired)', 'ROBIN', 'TIDE'].includes(label)).map(([label,,clean,,attacked])=>({label,values:[Number(clean)*100,Number(attacked)*100]}))} maximum={100}/>
        <div className="tide-table-wrap">
          <table>
            <caption><Localized en="Table 1 · Verification results on SD 2.1" zh="表 1 · SD 2.1 水印检测结果"/></caption>
            <thead>
              <tr><th rowSpan={2} scope="col"><Localized en="Method" zh="方法"/></th><th colSpan={2} scope="colgroup"><Localized en="No attack" zh="无攻击"/></th><th colSpan={2} scope="colgroup"><Localized en="After attack · mean" zh="攻击后 · 均值"/></th></tr>
              <tr><th scope="col">AUC</th><th scope="col">TPR¹</th><th scope="col">AUC</th><th scope="col">TPR¹</th></tr>
            </thead>
            <tbody>{verification.map(([name,cleanAuc,clean,auc,attacked])=><tr key={name}><th scope="row">{name}</th><td>{cleanAuc}</td><td>{clean}</td><td>{auc}</td><td>{attacked}</td></tr>)}</tbody>
          </table>
          <p><Localized en="¹ True positive rate at 1% false positives." zh="¹ 假阳性率为 1% 时的真阳性率。"/></p>
        </div>
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
        <TideTimingTable/>
        <InjectionStudy/>
        <p className="tide-prose tide-demo-intro"><Localized
          en={<>At step 35, the mean TPR across five image transformations is <strong>98.3% with adaptive guidance</strong>, 86.6% with a fixed budget, and 93.4% without watermark guidance. A fixed auxiliary signal can therefore be worse than no auxiliary signal. At step 45, all three strategies lose robustness, even though the image remains close to its reference.</>}
          zh={<>第 35 步注入时，五种图像变换下的平均 TPR 为：<strong>自适应引导 98.3%</strong>、固定预算 86.6%、无水印引导 93.4%。固定施加辅助信号，甚至可能不如不施加。到第 45 步，三种策略的鲁棒性都明显下降，尽管图像仍然接近参考结果。</>}/></p>
        <p className="tide-prose"><Localized
          en="At step 35, rotation separates the two guidance rules particularly clearly. Fixed guidance obtains a TPR of 59.7% under rotation, compared with 96.4% for adaptive guidance. The contrast is narrower for JPEG compression, where the corresponding results are 99.0% and 98.3%. The aggregate advantage of adaptive guidance therefore varies across transformations."
          zh="第 35 步写入时，旋转对两种引导方式的影响尤其不同。固定引导在旋转后的检出率为 59.7%，自适应引导为 96.4%。JPEG 压缩下两者分别为 99.0% 和 98.3%，差距较小且排序相反。自适应引导在平均值上的收益并非均匀分布在每一种变换上。"/></p>
      </div>
    </section>
    <section id="discussion" className="tide-results tide-bound">
      <header className="tide-chapter-head">
        <h2><Localized en="The detection–fidelity trade-off" zh="检出率与保真度的取舍"/></h2>
      </header>
      <p className="tide-prose"><Localized
        en="With the learned parameters held fixed, shifting the write from step 35 to step 45 raises adaptive guidance’s SSIM from 0.797 to 0.814 and lowers mean detection over five transformations from 98.3% to 64.5%. A later write preserves more of the reference image but leaves fewer updates to carry the watermark. The preferred injection point in this experiment reflects both objectives."
          zh="在学习参数相同的条件下，将自适应引导的写入时刻从第 35 步推迟到第 45 步，SSIM 从 0.797 升至 0.814，五种变换的平均检出率却由 98.3% 降至 64.5%。较晚的写入保留了更多原图结构，也缩短了水印随去噪传播的时间。实验中选取注入点时需要同时考虑这两项指标。"/></p>
      <p className="tide-prose"><Localized
        en="Verification currently assumes access to the generation model and a compatible inversion procedure. Third-party verification would need a service or public verifier. The experiments establish watermark detection, rather than a large multi-bit payload; the paper also leaves adaptive attacks against the inversion path as an open problem."
        zh="目前的检测需要访问生成模型，并使用兼容的反演过程。第三方验证还需要相应的服务或公开工具。现有实验验证的是水印检测能力，并未建立大容量多比特载荷的结论。针对反演过程设计的自适应攻击，也仍是论文指出的待解决问题。"/></p>
    </section>
  </PaperArticle>;
}
