type Bilingual = { en: string; zh: string };

type StoryBlock = { title: Bilingual; body: Bilingual };

export type ProjectStep = StoryBlock & {
  id: string;
  label: Bilingual;
  output: Bilingual;
};

export type ProjectStory = {
  example: Bilingual;
  designTitle: Bilingual;
  design: Bilingual[];
  implementationTitle: Bilingual;
  implementationLead?: Bilingual;
  steps?: ProjectStep[];
  workflowTitle?: Bilingual;
  checks: StoryBlock[];
};

export const projectStories: Record<string, ProjectStory> = {
  'epub-toolkit': {
    example: {
      en: 'Two volumes both call their first chapter chapters/01.xhtml. The combined book needs to keep both chapters and their links intact. EPUB Toolkit stores the path mapping and each source package’s reading order inside the collection, so either volume can be reconstructed from that file alone.',
      zh: '两卷书都用 chapters/01.xhtml。合并后，这两份同名章节得各占一个位置，还要让字体、目录和相对链接继续工作。EPUB Toolkit 把这次路径变换连同各卷的书籍结构写进合集。几个月后，即使手里只剩这一册，也能按记录拆回原卷。',
    },
    workflowTitle: { en: 'Follow the chapter paths through merge and split', zh: '沿着章节路径查看合并与拆分' },
    steps: [
      {
        id: 'collect',
        label: { en: 'Input', zh: '原始分卷' },
        title: { en: 'Read two self-contained books', zh: '读取两卷各自独立的书' },
        body: { en: 'Each package defines its own resource paths and reading order. The same path in a different archive can point to different content.', zh: '每卷的包文档分别规定资源路径和阅读顺序。两个包里的同名路径可能指向完全不同的内容。' },
        output: { en: 'Two independent package maps', zh: '两份独立的包结构' },
      },
      {
        id: 'merge',
        label: { en: 'Merge', zh: '合为一书' },
        title: { en: 'Separate chapter paths and pool the font', zh: '分开章节路径，让两卷共用字体' },
        body: { en: 'The engine namespaces chapter paths, maps identical font bytes to a shared destination, and rewrites references before writing the collection.', zh: '引擎按卷区分章节路径，把字节相同的字体映射到同一个位置，再重写引用并保存合集。' },
        output: { en: 'A new EPUB plus its merge record', zh: '新 EPUB 与合并记录' },
      },
      {
        id: 'restore',
        label: { en: 'Split', zh: '拆回分卷' },
        title: { en: 'Follow the mapping back to each volume', zh: '沿着映射还原每一卷' },
        body: { en: 'The split engine uses the stored mapping to copy the font into each output and point each reconstructed chapter to its local resource path.', zh: '拆分引擎按已保存的映射，把共用字体放回每个输出文件，并让重建的章节重新指向本卷资源。' },
        output: { en: 'Two independently readable EPUBs', zh: '两本可独立阅读的 EPUB' },
      },
    ],
    checks: [
      {
        title: { en: 'A pooled resource still resolves after splitting', zh: '资源合并去重后，拆开仍能正确引用' },
        body: { en: 'The resource tests merge books with shared binaries and nested CSS references. They read the merged files, split the collection, then resolve the restored references again.', zh: '资源测试用包含共用二进制资源和嵌套 CSS 引用的电子书执行合并，检查合集中的文件，再拆分并重新解析恢复后的引用。' },
      },
      {
        title: { en: 'The archive boundary stays explicit', zh: '遇到超出支持范围的 EPUB 时明确提示' },
        body: { en: 'Compatibility tests exercise missing resources, fixed-layout books and media overlays. A merge record is required for volume reconstruction.', zh: '兼容性测试包含缺失资源、固定版式和媒体叠加包。重建分卷时，引擎要求合集包含合并记录。' },
      },
    ],
    designTitle: { en: 'Let readers check the book before exporting', zh: '先确认阅读顺序，再导出' },
    design: [
      {
        en: 'After files are selected, the workspace displays the volume list, book details and a table of contents. Reordering the volumes or switching between grouped and continuous navigation updates that table immediately. A reader can catch an unexpected volume order before exporting.',
        zh: '选书后，分卷列表、书籍信息和目录预览会一起出现。调整卷序，或在分组目录与连续目录之间切换，预览会即时更新。卷序不对时，导出之前就能发现。',
      },
      {
        en: 'A finished collection can go straight into Inspect or Split. Each tool keeps its own working files until the reader clears them. Changing the merge settings invalidates the previous output, while visiting another tool preserves the current work.',
        zh: '合并完成后，可以把合集直接交给「检查」或「拆分」。各工具分别保留当前会话中的文件和结果。修改合并设置会使旧下载失效，切去查看另一个工具则会保留手头的进度。',
      },
    ],
    implementationTitle: { en: 'Two chapters and one shared font', zh: '两份同名章节与一份共用字体' },
  },
  originmark: {
    example: {
      en: 'In the demo, a generated image goes from the comparison canvas to the library and then into a separate protection run. The library links each new file to the run that produced it. That link matters when a reviewer returns to the image days later, because the generated PNG and the signed release have different records.',
      zh: '演示中的茶壶图从对照画布进入素材库，随后作为另一次保护操作的输入。素材库把每份文件与产出它的运行关联起来。几天后回到这张图，仍然可以沿着记录分别查到生成的 PNG 和最终签发的文件。',
    },
    checks: [
      {
        title: { en: 'The workflow follows the same artifact', zh: '验证沿着同一份图像产物进行' },
        body: { en: 'The TrustMark protection check validated the signed file and matched its recovered payload to the registered release. The Studio walkthrough carried the generated artifact through to that check and exported the verification report as PDF.', zh: 'TrustMark 保护验收核对了签名文件，并将恢复的水印载荷与已登记的发布记录匹配。工作台演示沿用前面生成的产物完成检查，并导出验证报告。' },
      },
      {
        title: { en: 'Interrupted computation has its own outcome', zh: '计算中断会留下独立的运行结果' },
        body: { en: 'Reliability checks interrupted the TIDE runner and observed the current job fail. The worker remained available and the subsequent detection ran successfully.', zh: '可靠性检查主动中断 TIDE 计算进程，当前任务记录为失败，处理进程仍然可用，随后一次检测成功完成。' },
      },
    ],
    designTitle: { en: 'Keep the image at the center of the workflow', zh: '以同一张图贯穿生成、保护和验证' },
    design: [
      {
        en: 'Studio can open the current image directly in Protect or Verify. The canvas keeps the image in view and changes the controls beside it. Activity then brings the reader back to the run, including the file and the operation that produced it.',
        zh: '工作台可以将画布中的图直接送到保护或验证。画布继续展示当前图片，旁边换成相应操作。需要回看时，可以从运行记录找到对应文件及产出它的操作。',
      },
      {
        en: 'Verify has separate entries for the watermark, signature integrity and issuer trust. When a detector is still running or lacks a matching calibration, the interface retains the other results and shows the unresolved check on its own.',
        zh: '验证页为水印检测、签名完整性和签发者信任分别保留一项结果。某个检测器还在运行或缺少匹配的校准时，页面保留其他已获得的证据，并单独显示尚未确定的项目。',
      },
    ],
    implementationTitle: { en: 'The teapot through generation and verification', zh: '茶壶图像的生成、保护与核验' },
    implementationLead: {
      en: 'The Studio demo starts with the same prompt and seed to produce two PNGs. The marked image can be verified as generated, or reused as input to a separate protection run that embeds a watermark and attaches a credential.',
      zh: '工作台用同一组提示词和随机种子生成两张 PNG。带水印的那张可以直接送检，也可以作为另一次保护操作的输入，写入水印并附加签名凭证。',
    },
    workflowTitle: { en: 'Studio walkthrough', zh: '工作台演示' },
    steps: [
      {
        id: 'generate',
        label: { en: 'Generate', zh: '生成' },
        title: { en: 'Produce a comparable pair', zh: '生成可直接比较的一对图像' },
        body: {
          en: 'TIDE runs with the same prompt and seed to produce a clean reference and a marked image. Studio can compare both before either output is used in another operation.',
          zh: 'TIDE 使用相同的提示词和随机种子生成无水印参考图与带水印图。工作台先展示这组对照，产物随后可以进入其他操作。',
        },
        output: { en: 'Reference and marked image files', zh: '无水印与带水印图像文件' },
      },
      {
        id: 'protect',
        label: { en: 'Protect', zh: '保护' },
        title: { en: 'Check the file that will actually be published', zh: '核对真正要发布的输出文件' },
        body: {
          en: 'The worker embeds a watermark, checks the serialized image and attaches the content credential. The final file goes through another check before its publication record is committed.',
          zh: '处理进程写入水印，检查序列化后的图像，再附加内容凭证。最终文件会再经过检查，确认后才登记发布记录。',
        },
        output: { en: 'Protected file and its publication record', zh: '受保护文件及对应发布记录' },
      },
      {
        id: 'verify',
        label: { en: 'Verify', zh: '验证' },
        title: { en: 'Read each evidence channel independently', zh: '分别核对每一路证据' },
        body: {
          en: 'A verifier checks the supplied image for watermark signals and reads any signed content credential. A report keeps the individual findings visible, including cases where a check cannot reach a result.',
          zh: '验证工具检查输入图像里的水印信号，并读取存在的签名内容凭证。报告分别保留各路结果，包括某项检查暂时无法判断的情况。',
        },
        output: { en: 'Evidence and verification report', zh: '独立证据与验证报告' },
      },
    ],
  },
  'personal-agent': {
    example: {
      en: 'A member schedules a P-17 inspection brief and closes the browser. The task stays visible in the workspace, and the finished report appears in the inbox. From the report, the member can reopen the run to see which equipment records and manual passages it used.',
      zh: '成员安排好明早的 P-17 巡检简报，就可以关掉浏览器。排期仍会留在工作台，完成后的报告会送到收件箱。读到一项结论时，还可以从报告回到这次运行，查它用了哪条设备记录、哪一段维护手册。',
    },
    checks: [
      {
        title: { en: 'A real clock triggers the scheduled run', zh: '按真实时钟触发定时任务' },
        body: { en: 'The demo used synthetic pump data and waited for the scheduled minute. It recorded the schedule entry, associated application run, report sources and web inbox receipt.', zh: '演示使用合成的泵组数据，等待真实排期时间到来，并记录了调度实例、关联应用运行、报告来源和网页收件箱回执。' },
      },
      {
        title: { en: 'Version changes and approvals stay visible', zh: '换版和审批都有单独状态' },
        body: { en: 'The acceptance scenarios exercised a changed application version, revoked access, rejected approval and pause/resume. The record retains these outcomes alongside normal completion.', zh: '验收场景覆盖了应用换版、撤销权限、拒绝审批和暂停后恢复。执行记录会区分这些结果与正常完成。' },
      },
    ],
    designTitle: { en: 'Keep a task findable after the conversation ends', zh: '对话结束后，任务还能被找回来' },
    design: [
      {
        en: 'The Chat view keeps the composer, model selection and recent conversations close together. Agent groups assistants, planned work and received results. A shared search can return the relevant task, assistant, conversation or report. The switch preserves the member’s context as they move between the two.',
        zh: '聊天模式把输入、模型选择和最近会话放在一处。Agent 模式集中展示可用助手、已安排的工作和交付结果。共用搜索可以找回相关任务、助手、会话或报告，用户在两种模式之间切换时仍能接着之前的工作。',
      },
      {
        en: 'A result opens as a readable report. Its citations point to the source lines retrieved by that run, and the run panel shows completed steps, pending approvals and delivery. Progress comes from recorded events, with a compact view for the reader and step details available on demand.',
        zh: '交付先以可阅读的报告呈现。正文引用可以打开本次运行检索到的来源行，执行面板再按需展开已完成步骤、待审批操作和投递状态。进度来自真实记录，读者可以先看结果，需要时再查过程。',
      },
    ],
    implementationTitle: { en: 'The P-17 inspection brief', zh: 'P-17 巡检简报的执行过程' },
    implementationLead: {
      en: 'The inspection assistant uses the equipment register and maintenance manual from the demo project. The member confirms the app, equipment and recipient before scheduling the brief. Each later execution produces a report tied to the actual records it used.',
      zh: '巡检助手读取演示项目的设备台账和维护手册。成员核对应用、设备和接收人后再安排排期。每次执行都会生成一份报告，并随报告保存此次查阅的资料。',
    },
  },
};
