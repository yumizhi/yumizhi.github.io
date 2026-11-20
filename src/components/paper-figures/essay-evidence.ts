import type { EssayChapter } from './essay-chapters';

export const sasboEvidence: EssayChapter[] = [
  {
    title: { en: 'Holding the target class fixed makes the comparison fair', zh: '定向实验先固定要走到的类别' },
    body: [
      {
        en: 'A targeted comparison can be biased by its choice of destination. If one method gets a class whose score is already close to the original prediction and another gets a distant one, the coordinate counts reflect both the algorithm and the difficulty of the assigned class. SASBO’s experiment samples a target label and holds it consistent across methods. In the untargeted experiment, any incorrect class qualifies, so the optimizer has more ways to satisfy the objective.',
        zh: '定向实验的比较会受目标类别影响。某个方法得到的是一个分数已接近原预测的类别，另一个方法却要走到相差很远的类别，坐标数就同时反映了算法差异和任务难度。论文先随机选出目标标签，同一张图在各方法之间使用同一个目标。非定向实验允许任意错误类别，搜索可以通过更多方式达到目标。',
      },
      {
        en: 'The paper draws its test images from CIFAR-10 and ImageNet and runs the comparisons on their respective classifiers. Within a setting, every method is tested with the same amplitude threshold. That combination of a shared target and a shared threshold gives the count a clear interpretation: it is a measure of how economically the method uses coordinates under the chosen test.',
        zh: '论文分别从 CIFAR-10 和 ImageNet 选测试图，并在对应分类器上做对照。同一设置下，各方法使用相同的幅度上限。这两个控制让坐标数变得好解释：目标一致，每处能动多少也一致，最终就能看不同方法在这个测试条件下有多节省位置。',
      },
    ],
  },
  {
    title: { en: 'The same success rate can hide different budgets', zh: '成功率相同，坐标开销可以很不同' },
    body: [
      {
        en: 'In the previewed CIFAR-10 settings, the success column is already saturated. The number of changed coordinates then tells us how much of the image each method had to use. The targeted setting makes that particularly clear. GreedyFool and SASBO both reach the prescribed class on the test cases, but the latter needs substantially fewer nonzero coordinates. This is evidence about coordinate efficiency in that setting. The image itself still needs to be inspected when the allowed amplitude is large.',
        zh: '页面展示的 CIFAR-10 设置里，成功率已经达到上限。这时，结果图改了多少坐标才能区分两种方法。定向实验尤其明显，GreedyFool 和 SASBO 都能到达指定类别，后者平均需要的非零坐标少得多。这说明在该设置下，坐标用得更省。若允许的单点幅度很大，还得结合图像本身判断改动是否显眼。',
      },
      {
        en: 'The difference between ℓ₀ and an amplitude metric also matters for comparing two algorithms. A count treats a faint change and a bright change as one entry each. An energy metric responds differently to those two edits. That is why the paper reports several norms in the same table and gives image examples under a tight amplitude bound.',
        zh: '比较两种算法时，还要分清非零计数和幅度指标。一个几乎看不出的改动，和一个明显的亮点，在计数里都只算一项，但它们对能量指标的影响不同。所以论文在同一张表里报告了多种范数，也给出了幅度限制较紧时的原图对照。',
      },
    ],
  },
  {
    title: { en: 'ImageNet tests the same idea at a different scale', zh: '换到 ImageNet，检验坐标选择能否在更大图像上成立' },
    body: [
      {
        en: 'The ImageNet experiment uses a larger visual input and a different classifier. Under the loose amplitude limit, the mean nonzero count goes from 71.65 for GreedyFool to 50.87 for SASBO in the untargeted setting. The gap is narrower than in the displayed CIFAR-10 example. Looking at both datasets therefore gives a more honest picture of the gains than quoting just the largest relative reduction.',
        zh: 'ImageNet 实验换了更大的图像输入和另一个分类器。在幅度限制较宽的非定向设置下，GreedyFool 平均用了 71.65 个非零坐标，SASBO 为 50.87。两者差距比页面上的 CIFAR-10 示例小。把两个数据集放在一起读，才能看出坐标节约的幅度会怎样随实验设置变化。',
      },
      {
        en: 'Table 2 also shows that making the amplitude limit much tighter changes what is comparable. Three methods still reach full success, while the projected-gradient baseline succeeds on only a subset. A smaller average count would be difficult to interpret in isolation there. Success and sparsity have to be read together before attributing an improvement to the choice of coordinates.',
        zh: '论文表 2 中，幅度上限进一步收紧后，能放在一起比较的含义也变了。三种方法仍能在全部样本上成功，投影梯度基线只在部分样本上成功。这时单看平均坐标数就很难解释。先把成功率和稀疏度合在一起读，才能判断改进是否来自坐标选择。',
      },
    ],
  },
  {
    title: { en: 'The final count summarizes a search', zh: '最终的坐标数，是一次搜索的结果' },
    body: [
      {
        en: 'The two stages of the method leave different traces in the measurement. The alternating stage finds a ranked set of locations and magnitudes at an initial allowance. The second stage reuses that ranking and tests smaller subsets. An example with a very low final count may have started with a considerably larger search budget. The final count tells us about the perturbation that survived the test. The number of optimization updates is a separate measure of cost.',
        zh: '方法的两个阶段会在结果里留下不同的痕迹。交替更新先在初始预算内得到一组有排名的位置和对应幅度，第二阶段再沿用排名尝试更小的集合。最终只动了很少位置的图，也可能在搜索时用过大得多的初始预算。最终计数描述的是通过测试后留下的扰动，优化过程用了多少次更新则是另一项开销。',
      },
    ],
  },
];

