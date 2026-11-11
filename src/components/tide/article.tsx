import { Localized } from '@/components/language';
import { Article, Callout, Equation, Figure, M, P, Section, Summary } from '@/components/article';
import type { Paper } from '@/lib/content';
import { asset } from '@/lib/paths';
import { TideBanner } from './banner';
import { GuidanceLab } from './guidance-lab';
import { QualitativeGrid, QualityTable, RobustnessChart, RuntimeTable, SpectrumPair } from './results';
import { StepExplorer } from './step-explorer';
import { TrajectoryExplorer } from './trajectory-explorer';

const contents = [
  { id: 'problem', en: 'A watermark that grows with the image', zh: '与图像一同生成的水印' },
  { id: 'difficulty', en: 'Where the trajectory bends', zh: '轨迹在哪里被改变' },
  { id: 'injection', en: 'Writing at step τ', zh: '在第 τ 步写入' },
  { id: 'guidance', en: 'Steering what remains', zh: '引导余下的轨迹' },
  { id: 'verification', en: 'Reading it back', zh: '读回水印' },
  { id: 'results', en: 'Results', zh: '实验结果' },
  { id: 'timing', en: 'Earlier or later?', zh: '更早还是更晚？' },
  { id: 'limits', en: 'Limits', zh: '局限' },
  { id: 'citation', en: 'Cite', zh: '引用' },
];

const authors = [
  { name: 'Yihan Meng', marks: '1,2' },
  { name: 'Suping Xu', marks: '1,3' },
  { name: 'Yanfeng Wu', marks: '4' },
  { name: 'Chongjun Wang', marks: '1,2' },
  { name: 'Lin Shang', marks: '1,2,*' },
];

const affiliations = [
  'State Key Laboratory of Novel Software Technology, Nanjing University',
  'School of Computer Science, Nanjing University',
  'School of Management, Nanjing University of Posts and Telecommunications',
  'Guodian Nanjing Automation Co., Ltd.',
];

