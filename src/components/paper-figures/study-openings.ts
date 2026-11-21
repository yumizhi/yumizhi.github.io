// Editorial introductions keyed to the three archived PDFs.
export const studyOpenings = {
  tide: {
    lead: { en: 'TIDE writes a watermark partway through image generation. It uses the remaining denoising steps to preserve a detectable signal while keeping the scene close to the image the same prompt and seed would have produced.', zh: 'TIDE 在扩散生成的中途写入水印，利用余下的去噪步骤维持信号，同时尽量保住相同提示词与随机种子原本会生成的画面。' },
    title: { en: 'The image that would have been generated', zh: '以原本会生成的那张图为参照' },
    paragraphs: [
      { en: 'A provenance signal needs to survive the ordinary life of an image. A picture may be compressed or resized long before anyone checks its origin. Embedding the signal during generation gives the denoiser a chance to carry it into the final pixels. It also gives the signal a chance to change the picture itself.', zh: '生成图像往往在发布后才需要验明来源。到那时，文件可能已经被压缩或缩放。生成过程中嵌入水印，使信号有机会随去噪进入最终成图；与此同时，生成器也会据此改变下一步预测，画面的内容可能随之改变。' },
      { en: 'Figure 2 makes this tension visible. A red sports car seen from behind can satisfy the same prompt as one seen from the front. To compare watermarking methods, the paper holds the prompt and seed fixed and keeps the unwatermarked picture as a second reference. A detector score and an image pair then describe two distinct outcomes of the same intervention.', zh: '论文图 2 的跑车把这种取舍摆在了眼前。车头与车尾都符合“红色跑车”这一提示，构图却截然不同。为此，实验固定提示词和随机种子，额外保留一张无水印生成图。同一轮写入的结果，由编辑后的检出率和成对图像的变化共同刻画。' }
    ],
  },
  sasbo: {
    lead: { en: 'Sparse changes expose a classifier’s dependence on individual image coordinates. SASBO studies the choice of locations itself, separating the cost of touching another coordinate from the size of the change made there.', zh: '图像分类器有时会因极少数坐标的变化而改判。SASBO 研究坐标选择本身，把新增一处改动的代价与该处允许的改动幅度分别建模。' },
    title: { en: 'Counting the altered entries', zh: '把改动的坐标逐一数出来' },
    paragraphs: [
      { en: 'Two disturbances of similar total magnitude can look quite different. One can spread small changes across a frame, the other can concentrate a handful of larger changes at isolated locations. An evaluation that counts altered coordinates distinguishes those cases. In this paper a coordinate is an entry of the image tensor, so a change confined to one colour channel counts on its own.', zh: '两组总幅度相近的扰动，可能一种分散在整幅图上，另一种只落在零星几处。逐一统计发生改动的坐标，可以区分这两种情形。论文将图像展开为张量坐标，一个位置只有红色通道发生变化时，这个通道也可以单独计数。' },
      { en: 'The count creates a difficult optimization problem. Moving an already changed entry a little farther need not increase the count. Touching a new entry adds one immediately. Relaxing the count to a sum of magnitudes changes the objective, while a fixed ranking of promising locations can miss useful combinations. SASBO keeps the on-or-off decision explicit throughout the search.', zh: '这个计数指标给优化带来了困难：已经改变的坐标再动一点，数量保持不变；原本不动的坐标只要稍作修改，计数就加一。用幅度总和近似计数会改变优化目标，预先排定位置又容易漏掉有效组合。SASBO 因而把每个坐标的二元选择保留在模型里。' }
    ],
  },
  'sparse-meta-learning': {
    lead: { en: 'A sparse perturbation can fit one classifier closely and lose much of its effect on another. SAM studies that transfer gap by letting distinct surrogate models propose and evaluate changes during optimization.', zh: '在一个分类器上有效的稀疏扰动，换到另一个分类器后常常效力减弱。SAM 让不同替代模型分别参与提议和评价更新，把跨模型迁移纳入优化目标。' },
    title: { en: 'A change of classifier', zh: '图像不变，换一个分类器' },
    paragraphs: [
      { en: 'Consider an image that a source classifier labels incorrectly after a small number of pixels have been altered. A second classifier sees exactly the same image. A correct prediction from that second model reveals a gap between success on the source and transfer to an independent architecture. A sparse budget makes that gap especially interesting because every retained pixel has to earn its place.', zh: '一张图只改了少量像素，源分类器就给出错误类别。把同一张图交给第二个分类器，预测却可能恢复正确。源模型上的成功和独立架构上的迁移由此分开。像素预算越紧，每一个保留下来的位置对跨模型结果的影响就越值得研究。' },
      { en: 'The study makes that handoff part of training. In each task, some accessible classifiers supply the initial feedback and another accessible classifier evaluates the proposed change. Their roles rotate. A separate group of models remains outside this process and supplies the final transfer measurements. This distinction keeps practice on a surrogate separate from evidence on a new classifier.', zh: '论文将类似的模型交接引入训练。每个任务从可访问的替代模型里选取支持组，并留出另一个模型检验候选更新；下一轮重新分配角色。真正用来报告迁移性能的是另一组独立模型，它们始终没有参与优化。' }
    ],
  },
};
