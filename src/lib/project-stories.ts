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
  design: StoryBlock[];
  implementationTitle: Bilingual;
  implementation: StoryBlock[];
  steps?: ProjectStep[];
  workflowTitle?: Bilingual;
  verification: Bilingual;
  checks: StoryBlock[];
};

export const projectStories: Record<string, ProjectStory> = {
  'epub-toolkit': {
    example: {
      en: 'Take two volumes that both contain chapters/01.xhtml and reference the same font. The collection should have two distinct chapters, one shared font, and enough information to rebuild either volume on its own.',
      zh: '假设两卷书都包含 chapters/01.xhtml，也都引用内容相同的字体。合集中应该保留两个独立章节、共用一份字体，同时留下足够的信息，让两卷都能独立重建。',
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
        title: { en: 'Make the table of contents part of the decision', zh: '把目录做成合并前的预览' },
        body: {
          en: 'The upload area starts with one choice: add books. Once the files arrive, the queue, book details and table of contents appear together. Reordering volumes or switching between grouped and continuous navigation changes the preview, so readers can see where each chapter will land before writing the collection.',
          zh: '空工作台先只给一个入口：添加书籍。读取文件后，分卷队列、书籍信息和目录预览同时出现。调整卷序，或切换分组与连续目录时，预览随之更新。读者在导出前就能确认每一章会出现在什么位置。',
        },
      },
      {
        title: { en: 'Carry the result into the next operation', zh: '让合并结果直接进入下一步' },
        body: {
          en: 'A finished collection can go straight into Inspect or Split. Each tool keeps its own working files until the reader clears them. Changing the merge settings invalidates the previous output, while visiting another tool preserves the current work.',
          zh: '合并完成后，可以把合集直接交给「检查」或「拆分」。各工具分别保留当前会话中的文件和结果。修改合并设置会使旧下载失效，切去查看另一个工具则会保留手头的进度。',
        },
      },
    ],
    implementationTitle: { en: 'Rebuild the package and keep its source mapping', zh: '重建书籍包，并保存分卷映射' },
    implementation: [
      {
        title: { en: 'Resolve collisions before rewriting links', zh: '先处理路径冲突，再改写引用' },
        body: {
          en: 'Two volumes can both contain a chapter or cover with the same filename. The engine remaps each volume’s paths before rebuilding its links. It stores byte-identical images and plain fonts once, keyed by media type and content hash. The rewritten chapter still points to the correct resource after a path changes.',
          zh: '两卷书可能都有同名的章节或封面。引擎先为各卷分配新路径，再重建引用。按媒体类型和内容哈希识别内容完全相同的图片与普通字体，合并后只存一份。路径改变后，章节仍指向正确的资源。',
        },
      },
      {
        title: { en: 'Define what can be recovered', zh: '明确能恢复到什么程度' },
        body: {
          en: 'The package document inventories each book’s resources and defines its reading order. During merge, the engine records each volume’s original paths, order, navigation and rewritten references. Split uses that record to rebuild readable volumes and their assets. The reconstructed package metadata and ZIP serialization can differ from the input files.',
          zh: 'EPUB 的包文档登记资源并定义阅读顺序。合并时，引擎记录每卷的原始路径、阅读顺序、目录和改写过的引用。拆分按这份记录重建可读的分卷及资源，重新生成的包元数据与 ZIP 封装可以和原文件不同。',
        },
      },
      {
        title: { en: 'Separate the workspace from the processing engine', zh: '界面和文件处理各自负责什么' },
        body: {
          en: 'React owns the file queue and previews. A Web Worker runs the TypeScript archive engine and reports progress back to the page. The Node CLI shares that engine, and a separate Python implementation reads and writes the same merge record. Offline caching saves the application shell and processing code. Book files live in the current browser session.',
          zh: 'React 管理选书队列与预览，Web Worker 运行 TypeScript 归档引擎并向界面报告进度。Node 命令行复用这套引擎，独立的 Python 实现也能读写同一种合并记录。离线缓存保存应用界面和处理代码，书籍文件留在当前浏览器会话。',
        },
      },
    ],
    verification: {
      en: 'Interoperability tests cover merging with one CLI and splitting with the other. Resource tests exercise duplicate assets and nested relative references. Recovery requires a merge record written by the Toolkit and targets reflowable EPUBs.',
      zh: '互操作测试覆盖了一个命令行实现合并、另一个实现拆分的场景，资源测试覆盖重复资源和多层相对引用。恢复原卷需要 Toolkit 写入的合并记录，支持范围以可重排 EPUB 为主。',
    },
  },
  originmark: {
    example: {
      en: 'Start with the ceramic teapot from the Studio demo. Its generation produces a clean reference and a marked image. In the verification example, the marked file returns a TIDE detection, while credential and issuer information remain separate.',
      zh: '从演示里的陶瓷茶壶出发。生成环节产出无水印参考图和带水印图。验证这张图时，报告给出 TIDE 水印结果，同时单独报告内容凭证与签发者信息。',
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
        title: { en: 'One output becomes the next input', zh: '上一步产物可以直接成为下一步输入' },
        body: {
          en: 'A generated image can move straight from the Studio into Protect or Verify. The canvas follows the same image, with controls for the current operation beside it. The Library links original and derived files, and Activity leads back to the run that produced each result.',
          zh: '在工作台生成一张图后，可以直接拿它继续保护或验证。画布保留同一张图，旁边的操作随当前步骤变化。素材库把原图和派生文件关联起来，运行记录则能回到产出这张图的具体操作。',
        },
      },
      {
        title: { en: 'Show the evidence behind a verdict', zh: '把验证结论拆回不同证据' },
        body: {
          en: 'A watermark result answers a different question from a signed content credential. The Verify screen reports watermark evidence, signature integrity and issuer trust separately. When a detector is still running or lacks a matching calibration, the interface retains the other results and shows the unresolved check on its own.',
          zh: '水印检测和签名内容凭证回答的问题不同。验证页分别展示水印证据、签名完整性和签发者是否可信。某个检测器还在运行或缺少匹配的校准时，页面保留其他已获得的证据，并单独显示尚未确定的项目。',
        },
      },
    ],
    implementationTitle: { en: 'From a Studio action to verifiable output', zh: '一次工作台操作怎样产出可验证文件' },
    workflowTitle: { en: 'The image and its evidence move together', zh: '图像与证据如何沿流程流转' },
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
    implementation: [
      {
        title: { en: 'Keep model execution outside the request', zh: '让模型计算独立于网页请求' },
        body: {
          en: 'The API records the operation and its input snapshot in PostgreSQL, then places the work on a durable queue. Separate workers execute the selected model. Studio subscribes to persisted run events, so a viewer can leave and later reopen the same operation with its state and outputs.',
          zh: 'API 在 PostgreSQL 中保存操作与输入快照，再将计算任务交给持久化队列。独立的处理进程运行相应模型。工作台订阅已经记录的运行事件，用户离开页面再回来时，仍可以打开同一次操作及其产物。',
        },
      },
      {
        title: { en: 'Define the publication boundary', zh: '区分生成产物与正式发布' },
        body: {
          en: 'Generation produces reusable files. Formal protection adds a release record only after final-file validation and credential checks. A retry gets its own execution attempt. The published artifact and its evidence remain tied to the file that passed validation.',
          zh: '生成阶段产出可复用的图像。正式保护只有在最终文件验证和凭证检查完成后，才登记发布记录。重试会创建独立的执行尝试，已登记的产物及证据始终对应当时通过验证的文件。',
        },
      },
    ],
    verification: {
      en: 'On the demo environment, the recorded browser walkthrough generated and verified a TIDE image, reused an artifact for TrustMark protection, and exported the verification report. The interface distinguishes a detected signal from a claim about authorship or ownership.',
      zh: '演示环境中的浏览器验收走通了 TIDE 生成与验证、复用产物进行 TrustMark 保护，以及导出验证报告。界面将是否检出信号与作者身份或所有权的主张分别呈现。',
    },
  },
  'personal-agent': {
    example: {
      en: 'A member asks for a recurring inspection brief for a sample pump. Days later, opening the report has to answer three questions: which plan started the run, which records it used, and where the result was delivered.',
      zh: '一位成员请助手定期整理演示泵组的巡检简报。隔几天打开报告时，仍要能回答三个问题：哪份计划启动了本次执行、报告用到了哪些资料、结果投递到了哪里。',
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
        title: { en: 'Two modes for different kinds of work', zh: '聊天与 Agent 对应两种工作方式' },
        body: {
          en: 'The Chat view keeps the composer, model selection and recent conversations close together. Agent groups assistants, planned work and received results. A shared search can return the relevant task, assistant, conversation or report. The switch preserves the member’s context as they move between the two.',
          zh: '聊天模式把输入、模型选择和最近会话放在一处。Agent 模式集中展示可用助手、已安排的工作和交付结果。共用搜索可以找回相关任务、助手、会话或报告，用户在两种模式之间切换时仍能接着之前的工作。',
        },
      },
      {
        title: { en: 'Show what happened before asking for trust', zh: '让结果能追溯到执行与原文' },
        body: {
          en: 'A result opens as a readable report. Its citations point to the source lines retrieved by that run, and the run panel shows completed steps, pending approvals and delivery. Progress comes from recorded events, with a compact view for the reader and step details available on demand.',
          zh: '交付先以可阅读的报告呈现。正文引用可以打开本次运行检索到的来源行，执行面板再按需展开已完成步骤、待审批操作和投递状态。进度来自真实记录，读者可以先看结果，需要时再查过程。',
        },
      },
    ],
    implementationTitle: { en: 'Turn a conversation into a recoverable scheduled run', zh: '如何把一段对话变成可恢复的定时执行' },
    workflowTitle: { en: 'The scheduled inspection example', zh: '以定时设备巡检报告为例' },
    steps: [
      {
        id: 'plan',
        label: { en: 'Plan', zh: '形成计划' },
        title: { en: 'Confirm the task before scheduling it', zh: '排期前先核对任务' },
        body: {
          en: 'The assistant turns the request into a draft with its selected app, version, inputs, time zone and delivery channel. The member checks these fields before approving the plan.',
          zh: '助手把自然语言请求整理为计划草稿，写明选定的应用、版本、输入、时区和交付渠道。成员先核对这些信息，再批准排期。',
        },
        output: { en: 'Approved, version-pinned plan', zh: '已批准并固定版本的计划' },
      },
      {
        id: 'execute',
        label: { en: 'Execute', zh: '执行任务' },
        title: { en: 'Keep track of one concrete application run', zh: '沿着同一次应用运行继续' },
        body: {
          en: 'At the scheduled time, the scheduler starts the approved application and records its run ID. If a step needs approval for a specific external action, its state appears in the run panel.',
          zh: '到达约定时间后，调度器启动已批准的应用，并保存本次应用运行的关联。某一步需要批准具体外部操作时，执行面板会显示对应的等待状态。',
        },
        output: { en: 'Application run, steps and approval state', zh: '应用运行、步骤与审批状态' },
      },
      {
        id: 'deliver',
        label: { en: 'Deliver', zh: '交付成果' },
        title: { en: 'Bring the report, its sources and receipt together', zh: '把报告、来源与回执连在一起' },
        body: {
          en: 'The report retains references to the material used in the run. Delivery records the destination and its receipt so the reader can return from the result to its execution.',
          zh: '报告保留指向本次运行所用资料的引用，投递记录保存去向与回执。从交付结果可以返回对应的执行记录。',
        },
        output: { en: 'Cited report and delivery receipt', zh: '带引用的报告与投递回执' },
      },
    ],
    implementation: [
      {
        title: { en: 'Persist the connection between schedule and run', zh: '保存排期与执行之间的关联' },
        body: {
          en: 'The self-hosted Node.js service stores approved plans and run associations in SQLite. A worker executes the application independently of the browser. After a scheduler restart, the persisted association lets it resume following the existing run. Publishing a new app version prompts the member to review and reapprove an older plan before it can use the new version.',
          zh: '自托管的 Node.js 服务在 SQLite 中保存已批准计划及其运行关联，执行不依赖网页一直打开。调度器重启后可以继续跟踪已经启动的运行。应用发布新版本后，旧计划要切到新版时，需要成员重新核对并批准。',
        },
      },
      {
        title: { en: 'Use recorded state as interface state', zh: '让界面跟着真实运行状态变化' },
        body: {
          en: 'The mode switch and search use coss UI controls for keyboard navigation. Reading and selection transitions use Motion. The run view takes its statuses from the stored step records. That gives waiting for approval, completed work and delivered results distinct states.',
          zh: '模式切换和搜索接入 coss UI 的键盘交互，阅读与选中状态用 Motion 做过渡。执行界面的状态直接来自步骤记录，因此等待批准、任务完成和已投递会在不同阶段显示。',
        },
      },
    ],
    verification: {
      en: 'The scheduled workflow was exercised against the real clock using synthetic inspection data. The demo records a scheduled instance, an associated application run, report citations and a web-inbox receipt. That receipt establishes delivery to the demo inbox.',
      zh: '定时流程使用合成巡检数据，在真实时钟下验收。演示记录包含排期实例、关联的应用执行、报告引用和网页收件箱回执。该回执对应演示中的网页收件箱投递。',
    },
  },
};
