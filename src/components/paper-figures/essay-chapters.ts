export type EssayCopy = { en: string; zh: string };
export type EssayChapter = { title: EssayCopy; body: EssayCopy[] };

export const tideChapters: EssayChapter[] = [
  {
    title: { en: 'The clean run gives us a reference', zh: '先留下无水印的参照' },
    body: [
      {
        en: 'Take the sports car from the opening. “A red sports car” leaves the viewpoint, lighting and layout largely free. Two pictures can both answer that prompt and still look surprisingly different. To tell what the watermark changed, we hold the prompt and initial noise fixed and compare against the image the same sampler would have made without a watermark. That gives us a particular hood, wheel and stretch of pavement to compare.',
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
        en: 'That creates a design choice. A strong spectral replacement may be easy to recognize at the instant it is written, then either fade during the remaining updates or leave a change in the visible scene. Training uses both a clean estimate at that step and the image from a full clean run. The first target catches damage at the write itself. The second ties the prediction back to the composition the unwatermarked sampler eventually produces.',
        zh: '于是设计要兼顾两个时刻。一个强信号在写入当下容易识别，往后却可能被逐步削弱，也可能在可见画面上留下改动。训练同时采用注入时刻的无水印预测和完整无水印采样的结果。前一个参照约束当下的变化，后一个让预测图继续贴近无水印采样最终走到的构图。',
      },
    ],
  },
  {
    title: { en: 'A local direction worth protecting', zh: '把该保留的方向分出来' },
    body: [
      {
        en: 'Once the write has happened, two conditions ask the same denoiser for different changes. Subtracting its unconditional prediction gives a text residual and a watermark residual. The prompt residual has a useful history. Several recent directions form a local span that records how text guidance has been moving the sample. The local guidance diagram collapses that span to a line so the geometry is visible.',
        zh: '写入之后，同一个去噪模型收到文本和水印两种条件。分别减去无条件预测，就得到文本残差和水印残差。文本残差有一段可以利用的历史，最近几步的方向张成一个局部子空间，记录文本引导刚刚怎样推动样本。局部引导图把这个子空间压成一条斜线，便于看清分解的几何关系。',
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
        en: 'Look at the gray and purple squares before any mask is set. Each square represents a possible coordinate, including the color channel at that position. A darker square has a higher chance of being selected in this sketch. A finished perturbation map has a definite decision at every coordinate. During optimization, those decisions are still provisional, especially where several locations look similarly useful.',
        zh: '先看掩码确定前那些深浅不同的格子。每个格子代表一个候选坐标，也包括那个位置上的颜色通道。示意里深色格子更可能被选中。成品扰动图对每个坐标都有一个确定决定，优化过程里这个决定还可以变，尤其当多个位置看起来同样有用时。',
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
        en: 'The shaded probability field and the middle mask are related to each other. Only the coordinates at the high end of the ranking enter the current mask. A single absolute cutoff would give images with different probability distributions different numbers of active entries. A cutoff tied to the ranking can instead be recomputed for the budget used in that round.',
        zh: '左边的概率场和中间的掩码一一对应。当前只有排名靠前的坐标进入掩码。如果给所有图用同一个固定概率阈值，两张概率分布不同的图可能会留下不同数量的活跃坐标。这里的阈值由排名和当轮预算决定，因此可以随着候选变化重新确定。',
      },
      {
        en: 'With the mask in place, the continuous part of the problem is much easier to picture. Each selected entry has an amount and a sign, both of which can change while the location stays fixed. The classifier’s loss rewards some of those changes. The magnitude term and amplitude limit make changes costly. Outside the mask, the original image remains exactly as it was.',
        zh: '掩码确定下来后，连续部分就好理解了。位置先固定，被选中的每个条目还可以在正负方向和幅度上调整。分类损失会鼓励某些改动，幅度惩罚和上限则约束它们能走多远。掩码外的条目保持原值，所以这一轮更新幅度时，位置预算始终成立。',
      },
    ],
  },
  {
    title: { en: 'The next round can change its mind', zh: '下一轮可以改选位置' },
    body: [
      {
        en: 'Follow the outlined cells in the middle of the figure. They were active in the previous round and have lost their place after the magnitudes changed. This is the reason to alternate. The usefulness of a coordinate depends on both its possible magnitude and what the other coordinates are doing. A location that was a good choice on its own can contribute little once a neighboring part of the image has changed.',
        zh: '中间那些空心格在上一轮是实心的。幅度更新后，它们失去了原来的位置。这正是交替更新的用处。一处坐标能起多大作用，取决于它能改多少，也取决于其他坐标已经做了什么。某个位置单独看很有用，附近图像发生变化后，继续保留它的收益可能就很小了。',
      },
      {
        en: 'ARM supplies a way to update the probabilities along the way. It compares losses from paired binary masks that share the same random draw. Because the sampled decisions stay binary, the values fed to the classifier correspond to complete candidate masks. The estimator turns their loss differences into information about which selection probabilities should change. The next threshold therefore uses a revised ordering.',
        zh: 'ARM 给了概率更新一条路。它让两个二值掩码共享同一次随机抽样，再比较各自带来的损失。送给分类器的仍是完整的离散候选。估计器把它们的损失差异转化成更新选择概率的信息，所以下一轮决定阈值时，用的是已经调整过的排名。',
      },
    ],
  },
  {
    title: { en: 'Successful masks can often be made smaller', zh: '找到有效扰动之后，还能缩小掩码' },
    body: [
      {
        en: 'A run that succeeds with its initial allowance has cleared one bar. There is still a smaller-budget comparison to make. SASBO keeps the learned ranking and tests tighter thresholds by binary search. This uses the work already done to find useful coordinates, while checking that the smaller mask still attains the classification objective.',
        zh: '用初始预算找到一组有效扰动，只完成了第一件事。还可以拿它和更小的预算比较。SASBO 保留学到的坐标排序，用二分搜索尝试更紧的阈值。这样既利用了前面找有效位置的结果，也会检查缩小后的掩码是否仍能达到分类目标。',
      },
      {
        en: 'The table below holds the amplitude allowance and attack objective fixed within each comparison. That makes the number of surviving entries meaningful. In the paper’s tighter amplitude setting, the count needed for success rises substantially. A good reading of the result keeps two constraints in view at once: how many entries moved and how far any single entry was allowed to move.',
        zh: '下面的表在每组比较里固定分类目标和幅度上限，这才让留下多少非零项变得可比。论文把幅度限制再收紧后，保持成功所需的坐标明显变多。看这个结果时，最好把两类约束放在一起：一共动了多少项，以及任何一项最多能动多远。',
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
    title: { en: 'The query model sees the proposed image', zh: '查询模型接手的是改过的图' },
    body: [
      {
        en: 'At this point a second model evaluation does more than contribute another vote. The query classifier is brought in after the support updates. It sees the proposed image, whose local gradients can differ from those at the beginning of the round. The support move therefore creates the place at which query feedback is measured.',
        zh: '这时再引入另一个模型，起到的作用比多投一票更具体。查询模型是在支持集更新之后加入的。它看的是改过的图，这个位置附近的梯度可能和本轮开始时不一样。支持集先走出的那几步，决定了查询反馈在什么位置取得。',
      },
      {
        en: 'Algorithm 1 uses the query gradient evaluated there to update the input carried into the task. The path through the support models changes the point of evaluation. The query direction is what guides the outer update. This is the part of meta-learning SAM borrows: propose an adaptation on one group, then use its behavior on a different member of the pool to shape what persists.',
        zh: '论文算法 1 在那个位置取得查询梯度，再用这个方向更新本轮开始时接到的图像。支持集走过的路径改变的是评价点，真正指导外层更新的是在那里得到的查询方向。这里借用元学习的一点是，先用一组模型做适应，再让另一组反馈决定哪些改动会被带走。',
      },
    ],
  },
  {
    title: { en: 'Projection makes the next task sparse again', zh: '投影把稠密更新放回预算内' },
    body: [
      {
        en: 'An image gradient can propose changes across much of the input. SAM needs the next task to start from an image that already fits the sparse budget. For each pixel, it can restore the original RGB values or keep a change clipped to the allowed amplitude. These options leave different squared errors relative to the dense proposal.',
        zh: '图像梯度可能在大部分位置都提出改动。SAM 希望下一轮拿到的图已经满足稀疏预算。对每个像素，可以恢复原本的 RGB 值，也可以保留裁剪到幅度上限内的改动。两种做法离稠密提议有不同的平方误差。',
      },
      {
        en: 'The relevant score is how much error keeping the pixel would save. A pixel can have a large proposed change, yet the amount it recovers once clipped may be modest. Ranking the savings spends the budget on the changes that best preserve the dense update under the constraints. The resulting sparse image is handed on to the next task, so later feedback can revise the solution we would actually keep.',
        zh: '真正用来排名的是保留该像素能省掉多少误差。一处位置提议的改动可能很大，但裁剪后能够保留下来的效果未必同样大。按省掉的误差分配名额，就能在约束内尽可能接近稠密更新。把投影后的稀疏图交给下一轮，后续模型的反馈就会直接作用到这张最终能保留的图上。',
      },
    ],
  },
  {
    title: { en: 'The roles change, and evaluation stays separate', zh: '模型角色轮换，评估留在最后' },
    body: [
      {
        en: 'The next sampled task can give the same classifier a different job. Follow Model A as it moves from the support group to the query position. Its network weights are the same. It now gives feedback at a point that was reached using the other support classifiers. A perturbation repeatedly exposed to these handoffs has to serve several model roles during optimization.',
        zh: '下一轮，同一个分类器可以换个角色。看模型 A 从支持组移到查询位置，它的网络参数没有变，提供反馈的时机却变了：现在等其他支持模型把图更新完，再去看那个位置。扰动在优化过程中要反复经历这样的交接。',
      },
      {
        en: 'The models in the final evaluation sit outside this loop. They receive the resulting images once the search is complete. Keeping that separation makes the ablation interpretable. The single-model baseline can still win on the classifier that produced its feedback, while the model that does better on held-out classifiers tells us more about transfer.',
        zh: '最后用来评估的模型在这个循环之外，只在搜索结束后收到结果图像。这个界限让消融结果有了清楚的解释。单模型基线仍可能在给它提供反馈的分类器上更强，跨到独立分类器之后谁表现更好，才更能说明迁移效果。',
      },
    ],
  },
];