export const samEvidence: EssayChapter[] = [
  {
    title: { en: 'The source-model score and transfer score tell different stories', zh: '源模型分数和迁移分数讲的是两件事' },
    body: [
      {
        en: 'For each method, the ablation evaluates the same images on their source model and on held-out classifiers. VGG19 gives the single-model baseline its optimization signal. A high score there confirms that the sparse perturbation fits the source. The six held-out classifiers never supply that signal. Their results test whether its effect survives the change to a different architecture. It is possible to do well on the first and poorly on the second, which is why the paper keeps those columns separate.',
        zh: '可以把消融实验读成对同一批图的两次评价。VGG19 为单模型基线提供优化信号，在它身上分数高，说明稀疏扰动适合源模型。六个独立分类器没有提供这类信号，它们的结果检查扰动换到另一种架构后还能不能起作用。前一项好，后一项也可能差，所以论文把这两组结果分列。',
      },
      {
        en: 'With the looser amplitude limit, DenseNet161 rises from 68.2% to 91.5%, while MnasNet1.0 rises from 69.8% to 78.8%. The gain is larger on DenseNet161. The average describes the overall benefit, and the per-model values show which architectures contribute most to it.',
        zh: '分模型看就更具体了。幅度限制较宽的那组，DenseNet161 的成功率从 68.2% 升到 91.5%，MnasNet1.0 则从 69.8% 升到 78.8%。两者方向一致，幅度不同。均值描述整体收益，分模型的结果让人看见收益究竟分布在哪里。',
      },
    ],
  },
  {
    title: { en: 'The amplitude limit changes the shape of the comparison', zh: '幅度上限也在改变比较的条件' },
    body: [
      {
        en: 'The lower-amplitude experiment is a separate operating point. It permits more locations to change, each by a smaller amount. Multiple independent targets benefit from cross-model feedback in this setting too. The main question for this ablation is the difference between SA and SAM within each setting, where the two methods share the same amplitude and pixel allowances.',
        zh: '幅度更紧的实验是另一个使用条件。它允许动更多位置，但每一处只能动得更小。在这个设置里，多种独立分类器依然能看到跨模型反馈带来的收益。这组消融最值得看的是，在每个固定设置内，SA 和 SAM 在相同幅度与像素预算下相差多少。',
      },
      {
        en: 'This also explains what the ablation isolates. SA keeps the gradient-based construction and global sparsification while using a single model. SAM changes the feedback scheme as a whole, including the support ensemble and the held-out query in each task. The result measures the combined effect of that scheme. A direct comparison between pooled gradients and query feedback alone would require an additional control.',
        zh: '这也说明了消融究竟控制了哪些东西。SA 保留梯度更新和全局稀疏化，只使用一个模型。SAM 改变的是整套反馈方式，包括支持模型的梯度合并，以及每轮暂时留出的查询模型。这里的提升是这两部分合在一起的收益。若要单独区分梯度合并和查询反馈各自的贡献，还需要另一组控制实验。',
      },
    ],
  },
  {
    title: { en: 'ImageNet puts transfer under more varied conditions', zh: 'ImageNet 提供了另一组迁移条件' },
    body: [
      {
        en: 'The ImageNet experiments extend the comparison to a different input scale and include InceptionV3 among the held-out models. In the looser-amplitude setting, SAM obtains 34.7% on InceptionV3, against 24.5% for the shown GreedyFool setting and 10.4% for the shown SparseFool setting. The direction of the result is compatible with the CIFAR-10 transfer experiment, while the absolute scores show how much more room there is for failure in this setting.',
        zh: 'ImageNet 实验换了输入尺度，独立测试模型也包括 InceptionV3。在幅度限制较宽的设置里，SAM 在 InceptionV3 上的成功率为 34.7%，论文列出的 GreedyFool 设置为 24.5%，SparseFool 设置为 10.4%。它和 CIFAR-10 的迁移实验方向一致，绝对成功率却告诉我们，在这个设置下还有相当多的图无法迁移。',
      },
      {
        en: 'The main comparison and the ablation answer different questions. The main table puts SAM alongside methods that produce variable numbers of changed pixels, so the paper shows the mean count for each baseline setting next to its transfer rate. The ablation fixes the budget and compares two feedback schemes. Put together, the first describes transfer at the reported sparsity levels and the second helps explain how much of that behavior comes from the feedback design.',
        zh: '主对照和消融回答的并不是同一个问题。主表把 SAM 放在会产生不同改动数量的方法旁边，因此同时列出各基线设置的平均像素数和迁移率。消融则固定预算，比较两种反馈方式。前者告诉我们在报告的稀疏度下表现如何，后者帮助解释表现差异有多少来自反馈设计。',
      },
    ],
  },
];