export function TideArticle({ paper }: { paper: Paper }) {
  return (
    <Article
      paper={paper}
      hue="tide"
      kicker={{ en: 'NeurIPS 2026 · Diffusion watermarking', zh: 'NeurIPS 2026 · 扩散模型水印' }}
      deck={{
        en: 'A watermark written at step 35 of 50 has fifteen steps left to become part of the image. TIDE decides, step by step, how much of the guidance those steps may spend on it.',
        zh: '在 50 步采样的第 35 步写入的水印，只剩十五步去成为图像的一部分。TIDE 逐步决定：这些步骤里有多少引导可以用在水印上。',
      }}
      authors={authors}
      affiliations={affiliations}
      banner={<TideBanner />}
      contents={contents}
    >
      <Summary>
        <P
          en={<>TIDE writes a learnable watermark into the Fourier spectrum of an intermediate latent, then steers the rest of the denoising trajectory so that the watermark survives without pulling the image away from what the prompt alone would have produced. Under seven attacks it verifies at <strong>0.999 AUC and 0.986 TPR@1%FPR</strong> on Stable Diffusion 2.1, and the watermarked images stay closer to their unwatermarked references than Tree-Ring or ROBIN (PSNR 24.53, SSIM 0.797).</>}
          zh={<>TIDE 把一个可学习的水印写入中间潜变量的傅里叶频谱，然后引导余下的去噪轨迹，使水印得以保留，同时不让图像偏离仅由提示词生成的结果。在 Stable Diffusion 2.1 上，七种攻击下的验证达到 <strong>0.999 AUC 与 0.986 TPR@1%FPR</strong>，带水印图像比 Tree-Ring 和 ROBIN 更接近各自的无水印参照（PSNR 24.53，SSIM 0.797）。</>}
        />
      </Summary>

      <Section id="problem" number="01" title={{ en: 'A watermark that grows with the image', zh: '与图像一同生成的水印' }}>
        <P
          en="A watermark added to a finished image is a thin layer on top of it. Blur, re-compression, or a pass through an autoencoder can remove that layer and leave the picture intact. Post-processing schemes such as DwtDct or RivaGAN verify almost perfectly on untouched images and lose most of their detections once the image is transformed."
          zh="加在成品图像上的水印只是覆盖其上的一层薄膜。模糊、重新压缩或经过一次自编码器重建，都可能抹去这层膜而保留画面本身。DwtDct、RivaGAN 等后处理方法在未经改动的图像上几乎可以完美验证，但图像一经变换，大部分检测就会失效。"
        />
        <P
          en="In-generation watermarks take the other route: they change the sampling process, so the mark is carried into the image by the diffusion model itself. Tree-Ring writes a key into the Fourier spectrum of the initial noise and recovers it by inverting the sampler. The signal is spread over the whole image and is hard to wash out."
          zh="生成过程中的水印走另一条路：改动采样过程，让扩散模型自己把水印带进图像。Tree-Ring 把密钥写入初始噪声的傅里叶频谱，再通过反演采样器将其恢复。信号分布在整幅图像中，难以被洗掉。"
        />
        <P
          en={<>The cost is that the mark is planted before anything else exists. Propagation is left to ordinary denoising, with nothing holding the sample close to the image the same prompt and seed would otherwise give. The result stays on-prompt but is <em>a different picture</em>.</>}
          zh={<>代价是：水印在一切内容出现之前就已埋下。它的传播完全交给普通的去噪过程，没有任何约束让样本贴近同一提示词、同一种子本应生成的图像。结果仍然符合提示词，却已经是<em>另一幅画</em>。</>}
        />
      </Section>

      <Section id="difficulty" number="02" title={{ en: 'Where the trajectory bends', zh: '轨迹在哪里被改变' }}>
        <P
          en="The figure below replays one sampling run three times with the same prompt and seed: without a watermark, with Tree-Ring, and with TIDE. Each frame is the model's current estimate of the final image. Drag through the steps."
          zh="下图把同一提示词、同一种子的一次采样重放了三遍：不加水印、使用 Tree-Ring、使用 TIDE。每一帧都是模型此刻对最终图像的估计。拖动滑块浏览各步。"
        />
        <Figure
          number={1}
          kind="data"
          width="wide"
          caption={{
            en: <>One real run on Stable Diffusion 2.1 (seed 42, 50 steps). Frames are VAE-decoded clean-image estimates. Δ is the mean absolute pixel difference from the unwatermarked estimate at the same step, and the budget split is what TIDE computed during this run. Both are read from this single run and are not evaluation metrics from the paper.</>,
            zh: <>Stable Diffusion 2.1 上的一次真实采样（种子 42，50 步）。画面是经 VAE 解码的干净图像估计。Δ 为同一步上与无水印估计的平均绝对像素差，预算分配是 TIDE 在这次采样中实际计算的值。两者都只来自这一次采样，不是论文中的评测指标。</>,
          }}
        >
          <TrajectoryExplorer />
        </Figure>
        <P
          en="Tree-Ring differs from the reference at the very first step and never comes back: the robot ends in another pose in front of another skyline. Moving the write to an intermediate step, as ROBIN does, avoids this. By step 35 the composition is fixed, and the first 35 TIDE frames are the reference frames."
          zh="Tree-Ring 从第一步起就与参照不同，并且再也没有回来：机器人最终换了姿态，背后也是另一片天际线。把写入时刻移到中间步骤（ROBIN 即是如此）可以避免这一点。到第 35 步时构图已经确定，TIDE 的前 35 帧就是参照帧本身。"
        />
        <P
          en="What intermediate injection does not settle is what happens next. The watermark now has to be carried through the remaining steps by an extra guidance signal, and that signal competes with the prompt. ROBIN applies one fixed rule to every remaining step, although the two signals interact differently from step to step. This is the gap TIDE addresses: where to write matters, and so does how the trajectory is steered afterwards."
          zh="中间注入没有回答的问题是：之后怎么办。水印需要一个额外的引导信号把它带过余下的步骤，而这个信号会与提示词竞争。ROBIN 对余下的每一步使用同一条固定规则，尽管两种信号的相互作用逐步不同。这正是 TIDE 要解决的问题：在哪里写入很重要，写入之后如何引导轨迹同样重要。"
        />
      </Section>

      <Section id="injection" number="03" title={{ en: 'Writing at step τ', zh: '在第 τ 步写入' }}>
        <P
          en={<>At the injection step <M tex="\tau" /> TIDE transforms the latent to the Fourier domain and replaces the coefficients inside a ring-shaped mask <M tex="M" /> (radii 5 to 30) with a watermark <M tex="W" />. Everything outside the ring is kept.</>}
          zh={<>在注入步 <M tex="\tau" />，TIDE 把潜变量变换到傅里叶域，并用水印 <M tex="W" /> 替换环形掩码 <M tex="M" />（半径 5 到 30）内的系数，环外的系数全部保留。</>}
        />
        <Equation tex="\tilde z_\tau = \mathcal{F}^{-1}\!\big((1-M)\odot\mathcal{F}(z_\tau) + M\odot W\big)" label="Watermarked latent: inverse Fourier transform of the original spectrum outside the mask plus the watermark inside the mask" />
        <Figure
          number={2}
          kind="concept"
          caption={{
            en: 'The write, shown on one latent channel. Only the coefficients inside the ring change. Display rendering for explanation.',
            zh: '以一个潜变量通道展示写入过程。只有环内的系数被替换。此图为说明用的显示渲染。',
          }}
        >
          <SpectrumPair />
        </Figure>
        <P
          en={<>Unlike a fixed key, <M tex="W" /> is learned, together with an auxiliary condition embedding <M tex="c_{wm}" /> that plays the role of a second prompt for the watermark. The VAE, U-Net, and text encoder stay frozen. Three losses shape the pair. Each compares one-step predictions of the final image with and without the watermark:</>}
          zh={<>与固定密钥不同，<M tex="W" /> 是学习得到的，同时学习的还有一个辅助条件嵌入 <M tex="c_{wm}" />，它相当于专属于水印的第二个提示词。VAE、U-Net 与文本编码器全部冻结。三项损失共同塑造这一对参数，每一项都比较带水印与不带水印时对最终图像的一步预测：</>}
        />
        <Equation tex="\mathcal{L}_{short} = d\big(\hat x^{wm}_{0,\tau},\, \hat x^{clean}_{0,\tau}\big) \qquad \mathcal{L}_{long} = d\big(\hat x^{wm}_{0,\tau},\, x_{ref}\big)" label="Short-term loss compares the watermarked and clean one-step predictions; long-term loss compares the watermarked prediction with the reference image" />
        <Equation tex="\mathcal{L}_{det} = \max\!\big(0,\; m + D_{wm}(\hat z^{wm}_{0,\tau}) - D_{wm}(\hat z^{clean}_{0,\tau})\big), \quad D_{wm}(z) = \tfrac{1}{|M|}\big\lVert M\odot(\mathcal{F}(z)-W)\big\rVert_1" label="Detection loss: a margin between the masked Fourier distance of the watermarked and clean predictions" />
        <P
          en={<>The short-term loss limits the immediate change caused by the write. The long-term loss limits accumulated drift from the unwatermarked reference image. The detection loss keeps watermarked and clean predictions separated by a margin in exactly the space the verifier will look at. Here <M tex="d" /> combines a pixel distance with <M tex="1-\mathrm{SSIM}" />, and an energy regulariser on <M tex="W" /> keeps the watermark from growing or collapsing.</>}
          zh={<>短期损失限制写入造成的即时变化；长期损失限制相对无水印参照图像的累积漂移；检测损失让带水印与不带水印的预测在验证器所观察的空间中保持一个间隔。其中 <M tex="d" /> 由像素距离与 <M tex="1-\mathrm{SSIM}" /> 组成，另有一项作用于 <M tex="W" /> 的能量正则，防止水印过强或坍缩。</>}
        />
        <Figure
          number={3}
          kind="paper"
          width="wide"
          caption={{
            en: 'Overview of TIDE: standard denoising to step τ, Fourier injection with joint optimisation of W and c_wm, trajectory-aware guidance, and verification by partial inversion. Figure 1 of the paper.',
            zh: 'TIDE 总览：标准去噪至第 τ 步、傅里叶域注入并联合优化 W 与 c_wm、轨迹感知引导，以及基于部分反演的验证。论文图 1。',
          }}
        >
          <img className="paper-figure" src={asset('/images/tide-paper/overview.webp')} width={1800} height={1383} loading="lazy" alt="Method overview of TIDE in four panels: standard denoising, Fourier watermark injection, trajectory-aware guidance, and verification." />
        </Figure>
      </Section>

      <Section id="guidance" number="04" title={{ en: 'Steering what remains', zh: '引导余下的轨迹' }}>
        <P
          en={<>After the write, each step produces two guidance residuals relative to the unconditional prediction <M tex="\epsilon_u" />: one from the prompt, one from the watermark condition.</>}
          zh={<>写入之后，每一步相对无条件预测 <M tex="\epsilon_u" /> 会得到两个引导残差：一个来自提示词，一个来自水印条件。</>}
        />
        <Equation tex="\Delta^{txt}_t = \epsilon_t - \epsilon_u \qquad \Delta^{wm}_t = \epsilon_w - \epsilon_u" label="Text residual and watermark residual, each relative to the unconditional prediction" />
        <P
          en="Adding both at full strength lets the watermark push along directions the prompt is using. TIDE first removes that overlap. It builds a basis from the most recent text residuals, projects the watermark residual onto it, and keeps only what is left."
          zh="如果把两者都以全强度相加，水印就会沿着提示词正在使用的方向推动样本。TIDE 先去掉这部分重叠：用最近几步的文本残差构造一组基，把水印残差投影到这组基上，只保留剩下的部分。"
        />
        <Equation tex="\Delta^{wm}_{t,proj} = \Pi_{B_t}\big(\Delta^{wm}_t\big) \qquad \Delta^{wm}_{t,null} = \Delta^{wm}_t - \Delta^{wm}_{t,proj}" label="Projection of the watermark residual onto the recent text subspace, and the remaining null-space component" />
        <P
          en={<>Then it decides how strongly to apply the remaining component. Three quantities are measured at the current step: the overlap <M tex="c_t" /> (how much of the watermark residual fell inside the text subspace), the curvature <M tex="\kappa_t" /> (how fast the text direction is turning), and the ratio <M tex="r_t" /> (how large the kept component is relative to the text residual).</>}
          zh={<>接着决定以多大强度施加保留下来的分量。在当前步测量三个量：重叠 <M tex="c_t" />（水印残差有多少落在文本子空间内）、曲率 <M tex="\kappa_t" />（文本方向转得多快），以及比值 <M tex="r_t" />（保留分量相对文本残差有多大）。</>}
        />
        <Equation tex="\eta_t = (1-c_t)\, e^{-\kappa_t}\, \min\!\Big(1,\, \frac{1}{r_t+\varepsilon}\Big) \qquad g^{wm}_t = (s-\hat s)\,\eta_t \qquad g^{txt}_t = s - g^{wm}_t" label="Adaptive factor eta, watermark guidance weight, and text guidance weight; the two weights always sum to the total budget s" />
        <P
          en={<>The two weights always add up to the original guidance scale <M tex="s" />, and <M tex="\hat s" /> is a floor reserved for the prompt. When the watermark conflicts with the prompt or the trajectory is turning, the budget moves back to the text branch. The step uses <M tex="\hat\epsilon_t = \epsilon_u + g^{txt}_t\Delta^{txt}_t + g^{wm}_t\Delta^{wm}_{t,null}" />.</>}
          zh={<>两个权重之和始终等于原来的引导强度 <M tex="s" />，<M tex="\hat s" /> 是为提示词保留的下限。当水印与提示词冲突、或轨迹正在转向时，预算回到文本分支。该步最终使用 <M tex="\hat\epsilon_t = \epsilon_u + g^{txt}_t\Delta^{txt}_t + g^{wm}_t\Delta^{wm}_{t,null}" />。</>}
        />
        <Figure
          number={4}
          kind="concept"
          width="wide"
          caption={{
            en: 'The allocation rule on a plane. The text subspace is drawn as a single axis; the dashed grey line is the previous text direction, whose angle sets the curvature. The second tab loads c_t and κ_t recorded at steps 36–50 of the run in Figure 1.',
            zh: '在平面上演示分配规则。文本子空间画成一条轴；灰色虚线是上一步的文本方向，它的夹角决定曲率。第二个标签页载入图 1 那次采样在第 36–50 步记录的 c_t 与 κ_t。',
          }}
        >
          <GuidanceLab />
        </Figure>
        <Callout title={{ en: 'Why not simply use a fixed weight?', zh: '为什么不直接用固定权重？' }}>
          <P
            en="The ablation in the paper keeps the auxiliary branch but fixes its budget. At step 35 this lowers average TPR@1%FPR over five transformations from 0.983 to 0.866, below even the variant with no watermark guidance at all (0.934). Rotation suffers most (0.597 against 0.964)."
            zh="论文的消融实验保留辅助分支，但固定其预算。在第 35 步，五种变换上的平均 TPR@1%FPR 从 0.983 降到 0.866，甚至低于完全不使用水印引导的版本（0.934）。旋转受影响最大（0.597 对 0.964）。"
          />
        </Callout>
      </Section>

      <Section id="verification" number="05" title={{ en: 'Reading it back', zh: '读回水印' }}>
        <P
          en={<>To verify an image, TIDE encodes it with the VAE and runs deterministic DDIM inversion back to step <M tex="\tau" />, with an empty prompt and guidance scale 1.0. Only part of the trajectory is inverted. The recovered latent is transformed to the Fourier domain and compared with <M tex="W" /> inside the mask, using the same distance <M tex="D_{wm}" /> as in training. A small distance means the watermark is present.</>}
          zh={<>验证一幅图像时，TIDE 先用 VAE 编码，再以空提示词、引导强度 1.0 做确定性的 DDIM 反演，回到第 <M tex="\tau" /> 步。只需反演轨迹的一部分。把恢复的潜变量变换到傅里叶域，在掩码内与 <M tex="W" /> 比较，使用与训练时相同的距离 <M tex="D_{wm}" />。距离小即表示水印存在。</>}
        />
        <P
          en="The verifier needs the model and the watermark parameters. It does not need the original prompt or the unwatermarked image. Thresholds are calibrated on unwatermarked generations."
          zh="验证方需要模型与水印参数，不需要原始提示词，也不需要无水印图像。阈值在无水印的生成结果上标定。"
        />
      </Section>

      <Section id="results" number="06" title={{ en: 'Results', zh: '实验结果' }}>
        <P
          en="Experiments use Stable Diffusion 2.1. The watermark and its condition are trained on Gustavosta prompts and evaluated on Gustavosta and MS-COCO 2017 prompts, with 5,000 watermarked and 5,000 unwatermarked images per run. Robustness is averaged over seven attacks: Gaussian blur, Gaussian noise, JPEG compression, rotation, crop-and-rescale, and reconstruction by two learned image compressors (VAE-B and VAE-C)."
          zh="实验基于 Stable Diffusion 2.1。水印及其条件在 Gustavosta 提示词上训练，在 Gustavosta 与 MS-COCO 2017 提示词上评测，每次实验使用 5,000 张带水印图像与 5,000 张无水印图像。鲁棒性在七种攻击上取平均：高斯模糊、高斯噪声、JPEG 压缩、旋转、裁剪缩放，以及两种学习式图像压缩器（VAE-B 与 VAE-C）的重建。"
        />
        <Figure
          number={5}
          kind="data"
          caption={{
            en: 'Verification under attack (Table 1 of the paper). Most methods are perfect on clean images; the attacked average separates them. AUC is the attacked average.',
            zh: '攻击下的验证性能（论文表 1）。大多数方法在干净图像上都接近完美，攻击下的平均值才拉开差距。AUC 为攻击下的平均值。',
          }}
        >
          <RobustnessChart />
        </Figure>
        <P
          en="ROBIN is the closest baseline, since it also injects at an intermediate step with an auxiliary condition. TIDE raises the attacked average from 0.981 to 0.999 AUC and from 0.825 to 0.986 TPR@1%FPR."
          zh="ROBIN 是最接近的基线，它同样在中间步骤注入并使用辅助条件。TIDE 把攻击下的平均 AUC 从 0.981 提高到 0.999，TPR@1%FPR 从 0.825 提高到 0.986。"
        />
        <h3><Localized en="Staying close to the reference" zh="贴近参照图像" /></h3>
        <P
          en="Robustness is half of the claim. The other half is that the watermarked image should be the image the user would have got anyway. Against its own unwatermarked reference, TIDE has the highest PSNR and SSIM and the lowest LPIPS of the three in-generation methods compared, and its CLIP score equals that of unwatermarked generation."
          zh="鲁棒性只是结论的一半。另一半是：带水印的图像应当就是用户本来会得到的那幅图像。相对各自的无水印参照，TIDE 在所比较的三种生成过程水印方法中 PSNR 与 SSIM 最高、LPIPS 最低，CLIP 分数与无水印生成持平。"
        />
        <Figure
          number={6}
          kind="data"
          caption={{
            en: 'Image quality (Table 2 of the paper). PSNR, SSIM, MS-SSIM and LPIPS are measured against the unwatermarked image from the same prompt and seed. FID† is FID between watermarked images and those references.',
            zh: '图像质量（论文表 2）。PSNR、SSIM、MS-SSIM 与 LPIPS 相对同一提示词、同一种子的无水印图像计算。FID† 为带水印图像与这些参照之间的 FID。',
          }}
        >
          <QualityTable />
        </Figure>
        <Figure
          number={7}
          kind="paper"
          width="wide"
          caption={{
            en: 'Each column shares a prompt and seed. Tree-Ring changes the content; ROBIN and TIDE keep the composition of the reference. Image crops from the qualitative comparison in the paper.',
            zh: '每一列使用相同的提示词与种子。Tree-Ring 改变了内容；ROBIN 与 TIDE 保持了参照图像的构图。图像取自论文的定性比较。',
          }}
        >
          <QualitativeGrid />
        </Figure>
        <h3><Localized en="Cost and transfer" zh="开销与迁移" /></h3>
        <P
          en="The watermark branch is evaluated only after step 35, and verification inverts only part of the trajectory. Generation time is on par with the baselines, and a verification query takes 0.74 s, against 2.16 to 2.95 s for Tree-Ring, which inverts the full trajectory."
          zh="水印分支只在第 35 步之后才参与计算，验证也只反演部分轨迹。生成时间与各基线相当，单次验证耗时 0.74 秒，而需要反演完整轨迹的 Tree-Ring 为 2.16 至 2.95 秒。"
        />
        <Figure
          number={8}
          kind="data"
          caption={{
            en: 'Runtime measured on NVIDIA V100 GPUs (Table 5 of the paper).',
            zh: 'NVIDIA V100 GPU 上测得的运行时间（论文表 5）。',
          }}
        >
          <RuntimeTable />
        </Figure>
        <P
          en="The same procedure applied to other backbones gives attacked AUC / TPR@1%FPR of 0.995 / 0.916 on Stable Diffusion 1.5 and 0.994 / 0.941 on Stable Diffusion 2, compared with 0.999 / 0.986 on 2.1."
          zh="同样的流程用于其他骨干网络时，攻击下的 AUC / TPR@1%FPR 在 Stable Diffusion 1.5 上为 0.995 / 0.916，在 Stable Diffusion 2 上为 0.994 / 0.941，2.1 上为 0.999 / 0.986。"
        />
      </Section>

      <Section id="timing" number="07" title={{ en: 'Earlier or later?', zh: '更早还是更晚？' }}>
        <P
          en="Why step 35 of 50? The paper takes the watermark and condition trained at step 35 and writes them at four other steps without retraining, under three guidance strategies. Choose an injection step to see both sides of the trade-off."
          zh="为什么是 50 步中的第 35 步？论文把在第 35 步训练好的水印与条件，不经重新训练直接写入另外四个步骤，并比较三种引导策略。选择一个注入步，查看取舍的两面。"
        />
        <Figure
          number={9}
          kind="data"
          width="wide"
          caption={{
            en: 'Injection step against robustness and fidelity (Tables 12 and 14 of the paper). Bars are TPR@1%FPR for blur (radius 4), noise (10%), JPEG (quality 25), rotation (up to 75°), and 75% crop; the average is over these five. The watermark is trained at step 35 and reused elsewhere.',
            zh: '注入步对鲁棒性与保真度的影响（论文表 12 与表 14）。条形为模糊（半径 4）、噪声（10%）、JPEG（质量 25）、旋转（至多 75°）与 75% 裁剪下的 TPR@1%FPR，平均值在这五项上计算。水印在第 35 步训练，并在其他步骤直接复用。',
          }}
        >
          <StepExplorer />
        </Figure>
        <P
          en="Early injection gives the watermark many steps to spread but disturbs an image that is still forming, so fidelity is poor. Late injection barely disturbs the image but leaves too few steps for propagation, and geometric and low-pass attacks erase it. Step 35 sits where the composition has settled and enough trajectory remains."
          zh="早期注入给了水印很多步去扩散，却扰动了仍在成形的图像，保真度差。晚期注入几乎不扰动图像，但留给传播的步数太少，几何变换和低通类攻击会将其抹去。第 35 步恰好位于构图已定、而余下轨迹仍然足够的位置。"
        />
      </Section>

      <Section id="limits" number="08" title={{ en: 'Limits', zh: '局限' }}>
        <P
          en="TIDE is evaluated in the model-owner setting. Verification needs the generation model and a compatible inversion path, so a third party could only verify through a service or a public verifier."
          zh="TIDE 在模型所有者验证的场景下评测。验证需要生成模型以及与之匹配的反演路径，第三方只能通过验证服务或公开的验证器完成验证。"
        />
        <P
          en="The watermark is a single learned pattern that answers one question: is it there or not. Carrying a multi-bit payload may cause stronger interference among watermark components. Because verification relies on deterministic partial inversion, an adaptive attacker who maximises inversion error is a threat the current evaluation does not cover."
          zh="水印是单一的学习图样，只回答一个问题：在或不在。若要承载多比特信息，水印各分量之间可能产生更强的相互干扰。由于验证依赖确定性的部分反演，专门放大反演误差的自适应攻击是目前评测尚未覆盖的威胁。"
        />
        <P
          en="This work was supported by the National Natural Science Foundation of China (62606244), the Open Research Foundation of the State Key Laboratory of Novel Software Technology (KFKT2026B15), the Postgraduate Research and Practice Innovation Program of Jiangsu Province (26CXJH0441), and the 111 Center (B26023)."
          zh="本工作受国家自然科学基金（62606244）、计算机软件新技术全国重点实验室开放课题（KFKT2026B15）、江苏省研究生科研与实践创新计划（26CXJH0441）以及 111 引智基地（B26023）资助。"
        />
      </Section>
    </Article>
  );
}
