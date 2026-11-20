export type EssayCopy = { en: string; zh: string };
export type EssayChapter = { title: EssayCopy; body: EssayCopy[] };

export const tideChapters: EssayChapter[] = [
  {
    title: { en: 'The clean run gives us a reference', zh: '先留下无水印的参照' },
    body: [
      {
        en: 'The sports car from the opening gives us a concrete control. “A red sports car” leaves the viewpoint, lighting and layout open. Two pictures can fit that description and look surprisingly different. To isolate the effect of the watermark, we repeat generation with the same prompt and initial noise, then compare the hood, the wheel and the stretch of pavement in the two results.',
        zh: '还是看开头那辆跑车。「红色跑车」对视角、光线和构图都留了很大余地。两张图可以同样符合这句提示词，看起来却相差很远。为了判断水印改了什么，我们固定提示词和起始噪声，再用同一个采样器生成一张无水印图作参照。这样就有了具体可比的车头、前轮和路面，而不仅仅是同一个类别的物体。',
      },
      {
        en: 'The two paths share their early updates up to the moment of writing. That shared prefix is useful in its own right. It lets the coarse scene take shape first and gives us a clean before-and-after at the latent where the intervention happens. The comparison at the top of the article and the fidelity measurements below follow that same logic all the way to the finished scene.',
        zh: '在写入水印之前，两条轨迹经过相同的早期更新。这一段共同路径让画面的大体结构先成形，也留下了一个清楚的对照：在选定的潜变量上，写入前后究竟变了什么。后面的画质实验把这组对照延续到最终图像。',
      },
    ],
  },
  {
    title: { en: 'One write changes the state of the sampler', zh: '一次写入改变了采样状态' },
    body: [
      {
        en: 'The write happens in the latent’s Fourier representation. TIDE replaces coefficients on a selected support with the learned spectrum, then returns to the latent representation used by the sampler. The shift on the left marks that single intervention. Thereafter the denoiser sees the modified latent, so the same text prompt can lead to a different noise prediction and a different next state.',
        zh: '水印写在潜变量的傅里叶表示中。TIDE 用学到的水印频谱替换指定区域的系数，再回到采样器使用的潜变量表示。图中那一下跳跃就是这次写入。此后，去噪模型看到的输入已经变了。同样的提示词作用在新的潜变量上，给出的噪声预测和下一步状态也可能随之变化。',
      },
      {
        en: 'A strong spectral replacement can be easy to recognize when written, then fade during denoising or leave a visible change in the scene. Training uses two clean targets for that reason. The estimate at the injection step catches the immediate disruption. The full clean run supplies the composition the watermark should preserve through the remaining updates.',
        zh: '于是设计要兼顾两个时刻。一个强信号在写入当下容易识别，往后却可能被逐步削弱，也可能在可见画面上留下改动。训练同时采用注入时刻的无水印预测和完整无水印采样的结果。前一个参照约束当下的变化，后一个让预测图继续贴近无水印采样最终走到的构图。',
      },
    ],
  },
  {
    title: { en: 'A local direction worth protecting', zh: '把该保留的方向分出来' },
    body: [
      {
        en: 'Once the write has happened, two conditions ask the same denoiser for different changes. Subtracting its unconditional prediction gives a text residual and a watermark residual. The prompt residual has a useful history. Several recent directions form a local span that records how text guidance has been moving the sample. That span is the reference for deciding which part of the watermark update can be used.',
        zh: '写入之后，同一个去噪模型收到文本和水印两种条件。分别减去无条件预测，就得到文本残差和水印残差。文本残差有一段可以利用的历史，最近几步的方向张成一个局部子空间，记录文本引导刚刚怎样推动样本。接下来对照这段历史，才能决定水印更新的哪一部分适合留下。',
      },
      {
        en: 'Imagine a watermark residual that is almost parallel to those recent text directions. Most of its length lies in the projected part, leaving a short complementary component after subtraction. If the residual points mostly across the span, more survives. This makes the intervention depend on the local relationship between the conditions. The same prompt can move through more and less sensitive parts of its trajectory as the image takes shape.',
        zh: '试想水印残差几乎沿着最近的文本方向。它的大部分长度会落入投影分量，减去以后只剩一小段互补分量。水印残差若更多地指向子空间之外，留下来的分量就更大。这让引导依赖当前两种条件的关系。同一个提示词在成图过程中经过不同阶段，允许水印引导发挥的空间也会跟着变。',
      },
    ],
  },
  {
    title: { en: 'The sampler spends its guidance budget step by step', zh: '把引导预算花在合适的步上' },
    body: [
      {
        en: 'Projecting out overlap settles the direction of the watermark update. Its strength still needs a rule. On a sharp turn, past text directions are a less stable description of where the prompt is going next. TIDE reduces the watermark share in that case. It also reduces the share when overlap is high or the complementary residual is already strong. The remainder goes to text guidance, which keeps a reserved minimum.',
        zh: '去掉重合分量之后，水印朝哪个方向加已经有了答案，接着还要决定加多少。文本轨迹转弯很急时，过去的文本方向对下一步的参考价值会变小，TIDE 在这样的步上压低水印预算。两者重合多，或者保留下来的残差本身就强时，也会给水印更少预算。余下部分交给文本分支，同时为它留有最低额度。',
      },
      {
        en: 'The guided branch bends toward the clean reference over several updates. That is the behavior we want to illustrate. The reported evidence comes from the matched generations, the detection experiment and the injection-timing ablation. In particular, the ablation lets us compare fixed and adaptive guidance with the same learned watermark, which is a sharper test of the controller than comparing two entirely different watermark systems.',
        zh: '图里受引导的分支是经过几步更新逐渐靠近无水印参考的。实验则用匹配生成图、检出率和注入时刻的消融来检验这种做法。尤其是消融，可以让固定引导和自适应引导使用同一组学到的水印。比起直接比较两套不同的水印系统，这更能说明差异来自后续引导的哪一部分。',
      },
    ],
  },
];

