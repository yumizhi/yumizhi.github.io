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
      en: 'One archive engine, three ways to run it',
      zh: '浏览器、Node 和 Python 如何处理同一种 EPUB',
    },
    architectureLead: {
      en: 'The browser and Node share the TypeScript engine. Python implements the same on-disk contract independently. The merged EPUB carries the information all three need to reconstruct the volumes.',
      zh: '浏览器和 Node 共用 TypeScript 归档引擎，Python 独立实现相同的文件协议。拆回原卷所需的信息随 EPUB 一起交付，换了工具仍能找到。',
    },
    architecture: [
      {
        title: { en: 'The workspace owns intent. The worker owns the bytes.', zh: '界面保存编辑意图，Worker 处理书籍字节' },
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
        title: { en: 'An EPUB has a reading order and a graph of links', zh: '除了阅读顺序，EPUB 还有一整张资源引用图' },
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
        title: { en: 'Plan destinations before writing an archive member', zh: '写入成员之前，先决定所有资源去哪里' },
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
    decisionsTitle: { en: 'What a reversible merge can promise', zh: '一个可拆分的合集，应该承诺到什么程度' },
    decisions: [
      {
        title: { en: 'Keep a reconstruction record inside the book', zh: '让分卷映射随合集一起保存' },
        paragraphs: [
          {
            en: 'Consider a collection whose table of contents has been flattened. Once two volumes share a font and only the linked chapter entries remain, headings alone cannot recover which resources belonged to which source. The merge record saves each source’s resource mapping, navigation, spine and supported package metadata inside the EPUB. Split copies pooled resources into the reconstructed volumes and rebuilds the package and navigation around them.',
            zh: '设想把目录展开成连续章节，同时让两卷共用字体。仅看合成后的目录，已经无法知道共用资源原先分别归属哪一卷。合并记录因此保存在书里，逐卷写明资源映射、目录、spine 和受支持的包元数据。拆分时，把共用资源复制到需要它的原卷，再重新生成各卷的包文档和目录。',
          },
          {
            en: 'The v1 record also leaves room for optional package metadata. New readers can restore fields such as publisher and page progression direction, and earlier records still work. The reconstruction contract covers a readable book and its recorded metadata. Exact ZIP bytes, package signatures and unknown metadata extensions fall outside it. Fixed-layout books, encrypted resources and media overlays are rejected before export because partial conversion could leave a book that opens but no longer behaves correctly.',
            zh: 'v1 记录允许加入可选的包元数据。新版可以恢复出版者、翻页方向等字段，旧记录也仍可读取。恢复承诺到可读的书及已记录的元数据，原始 ZIP 字节、包签名与未知元数据扩展不在这个范围内。固定版式、加密资源和媒体叠加会在导出前被拒绝，避免生成一本能打开、却丢了原有行为的书。',
          },
        ],
      },
      {
        title: { en: 'Spend memory on the current source and the output', zh: '把内存留给当前分卷与输出' },
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
    architectureTitle: { en: 'From a Studio request to a durable release', zh: '从工作台请求到可追溯的发布记录' },
    architectureLead: {
      en: 'The API records the work, the queue delivers it and the worker runs the chosen engine. The worker then decides whether a particular file can become a release. Studio reads task events and verification evidence from the persisted record.',
      zh: 'API 负责登记，队列负责投递，Worker 按能力调用模型并判断最终文件是否满足发布条件。工作台从已保存的记录读取进度和核验结果。',
    },
    architecture: [
      {
        title: { en: 'Give the operation, the job and the attempt their own identities', zh: '一次操作、一个任务与一次尝试各有身份' },
        paragraphs: [
          {
            en: 'A Run records what the member asked the Studio to do and which inputs it used. A Job represents a unit of computation, and an Attempt records a particular worker execution. One verification case can have independent detector jobs. A batch can retain successful releases while individual files fail. The Studio can reopen an operation and read its artifacts and timed stages without having kept the original HTTP request alive.',
            zh: 'Run 记录成员在工作台发起的操作与输入快照。Job 是可以调度的计算单元，Attempt 则记录具体哪次 Worker 执行。同一验证案例可以有多个独立的检测任务，一批文件中也可以保留成功发布的结果，并单独查看失败项。浏览器即使离开，也能回来打开同一次操作及其产物和阶段耗时。',
          },
          {
            en: 'The API writes the Run, Job, initial Event and outbox message in one PostgreSQL transaction. A separate dispatcher sends the message to RabbitMQ and waits for broker confirmation. Keeping the dispatch intent in the database closes the gap between recording a run and putting it on the queue. If confirmation is followed by a dispatcher crash before the database update, the message may be sent again. The worker claims the database job before running it. Persisted event sequences also let the browser resume its event stream after reconnecting.',
            zh: 'API 用一笔 PostgreSQL 事务写入 Run、Job、初始事件和待投递消息。独立分发器随后向 RabbitMQ 发送，并等待消息代理确认。投递意图随任务落库，避免界面已经显示提交成功、后台却没有任务可发。若分发器收到确认却在更新数据库前崩溃，消息可能再次投递，Worker 会先到数据库领取任务。持久化事件也让浏览器断线后能从已读位置接续。',
          },
        ],
      },
      {
        title: { en: 'Keep three different runtimes behind one execution contract', zh: '用同一个执行接口接住三种运行时' },
        paragraphs: [
          {
            en: 'TrustMark runs in a resident CPU subprocess. Its process can be stopped when a call times out, while the worker keeps running. PixelSeal uses Ray Serve, which batches requests with compatible dimensions and operations on GPU replicas and maps the outputs back to their request IDs. TIDE keeps its pinned research environment and exchanges files with the worker through a versioned runner, preserving its generation and inversion profile.',
            zh: 'TrustMark 运行在常驻 CPU 子进程里，调用超时时可以结束该进程，Worker 仍能继续服务。PixelSeal 交给 Ray Serve，在 GPU 副本上将尺寸和操作兼容的请求组成实际计算批次，再按请求编号对应输出。TIDE 保留独立的研究环境，通过有版本的文件接口交接输入与结果，保留其生成与反演配置。',
          },
          {
            en: 'The adapter provides the expected way to invoke each engine. Leases, cancellation, signing and release rules remain with the worker. As a result, moving an engine to another service or restarting it changes how the computation runs. It leaves the publication checks and the meaning of a release intact.',
            zh: '适配器统一的是模型怎样接收输入和返回产物，租约、取消、签名和发布规则仍由 Worker 管理。这样一来，某个模型换运行方式或独立重启，最终文件仍遵循同一套发布核验，工作台里的发布记录也有一致的含义。',
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
        title: { en: 'Preserve what each verification channel actually knows', zh: '保留每一路证据能够回答的问题' },
        paragraphs: [
          {
            en: 'The teapot from Generate gives us a clean reference and a marked image. TIDE reports presence under an exact matching calibration profile, with an inconclusive state when it has no such calibration. Payload-based engines can recover a token and look it up against a release. C2PA independently checks whether a credential is intact and whether the issuer is trusted. One of those signals can be available while the others are absent, pending or inconclusive. Keeping them separate lets the report explain what it found without turning detection into an ownership claim.',
            zh: '用「生成」得到的茶壶有无水印参考图和带水印图。TIDE 根据精确匹配的校准配置判断水印存在性，缺少匹配校准时保留未定结论。载荷型引擎可能读回令牌，进一步查找关联发布记录。C2PA 则单独回答凭证是否完整、签发者是否可信。这几路证据可能一个已经给出结果，另外的缺失、等待中或无法判断。逐项报告才能说明文件里发现了什么，不会把检测结果包装成归属证明。',
          },
          {
            en: 'A verification step is stored per case and detector. On completion, a worker updates its own step and recomputes the case state while holding the parent record lock. A CPU detector and a GPU detector can therefore finish in either order without losing the earlier result. If the credential check succeeds and one detector times out, the case exposes its available evidence as a partial result. Retrying reopens the affected detector step.',
            zh: '每个验证案例为每种检测器保留独立步骤。某一路结束时，Worker 在锁住父记录的事务里更新该步骤，并重新计算整案状态。CPU 与 GPU 检测器可以按任意顺序返回，先返回的结果也不会被后来的覆盖。如果凭证检查已完成而某个检测器超时，案例仍会展示已有的部分证据。重试只重新打开受影响的检测步骤。',
          },
        ],
      },
      {
        title: { en: 'Keep the artifact lineage after a file changes', zh: '文件变化后，仍然追得回原图与处理步骤' },
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
    architectureTitle: { en: 'From a conversation to an application run', zh: '一句交办怎样变成一次可追溯的应用运行' },
    architectureLead: {
      en: 'Chat captures intent. The saved plan binds that intent to an application and a delivery destination. The runtime follows the pinned release, and the report links back to its steps, sources and receipt.',
      zh: '对话接收交办意图，计划把意图绑定到应用与交付去向，运行时按批准的版本执行。读者拿到报告后还能查到步骤、引用和投递回执。',
    },
    architecture: [
      {
        title: { en: 'Keep personal context and project context separate', zh: '区分个人对话与项目上下文' },
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
        title: { en: 'Store the relationship between a scheduled occurrence and a run', zh: '把一次排期触发与对应运行的关系存下来' },
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
    decisionsTitle: { en: 'Decide what can continue without a person', zh: '判断哪些步骤可以自动继续' },
    decisions: [
      {
        title: { en: 'Scheduling consent and action approval answer different questions', zh: '批准排期与审批外部操作各管一件事' },
        paragraphs: [
          {
            en: 'Approving the plan answers “may this application run on this schedule?” A step that proposes a write to a connected system may require approval for that specific action. A user can see the waiting step in the run they approved earlier, and a project approver decides whether that operation can proceed. Treating plan approval as approval for every tool step would give a recurring task authority over actions the member never reviewed.',
            zh: '批准计划回答的是「能否在约定时间运行这个应用」。当执行中的某一步要写入外部系统时，仍可能要求针对该操作的审批。成员可以在早先批准的运行里看到等待状态，由具备项目审批权限的人决定是否继续。若一次批准排期就放行所有工具操作，定时任务就会得到成员此前无法逐项检查的权限。',
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
        title: { en: 'Verify the clock, the sources and the delivery separately', zh: '分别验时钟、引用、交付' },
        paragraphs: [
          {
            en: 'The recorded acceptance used synthetic equipment data and let the server clock reach the scheduled minute. It retained the schedule occurrence, linked execution, source lines and web inbox receipt. Those records let an observer distinguish a job that ran manually from one launched by the scheduler, and a report that was generated from one that reached the inbox. Separate cases exercised app replacement, revoked access, rejected approval and pause/resume. The recorded delivery used a controlled inbox. Live enterprise data, model quality and external-channel receipts are outside that result.',
            zh: '验收使用合成的设备数据，等待服务器时钟真正走到约定分钟，留下排期实例、关联应用运行、来源行和网页收件箱回执。这几项一起看，能区分手动执行和定时触发，也能区分报告已经生成和已经送达。另有用例覆盖应用换版、权限撤销、审批拒绝和暂停后恢复。交付验收走的是受控收件箱，其结果不覆盖真实企业数据、线上模型质量或外部渠道实际回执。',
          },
        ],
      },
      {
        title: { en: 'Keep the evidence that supported the original answer', zh: '留下当时支撑报告结论的证据' },
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
