export type Bilingual = { en: string; zh: string };

type Chapter = { title: Bilingual; paragraphs: Bilingual[] };

type TechnicalArticle = {
  architectureTitle: Bilingual;
  architectureLead: Bilingual;
  architecture: Chapter[];
  decisionsTitle: Bilingual;
  decisions: Chapter[];
};

export const projectChapters: Record<string, TechnicalArticle> = {
  'epub-toolkit': {
    architectureTitle: {
      en: 'A shared file format for merge and split',
      zh: '合并与拆分共用的文件格式',
    },
    architectureLead: {
      en: 'Two EPUBs can contain different chapters at the same path. The merger gives each volume its own directory, rebuilds the navigation and stores the source mapping in the new archive. The browser and Node share the TypeScript engine. The Python CLI implements the same file format independently.',
      zh: '两个 EPUB 可以用同一个路径保存不同的章节。合并时，引擎为各卷分配独立目录，重建阅读目录，并把原卷与新路径的对应关系写入合集。浏览器和 Node 共用 TypeScript 引擎，Python 命令行独立实现同一文件格式。',
    },
    architecture: [
      {
        title: { en: 'Package inspection in the browser', zh: '浏览器中的预检与处理' },
        paragraphs: [
          {
            en: 'Merge, Split and Inspect each keep a session containing the selected files, parsed summaries, results and errors. One worker processes requests for all three. It inspects each book by reading the ZIP directory and inflating only the container, package and navigation documents. React uses the returned report to preview the table of contents in the selected order. It can render a useful preview before any images or fonts are inflated.',
            zh: '「合并」「拆分」「检查」各自保留已选文件、分析摘要、结果与错误，三者共用一个 Worker。预检时，Worker 先读取 ZIP 目录，只解压容器、包文档和导航文件。React 根据返回的分析报告和当前卷序生成目录预览，图片和字体都还没解压，用户已经可以检查章节顺序。',
          },
          {
            en: 'Each request carries an ID and its originating workspace. If someone switches to Inspect while Merge is running, the result still belongs to Merge. Cancel terminates the worker and invalidates the pending result. Once a collection is ready, Inspect or Split can take the same Blob as a new file. There is no download-and-upload round trip. The offline cache covers the workspace and worker bundle, and the current session owns the books.',
            zh: '每个处理请求都携带请求编号和所属工具。合并时切到「检查」，结果仍会回到「合并」。取消操作会终止 Worker 并作废等待中的结果。合集生成后，可以把同一份 Blob 直接交给检查或拆分，省掉下载再选择文件的往返。离线缓存覆盖界面和 Worker 代码，书籍文件由当前会话持有。',
          },
        ],
      },
      {
        title: { en: 'Reading order and relative references', zh: '阅读顺序与相对引用' },
        paragraphs: [
          {
            en: 'The engine follows container.xml to the OPF. Its manifest names the resources and its spine determines reading order. EPUB 2 NCX and EPUB 3 navigation can sit in different directories from the OPF, so each link is resolved relative to the document that contains it. ZIP entry names are literal paths, while links in those documents are URIs. Decode a URI once on lookup and encode it again on output, keeping its fragment and query.',
            zh: '引擎从 container.xml 找到 OPF。OPF 的 manifest 登记资源，spine 决定阅读顺序。EPUB 2 的 NCX 和 EPUB 3 的导航文件可能位于 OPF 之外的目录，因此每条链接都要以写下它的文档为基准解析。ZIP 条目是字面路径，文档链接是 URI。查找资源时解码一次，写回链接时重新编码，并保留片段标识和查询参数。',
          },
          {
            en: 'That distinction matters in the two-volume example. Both copies of chapters/01.xhtml survive in separate volume namespaces. If a stylesheet inside either volume points to a pooled font, the engine calculates a new relative path from the stylesheet’s new location. It checks local references in XHTML, SVG and CSS against the resource plan before writing. External links remain intact and are never fetched.',
            zh: '回到两卷书的例子，两份 chapters/01.xhtml 会分别进入各自的卷目录。如果卷里的样式表指向已合并的共用字体，引擎就以样式表的新位置为基准重算相对路径。写出前，XHTML、SVG 和 CSS 中受支持的本地引用都会经过资源映射校验。外部链接原样保留，处理期间也不会访问。',
          },
        ],
      },
      {
        title: { en: 'Resource mapping before archive assembly', zh: '先确定资源路径，再组装归档' },
        paragraphs: [
          {
            en: 'The merge implementation processes deduplicable binaries first. Two candidates share a destination only if both media type and content hash agree. Chapters, stylesheets and SVGs keep their own paths because the same bytes can resolve their relative links differently in different source books. With destinations decided, the engine can validate a local reference and rewrite it if its target moved. Unchanged document bytes go directly to the ZIP writer.',
            zh: '合并实现先处理可去重的二进制资源。只有媒体类型和内容哈希都相同时，两个资源才能共用一个目标。章节、样式表、SVG 各自保留路径，因为即使字节相同，同一条相对链接也可能在两本书里指向不同的内容。位置定下来后，引擎就能逐条验证本地引用，目标移动时才重写，未改动的文档字节直接进入 ZIP 写入器。',
          },
          {
            en: 'The collection has its own EPUB 3 package and navigation. The package inherits the first volume’s language and page direction, while the generated spine follows the selected volume order. Grouped navigation adds a level for each volume. Continuous navigation keeps links at one level. The original navigation and spine attributes remain in the merge record, so the user can change the reading experience of the collection without erasing the structure needed for split.',
            zh: '合集有自己的 EPUB 3 包文档和目录。包文档取第一卷的语言与翻页方向，重新生成的 spine 按用户选定的卷序排列。分组目录为每卷加一层，连续目录则把可跳转的章节摊平。原目录与 spine 属性留在合并记录里，因此用户能调整合集的读法，同时保留日后拆卷所需的结构。',
          },
        ],
      },
    ],
    decisionsTitle: { en: 'Reconstruction limits and memory costs', zh: '分卷恢复的范围与内存开销' },
    decisions: [
      {
        title: { en: 'The embedded merge record', zh: '随书保存的合并记录' },
        paragraphs: [
          {
            en: 'Consider a collection whose table of contents has been flattened. Once two volumes share a font and only the linked chapter entries remain, headings alone cannot recover which resources belonged to which source. The merge record saves each source’s resource mapping, navigation, spine and supported package metadata inside the EPUB. Split copies pooled resources into the reconstructed volumes and rebuilds the package and navigation around them.',
            zh: '设想把目录展开成连续章节，同时让两卷共用字体。仅看合成后的目录，已经无法知道共用资源原先分别归属哪一卷。合并记录因此保存在书里，逐卷写明资源映射、目录、spine 和受支持的包元数据。拆分时，把共用资源复制到需要它的原卷，再重新生成各卷的包文档和目录。',
          },
          {
            en: 'The v1 record also leaves room for optional package metadata. New readers can restore fields such as publisher and page progression direction, and earlier records still work. Split reconstructs readable books and restores recorded metadata. It writes a new ZIP and does not preserve package signatures or metadata extensions outside the format. Fixed-layout books, encrypted resources and media overlays are rejected before export because partial conversion could leave a book that opens but no longer behaves correctly.',
            zh: 'v1 记录允许加入可选的包元数据。新版可以恢复出版者、翻页方向等字段，旧记录也仍可读取。拆分会重新生成可读的书与已记录的元数据。输出采用新的 ZIP 封装，原包签名和格式未收录的元数据扩展无法恢复。固定版式、加密资源和媒体叠加会在导出前被拒绝，避免生成一本能打开、却丢了原有行为的书。',
          },
        ],
      },
      {
        title: { en: 'Memory use during local processing', zh: '本地处理的内存开销' },
        paragraphs: [
          {
            en: 'The browser loads sources one at a time and inflates individual members as needed. The writer retains output chunks. That reduces the decoded working set while still keeping the current compressed input and the eventual downloads in memory. Very large collections are subject to browser memory limits. The architecture notes describe a compressed-entry pass-through prototype that was slower on the tested image workload and would have required a second path for the synchronous API. The shipped browser and Node tools keep one ZIP engine and one reference planner.',
            zh: '浏览器逐卷加载，按需解压单个成员，写入器保留输出分块。这样减少了同时存在的解压内容，但当前卷的压缩数据和最终下载结果仍需要内存，超大合集仍受浏览器容量限制。仓库还记录过直接复用压缩条目的原型。它在所测图像负载上耗时更高，还要为原有同步 API 另维护一条处理路径，因此发布版继续让浏览器和 Node 共用一个 ZIP 引擎和一套引用规划。',
          },
        ],
      },
    ],
  },
  originmark: {
    architectureTitle: { en: 'The work queue and release record', zh: '任务队列与发布记录' },
    architectureLead: {
      en: 'Model calls can outlast a browser connection. OriginMark records the operation before dispatching it, so closing Studio does not interrupt the work. The queue delivers the job, and the worker updates the same record as it processes the file.',
      zh: '图像生成和检测可能在浏览器断开后继续运行。OriginMark 先把操作登记到数据库，再安排模型执行。用户重新打开工作台时，能继续查看同一次操作的进度和产物。',
    },
    architecture: [
      {
        title: { en: 'Runs, jobs and retry attempts', zh: '运行记录、计算任务与重试' },
        paragraphs: [
          {
            en: 'A Run stores the requested operation and its input snapshot. A Job is a unit of work, such as one detector call. Each time a worker claims that job, it creates a new Attempt. One verification case can have independent detector jobs. A batch can retain successful releases while individual files fail. The Studio can reopen an operation and read its artifacts and timed stages without having kept the original HTTP request alive.',
            zh: 'Run 保存用户提交的操作和输入快照。一次检测器调用可以独立成为一个 Job。同一个 Job 被重新领取时，会留下新的 Attempt。同一验证案例可以有多个独立的检测任务，一批文件中也可以保留成功发布的结果，并单独查看失败项。浏览器即使离开，也能回来打开同一次操作及其产物和阶段耗时。',
          },
          {
            en: 'The API writes the Run, Job, initial Event and outbox message in one PostgreSQL transaction. A separate dispatcher sends the message to RabbitMQ and waits for broker confirmation. If the dispatcher stops before sending the message, the pending entry remains available when it restarts. If confirmation is followed by a dispatcher crash before the database update, the message may be sent again. The worker claims the database job before running it. Persisted event sequences also let the browser resume its event stream after reconnecting.',
            zh: 'API 用一笔 PostgreSQL 事务写入 Run、Job、初始事件和待投递消息。独立分发器随后向 RabbitMQ 发送，并等待消息代理确认。分发器如果在发出消息前停机，恢复后仍能从数据库找到这条待投递记录。若分发器收到确认却在更新数据库前崩溃，消息可能再次投递，Worker 会先到数据库领取任务。持久化事件也让浏览器断线后能从已读位置接续。',
          },
        ],
      },
      {
        title: { en: 'Model adapters and runtime isolation', zh: '模型适配器与运行隔离' },
        paragraphs: [
          {
            en: 'TrustMark runs in a resident CPU subprocess. Its process can be stopped when a call times out, while the worker keeps running. PixelSeal uses Ray Serve, which batches requests with compatible dimensions and operations on GPU replicas and maps the outputs back to their request IDs. TIDE keeps its pinned research environment and exchanges files with the worker through a versioned runner, preserving its generation and inversion profile.',
            zh: 'TrustMark 运行在常驻 CPU 子进程里，调用超时时可以结束该进程，Worker 仍能继续服务。PixelSeal 交给 Ray Serve，在 GPU 副本上将尺寸和操作兼容的请求组成实际计算批次，再按请求编号对应输出。TIDE 保留独立的研究环境，通过有版本的文件接口交接输入与结果，保留其生成与反演配置。',
          },
          {
            en: 'Adapters give the worker one interface for model inputs and outputs. The worker holds the lease, handles cancellation and checks the final file. A model runtime can restart or move to another service while the release rules stay with the worker.',
            zh: '模型的输入输出由适配器统一。Worker 负责续租、取消和最终文件的校验，模型的独立重启或迁移不影响发布规则。',
          },
        ],
      },
    ],
    decisionsTitle: { en: 'The file, the signature and the claim', zh: '文件发布、签名校验与水印结论' },
    decisions: [
      {
        title: { en: 'Check the encoded file, then check the signed file', zh: '先验编码后的文件，再验签名后的最终文件' },
        paragraphs: [
          {
            en: 'For signed protection, the worker embeds the watermark into a normalized input and encodes the output as PNG. It decodes that serialized file to check the payload and runs image-quality gates. Then it adds the C2PA credential, decodes the final file again and verifies the credential. Only the final immutable object and the corresponding release entry are registered as published. Checking the in-memory image alone would leave encoding and signing outside the acceptance path.',
            zh: '以带签名的保护为例，Worker 对规范化后的输入嵌入水印，写出 PNG，从已经编码的文件中回读载荷并执行图像质量门槛。加上 C2PA 凭证后，再检查最终文件的水印和凭证。正式登记的是这份已验过的不可变对象及对应发布记录。若只检查内存里的图像，真正会出现在下载里的编码与签名结果就没有经过验收。',
          },
          {
            en: 'A worker holds a renewable lease and a claim version that changes on retry. A release can commit only while the job is still running and the lease and claim both match. A GPU request can finish after cancellation or lease expiry, but its old claim cannot publish. That protects the visible result even if a duplicate message arrives or a worker dies between producing bytes and committing the database transaction.',
            zh: 'Worker 持有可续期的租约，重新领取任务会生成新的领取版本。提交发布时，任务必须仍在运行且租约、领取版本都匹配。取消或租约过期后，一个 GPU 请求仍可能算完，但旧领取版本无法发布。即便遇到重复投递，或处理进程在写完字节、提交事务之前退出，迟到的结果也无法覆盖当前记录。',
          },
        ],
      },
      {
        title: { en: 'Independent watermark and credential results', zh: '独立的水印与凭证结果' },
        paragraphs: [
          {
            en: 'A generated file can return a TIDE watermark finding with no C2PA credential present. TIDE needs a matching calibration profile to report a detection or non-detection. Payload-based engines can also recover a token and look up the corresponding release. C2PA records signature integrity and issuer trust independently. The report preserves the status of each check, including missing or inconclusive evidence.',
            zh: '生成图可能检出 TIDE 水印，但没有附带 C2PA 凭证。TIDE 只有在匹配校准配置时才给出检出或未检出的结论。载荷型引擎还能读回令牌并查找关联的发布记录。C2PA 则独立核对签名完整性和签发者信任。报告逐项保留结果，包括缺少证据和无法判断的情况。',
          },
          {
            en: 'A verification step is stored per case and detector. On completion, a worker updates its own step and recomputes the case state while holding the parent record lock. A CPU detector and a GPU detector can therefore finish in either order without losing the earlier result. If the credential check succeeds and one detector times out, the case exposes its available evidence as a partial result. Retrying reopens the affected detector step.',
            zh: '每个验证案例为每种检测器保留独立步骤。某一路结束时，Worker 在锁住父记录的事务里更新该步骤，并重新计算整案状态。CPU 与 GPU 检测器可以按任意顺序返回，先返回的结果也不会被后来的覆盖。如果凭证检查已完成而某个检测器超时，案例仍会展示已有的部分证据。重试只重新打开受影响的检测步骤。',
          },
        ],
      },
      {
        title: { en: 'Source and derived artifacts', zh: '原图与派生产物的关联' },
        paragraphs: [
          {
            en: 'The artifact record ties a file’s role, content hash and source Run together. Picking a generated image from Library for Protect creates a fresh operation with the existing image as input. Its derived file and report receive their own artifact records. A crop or JPEG transformation in Experiment has a recorded input, transform and extraction result, with its own place in the lineage. Only the Protect workflow registers a release. The separation makes it possible to compare transformed files without treating each trial as an issue of a new credential.',
            zh: 'Artifact 把文件用途、内容哈希和来源 Run 关联起来。从素材库选一张生成图做保护，会以现有图像为输入发起新操作，得到的派生文件与报告各有自己的记录。在实验模式中执行裁剪或 JPEG 处理，也会留下输入、变化方式与回读结果，在文件谱系中可以查到。只有保护流程会登记发布，这样可以用实验记录比较变换前后的文件，同时保持正式签发记录的含义。',
          },
        ],
      },
    ],
  },
  'personal-agent': {
    architectureTitle: { en: 'Scheduled runs and delivery records', zh: '定时运行与交付记录' },
    architectureLead: {
      en: 'The pump inspection brief starts in the member workspace and runs later in the background. The approved plan records the application version, schedule and recipient. Each delivery keeps a link to the particular run that produced it.',
      zh: '泵组巡检在成员工作区交办，到点后才由后台执行。批准后的计划记录应用版本、执行时间和收件人。每次报告投递都保留指向原运行的链接。',
    },
    architecture: [
      {
        title: { en: 'Personal and project context', zh: '个人对话与项目上下文' },
        paragraphs: [
          {
            en: 'A person can ask a question in Chat or schedule a published assistant from the member workspace. Studio is where project authors edit, snapshot and deploy agents or workflows. Both experiences share identity and model access, but personal messages and memory do not automatically enter an application’s project context. A project run loads its released definition, project-scoped knowledge and authorized tools. That boundary lets the same workflow run for another authorized member without inheriting the author’s chat history.',
            zh: '成员可以在「对话」里提问，也可以在成员工作区给已发布的助手排期。项目作者则在 Studio 编辑、保存快照、发布 Agent 或工作流。两个入口共用账号和模型授权，个人消息与记忆不会自动进入项目上下文。项目运行读取已发布定义、项目范围内的知识和获授权的工具，其他成员运行同一工作流时也不会带上作者的私人聊天记录。',
          },
          {
            en: 'A deployment points to a particular snapshot. A workflow can itself name specific agent snapshots. This indirection gives the maintainer a release pointer to update or roll back while allowing an old run to retain the exact definition it used. The scheduled plan pins the deployment and version, business input, local time and time zone, and delivery channel. The preview gives the approving member a chance to catch two apps with the same name or a report headed to the wrong destination.',
            zh: '部署指向具体快照，工作流中的 Agent 节点也可以指向确定的快照。维护者可以更新或回滚部署指针，历史运行仍可定位到当时的定义。定时计划固定部署与版本、业务输入、本地时间及其时区和交付渠道。批准前展示这些字段，成员可以核对同名应用，也能发现报告被安排到了错误去向。',
          },
        ],
      },
      {
        title: { en: 'Persistent links between schedule and run', zh: '排期实例与运行记录的关联' },
        paragraphs: [
          {
            en: 'For the sample P-17 brief, the scheduler checks the approved plan when its due time arrives. The self-hosted Node service records the occurrence and its linked application run in SQLite. Application workers consume the durable run queue independently and report real step state. If the scheduler restarts while the application is executing, it can follow the saved child run instead of launching it again. That matters for long work and for a run that is suspended on approval.',
            zh: '以演示数据中的 P-17 简报为例，到点后调度器核对已批准的计划。自托管 Node 服务会把这一次排期实例与应用运行的关联保存在 SQLite。应用 Worker 从持久队列独立领取任务，记录真实步骤状态。调度器在应用运行期间重启后，能接着跟进原来的子运行，避免重新启动。运行时间长，或任务正挂起等待审批时，这一点尤其重要。',
          },
          {
            en: 'When the application finishes, the report and artifact are stored with the run. The member inbox holds a delivery receipt and reads the report through authorized run access. A citation opens the source line associated with that execution. Operators can investigate the schedule and application from the linked records, while a member reading the brief sees the report and its citations first.',
            zh: '应用完成后，报告与附件随运行保存。成员收件箱保留投递回执，报告正文则通过被授权的运行读取。打开引用会跳到这次执行用到的来源行。维护者可以沿关联记录调查排期与应用，成员打开简报时则先看到结果和可核对的引用。',
          },
        ],
      },
    ],
    decisionsTitle: { en: 'Approval, retries and evidence', zh: '审批、重试与交付证据' },
    decisions: [
      {
        title: { en: 'Plan approval and tool permissions', zh: '计划批准与工具审批' },
        paragraphs: [
          {
            en: 'An approved plan grants permission to run the pinned application on schedule. When a step proposes a gated change to a connected system, the run pauses with the proposed action visible. A project approver can inspect the exact write before releasing that step.',
            zh: '批准计划以后，系统可以按时启动指定的应用版本。执行到了需要审批的外部写操作，运行会停在该步骤，等待项目审批人核对具体参数并决定是否放行。',
          },
          {
            en: 'The connector first prepares the concrete input and freezes it for review. The approval refers to the request ID and a digest of those parameters. The executor classifies calls as reads, writes with a business idempotency contract, or external actions. A read can be retried as a read. A write can reuse a stable business key only if the target honors that contract. When an external action has an uncertain outcome, the operator must reconcile the receipt before deciding what comes next.',
            zh: '连接器先准备具体输入，把参数冻结后交给人检查。审批关联请求编号和参数摘要。执行层区分读取、有业务幂等契约的写入，以及普通外部操作。读取可以按读取重试。写入只有在目标系统兑现幂等契约时，才能用同一业务键继续。外部操作结果不确定时，要先核对回执，再决定下一步。',
          },
          {
            en: 'If an application is republished, the old plan pauses on its next invocation until a member selects the new deployment and approves it. If access is revoked, it is checked again when reading the report, exporting a file or sending a message. Pausing a plan stops future scheduling and pending sends. An already started child run retains its own execution and approval rules.',
            zh: '应用换版后，旧计划在下一次尝试调用时会暂停，直到成员选定新版并重新批准。权限发生变化时，读报告、导出文件和实际发送前都会重新核对。暂停计划会拦住未来的调度与等待发送的消息，已经启动的应用运行仍按所属项目的执行与审批规则处理。',
          },
        ],
      },
      {
        title: { en: 'Schedule, citation and delivery checks', zh: '排期、引用与投递验收' },
        paragraphs: [
          {
            en: 'The recorded acceptance used synthetic equipment data and let the server clock reach the scheduled minute. It retained the schedule occurrence, linked execution, source lines and web inbox receipt. Those records let an observer distinguish a job that ran manually from one launched by the scheduler, and a report that was generated from one that reached the inbox. Separate cases exercised app replacement, revoked access, rejected approval and pause/resume. The recorded delivery used a controlled inbox. Live enterprise data, model quality and external-channel receipts are outside that result.',
            zh: '验收使用合成的设备数据，等待服务器时钟真正走到约定分钟，留下排期实例、关联应用运行、来源行和网页收件箱回执。这几项一起看，能区分手动执行和定时触发，也能区分报告已经生成和已经送达。另有用例覆盖应用换版、权限撤销、审批拒绝和暂停后恢复。交付验收走的是受控收件箱，其结果不覆盖真实企业数据、线上模型质量或外部渠道实际回执。',
          },
        ],
      },
      {
        title: { en: 'Citations tied to the original run', zh: '随运行保存的引用原文' },
        paragraphs: [
          {
            en: 'The retrieval contract returns a source locator, line, text and content hash. The run stores the cited fragment alongside its result. Opening an older P-17 report can therefore show the passage used by that execution even if the manual is revised later. It also gives reviewers a concrete place to check whether a statement is supported. A citation proves which material was used. The separate acceptance questions are whether that material is current and whether the conclusion follows from it.',
            zh: '检索契约返回来源定位、行号、文本和内容哈希，运行把被引用的片段随成果保存。即使手册后来修订，打开旧的 P-17 报告也能看到当时采用的段落。审核者还可以检查某条结论是否有原文支持。引用让资料用在哪里可核对，资料是否最新、结论是否成立则需要另外评估。',
          },
        ],
      },
    ],
  },
};
