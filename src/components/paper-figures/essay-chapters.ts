export type EssayCopy = { en: string; zh: string };
export type EssayChapter = { title?: EssayCopy; body: EssayCopy[] };

export const sasboChapters: EssayChapter[] = [
  {
    body: [
      {
        en: 'In the opening picture, the dark field in the perturbation map matters as much as the bright points. Each point records a change in at least one color channel. A finished map has a definite decision at each coordinate, but during optimization it is useful to hold several possibilities open, especially where different sets of coordinates give comparable changes in the classifier’s loss.',
        zh: '开头扰动图的黑底和亮点一样重要。亮点记录了至少一个颜色通道发生变化的位置，黑色位置保持原值。最终的掩码明确了哪些坐标发生变化。优化时如果几组坐标给分类器的损失差不多，保留多个候选就有价值，幅度调整后还可以改选。',
      },
      {
        en: 'This is where a sum of absolute changes gives only part of the picture. Taking a little from each of many coordinates can keep the sum modest. The sparsity test cares about how many entries moved at all. By representing each decision with a Bernoulli probability, SASBO can consider several layouts of the same budget and learn from the loss obtained by drawing an actual mask.',
        zh: '这也解释了为什么改动绝对值的总和只能描述一部分问题。很多坐标分别动一点，总和也可能很小。稀疏测试关心的是有多少项发生过变化。SASBO 用伯努利概率表示每个开关，让同一份预算可以试着分给不同位置，再根据抽出的真实掩码所产生的损失学习。',
      },
    ],
  },
  {
    title: { en: 'Ranking and amplitude updates', zh: '坐标排序与幅度更新' },
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
    body: [
      {
        en: 'A classifier’s gradient is a local description of how its score changes near an image. Two classifiers can disagree about that direction even when they assign the original image the same label. A perturbation that follows VGG19 closely can spend its entire sparse budget on directions that matter much less to DenseNet. The VGG19 and DenseNet161 comparison gives a concrete example.',
        zh: '分类器的梯度描述的是在这张图附近，往哪个方向改会让它的分数变化。两个分类器即使给原图分到了同一类，也可能对改动方向给出不同判断。紧跟 VGG19 的扰动，可能把整个稀疏预算花在对 DenseNet 影响很小的方向上。开篇提到的 VGG19 和 DenseNet161 就是这样一组对照。',
      },
      {
        en: 'In the first part of a SAM task, several support classifiers see the same image and their gradients are combined. This gives the perturbation a shared update direction to follow for that part of the task. The models can disagree locally, and the weighted combination limits how much one of them determines the proposal on its own.',
        zh: 'SAM 每轮先让几个支持模型看同一张图，再合并它们提供的梯度。这样，扰动在这一阶段沿着共同提出的方向更新。即使模型对部分位置意见不一致，一个模型也只能按它的权重影响这个提议。',
      },
    ],
  },
  {
    body: [
      {
        en: 'The next sampled task can give the same classifier a different job. For example, a task can use VGG19 in the support group and a later task can reserve it for query feedback. Its network weights stay fixed. The other support classifiers now determine the point at which it supplies feedback. A perturbation repeatedly exposed to these handoffs has to serve several model roles during optimization.',
        zh: '下一轮，同一个分类器可以换个角色。比如一轮把 VGG19 放在支持组，之后某轮留它做查询。网络参数保持固定。作为查询模型时，它在其他支持模型更新后的图上提供反馈。扰动在优化过程中要反复经历这样的交接。',
      },
      {
        en: 'The final evaluation uses a separate pool of models. Those models receive the resulting images once the search is complete. That separation makes the ablation interpretable. Performance on the original classifier reflects the fit to its feedback, while performance on held-out classifiers measures how much of that effect transfers.',
        zh: '最后用来评估的模型在这个循环之外，只在搜索结束后收到结果图像。这个界限让消融结果有了清楚的解释。单模型基线仍可能在给它提供反馈的分类器上更强，跨到独立分类器之后谁表现更好，才更能说明迁移效果。',
      },
    ],
  },
];
