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
  resultsTitle: Bilingual;
  design: Bilingual[];
  implementationTitle: Bilingual;
  implementationLead?: Bilingual;
  steps?: ProjectStep[];
  workflowTitle?: Bilingual;
  checks: StoryBlock[];
};

export const projectStories: Record<string, ProjectStory> = {
  'epub-toolkit': {
    resultsTitle: {en: 'Opening the volumes again', zh: '把分卷放回书架'},
    example: {
      en: "A series that arrives as separate volumes is awkward to read on an e-reader. Finishing one volume means leaving the book, finding its sequel and reopening it at the right chapter. A combined edition puts the whole series behind one table of contents. The reader should still be able to move just one volume to a second device later.",
      zh: "分卷下载的系列书到了阅读器上，一卷读完，得退出书籍、回到书架，再找到下一本。合为一册以后，下卷第一章可以直接接着读，整套目录也只需打开一次。可书架上的单卷还有用处：读者可能只想把其中一本传到另一台设备。因此，合并时就得为日后拆分留下依据。",
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
    designTitle: { en: 'A series that reads as one book', zh: '让分卷读起来像同一本书' },
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
    resultsTitle: {en: 'Release evidence and its limits', zh: '发布证据与校准范围'},
    example: {
      en: "An image leaves several tools before it reaches a reader. A generator records a prompt and a seed. A watermark encoder writes a signal. A publisher attaches a credential and exports a file. At that point the publisher needs evidence about the exported image itself. OriginMark brings those steps into one workspace for people preparing images for release and for reviewers checking an image they received.",
      zh: "一张图片从生成到发布，通常要经过好几道手。生成器留下提示词和种子，编码器把水印写入像素，发布者再附上凭证、导出文件。此时审核人手里只有最终图片，需要从这份文件重新核对来源。OriginMark 把生成、保护和验证接在同一个工作台里，让发布者保存交付依据，也让收图的人能独立检查。",
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
    designTitle: { en: 'Following an image past the export button', zh: '一张图从生成走到发布' },
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
    implementationTitle: { en: 'Signing the file that reached the reader', zh: '为真正交付的文件签发凭证' },
    implementationLead: {
      en: 'A release has a stable identifier, a file digest and the evidence used to approve it. The hard part is keeping those three in agreement as images pass through an encoder, a signer and a download endpoint.',
      zh: '一次发布会留下稳定的登记编号、文件摘要和准予发布的依据。图像要经过编码器、签名服务和下载入口，三者始终对应同一份文件，是这段工程里最重要的约束。',
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
    "resultsTitle": {
      "en": "Measured behavior and development status",
      "zh": "实测结果与开发进度"
    },
    "designTitle": {
      "en": "From a conversation to a standing task",
      "zh": "从一句交代，到一项长期任务"
    },
    "example": {
      "en": "A chat window works well for a question that can be settled in one sitting. A request such as “send me a maintenance brief every morning” has a different lifetime. Someone must keep the schedule, remember the destination and deliver the result after the browser closes. Personal Agent grew around that gap. It gives each member a place to talk to an assistant and a durable place to leave work with it.",
      "zh": "一次对话很适合解决手边的问题。“每天早上把维护简报发给我”却是一项可以持续几个月的委托。窗口关了，时间表还得有人守着；换到手机，也要能找到昨天的简报。Personal Agent 把这类事情从聊天记录里接了出来：对话负责交代工作，个人工作台负责把它记下来、按时执行，再把成果送回成员身边。"
    },
    "design": [
      {
        "en": "A member can draft a task in Web Chat or a bound private chat. The draft exposes the local time, recurrence and delivery channel for review. Once approved, the task appears in Today beside work in progress and decisions waiting for the member. A completed run opens as a report in Results. From there the reader can return to its sources, download an artifact or reopen the execution. A channel receipt lives beside the run, so a finished report remains findable even while delivery is awaiting confirmation.",
        "zh": "成员在网页对话或已绑定的私聊中交代任务，先拿到一份可修改的草稿。确认当地时间、重复周期和收件渠道后，任务出现在「今日」：可以从这里查看下一次排期，也能处理等待批准的操作。一次执行结束后，「成果」收进报告、引用和附件。从报告返回执行记录，还能看到渠道回执。即使外发消息尚待确认，已经完成的报告也有固定入口。"
      },
      {
        "en": "Studio is the authoring side of the same product. A developer gives an agent a bounded set of tools, wires steps into a workflow, tests an input, then publishes a version. A member with access can invoke that application from their workspace. In Studio, the developer can reopen the resulting run, inspect a particular step and turn the original input into an evaluation case. Operate gives administrators a separate view of queues, channels and model usage.",
        "zh": "Studio 面向搭建助手的人。开发者给 Agent 配置工具，把读取资料、计算、审批等步骤连成工作流，用示例输入调试，再发布一个版本。获得授权的成员就能在个人工作台调用它。一次回答有问题，开发者可以回到 Studio，定位当次运行的具体步骤，把原始输入固定成下次发布前的评测案例。管理员则从 Operate 查看队列、渠道和模型用量。"
      }
    ],
    "implementationTitle": {
      "en": "A model turn inside a recoverable workflow",
      "zh": "模型回合与可恢复的工作流"
    },
    "implementationLead": {
      "en": "A workflow may spend seconds retrieving evidence and hours waiting for a decision. The worker advances it in small, committed steps. Pi supplies a model turn when the workflow calls for one. Read tools, calculations, approvals and business receipts can follow their own contracts. Two examples below follow that boundary through execution and through a correction.",
      "zh": "一项工作可能只花几秒钟检索资料，却要等几个小时才有人批准写入。后台把它拆成可以逐步提交的节点。需要模型判断时，Pi 接手一个回合；读取记录、计算、审批和业务回执则分别有自己的执行条件。下面先看模型在这条链上的位置，再沿一份已开工单的报告追踪更正过程。"
    },
    "checks": [
      {
        "title": {
          "en": "A task handed off through QQ",
          "zh": "从 QQ 交办到投递回执"
        },
        "body": {
          "en": "In the local protocol replay, a bound account submitted a task through a WebSocket peer. The member reviewed the time, version and destination on the web. The peer accepted one outgoing message when the task came due, and the same receipt could be reopened in the browser. This exercises the adapter and the member-facing flow with a local counterpart.",
          "zh": "本机协议回放中，已经绑定的账号经 WebSocket 对端交办任务，成员在网页上核对时间、版本与目的地。任务到期时，对端接收一次主动发送，回到网页还能打开同一份回执。这次验收走通了适配器与成员界面，接收端使用本机协议对端。"
        }
      },
      {
        "title": {
          "en": "One maintenance answer, two retrieved passages",
          "zh": "一份维护回答与两条检索记录"
        },
        "body": {
          "en": "A local Pi run with Qwen2.5-0.5B returned the recorded 72-hour inspection interval for P-17. Retrieval found two source lines, but the reply itself contained zero exact citations. The result page records the retrieved passages and exact citations separately. This single grounded question exposed a gap between finding the manual and citing it in a generated answer.",
          "zh": "一次使用 Pi 与本地 Qwen2.5-0.5B 的运行，回答了 P-17 的 72 小时巡检周期。检索找到了两行原文，模型回答中的精确引用却是零。成果页分别显示检索到的资料和回答中的引用。这道有明确依据的问题，暴露出了找到手册与在回答里准确引用手册之间的落差。"
        }
      },
      {
        "title": {
          "en": "Six successful polls, three notifications",
          "zh": "六次成功采集，三次通知"
        },
        "body": {
          "en": "In a seven-check replay with synthetic release events, six polls succeeded and one source failed. A policy that notified on every successful poll would have sent six notifications. The watch sent three. The run measures interruption frequency on that event stream.",
          "zh": "在七次合成发布事件回放中，六次采集成功，一次上游故障。若每次成功都通知，会发送六次；长期关注策略实际发送三次。这组记录度量的是这段事件流上的打扰次数。"
        }
      }
    ]
  },
};
