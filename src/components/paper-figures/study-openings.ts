// Editorial introductions keyed to the three archived PDFs.
export const studyOpenings = {
  tide: {
    title: { en: 'Watermarking a diffusion trajectory', zh: '扩散轨迹中的水印' },
    paragraphs: [
      { en: 'An image generator can mark its output before the file is published. Later, even if the file has been resized or recompressed, a verifier can look for evidence that it came from that generator. For the person who requested the image, there is a second requirement. Changing the generator to write a watermark should preserve the scene they would otherwise have received.', zh: '生成器可以在图像发布前写入水印。文件经过缩放或重新压缩以后，验证者仍有机会从画面中找到来源证据。对请求生成这张图的人来说，还有另一项要求。同样的提示词、同样的随机种子，加入水印以后，原本会得到的画面应当尽量保留下来。' },
      { en: 'The choice of when to write matters because a diffusion model builds the scene over successive predictions. Tree-Ring modifies the starting noise, upstream of decisions about composition and viewpoint. ROBIN moves the write to an intermediate latent, by which time some structure is already present. Both the watermark signal and the scene then pass through the remaining denoising steps. A write that is detectable at the instant of injection can still fade before the last step.', zh: '扩散模型通过连续多次预测逐步构成画面，写入发生在哪一步会改变结果。Tree-Ring 修改起始噪声，构图和视角都还未确定。ROBIN 则在中间潜变量上写入，这时画面的部分结构已经形成。写入之后，场景和水印还要共同经历余下的去噪；注入当下容易辨认的信号，走到最后一步时也可能已经衰减。' },
      { en: 'TIDE treats the remaining trajectory as part of watermarking. An auxiliary condition helps carry the signal, and recent text-guidance directions indicate where that extra influence may interfere with the scene. In Figure 2, the car in one watermarked image faces away from the camera while the unwatermarked car faces it. Both satisfy the prompt. Only the paired comparison captures the change in viewpoint.', zh: 'TIDE 把剩余轨迹也纳入水印设计。辅助条件帮助信号延续，近期的文本引导方向则提供参照，提示哪些额外改动容易干扰画面。图 2 的无水印跑车朝向镜头，其中一种水印方法生成了车尾。两张图都符合「红色跑车」的提示，视角变化则体现在同种子生成图之间的配对差异。' },
    ],
  },
  sasbo: {
    title: { en: 'Sparsity as a coordinate count', zh: '图像坐标的稀疏约束' },
    paragraphs: [
      { en: 'Two disturbances of similar total magnitude can have quite different footprints. One spreads small changes across an image. Another concentrates its effect in a few colour values. Sparse robustness studies this second case by counting the coordinates that changed. In SASBO each coordinate is an entry of the image tensor, so two altered colour channels at the same pixel count twice.', zh: '两组总幅度相近的扰动，在图像里可能留下完全不同的痕迹。一组把微小改动散到整幅图，另一组只改变零星几处颜色值。稀疏鲁棒性研究用改动坐标的数量来刻画后一种情形。SASBO 按图像张量的元素计数，同一像素的两个颜色通道发生变化，就计作两项。' },
      { en: 'This count, the ℓ₀ measure, changes abruptly. An already active coordinate can move farther without increasing the count. At a previously untouched coordinate, even a small change adds one immediately. A magnitude penalty can assign different costs to two disturbances that use exactly the same number of entries. A greedy selection can also keep a coordinate whose contribution disappears once another has been chosen.', zh: '这个计数量 ℓ₀ 是跳变的。把已经改动的坐标再推远一点，计数保持原样；轻轻改变一个此前未动的坐标，计数立刻加一。若以幅度惩罚近似计数，两个明明用了同样多坐标的结果也会得到不同代价。若靠贪心逐项选点，先前选中的坐标又可能在新的组合里失去作用。' },
      { en: 'SASBO keeps a separate choice for each entry and a separate magnitude for its change. It estimates which combinations matter, then checks how many selected entries the classifier still requires to change its decision. For each amplitude limit, the paper reports the proportion of images that change class and the mean count of altered entries.', zh: 'SASBO 为每个坐标分别表示是否选中及允许多大改动，先估计哪些组合有效，再检验保留的坐标子集能否维持改判。对每个幅度上限，论文分别报告改判成功的图像比例和平均改动坐标数。' },
    ],
  },
  'sparse-meta-learning': {
    title: { en: 'Sparse perturbations across classifiers', zh: '稀疏扰动的跨模型迁移' },
    paragraphs: [
      { en: 'A classifier may mislabel an image after only a few pixels change, yet a second classifier may still recognize exactly the same image. The first result measures sensitivity to a sparse change on a known model. The second tests transfer across model boundaries. In a black-box evaluation the target classifier is unavailable while the changes are being chosen, so fitting a source model closely can give a misleading picture of transfer.', zh: '一张图只改了几个像素，某个分类器就会认错。把这张图原封不动交给另一模型，它仍可能认对。前一项反映已知模型对稀疏改动的敏感程度，后一项检验这种影响能否跨越模型边界。黑盒评估中，选择改动时无法使用目标模型；在源模型上很有效的结果，到了迁移测试时可能大打折扣。' },
      { en: 'The pixel budget sharpens the difficulty. Each retained position takes one of a finite number of places. An update favoured by one surrogate may occupy a place that would have been more useful on another. SAM brings the change of evaluator into optimization: a support group proposes a change, a different accessible model evaluates it, and a sparse projection chooses the positions retained for the next task.', zh: '像素预算使这个矛盾更尖锐。每留下一个位置，就占去一个有限的名额。某个替代模型偏好的位置，在另一模型上可能几乎没有作用。SAM 将更换评判者的过程引入优化。支持组提出候选更新，另一台可访问的模型评价提案，再通过稀疏投影选择下一轮保留的位置。' },
      { en: 'The query model in a task belongs to the accessible pool and can take a different role in a later task. The targets used to report transfer are a separate group that never supplies an update. The transfer test begins after image construction has finished.', zh: '一轮任务里的查询模型属于可访问的替代模型池，到下一轮可以换角色。最后用于报告迁移率的目标模型则始终独立，从未为更新提供反馈。图像构造完成后，才交给这组独立模型评估。' },
    ],
  },
};
