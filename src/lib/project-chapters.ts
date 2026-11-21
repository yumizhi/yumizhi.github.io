export type Bilingual = { en: string; zh: string };

export type ArticleFigure = 'epub-worker-handoff' | 'epub-path-roundtrip' | 'originmark-teapot-report' |
  'originmark-lease-recovery' | 'agent-run-link' | 'agent-report-evidence' | 'agent-runtime-trace' |
  'agent-workflow-data' | 'agent-message-transport' | 'agent-watch-replay' | 'agent-browser-measurements' | 'agent-context-selection' | 'agent-collection-schedule' | 'agent-handoff-comparison';

export type Chapter = { title: Bilingual; paragraphs: Bilingual[]; id?: string; figure?: ArticleFigure };

type TechnicalArticle = {
  architectureTitle: Bilingual;
  architectureLead: Bilingual;
  architecture: Chapter[];
  implementation: Chapter[];
  decisionsTitle: Bilingual;
  decisions: Chapter[];
  verification: Chapter[];
};

export const projectChapters: Record<string, TechnicalArticle> = {
  'epub-toolkit': {
    architectureTitle: {
      en: 'A shared file format for merge and split',
      zh: '合并与拆分共用的文件格式',
    },
    architectureLead: {
      en: 'The browser and Node share a TypeScript engine for inspecting, merging and splitting books. A separate Python implementation reads and writes the same merge record. The record travels inside the book, which allows an archive created in the browser to be split later from the command line.',
      zh: '浏览器和 Node 共用一套 TypeScript 引擎处理检查、合并和拆分。独立的 Python 实现读写同一种合并记录。记录随书保存，所以在浏览器中合出的 EPUB，日后也能在命令行里拆回分卷。',
    },
    architecture: [
      {
        title: { en: 'Package metadata and document bytes have different lifetimes', zh: '包信息与文件内容分开读取' },
        figure: 'epub-worker-handoff',
        paragraphs: [
          {
            en: 'The same file appears in three places during a browser session. The selected File is the input. Its analysis result holds the package metadata, reading order and resolved navigation used by the preview. The output Blob exists only once the archive writer finishes. Keeping those objects separate lets the preview refresh without writing a book, and lets Inspect or Split reuse a finished output by wrapping the Blob as a File. No file chooser or extra ZIP serialization is needed for that handoff.',
            zh: '在一次浏览器会话里，同一本书先后有三种形态。用户选择的 File 是源文件，预检结果保存包元数据、阅读顺序和解析后的目录，用于工作台预览，归档写完后才得到可下载的 Blob。调整卷序只需要重排已经解析好的目录，无需另写一本书。导出完成后，「检查」或「拆分」可以把同一个 Blob 包成新的 File 继续处理，中间省去重新打包、下载和选文件。',
          },
          {
            en: 'Each mode has its own files, results and errors. An in-flight job keeps the identity of the mode that started it. Changing a merge setting clears that mode’s downloadable result because it belongs to the previous inputs. Switching modes keeps the result. Cancel terminates the worker and invalidates the pending request. The next operation uses a fresh worker, and a late message from the cancelled job cannot repopulate the old result.',
            zh: '三个工具分别保存自己的文件、结果和错误。运行中的请求始终带着发起它的工具标识。调整合并设置会清掉当前下载，因为那是按旧设置生成的文件；单纯切到别的工具则保留结果。取消处理会结束 Worker，并作废等待中的请求，下一次操作启动新的 Worker。这样就算旧任务的消息迟到，也不会把过时的结果重新显示出来。',
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
            en: 'For example, a link in an EPUB can encode a space as %20 even though the ZIP member name contains a literal space. The engine decodes once when looking up the member and re-encodes the path when writing a link. The original OPF path stored in the merge record is already a literal archive path. Decoding that value again would change the member name in some books.',
            zh: '例如，链接里可能用 %20 表示空格，ZIP 成员名称里却是字面上的空格。引擎查找成员时解码一次，写出链接时再编码。合并记录里的原 OPF 路径已经是 ZIP 中的字面路径，如果读到后再解码一次，某些书的成员名称反而会被改掉。',
          },
        ],
      },
    ],
    implementation: [
      {
        title: { en: 'One shared asset, two local references', zh: '一份共享资源与两条本地引用' },
        figure: 'epub-path-roundtrip',
        paragraphs: [
          {
            en: 'The first copy of a deduplicable resource becomes its canonical destination. When the second volume contains the same font bytes and media type, its planned reference points to that existing destination. A stylesheet in v2/ may now need to reach a file in v1/. The rewriter resolves the old URL from the original stylesheet’s directory, looks up the canonical destination and calculates a relative URL from the stylesheet’s new address. It preserves any query or fragment suffix when writing the updated link.',
            zh: '字体这类可去重资源第一次出现时，会获得一个实际存放位置。处理到第二卷时，如果字体的字节和媒体类型都一样，第二份字体的映射就指向已有文件。此时 v2/ 里的样式表可能需要跨目录访问 v1/ 里的字体。引擎先以旧样式表所在目录为基准解析原引用，再查资源的新位置，最后从样式表搬迁后的目录重新计算相对路径。URL 上的查询参数和片段标识随改写保留。',
          },
          {
            en: 'The scope of the rewriter matters as much as the lookup. For XHTML and SVG it checks supported link attributes; for CSS it recognizes URL tokens and imports. A filename mentioned in a comment or an unrelated string is left alone. External and data URLs pass through without a download. The same validation runs when a collection has no duplicates, so a broken local target is caught during assembly instead of surfacing later as a missing image or stylesheet in the reader.',
            zh: '改写器只处理可识别的引用。XHTML 和 SVG 中按受支持的链接属性查找，CSS 中识别 URL 与导入语句。注释或普通字符串即使恰好出现相同文件名，也不会被替换。外链和 data URL 原样保留，处理时不会下载。即使这本合集中没有任何重复资源，引擎也会校验本地目标，尽可能在打包时发现断链，避免读者到打开书后才看到缺图或丢样式。',
          },
        ],
      },
    ],
    decisionsTitle: { en: 'Reconstruction limits and memory costs', zh: '分卷恢复的范围与内存开销' },
    decisions: [
      {
        title: { en: 'Memory use during local processing', zh: '本地处理的内存开销' },
        paragraphs: [
          {
            en: 'The browser loads sources one at a time and inflates individual members as needed. The writer retains output chunks. That reduces the decoded working set while still keeping the current compressed input and the eventual downloads in memory. Very large collections are subject to browser memory limits. The architecture notes describe a compressed-entry pass-through prototype that was slower on the tested image workload and would have required a second path for the synchronous API. The shipped browser and Node tools keep one ZIP engine and one reference planner.',
            zh: '浏览器逐卷加载，按需解压单个成员，写入器保留输出分块。这样减少了同时存在的解压内容，但当前卷的压缩数据和最终下载结果仍需要内存，超大合集仍受浏览器容量限制。仓库还记录过直接复用压缩条目的原型。它在所测图像负载上耗时更高，还要为原有同步 API 另维护一条处理路径，因此发布版继续让浏览器和 Node 共用一个 ZIP 引擎和一套引用规划。',
          },
        ],
      },
      {
        title: { en: 'Invalid inputs and unsupported books', zh: '输入损坏与格式限制' },
        paragraphs: [
          {
            en: 'A manifest can list a resource that is absent from the ZIP. Malformed XML can prevent the reader from locating the OPF or interpreting its spine. Both conditions stop the operation with an error before the workspace offers a download. A supported reflowable book can still reference an unsupported packaging feature such as media overlays. This is a compatibility boundary even when the ZIP itself is readable: dropping an overlay would change synchronized narration, and treating a fixed-layout title as ordinary reflowable text would change the presentation.',
            zh: '有些文件能解压，但清单指向的资源根本不在 ZIP 里；也可能因为 XML 损坏，读不到 OPF 或无法解释 spine。这两类错误会中止处理，工作台不会提供成品。还存在 ZIP 结构有效、书籍特性超出支持范围的输入，例如媒体叠加或固定版式。忽略媒体叠加会丢掉同步朗读，按普通可重排内容处理固定版式也会改变原来的呈现，因此这些书需要在预检或处理时明确报出限制。',
          },
          {
            en: 'A normal EPUB without a merge record can still be opened in Inspect. Its navigation, metadata and resources are useful for diagnosing the file. Split requires the record because several plausible source structures could yield the same combined navigation. Refusing to guess protects the source boundaries, and keeping Inspect available still gives the user a useful result.',
            zh: '没有 Toolkit 合并记录的普通 EPUB 仍然可以在「检查」里打开，目录、元数据和资源列表也能用来排查问题。拆分则要求合并记录，因为几种不同的原卷结构可能生成相同的合集目录。先检查，再决定是否支持拆卷，可以让界面给出已知信息，又不把推测出来的卷界当成原始数据。',
          },
        ],
      },
    ],
    verification: [
      {
        title: { en: 'Round trips verify individual links and resources', zh: '往返测试核对具体链接和资源' },
        paragraphs: [
          {
            en: 'The resource fixtures check the relative URL emitted in the merged XHTML and CSS, reopen a reconstructed volume and check those links again. The font fixture verifies that both sources can recover the font bytes and that SVGs with local references still have distinct entries. Other fixtures exercise EPUB 2 NCX, nested EPUB 3 navigation, filenames with spaces, query and fragment preservation, and old v1 records without the optional package metadata.',
            zh: '资源测试先检查合并后 XHTML 和 CSS 写出的具体相对链接，再打开重建的分卷，核对链接是否恢复。字体用例会比对恢复后的字体字节，并检查含有本地引用的 SVG 仍然分别保存。其余样本覆盖 EPUB 2 的 NCX、嵌套的 EPUB 3 目录、带空格的文件名、查询参数和片段，以及缺少可选包元数据的旧版 v1 合并记录。',
          },
          {
            en: 'The project also runs EPUBCheck against the merge and split outputs and exercises cross-implementation reconstruction in both directions. That provides different evidence from an app screenshot: EPUBCheck validates the container and package, while the round trips check that each implementation can read the other’s reconstruction data. Browser coverage separately exercises cancellation, handling old download URLs and offline worker operation.',
            zh: '仓库还用 EPUBCheck 检查合并与拆分的输出，并覆盖 TypeScript 与 Python 两个方向的交叉重建。EPUBCheck 检查容器和包文档是否符合格式，互操作用例检查两个实现能否正确读取对方写出的重建记录。浏览器测试另行验证取消处理、淘汰旧下载链接及离线 Worker 运行。这几类用例分别检验文件格式、恢复语义和界面行为。',
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
      {
        title: { en: 'The same file can participate in several operations', zh: '同一份文件可以参与多次操作' },
        figure: 'originmark-teapot-report',
        paragraphs: [
          {
            en: 'A generated teapot in the Library is an Artifact. Its record gives it a role, byte hash, MIME type, dimensions and originating Run. When it becomes an input to Protect, the service can materialize or reuse an Asset for those bytes. The new Run refers to that input and records the selected engine and policy. Its eventual protected file and report get their own Artifact records. This is the relationship Activity follows when a user opens a file and traces it back to the operation that produced it.',
            zh: '素材库里刚生成的茶壶是一条 Artifact，记录文件用途、字节哈希、媒体类型、尺寸及来源 Run。将它送入保护流程时，服务会为同一份文件建立或复用对应的输入 Asset。新的 Run 引用该输入，并保存所选引擎和策略。保护后生成的文件与报告再各建一条 Artifact。用户从素材库打开文件时，运行记录正是沿这些关联找回当时的操作。',
          },
          {
            en: 'This distinction matters when there are several versions of the same picture. A preview and a downloaded release may look identical, but their bytes and roles can differ. Verify works on the supplied file and associates any recovered token with a published release in the current project. The image shown in Studio is useful for orientation. The original bytes, input snapshot and release evidence give the verification result its identity.',
            zh: '同一张图可能同时有预览、原件和签发后可下载的版本。它们在页面上看起来一样，字节和用途却可能不同。验证以实际拿到的文件为输入，读回令牌后，也只在当前项目里查找对应的已发布记录。工作台的画布让用户知道自己在处理哪张图，具体验证结论则要回到输入快照、文件字节和发布证据。',
          },
        ],
      },
    ],
    implementation: [
      {
        title: { en: 'The signed file is the one that must pass', zh: '真正接受核验的是签名后的文件' },
        paragraphs: [
          {
            en: 'For signed protection, the worker normalizes the original image, embeds the expected payload and writes a candidate PNG. It decodes the candidate from those bytes and applies the configured quality gate. After inserting the C2PA credential, it reads the final file again to check the signature, compare its pixels with the candidate and recover the expected watermark. Each check covers an operation that happened after the model call. A successful embed in memory would leave the effects of encoding and signing untested.',
            zh: '做带签名的保护时，Worker 先规范化输入，写入预期载荷，并输出候选 PNG。它从实际生成的字节中回读水印，再应用配置的质量门槛。加入 C2PA 凭证后，还要重新读取最终文件，校验签名、比对签名前后像素，并确认预期水印仍能读回。这里核对的是模型结束后每一次可能影响输出的操作，只看模型在内存中的嵌入结果，覆盖不到实际编码和签名。',
          },
          {
            en: 'The final object is stored by its content hash. Then the worker locks the job again and checks the running state, claim version and lease. Successful release registration, output Artifact registration and the publication event are committed together. The object store write happens first, so a crash or rollback can leave an unreferenced object. The user-facing record stays unpublished. That ordering favors leaving a removable staging object over exposing a release whose bytes or evidence are missing.',
            zh: '最终文件按内容哈希写入对象存储。随后 Worker 再次锁定任务，核对其运行状态、领取版本和租约是否有效。发布登记、产物记录和发布事件在同一事务里提交。对象存储的写入在事务之前，因此崩溃或回滚可能留下一个没有引用的对象，但用户不会看到正式发布。这个顺序允许留下可清理的中间产物，避免出现已经发布、实际文件或证据却不齐全的记录。',
          },
        ],
      },
      {
        title: { en: 'Batch requests retain the outcome of each image', zh: '批量发布保留每张图自己的结果' },
        paragraphs: [
          {
            en: 'The directory demo repeats the single-image path for multiple inputs. A batch groups the jobs and provides an aggregate status, while each item has its own attempts and output. An item that fails the watermark or quality check can be retried without asking the user to regenerate successful outputs. A batch can therefore finish with usable released files and a list of failed items at the same time.',
            zh: '目录批量示例把单张图片的流程用于一组输入。Batch 聚合任务并给出总体进度，每个成员仍有自己的尝试记录与输出。某张图在水印回读或质量检查时失败，可以单独重试，其他已发布文件仍可下载。批次结束时可以同时交付成功的文件，并列出失败项，而不必让整组结果一起作废。',
          },
          {
            en: 'The JSON or CSV manifest carries per-item outcomes and final hashes. That is useful if an upstream integration imports the files later. It can reconcile each downloaded output against the corresponding publication record without parsing visible status messages from Studio. In the recorded directory example, a repeated submission reused the batch identities. That evidence concerns the tested submission path, and item processing still relies on the job claim and publication rules.',
            zh: 'JSON 或 CSV 清单保留每项状态和最终文件哈希。上游系统以后重新导入文件时，可以逐项核对下载件与发布记录，无需从工作台的状态文案里提取结果。已有的目录验收中，重复提交复用了原有批次身份。那项检查覆盖的是提交路径，每个计算任务的恢复和发布仍由领取与事务校验保证。',
          },
        ],
      },
    ],
    decisionsTitle: { en: 'The file, the signature and the claim', zh: '文件发布、签名校验与水印结论' },
    decisions: [
      {
        title: { en: 'Independent watermark and credential results', zh: '独立的水印与凭证结果' },
        paragraphs: [
          {
            en: 'A generated file can return a TIDE watermark finding with no C2PA credential present. TIDE needs a matching calibration profile to report a detection or non-detection. Payload-based engines can also recover a token and look up the corresponding release. C2PA records signature integrity and issuer trust independently. The report preserves the status of each check, including missing or inconclusive evidence. A detected signal supports a watermark finding. Claims about authorship or ownership depend on separate evidence.',
            zh: '生成图可能检出 TIDE 水印，但没有附带 C2PA 凭证。TIDE 只有在匹配校准配置时才给出检出或未检出的结论。载荷型引擎还能读回令牌并查找关联的发布记录。C2PA 则独立核对签名完整性和签发者信任。报告逐项保留结果，包括缺少证据和无法判断的情况。检出的信号支持水印结论，作者身份或所有权需要各自的证据。',
          },
          {
            en: 'A verification step is stored per case and detector. On completion, a worker updates its own step and recomputes the case state while holding the parent record lock. A CPU detector and a GPU detector can therefore finish in either order without losing the earlier result. If the credential check succeeds and one detector times out, the case exposes its available evidence as a partial result. Retrying reopens the affected detector step.',
            zh: '每个验证案例为每种检测器保留独立步骤。某一路结束时，Worker 在锁住父记录的事务里更新该步骤，并重新计算整案状态。CPU 与 GPU 检测器可以按任意顺序返回，先返回的结果也不会被后来的覆盖。如果凭证检查已完成而某个检测器超时，案例仍会展示已有的部分证据。重试只重新打开受影响的检测步骤。',
          },
        ],
      },
      {
        title: { en: 'Recovery treats a lost worker and a cancelled job differently', zh: 'Worker 掉线与主动取消走不同的恢复路径' },
        figure: 'originmark-lease-recovery',
        paragraphs: [
          {
            en: 'When a heartbeat lease expires, reconciliation advances the claim version and closes the old attempt. A job with a pending cancellation is marked cancelled. A running job with attempts left can return to the queue, while a job that has exhausted its attempt budget becomes failed. A GPU call may return after any of those transitions. The stale attempt can no longer commit results. This separates scheduling a retry from granting permission to publish.',
            zh: '某次心跳租约过期后，恢复逻辑会推进领取版本，并结清旧 Attempt。已请求取消的任务进入取消态；仍在运行且有剩余尝试次数的任务可以重新排队；耗尽次数的任务进入失败态。已经发给 GPU 的计算可能在这些状态变化之后才返回，旧尝试也无法再提交结果。是否安排一次重试和这次计算是否仍有资格发布，由此可以分别处理。',
          },
          {
            en: 'Verify has a related but narrower recovery unit. A case stores separate detector steps. C2PA can finish first, followed later by a CPU or GPU result. If one detector fails, the report still shows the available findings and marks the unresolved check. Retrying that step leaves earlier credential results in place. A valid signature from an untrusted issuer also remains valid integrity evidence with a separate trust result.',
            zh: '验证的恢复粒度更细。每个案例分别保存各路检测步骤，C2PA 可能先完成，CPU 或 GPU 的检测随后返回。一路失败时，报告仍呈现已获得的结果，并标明未完成的检查。只需重试失败的步骤，不用丢掉前面已经取得的凭证结果。签名完整但签发者不在信任范围内时，也分别记录完整性成立和信任未通过。',
          },
        ],
      },
    ],
    verification: [
      {
        title: { en: 'Browser, batch and fault-injection evidence', zh: '浏览器、批量与故障注入的验收记录' },
        paragraphs: [
          {
            en: 'The recorded browser run used the marked TIDE output for a verification, returned to the same artifact in Library, ran TrustMark Protect and checked the downloaded signed PNG. The recovered payload matched the registered release, and the verification report could be exported as PDF. A separate directory test published six images in two batches, downloaded the six outputs and checked their SHA-256 values. Repeating that submission reused the saved batch identities.',
            zh: '浏览器验收先验证 TIDE 生成的标记图，再从素材库复用同一产物执行 TrustMark 保护，最后核对下载的签名 PNG。回读水印载荷能匹配已登记发布，验证报告也可导出为 PDF。另一次目录验收把六张图分成两批发布，下载六份结果并逐一比对 SHA-256。重复提交时，保存的批次身份保持一致。',
          },
          {
            en: 'The reliability checks separately stopped a TIDE runner while it was handling a detection. The interrupted task failed, the worker stayed available, and the next detection succeeded. Earlier runtime checks on a dedicated demo also exercised duplicate delivery, active cancellation and a result-write failure after computation. These cases check recovery and publication behavior on those environments. Model robustness under arbitrary edits and production-wide performance require their own workload and evidence.',
            zh: '可靠性验收还在一次检测进行中终止 TIDE runner。被打断的任务记录为失败，Worker 继续存活，后续检测成功。较早一轮独立演示环境的运行时验收覆盖了重复投递、运行中取消，以及计算完成后数据库结果写入失败。它们检验的是这些环境下的任务恢复与发布行为。任意图像编辑后的水印鲁棒性和线上容量需要各自的负载与测量。',
          },
        ],
      },
      {
        title: { en: 'A matching research output still needs a calibrated detector', zh: '对齐研究输出之后，还要实测检测阈值' },
        paragraphs: [
          {
            en: 'The TIDE integration first checked parity on pinned research settings. The original script, wrapper and product runner were compared at the level of decoded outputs and, for the recorded fixtures, exact PNG hashes and raw scores. Matching values in those controlled comparisons show that the adapter preserved the tested computation end to end. A successful parity check only needs the reference run and the integration run. It cannot by itself characterize how often the detector finds a watermark on a new image.',
            zh: 'TIDE 接入先在锁定的研究配置上做对齐检查。验收比较原研究脚本、适配层和产品运行器，记录中的固定样本对齐到了相同的输出 PNG 哈希和原始检测分数。这说明经过适配器调用以后，所测配置的计算结果得到保留。对齐测试只需同一份输入分别经过参考实现和产品实现，单凭这组对照无法估计检测器在新图上误报的频率。',
          },
          {
            en: 'Calibration is recorded separately and bound to a matching computational profile. A raw score generated under a different profile remains available as evidence, with an inconclusive detection outcome until a matching calibration exists. This keeps the report from inheriting a threshold that was measured for a different sampler, inversion setup or watermark configuration. The publication tests and the calibration tests thus support different guarantees.',
            zh: '校准另行登记，并与匹配的计算配置绑定。换了计算配置后产生的原始分数仍可保留，但缺少对应校准时，检测结论记为未定。采样、反演或水印配置改变后，报告由此不会沿用另一组配置测出的阈值。签发验收关注最终文件能否按策略发布，校准验收关注特定配置和测试样本下的检测表现。',
          },
          {
            en: 'The isolated TIDE release evaluation used 5,000 negatives to set the threshold and then froze it. At that threshold, all 1,000 marked PNGs were detected. False positives varied by source: 12 of 2,500 generated JPEGs, 52 of 2,500 photographs and 24 of 1,000 additional PNG controls. The target was one percent. The differences between cohorts explain why the report binds a decision to its calibration profile and shows the observed error rates alongside it. This evaluation covered unedited files; further robustness claims require tests with the corresponding edits.',
            zh: '独立演示环境先用 5,000 张负样本选定 TIDE 阈值，然后固定阈值做测试。1,000 张带水印 PNG 全部检出。误报在不同来源之间相差很大：2,500 张生成 JPEG 中有 12 张，2,500 张照片中有 52 张，另加的 1,000 张 PNG 对照中有 24 张。设定的目标是 1%。正因实测结果随样本构成而变，报告才把结论绑定到具体校准配置，同时展示实测误报率。这组验收使用未经编辑的文件，图像编辑后的鲁棒性需要对应的测试。',
          },
        ],
      },
    ],
  },
  'personal-agent': {
    "architectureTitle": {
      "en": "One account, two execution paths",
      "zh": "同一个账号，两条执行路径"
    },
    "architectureLead": {
      "en": "Web, QQ and WeChat adapters identify the member and normalize incoming messages. Personal tasks enter through the member workspace. Published applications enter through Studio, the SDK or a trigger. Both use the account’s model grants and a SQLite store, but the project worker reads inputs and knowledge scoped to its project. Joining a project leaves the member’s private conversation history outside the application context.",
      "zh": "网页、QQ 与微信的适配器识别成员，把各自的消息转换成平台可处理的输入。个人任务从工作台进入，项目应用则可由 Studio、SDK 或定时触发启动。两条路径复用账号、模型授权和 SQLite 存储。项目工作进程只读取当前项目允许使用的输入和知识；成员加入项目后，个人对话和私人记忆仍留在个人空间。"
    },
    "architecture": [
      {
        "title": {
          "en": "The scheduler follows a particular run",
          "zh": "让排期始终指向同一次执行"
        },
        "paragraphs": [
          {
            "en": "The studio saves a published definition as a snapshot. Each workflow run pins that version and the input supplied by the caller. A worker claims a ready step with a lease and commits its output to SQLite. A later worker can continue at the next eligible step, even if the browser and original worker have both gone away. Before writing to an external system, the platform freezes the proposed operation and its parameters for the approving member.",
            "zh": "Studio 把发布的定义保存为快照。每次运行都锁定版本和调用者交来的输入。工作进程凭租约领取一个可执行节点，完成后把输出提交到 SQLite。即使浏览器关闭、原进程退出，后续进程也能从下一个满足条件的节点接续。涉及外部写入时，平台会先冻结这次操作及其参数，交给成员批准。"
          },
          {
            "en": "A recurring personal task can also invoke a published application. At each due time the scheduler stores the link between the occurrence and its child application run. After a restart, that link lets the parent wait for the existing child and route its result back to the member. Starting the application again would create two executions for one morning’s brief.",
            "zh": "周期任务也可以调用已发布的应用。执行时间到达时，调度器记下本次排期与应用子运行之间的关联。服务重启后，父任务沿这条记录找到仍在进行的子运行，等它完成，再把成果送回成员。如果每次恢复都重新启动应用，同一份早报就可能执行两遍。"
          }
        ],
        "figure": "agent-run-link"
      },
      {
        "title": {
          "en": "The last mile has a receipt",
          "zh": "结果交付还有最后一步"
        },
        "paragraphs": [
          {
            "en": "A project report is delivered to the project inbox. Personal tasks can also target a web inbox or a bound chat channel. An inbound channel message is normalized and deduplicated before it starts work. On the way out, completing a model turn, creating the report and receiving confirmation from a channel are separate events. A lost external acknowledgement leaves the delivery open for reconciliation. Sending the message again could otherwise deliver two copies.",
            "zh": "巡检报告交付到项目收件箱；个人任务还可送往网页收件箱或已绑定的聊天渠道。渠道收到的消息先归一化、去重，再启动应用。反向投递时，模型生成完毕、报告保存成功、外部渠道确认送达，是三个不同的时刻。如果最后一次确认丢失，就保留待核对状态；直接补发可能让接收人收到两份相同消息。"
          }
        ],
        "id": "agent-messages",
        "figure": "agent-message-transport"
      }
    ],
    "implementation": [
      {
        "title": {
          "en": "A model turn has a small job",
          "zh": "把模型回合放在合适的位置"
        },
        "paragraphs": [
          {
            "en": "The platform can run Pi for a model turn. It gives the model scoped context and read tools, validates tool calls and returns their results to the same turn. The workflow engine owns the checkpoints and authorization for a business write. For this inspection the template selects the deterministic local evidence runtime. The recorded arithmetic, mock work order and restart exercise therefore remain reproducible without depending on a particular model response.",
            "zh": "工作台可以通过 Pi 执行模型回合：装配本次可见的上下文与只读工具，校验调用参数，再把工具结果送回同一回合。步骤持久化和业务写入审批由外层工作流管理。I-204 模板选择了确定性的本地证据运行时，因此核算、模拟工单和恢复演练可以重复执行，无需等待某个模型再次给出相同回答。"
          }
        ],
        "id": "agent-pi-runtime",
        "figure": "agent-runtime-trace"
      },
      {
        "title": {
          "en": "A corrected timestamp changes the finding",
          "zh": "一处录入更正改变了巡检结论"
        },
        "paragraphs": [
          {
            "en": "The inspection template in the development preview uses a fictional handoff, I-204, to exercise the durable engine. The register shows a start at 08:10 UTC and an acknowledgement at 09:04. With 45 minutes allowed, the calculation records a nine-minute overrun. A reviewer later supplies 08:49 as the corrected acknowledgement. By then the first report has already led to an approved mock work order.",
            "zh": "开发预览中的巡检模板用虚构的 I-204 交接走通这套引擎。登记表里的开始时间为 08:10 UTC，确认时间为 09:04；协议允许 45 分钟，因此初次核算超时 9 分钟。复核人后来拿出更正后的确认时间 08:49。此时第一份报告已经触发过一笔获批的模拟工单。"
          }
        ],
        "figure": "agent-handoff-comparison"
      },
      {
        "title": {
          "en": "The agreement supplies the threshold",
          "zh": "时限取自当时适用的条款"
        },
        "paragraphs": [
          {
            "en": "The inspection pack supplies two passages about the same equipment. One is a historical handoff that took 39 minutes. The other sets a 45-minute allowance for a standard I-204 handoff. Both are relevant search results and both contain a number. Only the agreement can supply the threshold. The read tool checks the record and category against the retrieved clause, requires a unique applicable limit and parses the UTC timestamps. Missing or ambiguous evidence stops the calculation.",
            "zh": "模板里有两段容易混淆的文字。一段历史记录写着同一设备上次交接用了 39 分钟，另一段约定规定 I-204 的标准交接时限是 45 分钟。按设备检索，两段都相关，也都有数字。计算工具需要的是约定中的时限。它核对登记编号、类别和检索到的条款，找到唯一适用的时限后才解析 UTC 时间；缺少依据或出现歧义时就停下来。"
          },
          {
            "en": "This distinction matters again on the second run. The corrected elapsed time also happens to be 39 minutes. That value comes from subtracting 08:10 from 08:49. Copying the historical observation would produce the right number by accident. The report therefore retains the source lines and revision hashes alongside the calculation.",
            "zh": "更正运行恰好也算出 39 分钟。这次的 39 来自 08:49 减去 08:10。倘若直接抄上次记录，数值碰巧相同，却无法解释此次交接。报告把计算输入与当次检索的行号、来源版本摘要一起保留，复核人可以把两个 39 分钟分别追到出处。"
          }
        ],
        "id": "agent-workflow-handoff",
        "figure": "agent-workflow-data"
      },
      {
        "title": {
          "en": "Review the original, run the correction",
          "zh": "在原稿上复核，另起一次更正运行"
        },
        "paragraphs": [
          {
            "en": "A reviewer records a decision and a reason against the original artifact digest and the last review version. Submitting the same request again returns the existing version. Two reviewers starting from the same revision cannot silently overwrite one another. The original report keeps the reviewer’s reason for requesting a correction, even if nobody resubmits the task.",
            "zh": "复核人把决定和理由提交到原稿摘要与上一复核版本上。同一请求重试时返回已保存的版本；两个人从同一旧版本编辑，后提交的人需要先处理版本冲突。即便后来没有人提交更正，原稿旁边也留着当时提出异议的理由。"
          },
          {
            "en": "Resubmission pins the original workflow version, takes the corrected input and reads the sources again. That last detail matters if an agreement has since changed. A fresh approval covers the new work-order parameters, and the receipt is filed with this run. A reader can now explain both actions: the first order followed the data then on file, the second followed a documented correction.",
            "zh": "提交更正时固定原工作流版本，带着新输入重新读取来源。协议可能已经换版，所以沿用流程也需要重新取证。新的工单参数再次进入审批，回执归入此次运行。这样，两次业务动作都解释得通：第一份工单依据当时的登记，第二份依据有记录的更正。"
          }
        ],
        "figure": "agent-report-evidence"
      }
    ],
    "decisionsTitle": {
      "en": "Personal context across days",
      "zh": "从当天的提醒到跨天的个人上下文"
    },
    "decisions": [
      {
        "title": {
          "en": "A watch can stay quiet",
          "zh": "采集成功，也可以安静地结束"
        },
        "figure": "agent-watch-replay",
        "paragraphs": [
          {
            "en": "PRs #14–17 extend the workbench in a development preview. In the member workspace a reader chooses subscriptions, topics, quiet hours and a digest time. Each hourly check takes a bounded snapshot, matches canonical URLs and fingerprints the title and excerpt. A repeat can end quietly. A relevant change can interrupt, and ordinary updates accumulate for a digest. The pending items and the report are saved together, so the next worker can pick up the outstanding deliveries after a restart.",
            "zh": "PR #14–17 在开发预览中扩展了工作台。在个人工作台，读者先选订阅、关注主题、免打扰时段和摘要时间。每小时采集一次有限快照，按规范网址比对条目，再看标题和正文摘要的指纹。重复条目可以安静结束，命中主题的变化可以优先送达，普通更新积累到摘要。待发条目和报告在同一事务里保存，服务重启后，下一轮仍可接着投递待发条目。"
          },
          {
            "en": "The release replay begins with two changed items at 13:00. One matches the reader’s priority and reaches the inbox immediately. The second stays in the digest queue. After the reader marks the topic less relevant, another release arrives at 14:00. Its address is new and collection succeeds, yet the queue grows to two and the inbox stays quiet. At 18:00 the source has nothing new to offer. Both waiting items appear together in that evening’s digest.",
            "zh": "回放从下午一点开始。来源里有两条变化，其中一条命中读者关心的主题，立即进入收件箱，另一条留下等晚报。读者随后调低这个主题的优先级。两点又来了一个新发布，采集成功，待发条目增加到两条，收件箱仍然安静。到六点，来源没有新增，晚报里却有两条可读。晚报消费的是前面几个小时攒下的记录。"
          },
          {
            "en": "At 23:00 another item arrives during quiet hours. It remains pending until the following morning. At 08:00 the source fails altogether. Both checks are silent at the moment they run, but their recovery paths differ. The first has a saved item ready to deliver. The second has an outstanding fetch to retry. Treating a failed fetch as an empty snapshot would turn an outage into a misleading “no change” entry in the history.",
            "zh": "夜里十一点还有一条更新，免打扰时段把它留到次日早晨再送。次日八点，上游请求失败，那一轮同样没有通知。翻开记录，两次沉默有不同的后续：前者已经拿到内容，只欠投递；后者连快照都没拿到，还得重新采集。把请求失败记成空快照，会让来源故障在历史里看起来像一切正常。"
          }
        ]
      },
      {
        "title": {
          "en": "Saving a method from a delivered digest",
          "zh": "从一份已送达的摘要保存方法"
        },
        "paragraphs": [
          {
            "en": "A useful digest is a concrete starting point for a second watch. From its delivered run, the reader can inspect the source endpoints, keywords, digest rules and quiet hours, then save a version of that recipe. The version points back to the run that demonstrated it. A partial source failure disqualifies the run from extraction: a digest assembled from half its subscriptions gives little evidence that the whole recipe worked.",
            "zh": "一份读起来合意的晚报，可以成为下一项订阅的起点。读者从已送达的那次运行里打开来源端点、关键词、摘要规则和免打扰时段，逐项看过再保存。保存的方法带有版本，能追溯到实际用过这套配置的运行。即使晚报已经送达，只要当轮有部分来源读取失败，就不能据此提取方法。一份少了半数来源的晚报，很难证明整套订阅都合适。"
          },
          {
            "en": "Starting a watch from that version still requires a goal, a schedule, a destination and approval for this task. The old model choice and recipient stay with the earlier task. In the replay, the reused method produces a second digest. Changing its source endpoint then makes the same version inapplicable. The next attempt stops with a source-change record. The reader can now inspect the new address before authorizing a revised plan.",
            "zh": "下次采用这个版本时，成员填写这次的目标、排期和收件渠道，再单独批准。上次选用的模型和收件人留在原任务里。验收先复用原方法，成功交付第二份摘要，随后替换来源地址，再用同一版本执行。这次运行停下，历史中留下地址变更的原因。重新确认端点后，读者才能为更新过的计划授权。"
          }
        ]
      },
      {
        "title": {
          "en": "Recovering an early decision in a long chat",
          "zh": "在长对话中找回早先的决定"
        },
        "paragraphs": [
          {
            "en": "A different kind of reuse happens inside a model turn. In the fixed-budget replay, a conversation about SQLite has reached turn 24. Taking only the latest exchanges spends the available space on turns 22, 23 and 24. The older operating procedure lives in turn 3. The selector reserves the two recent turns, ranks eligible earlier turns by terms in the current request, and reads the member’s confirmed memory. It then restores chronological order for the selected conversation. Turn 3 and the current preference both fit in the same 4,000-byte allowance.",
            "zh": "对话里的复用有另一层难处。在一次固定预算回放里，讨论 SQLite 的会话已经进行到第 24 轮。只从末尾往前截取，能装下第 22、23、24 轮，早先写下操作步骤的第 3 轮却进不了提示。新版先给最近两轮留位，再用当前请求里的词匹配较早的对话，同时读取成员确认过的记忆。入选的对话按发生顺序放回提示。在同样的 4,000 字节内，第 3 轮的步骤和当前偏好都得以保留。"
          },
          {
            "en": "The replay also edits the saved preference to specify the weekly copy, then withdraws it. Each subsequent selection reads the current record. After withdrawal the private memory is absent even though the conversation still exists. The trace retains references to the entries actually selected. Those references make a missing preference diagnosable: it may have been withdrawn, excluded by the member boundary, or simply missed by lexical matching after the user paraphrased the request.",
            "zh": "验收接着把已确认的备份偏好改成“使用每周副本”，随后撤回。每次准备下一轮输入时，系统都重读当前记录；撤回后，会话还在，私有记忆已退出选集。每轮留下实际入选的条目引用。排查一次遗漏时可以据此区分几种情况：用户撤回了偏好，当前会话无权读取，或者用户换了说法，词项匹配没有找回原句。群聊也不会因此读到成员的私人记忆。"
          },
          {
            "en": "A separate CPU experiment used Pi and Qwen2.5-0.5B with a fixed seed. Sixteen unrelated turns separated a saved SQLite backup preference from the final request. Across three repetitions of that one task, the old context missed the time and used 1,125 tokens each time. The revised context recovered 23:15 UTC in 728 tokens. That result identifies a case where selection matters. Testing paraphrases and conflicting preferences would be needed to estimate reliability across tasks.",
            "zh": "另一次测试在 CPU 上用 Pi 与 Qwen2.5-0.5B，以固定随机种子重复同一道题：在 SQLite 备份偏好与当前请求之间插入 16 轮无关对话。旧版三次都答错时间，每次消耗 1,125 tokens；新版三次都找回 23:15 UTC，每次 728 tokens。这说明选对上下文能挽回这一条偏好。对于同义改写或前后冲突的偏好，还需要独立样本才能判断可靠性。"
          }
        ],
        "figure": "agent-context-selection"
      },
      {
        "title": {
          "en": "Source excerpts and optional interpretation",
          "zh": "来源摘要与按需解读"
        },
        "paragraphs": [
          {
            "en": "A release already has a title, excerpt and address. For routine digests those fields are enough to give the reader something they can open and check. An early local-model trial returned a numbered paraphrase of the reader’s goal. Another failure shortened a source address. A convincing list of citations could therefore leave the reader no closer to the release. The collector now supplies the canonical links, and the original excerpts remain deliverable when interpretation fails.",
            "zh": "一条发布记录已经带有标题、摘要和地址。日常晚报只靠这三项，读者就能挑出值得点开的原文。早期一次本地模型试验里，回答逐条编号，内容却只是换个说法复述用户目标；另一次输出还截短了来源地址。读者会看到一份颇像样的引用清单，却未必找得到那条发布。现在链接由程序根据采集记录附上，即使模型解读失败，原始摘要仍可交付。"
          },
          {
            "en": "The automatic policy requests interpretation for a priority match or a report spanning multiple sources. Below 512 remaining daily tokens it delivers the excerpts directly. With fewer than 1,024 it favors the configured fast model. A recent failure temporarily removes that model from automatic selection for this member. An explicit model choice remains pinned. These are small, inspectable decisions around read-only evidence. Replaying an external write after failure would carry a different cost, so the multi-step runner leaves that action to its existing approval and recovery path.",
            "zh": "自动模式只在命中优先主题或需要合并多个来源时考虑解读。当天剩余额度低于 512 tokens 时，直接交付来源摘要；低于 1,024 时，在允许解读的范围内优先使用已配置的快速模型。某个模型刚调用失败，该成员的自动选择会暂时避开它，手动指定的模型仍保持固定。这些规则都发生在只读证据之上。涉及外部写入的多步任务继续沿用审批与恢复流程，盲目重放一次工单可能会产生第二笔业务。"
          }
        ]
      }
    ],
    "verification": [
      {
        "title": {
          "en": "Measure the bytes as well as the wait",
          "zh": "把传输量和等待时间分开看"
        },
        "paragraphs": [
          {
            "en": "In five fresh browser contexts with a synthetic 20-turn chat and a fixed streaming provider, the earlier build returned 31,645 API bytes after a send. The integrated build returned 1,977 by sending just the new turn. Loading workspace features on demand also cut initial uncompressed JavaScript from 730,841 to 488,594 bytes. Median time to the first visible reply stayed close to 19 milliseconds on both builds. Most of the observed gain was in transfer volume.",
            "zh": "在五个冷启动浏览器环境中，使用同一份 20 轮合成对话和固定流式服务。早期版本每发一条消息，API 回传 31,645 字节；集成版只回传本轮记录，降到 1,977 字节。工作台按需加载后，首屏未压缩 JavaScript 从 730,841 降至 488,594 字节。两版首段文字可见的中位时间都在 19 毫秒左右，这组数据里最明显的收益在传输量。"
          },
          {
            "en": "Sending one message used to trigger a second trip for the entire conversation. The completion event now carries the new turn and the browser appends it to the history it already holds. This removes a round trip that carried more data with every exchange. The model request has a separate budget, and the fixed provider controls when text starts to stream. Those are three distinct measurements. A shorter response from the API alone gives little reason to expect the first word to appear earlier.",
            "zh": "过去发一条消息，完成后浏览器还要再取一次整段历史，对话越长，重复传回来的内容越多。现在完成事件直接带回本轮记录，页面把它接到已有历史后面。送进模型的请求体另有一份预算，首段文字开始出现的时刻又受流式服务影响。三项指标可以独立变化。仅凭 API 响应缩小，很难推断读者会更早看到第一个字。"
          }
        ],
        "figure": "agent-browser-measurements"
      },
      {
        "title": {
          "en": "Overlapping the waits for six sources",
          "zh": "把六个独立来源的等待时间重叠起来"
        },
        "paragraphs": [
          {
            "en": "For collection, waiting on independent sources was the measurable delay. The worker fetches up to three read-only sources at once and reassembles their results in subscription order. In seven replays with six sources and a fixed 25-millisecond delay per source, median collection fell from 160.7 to 54.0 milliseconds. Each run still made six requests and returned six items. The experiment isolates the benefit of overlapping waits. A live feed with its own rate limit may have a very different timing profile.",
            "zh": "采集端的等待更容易定位。六个相互独立的来源逐个读取，就要逐个等网络返回。工作进程现在最多同时读取三个来源，最后按订阅顺序还原结果。给六个来源各注入 25 毫秒延迟，重复七轮，采集中位耗时由 160.7 降到 54.0 毫秒。两版每轮都发六个请求，得到六项结果；省下来的是重叠的等待时间。真实来源如果限流，这段受控回放里的耗时就不能直接照搬。"
          }
        ],
        "figure": "agent-collection-schedule"
      },
      {
        "title": {
          "en": "Restore the work between the two approvals",
          "zh": "在两次审批之间恢复数据库"
        },
        "paragraphs": [
          {
            "en": "The replay uses an isolated SQLite database, fictional inspection records and a mock service desk. After the corrected run is created, a backup is restored to a new file. The replay checks integrity, foreign keys, links to the original and the behavior of a duplicate submission before approving the second write. A final attempt substitutes a clause for the wrong category. Its calculation fails and no third receipt appears. The two successful runs and that failed one test different properties of the same workflow.",
            "zh": "回放使用独立 SQLite 数据库、合成交接记录和模拟工单服务。更正运行建立后，将备份恢复到新文件，核对数据库完整性、外键、原稿关联和重复提交，再批准第二次写入。最后把条款换成不适用的类别，核算步骤失败，始终没有第三份回执。前两次运行完成了交付。第三次因条款不适用而停在审批之前，工单服务没有收到写入请求。"
          }
        ]
      },
      {
        "title": {
          "en": "The next step for longer-lived agents",
          "zh": "长期运行之后的下一步"
        },
        "paragraphs": [
          {
            "en": "The merged workspace supports conversational task drafts, scheduled application runs, versioned workflows and results delivered through a member’s authorized channels. The source-watch, context-selection, adaptive-execution and inspection-review changes discussed here are implemented on four stacked review branches. Their replays use controlled sources and test accounts. Real business corpora, multi-host recovery and delivery to external QQ and WeChat accounts still need acceptance testing in their target environments.",
            "zh": "已合并的工作台支持对话起草、定时调用应用、版本化工作流及授权渠道投递。本文介绍的长期关注、上下文选择、自适应执行和巡检复核已经在四个依次衔接的评审分支上实现。回放使用受控来源与测试账号；真实业务语料、多主机恢复以及外部 QQ 和微信收件账号仍需各自验收。"
          },
          {
            "en": "The current watch follows a goal the member has explicitly approved. A broader proactive agent would also need to identify useful work before the member describes it, propose a plan with a visible cost and revise that plan as evidence changes. Those are directions for development. The source and delivery records already in the workspace provide a way to judge a future suggestion against the outcome it actually produced.",
            "zh": "当前的长期关注围绕成员明确批准的目标运行。更主动的个人 Agent 还需要从新情况中发现值得处理的事情，提出带有成本说明的计划，并随证据变化调整计划。这部分属于后续方向。现有的来源记录和投递历史，已经为将来评价一次主动建议及其真实结果提供了依据。"
          }
        ]
      }
    ]
  },
};
