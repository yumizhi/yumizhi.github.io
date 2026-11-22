export type EssayCopy = { en: string; zh: string };
export type EssayChapter = { title?: EssayCopy; body: EssayCopy[] };

export const sasboChapters: EssayChapter[] = [
  {
    body: [{
      en: 'The loss depends on the combination of active entries. Two masks can achieve similar losses with the current amplitudes and diverge after those amplitudes change. SASBO assigns each coordinate a selection probability. The classifier evaluates discrete masks sampled from those probabilities, so a coordinate can participate in several combinations before the method commits to a support.',
      zh: '分类损失取决于同时被选中的一组坐标。在当前幅度下，两张掩码的损失可能很接近；幅度调整后，同一对掩码的表现可能分开。SASBO 为每个坐标分配选中概率，并用按这些概率抽取的二值掩码计算分类损失。在固定一轮的位置之前，一个坐标可以参与多种组合。',
    }],
  },
  {
    title: { en: 'Ranking and amplitude updates', zh: '坐标排序与幅度更新' },
    body: [{
      en: 'SASBO ranks the selection probabilities for each image. A fixed probability threshold would retain different numbers of entries on images with different probability distributions. Retaining the highest-ranked entries instead gives the current mask a specified size. With that mask fixed, each selected entry has a signed, continuous amplitude. The classification loss and the magnitude penalty determine its update within the permitted range.',
      zh: 'SASBO 对每幅图的选择概率独立排序。若使用统一的概率阈值，概率分布不同的图像会留下数量各异的坐标。按当轮预算保留排名靠前的坐标，则可以指定掩码大小。位置确定后，每个入选坐标都有一个带符号的连续幅度，由分类损失与幅度惩罚共同决定允许范围内的更新。',
    }],
  },
];

export const samChapters: EssayChapter[] = [
  {
    body: [{
      en: 'Classifiers can agree on an image label and still have different input gradients in its neighbourhood. A position with a strong effect on VGG19 may have little effect on a DenseNet classifier. Within a task, SAM evaluates the support models at the same image. Their weighted gradients define a proposal shared by the group. A separate query model evaluates the resulting image using its own loss.',
      zh: '不同分类器可能对同一张图给出相同标签，但它们在该图附近的输入梯度仍有差异。VGG19 对某个位置很敏感，DenseNet 在同处的响应可能很弱。每轮任务中，SAM 在同一张图上计算支持模型的梯度，以加权结果构造候选更新，再由一个查询模型在候选图像上计算自身损失。',
    }],
  },
  {
    body: [{
      en: 'Model weights remain fixed as the task roles change. VGG19 can contribute to a support proposal in one task and evaluate another group’s proposal in a later one. The image retained between tasks accumulates those updates under a common pixel budget. The independent test classifiers receive only the final images.',
      zh: '任务重新分组时，各模型权重保持固定。VGG19 可以在一轮任务中参与支持组的提议，之后又在另一轮评价其他模型的提案。轮次之间保留的图像在同一像素预算下累积更新，独立测试分类器只接收最后的结果图。',
    }],
  },
];
