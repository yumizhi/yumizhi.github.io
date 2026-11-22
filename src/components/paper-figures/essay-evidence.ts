import type { EssayChapter } from './essay-chapters';

export const sasboEvidence: EssayChapter[] = [
  {
    title: { en: 'ImageNet at two amplitude limits', zh: 'ImageNet 上的幅度约束' },
    body: [
      {
        en: 'On VGG19, GreedyFool and SASBO both reach 100% untargeted success at ε = 255. GreedyFool changes 71.65 entries on average and SASBO changes 50.87. With a prescribed destination class at the same limit, their respective means rise to 503.27 and 272.95. Specifying the class substantially increases the coordinate cost for both methods.',
        zh: '在 VGG19 上，ε = 255 时 GreedyFool 和 SASBO 的非定向成功率均为 100%，平均分别改变 71.65 和 50.87 个坐标。在相同幅度限制下指定目标类别，两者的平均改动数分别升至 503.27 和 272.95。目标类别限制缩小了有效改动的范围，两种方法都需要更多坐标。',
      },
      {
        en: 'At ε = 10, the projected-gradient baseline succeeds on 64.92% of the ImageNet examples in the untargeted experiment. SparseFool, GreedyFool and SASBO retain 100% success with mean counts of 1257.56, 1104.27 and 1051.24. SASBO has the smallest count among those three methods. Its mean ℓ₁, however, is 40.86, compared with 38.95 for GreedyFool. Minimizing the number of active entries and minimizing their total magnitude are different objectives.',
        zh: '当 ε 收紧到 10，投影梯度基线在 ImageNet 非定向实验中的成功率下降至 64.92%。SparseFool、GreedyFool 和 SASBO 仍达到 100%，平均改动数分别为 1257.56、1104.27 和 1051.24。SASBO 使用的坐标最少，但其平均 ℓ₁ 为 40.86，高于 GreedyFool 的 38.95。坐标数与绝对改动总量衡量两个不同的目标。',
      },
    ],
  },
];

export const samEvidence: EssayChapter[] = [
  {
    body: [{
      en: 'For the tighter amplitude limit, VGG19-only SA succeeds on 80.6% of images on its source model, compared with 66.4% for SAM. The ordering reverses on all six independent classifiers. On ResNet50, for example, success rises from 23.2% with SA to 50.8% with SAM. The ablation changes both the support ensemble and the use of query feedback, so it measures their combined contribution.',
      zh: '幅度上限为 16 时，只用 VGG19 的 SA 在源模型上的成功率为 80.6%，SAM 为 66.4%。在六个独立模型上，两种方法的排序全部反转。其中 ResNet50 上的成功率由 SA 的 23.2% 提高到 SAM 的 50.8%。这一消融同时引入了支持模型集成与查询反馈，测得的是二者合在一起的贡献。',
    }],
  },
  {
    title: { en: 'Transfer on ImageNet', zh: 'ImageNet 上的迁移结果' },
    body: [
      {
        en: 'The ImageNet evaluation includes InceptionV3 among the independent targets. In Table II, at ε = 255, SAM uses a budget of 400 pixels and obtains 34.7% success on InceptionV3. GreedyFool at κ = 10 uses 383.8 pixels on average and obtains 24.5%. SparseFool at λ = 15 uses 452.1 pixels and obtains 10.4%. The baselines produce image-dependent support sizes, so their mean counts accompany the transfer rates.',
        zh: 'ImageNet 的独立测试模型包括 InceptionV3。表 II 在 ε = 255 的条件下比较了不同方法：SAM 的预算为 400 个像素，在 InceptionV3 上的成功率为 34.7%；GreedyFool（κ = 10）平均使用 383.8 个像素，成功率为 24.5%；SparseFool（λ = 15）平均使用 452.1 个像素，成功率为 10.4%。两种基线产生的稀疏度随图像变化，因此论文同时给出了平均像素数。',
      },
      {
        en: 'With ε = 16 and a 3000-pixel budget, SAM obtains 19.5% on InceptionV3 and 23.2% on ResNet50 (Table III). Allowing more changed positions does not remove the effect of a much tighter amplitude limit. These ImageNet results are also lower in absolute terms than the CIFAR-10 results. The two datasets use different input scales, budgets and target pools.',
        zh: '在 ε = 16、预算为 3000 个像素时，SAM 在 InceptionV3 和 ResNet50 上的成功率分别为 19.5% 和 23.2%（表 III）。允许改动更多位置，仍不足以抵消更严格的单点幅度限制。ImageNet 的绝对成功率也低于 CIFAR-10，两者的输入分辨率、像素预算和目标模型集合均有差异。',
      },
    ],
  },
];