export const sasboChapters: EssayChapter[] = [
  {
    title: { en: 'A probability holds open more than one choice', zh: '概率让搜索保留多个候选' },
    body: [
      {
        en: 'In the opening picture, the dark field in the perturbation map matters as much as the bright points. Each point records a change in at least one color channel. A finished map has a definite decision at each coordinate, but during optimization it is useful to hold several possibilities open, especially where different sets of coordinates give comparable changes in the classifier’s loss.',
        zh: '开头扰动图的黑底和亮点一样重要。亮点记录了至少一个颜色通道发生变化的位置，黑底保留的是原来的值。成品图在每个坐标上都有确定的决定。优化时如果几组坐标给分类器的损失差不多，保留多个候选就有价值，幅度调整后还可以改选。',
      },
      {
        en: 'This is where a sum of absolute changes gives only part of the picture. Taking a little from each of many coordinates can keep the sum modest. The sparsity test cares about how many entries moved at all. By representing each decision with a Bernoulli probability, SASBO can consider several layouts of the same budget and learn from the loss obtained by drawing an actual mask.',
        zh: '这也解释了为什么改动绝对值的总和只能描述一部分问题。很多坐标分别动一点，总和也可能很小。稀疏测试关心的是有多少项发生过变化。SASBO 用伯努利概率表示每个开关，让同一份预算可以试着分给不同位置，再根据抽出的真实掩码所产生的损失学习。',
      },
    ],
  },
  {
    title: { en: 'A ranking becomes a concrete mask', zh: '按排名把概率变成掩码' },
    body: [
      {
        en: 'The final map shows a definite set of positions. SASBO obtains it by ranking the current selection probabilities and retaining the coordinates at the top. A fixed probability cutoff could leave one image with many more active entries than another. A rank-based cutoff can be recomputed whenever the round’s budget changes.',
        zh: '要得到成品图里那组确定的位置，SASBO 先对当前概率排序。只有排名靠前的坐标进入掩码。如果给所有图用同一个固定概率阈值，概率分布不同的两张图可能会留下不同数量的活跃坐标。这里的阈值由排名和当轮预算决定，可以随着候选变化重新确定。',
      },
      {
        en: 'With the mask in place, the continuous part of the problem is much easier to picture. Each selected entry has an amount and a sign, both of which can change while the location stays fixed. The classifier’s loss rewards some of those changes. The magnitude term and amplitude limit make changes costly. Outside the mask, the original image remains exactly as it was.',
        zh: '掩码确定下来后，连续部分就好理解了。位置先固定，被选中的每个条目还可以在正负方向和幅度上调整。分类损失会鼓励某些改动，幅度惩罚和上限则约束它们能走多远。掩码外的条目保持原值，所以这一轮更新幅度时，位置预算始终成立。',
      },
    ],
  },
];

export const samChapters: EssayChapter[] = [
  {
    title: { en: 'Several models propose one image update', zh: '让多个模型共同提出改动' },
    body: [
      {
        en: 'A classifier’s gradient is a local description of how its score changes near an image. Two classifiers can disagree about that direction even when they assign the original image the same label. A perturbation that follows VGG19 closely can spend its entire sparse budget on directions that matter much less to DenseNet. The opening experiment shows how large that gap can be.',
        zh: '分类器的梯度描述的是在这张图附近，往哪个方向改会让它的分数变化。两个分类器即使给原图分到了同一类，也可能对改动方向给出不同判断。紧跟 VGG19 的扰动，可能把整个稀疏预算花在对 DenseNet 影响很小的方向上。开头的实验就显示了这种差距。',
      },
      {
        en: 'In the first part of a SAM task, several support classifiers see the same image and their gradients are combined. This gives the perturbation a shared update direction to follow for that part of the task. The models can disagree locally, and the weighted combination limits how much one of them determines the proposal on its own.',
        zh: 'SAM 每轮先让几个支持模型看同一张图，再合并它们提供的梯度。这样，扰动在这一阶段沿着共同提出的方向更新。即使模型对部分位置意见不一致，一个模型也只能按它的权重影响这个提议。',
      },
    ],
  },
  {
    title: { en: 'The roles change, and evaluation stays separate', zh: '模型角色轮换，评估留在最后' },
    body: [
      {
        en: 'The next sampled task can give the same classifier a different job. For example, a task can use VGG19 in the support group and a later task can reserve it for query feedback. Its network weights stay fixed. It now gives feedback at a point reached using the other support classifiers. A perturbation repeatedly exposed to these handoffs has to serve several model roles during optimization.',
        zh: '下一轮，同一个分类器可以换个角色。比如一轮把 VGG19 放在支持组，之后某轮留它做查询。网络参数保持固定，提供反馈的时机却变了：它现在等其他支持模型把图更新完，再看那个位置。扰动在优化过程中要反复经历这样的交接。',
      },
      {
        en: 'The final evaluation uses a separate pool of models. Those models receive the resulting images once the search is complete. That separation makes the ablation interpretable. Performance on the original classifier reflects the fit to its feedback, while performance on held-out classifiers measures how much of that effect transfers.',
        zh: '最后用来评估的模型在这个循环之外，只在搜索结束后收到结果图像。这个界限让消融结果有了清楚的解释。单模型基线仍可能在给它提供反馈的分类器上更强，跨到独立分类器之后谁表现更好，才更能说明迁移效果。',
      },
    ],
  },
];
