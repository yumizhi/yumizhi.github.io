export type Bilingual = { en: string; zh: string };

export type ArticleFigure = 'epub-worker-handoff' | 'epub-path-roundtrip' | 'originmark-teapot-report' |
  'originmark-lease-recovery' | 'agent-run-link' | 'agent-report-evidence' | 'agent-runtime-trace' |
  'agent-workflow-data' | 'agent-message-transport';

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
        title: { en: 'Package inspection in the browser', zh: '浏览器中的预检与处理' },
        paragraphs: [
          {
            en: 'Merge, Split and Inspect each keep a session containing the selected files, parsed summaries, results and errors. One worker processes requests for all three. It inspects each book by reading the ZIP directory and inflating only the container, package and navigation documents. React uses the returned report to preview the table of contents in the selected order. It can render a useful preview before any images or fonts are inflated.',
            zh: '「合并」「拆分」「检查」各自保留已选文件、分析摘要、结果与错误，三者共用一个 Worker。预检时，Worker 先读取 ZIP 目录，只解压容器、包文档和导航文件。React 根据返回的分析报告和当前卷序生成目录预览，图片和字体都还没解压，用户已经可以检查章节顺序。',
          },
          {
            en: 'The offline cache keeps the workspace and worker code available. The books live in the current browser session, so closing or reloading the page clears the working state. A download URL is tied to the result that created it. When the result is replaced, the workspace can revoke that URL without deleting a file that another tool still holds as input.',
            zh: '离线缓存保留界面和 Worker 代码。书籍文件留在当前浏览器会话，关闭或刷新页面会清除手头的工作。下载链接跟它对应的结果一起管理：如果结果被替换，就可以撤销旧链接，同时保留已经作为另一个工具输入的文件。',
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
        title: { en: 'One volume order feeds both preview and export', zh: '预览和导出共用同一份卷序' },
        paragraphs: [
          {
            en: 'Automatic order derives a key from the filename and can fall back to the book title or the first navigation label. The ordering rules recognize numeric volume labels and Chinese ordinals. Two books that resolve to the same key are reported as ambiguous. That matters for a series that has two files both labeled Volume 1. The user can put them in the intended order, inspect the resulting contents and merge using that explicit order.',
            zh: '自动排序从文件名提取排序键，也可以回退到书名或目录第一项。规则能识别数字式卷号和一部分中文序数。两本书算出的键相同时会提示歧义，例如同一套书有两个文件都标作「第一卷」。此时可以手动排列，先在目录中检查章序，再按明确的顺序导出。',
          },
          {
            en: 'Dragging, keyboard reordering and the automatic sort all update the same list. Leaving a drag with Escape keeps the previous order. Committing to a new order updates the preview and retires the earlier download. The change also determines which source gets v1/ and which book supplies the collection’s language and page direction, so the handoff from preview to export has to use the same order.',
            zh: '拖动、键盘改序和自动排序最终更新同一个列表。按 Escape 退出拖动会保留原卷序，确认新的顺序后则更新目录预览，并作废此前的下载。卷序还决定哪一本进入 v1/，以及合集继承哪本书的语言与翻页方向。因此，预览上的顺序与归档引擎实际收到的顺序必须一致。',
          },
        ],
      },
    ],
    implementation: [
      {
        title: { en: 'Reading the package before touching chapter files', zh: '先读包结构，再读取章节文件' },
        paragraphs: [
          {
            en: 'An EPUB can put its OPF in any valid directory. The reader starts at META-INF/container.xml and resolves the declared package path. It builds the manifest’s mapping from item IDs to resource locations, then follows the spine’s item references in reading order. The navigation document is a separate input. It supplies labels and link targets for the table of contents and can omit spine items or group several under a heading. Preserving the spine and the navigation separately avoids confusing a navigation hierarchy with the order of the book.',
            zh: '合法 EPUB 的 OPF 可以放在不同目录。读取器先打开 META-INF/container.xml，从中找到包文档，再把清单里的资源编号映射到实际位置。spine 按资源编号指明阅读顺序。导航文件则单独提供目录标题和跳转目标，其中可以略过某些 spine 条目，也可以用一个标题把多个章节归在一起。分别读取两份结构，才能在合并卷序的同时保住目录层级。',
          },
          {
            en: 'The two-volume example uses the same chapter path in each source archive, so each lookup is relative to its own archive. In the collection, the first chapter is placed under v1/ and the second under v2/. Item IDs also receive a volume prefix. That second change matters even when the files have different names. Two source packages can both call their chapter item chap01, and the combined spine has to point to two distinct manifest items.',
            zh: '示例的两卷书在各自归档里都有 chapters/01.xhtml，读取时必须到各自的 ZIP 中查找。合并后，第一卷的章节放在 v1/ 下，第二卷放在 v2/ 下。清单里的条目编号同样加卷前缀。这个步骤跟文件同名是两回事，即使两章的文件名不同，两个源包也可能都把章节编号写成 chap01。合集的 spine 必须能分别指向两个新条目。',
          },
        ],
      },
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
      {
        title: { en: 'The merge record and the reconstructed volume', zh: '合并记录与原卷重建' },
        paragraphs: [
          {
            en: 'The writer stores the reconstruction data at META-INF/epub-merge-tool.json. Each source entry has the volume’s filename, original OPF path and package metadata, the spine and table of contents, and a resource list. Each resource row records its local manifest ID, original href, media type and merged_href. Documents with changed links also have a per-document rewrite map. A single canonical font can therefore appear in several source entries while occupying one entry in the combined ZIP.',
            zh: '拆分需要的信息保存在 META-INF/epub-merge-tool.json。记录按卷组织，每卷有文件名、原 OPF 路径和包元数据、spine、目录与资源清单。每条资源记录原条目编号、原 href、媒体类型和合集内的 merged_href。有引用发生改变的文档还有一张自己的改写表。于是同一字体可以在两卷的记录中各有一条映射，在合集 ZIP 里仍然只占一个成员。',
          },
          {
            en: 'Split opens that record before creating any output. For each book it creates a new writer, restores the original package location and rebuilds the navigation using that volume’s entries. It reads each resource by its merged address and writes it back at the source address. The rewrite table is applied in reverse, so the second volume’s stylesheet again points to its own font. If a recorded resource is absent from the collection, the split stops with that missing path. A partially rebuilt archive is not offered as a completed volume.',
            zh: '拆分先读合并记录，再为每卷分别建立写入器，恢复原 OPF 路径，用该卷的目录条目生成导航。资源从合集地址读取，写回原卷地址；文档则反向应用各自的改写表，把第二卷样式表里的字体链接恢复到本卷。如果记录指向的资源已从合集中丢失，拆分会报出缺失路径，不会把半本重建结果当作完整分卷交给用户。',
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
      {
        title: { en: 'The same resource plan serves synchronous and file-based APIs', zh: '同步接口与逐卷读取共用一套资源计划' },
        paragraphs: [
          {
            en: 'Calling mergeEpubs with byte arrays and calling mergeEpubFiles with Blobs use the same entry generator. When the generator requests the next source, the synchronous caller returns its existing bytes and the file-based caller reads that Blob on demand. Both emit entries through the same package and navigation code. There is one place to fix a path or output-order bug. Automatic order still has a metadata prepass, while an explicit input order lets the merge begin directly.',
            zh: '接收字节数组的 mergeEpubs 与接收 Blob 的 mergeEpubFiles 共用一个归档条目生成器。当处理逻辑需要下一卷时，同步接口交出现成的字节，文件接口才去读取对应 Blob。两条路径共用后续的清单、目录和写入规则，因此路径修复和排序变更只需要在同一处落实。自动排序仍要先预检各卷元数据，用户明确指定卷序后就可以直接进入处理。',
          },
          {
            en: 'The ZIP writer stores formats such as PNG, JPEG and WOFF2 that are already compressed and deflates ordinary text entries. It writes mimetype first, uncompressed, in the EPUB container. This avoids spending additional compression work on typical image-heavy books. The resulting storage profile depends on the input, and a peak memory estimate still has to account for the compressed source, the resource being processed and the accumulated output.',
            zh: 'ZIP 写入器直接存储通常已压缩的 PNG、JPEG 和 WOFF2，普通文本则用 deflate 压缩。归档的首个成员是未压缩的 mimetype。这样的选择省掉了对常见图片做二次压缩的工作。具体收益受输入素材影响，估算峰值内存时仍要计入当前卷的压缩数据、正在解压处理的单个资源，以及已经积累的输出数据。',
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
        title: { en: 'Runs, jobs and retry attempts', zh: '运行记录、计算任务与重试' },
        paragraphs: [
          {
            en: 'A Run stores the requested operation and its input snapshot. A Job is a unit of work, such as one detector call. Each time a worker claims that job, it creates a new Attempt. One verification case can have independent detector jobs. A batch can retain successful releases while individual files fail. The Studio can reopen an operation and read its artifacts and timed stages without having kept the original HTTP request alive.',
            zh: 'Run 保存用户提交的操作和输入快照。一次检测器调用可以独立成为一个 Job。同一个 Job 被重新领取时，会留下新的 Attempt。同一验证案例可以有多个独立的检测任务，一批文件中也可以保留成功发布的结果，并单独查看失败项。浏览器即使离开，也能回来打开同一次操作及其产物和阶段耗时。',
          },
          {
            en: 'The HTTP service uses lightweight engine definitions for capabilities and input schemas. Model libraries load in their execution runtimes. That allows a CPU-only service to accept and record an operation even when it cannot execute the selected GPU model locally. Each compute queue can have its own worker pool without forcing all requests to share the same model process.',
            zh: 'HTTP 服务通过轻量的引擎定义读取能力和输入格式，模型依赖留在各自的执行进程中。因此，服务即使没有 GPU，也能接收操作并将任务登记到合适的队列。CPU 和不同 GPU 队列可以分别配置处理进程，无需让所有请求共用一个模型进程。',
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
        title: { en: 'A run is saved before its message is sent', zh: '先保存操作，再投递任务' },
        paragraphs: [
          {
            en: 'A protection request creates its release target, run snapshot, job, initial event and outbox entry in a database transaction. This gives Studio a run to open immediately. The dispatcher reads pending outbox entries, sends a persistent RabbitMQ message containing the job ID and records dispatch after confirmation. If the dispatcher stops before sending, there is still a pending entry. If RabbitMQ confirms the send and the database transaction then fails, a later dispatcher can send the message again.',
            zh: '保护请求在一笔数据库事务里创建待发布记录、运行快照、计算任务、初始事件和待投递消息。事务完成后，工作台已有一条可以打开的运行记录。分发器从待投递表取出条目，向 RabbitMQ 发送携带任务编号的持久消息，收到确认后登记已投递。若分发器在发送前退出，待投递条目仍在；若 RabbitMQ 已确认但数据库事务随后失败，重启后这条消息可能再发一次。',
          },
          {
            en: 'A worker therefore reads the job state before computing. It locks the row, claims queued work, increments the claim version and records a new attempt. Heartbeats extend the lease only while that exact claim is still valid. Duplicate messages can refer to a run that is already active or finished. The database claim, rather than the number of broker deliveries, determines which attempt may proceed. A browser reconnect can replay the saved sequence of run events independently of either message delivery or GPU progress.',
            zh: 'Worker 收到消息后先读取任务状态，在行锁下领取仍处在排队状态的任务，递增领取版本，同时写下一条 Attempt。心跳只为当前仍有效的领取续租。重复消息可能指向正在跑或已结束的任务，能否开始计算由数据库里的领取状态决定。浏览器断线后则按已保存的事件序列补读进度，不依赖消息队列回放任务，也不必重新启动计算。',
          },
        ],
      },
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
        title: { en: 'The policy is part of the release record', zh: '发布记录保留当时的质量策略' },
        paragraphs: [
          {
            en: 'The release is tied to a version of the project policy. A candidate can fail because the expected payload cannot be recovered, or because its image-quality score is below the configured floor. Those checks are recorded against the policy used for that run. If the project later changes the threshold or engine, an older release still points to the policy and evidence that governed it at publication.',
            zh: '每次发布绑定该项目的一版策略。候选文件可能因为预期载荷无法读回而失败，也可能因为图像质量低于配置门槛而被拦下。核验结果随该次运行的策略保存。项目之后调整门槛或引擎，旧发布仍能找到当时的策略与证据。',
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
        title: { en: 'Experiments record transforms and extraction results', zh: '实验记录保留变换参数与回读结果' },
        paragraphs: [
          {
            en: 'Experiment handles a different task from Protect. It records an input, the chosen model and transform settings, and saves both the embedded and transformed files. The worker measures image quality and reads the watermark again on the transformed output. Those results can be compared later through their recorded settings. A formal release has its own publication record and token registry, so a laboratory crop remains identifiable as an experiment.',
            zh: '实验模式会记录输入、模型和变换设置，分别保存嵌入后与变换后的文件。Worker 测量图像质量，并从变换后的输出重新回读水印，后续可以按保存的参数比较结果。正式发布另有发布记录与令牌登记，因此一次裁剪或 JPEG 试验始终可以从记录中识别为实验。',
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
      {
        title: { en: 'Quick and deep verification share a case', zh: '快速验证与深度检测共用同一个案例' },
        paragraphs: [
          {
            en: 'Quick Verify checks the credential and uses the available provenance for that file within the current project to select detectors. An unknown input falls back to the CPU path. A user with permission can add a deep check using a supported PixelSeal or TIDE worker. The extra check attaches a new step to the same case. Earlier evidence and the original input snapshot remain available, so the report can account for findings produced at different times.',
            zh: '快速验证核对内容凭证，再利用当前项目内已有的文件来源记录选择检测器。没有来源记录的输入默认走 CPU 路径。具备权限的用户可以继续增加 PixelSeal 或 TIDE 深度检测，系统在原案例下增加步骤。已有证据与最初的输入快照仍然可查，报告可以呈现先后得到的几路结果。',
          },
          {
            en: 'A request for the same deep check can return its existing step. This saves a new model run when a user reopens the case and requests a check already in progress. A file with a valid credential can still have an unresolved watermark check, and a matched watermark token still points to a published record even if the supplied copy has lost its credential. The report keeps enough detail to tell both situations apart.',
            zh: '同一种深度检测已存在时，重复请求可以直接返回那条步骤，避免用户重开案例时又启动一份同样的模型任务。凭证有效的文件可能仍有尚未完成的水印检查；收到的副本即使已经丢了凭证，读回的令牌也仍可能关联到发布记录。报告分别保留证据状态，才能区分这两种情况。',
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
        title: { en: 'Research parity and detection calibration', zh: '研究实现对齐与检测校准' },
        paragraphs: [
          {
            en: 'The TIDE integration first checked parity on pinned research settings. The original script, wrapper and product runner were compared at the level of decoded outputs and, for the recorded fixtures, exact PNG hashes and raw scores. Matching values in those controlled comparisons show that the adapter preserved the tested computation end to end. A successful parity check only needs the reference run and the integration run. It cannot by itself characterize how often the detector finds a watermark on a new image.',
            zh: 'TIDE 接入先在锁定的研究配置上做对齐检查。验收比较原研究脚本、适配层和产品运行器，记录中的固定样本对齐到了相同的输出 PNG 哈希和原始检测分数。这说明经过适配器调用以后，所测配置的计算结果得到保留。对齐测试只需同一份输入分别经过参考实现和产品实现，单凭这组对照无法估计检测器在新图上误报的频率。',
          },
          {
            en: 'Calibration is recorded separately and bound to a matching computational profile. A raw score generated under a different profile remains available as evidence, with an inconclusive detection outcome until a matching calibration exists. This keeps the report from inheriting a threshold that was measured for a different sampler, inversion setup or watermark configuration. The publication tests and the calibration tests thus support different guarantees.',
            zh: '校准另行登记，并与匹配的计算配置绑定。换了计算配置后产生的原始分数仍可保留，但缺少对应校准时，检测结论记为未定。采样、反演或水印配置改变后，报告由此不会沿用另一组配置测出的阈值。签发验收关注最终文件能否按策略发布，校准验收关注特定配置和测试样本下的检测表现。',
          },
        ],
      },
    ],
  },
  'personal-agent': {
    architectureTitle: { en: 'Model turns, workflow steps and message delivery', zh: '模型回合、工作流步骤与消息投递' },
    architectureLead: {
      en: 'A scheduled report starts with an approved app version and ends with a receipt. In between, the platform has to drive a workflow, execute individual model turns and keep their evidence available after either a worker or chat client disconnects.',
      zh: '一份定时报告，从选定应用版本到收件箱回执，中间要过三道边界。工作流负责推进步骤，模型运行时负责一轮内的工具调用，消息通道负责把结果送到成员手里。这三段可以在不同时间恢复，最后用同一条运行记录对起来。',
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
            en: 'Project membership grants the rights a run can use. A member can start a published app with the appropriate access, while editing releases and approving writes are distinct project roles. The server checks those rights on execution and again when accessing a result. That matters in a shared workspace where the person who builds a workflow, the person who schedules it and the person who approves a write can be different people.',
            zh: '运行可用的权限来自项目成员身份。成员在获授权后可以启动已发布的应用，编辑或发布版本、审批外部写入则是不同的项目权限。服务端在执行前检查，也会在访问成果时重新核对。在共享工作区里，编排工作流、安排任务和批准写入往往由不同的人负责。',
          },
        ],
      },
      {
        id: 'agent-pi-runtime',
        title: { en: 'A Pi loop inside a workflow step', zh: 'Pi 循环嵌在一个工作流节点里' },
        figure: 'agent-runtime-trace',
        paragraphs: [
          {
            en: 'The runtime adapter creates a fresh instance of Pi’s Agent for the step. Pi supplies the model and tool loop: it sends the messages and tool definitions to the provider, receives a tool request, adds the tool result to the turn and continues until the model ends the exchange. The project loads the pinned Agent definition, selects a model from the member’s authorized aliases, and hands Pi the configured provider stream. For a deployed app, each model request also rechecks the release’s model grant and reserves usage before it goes out.',
            zh: '工作流走到一个 Agent 节点时，适配器为这一步创建一个新的 Pi Agent。模型调用和工具循环由 Pi 提供：模型收到消息与工具定义，发起一次工具调用，Pi 把工具结果放回本轮上下文，再继续请求模型，直到本轮结束。项目要交给 Pi 的是已有授权的模型、供应商流接口和固定版本的 Agent 定义。对已部署应用，每次请求发出前还会复查部署的模型授权，并预占当日用量。',
          },
          {
            en: 'The engine prepares three pieces of input: the task, the collected business records and a bounded set of cited excerpts. It wraps authorized read capabilities as Pi tools. A tool call passes back through the engine, which checks the current run and project scope, validates the payload and records the outcome. Pi reports usage at turn boundaries. In debug runs the adapter also batches visible text deltas and writes them as trace events. The finished step has a separate record with the summary, sources, model and usage.',
            zh: '调用开始前，引擎先备好三部分输入：任务原文、业务记录，以及限量的来源摘录。项目把获授权的只读能力包装成 Pi 工具；真正调用时，仍回到引擎核对当前运行和项目范围、验证参数并记录结果。Pi 在每轮结束时回报用量。草稿调试还会把用户可见的文本增量分批记入追踪事件。一步结束后，系统另外保存摘要、来源、模型与用量，这份记录才供后续节点和运行详情读取。',
          },
          {
            en: 'P-17 uses the local evidence adapter under the same runtime contract. It reads the configured tool and assembles its report from the returned records and source excerpts. The scheduled acceptance therefore exercises the path from trigger to receipt with fixed data. Separate protocol tests exercise the Pi adapter with a controlled provider. This division makes failures easier to locate: a missing receipt can be investigated independently of the model’s ability to write a useful brief.',
            zh: 'P-17 验收在同一个运行时契约下选用本地证据适配器。它调用指定的读取工具，用返回记录和来源摘录组装简报，所以可以用固定数据检查整条调度与投递链路。另有协议测试通过受控供应商覆盖 Pi 的调用。这样排查少了一层猜测：收件箱收不到简报时，可以单独检查调度、运行与回执，不必先从模型生成质量查起。',
          },
        ],
      },
      {
        id: 'agent-workflow-handoff',
        title: { en: 'Information passes through committed step results', zh: '节点通过已提交的结果接力' },
        figure: 'agent-workflow-data',
        paragraphs: [
          {
            en: 'A workflow can pin different Agent versions at different nodes. When advancing a node, the engine walks back through the graph and loads completed ancestor outputs for this run. It collects business records, citations and structured values into context. An artifact step can also read the latest upstream summary. Each Agent runtime gets its own input, the records and evidence selected for that step, and a list of available tools. The Agent session starts fresh at each node, and the artifact reads the upstream summary through the workflow context.',
            zh: '工作流的不同节点可以绑定不同的 Agent 版本。推进一个节点时，引擎顺着图往回找，只读本次运行中已完成的上游步骤，把业务记录、引用和结构化值整理成上下文。成果节点还可以读取最近一份上游摘要。每个 Agent 运行时收到的是这一步所需输入、记录、证据和可用工具，每个节点会新建自己的 Pi 会话，上游摘要则由成果节点从工作流上下文读取。',
          },
          {
            en: 'For a maintenance workflow, a read node can return the equipment record, a knowledge node can attach manual excerpts, and the Agent can use both to prepare the brief. The artifact node gathers the resulting summary and evidence under the same run. Because the links are explicit, the run view can show which steps supplied records and which step wrote the summary. The runner can checkpoint those handoffs in SQLite and resume at the next eligible node.',
            zh: '以设备维护工作流为例，读取节点可以返回设备记录，知识节点可以附上手册摘录，Agent 再据此整理简报。成果节点把摘要和证据收进同一次运行。运行详情里能看到设备记录来自哪一步、摘要由哪一步生成。引擎把这些交接写成 SQLite 检查点，恢复时沿已完成的结果找到下一个可执行节点。',
          },
        ],
      },
      {
        id: 'agent-messages',
        title: { en: 'Channel messages and workflow events', zh: '渠道消息与工作流事件' },
        figure: 'agent-message-transport',
        paragraphs: [
          {
            en: 'The QQ adapter receives gateway events over the bot SDK’s WebSocket. WeChat uses long polling. When a WeChat response arrives, its messages and the next cursor are saved together in one SQLite transaction. Both adapters pass normalized messages to the same gateway. It derives a deduplication key from the channel account, peer and source message ID, with group context where applicable. Pending messages from one peer remain ordered, while a transport retry can reuse an already computed reply.',
            zh: 'QQ 通过机器人 SDK 的 WebSocket 接收网关事件，微信走长轮询。微信返回一批消息时，入箱与推进查询游标会在同一笔 SQLite 事务里完成。两个适配器再把消息交给同一个网关。网关根据渠道账号、会话来源和原消息编号生成去重键，群聊还会纳入群上下文。同一会话的待处理消息保持顺序，发送失败重试时也可以复用已经算好的回复。',
          },
          {
            en: 'A bound private chat can invoke a published app. Its message key becomes the invocation key, so checking a queued or running reply can follow the existing run. The channel receives a reply or a waiting status, together with the run reference. Inside the application, the steps still communicate through saved state and evidence. Studio reads that durable record to show progress. The platform can finish the run even if the chat transport or the browser has disconnected.',
            zh: '绑定后的私聊可以调用已发布应用，入站消息的去重键也会成为调用键。轮询一条还在排队的回复时，可以接着查原来的运行。渠道收到的是答复或等待状态，以及对应运行的编号。应用内部仍然通过保存的步骤结果与证据推进，Studio 则读取这些记录展示进度。聊天连接断开或浏览器关闭之后，应用可以继续跑。',
          },
          {
            en: 'The project also includes a Kafka-to-webhook example for event-driven entry. It derives a stable key from the topic, partition and offset, and commits the offset only after the application endpoint accepts the event. If that acknowledgement is lost, the consumer can present the same key again. Scheduled delivery has its own receipt and uncertainty state. That keeps a completed run, a channel acknowledgement and a reader opening the result as distinct events.',
            zh: '事件入口还有一个 Kafka 到 Webhook 的接入示例。桥接器用主题、分区和 offset 生成稳定的调用键，等应用接口接受事件之后才提交 offset。确认丢失时，消费端可以带同一个键重新提交。定时成果的发送另有投递回执和不确定状态，因而应用执行结束、渠道接受消息、收件人打开报告是三个分别留痕的事件。',
          },
        ],
      },
      {
        title: { en: 'SQLite checkpoints and the deployment footprint', zh: 'SQLite 检查点与部署边界' },
        paragraphs: [
          {
            en: 'The self-hosted Node service uses a shared local SQLite database in WAL mode. The queue, claim, step record and output can be updated using ordinary local transactions. Long model and tool calls happen outside them. This fits a single-host deployment with a small number of active workers. It also leaves an explicit scaling boundary: concurrent writes still contend for the database writer, and the shared local volume belongs to one host.',
            zh: '自托管的 Node 服务使用同一份开启 WAL 的本地 SQLite 数据库。队列、任务领取、步骤记录和成果可以用普通本地事务更新，耗时的模型和工具调用在事务之外处理。这个方案适合单机和少量并行 Worker。它的规模上限也很明确，多次并发写入仍会争用数据库的写锁，共享数据卷也属于同一台主机。',
          },
          {
            en: 'The platform adds separate records for project apps while retaining the original personal chat and task data. The two areas can share an account and model settings. Introducing a project workflow therefore does not require migrating somebody’s existing conversations into the application database or making their personal history available as project knowledge.',
            zh: '平台为项目应用新增记录，原有个人对话和任务继续使用原来的数据。两套入口可以共用账号与模型设置。引入项目工作流时，无需迁移成员已有的对话，也无需把个人历史转成项目知识。',
          },
        ],
      },
      {
        title: { en: 'Drafts, snapshots and deployments', zh: '草稿、快照与部署各自承担的职责' },
        paragraphs: [
          {
            en: 'An author edits a mutable definition in Studio. The revision number protects against saving over someone else’s newer edit. Publication turns the chosen revision into an immutable snapshot with a content hash and moves the deployment pointer to that snapshot. A rollback moves the pointer to an earlier release. Every run retains its own snapshot reference, and a workflow node can reference a specific published Agent snapshot. Operators can change the default for future work without changing the definition that a historical run used.',
            zh: '作者在 Studio 编辑可以反复修改的定义，保存时用草稿修订号防止覆盖别人的新编辑。发布时把选定修订固化成带内容哈希的快照，并让部署指针指向它。回滚只是把部署指回以前的快照。历史运行保留自己的快照引用，工作流内的 Agent 节点也可引用具体已发布版本。运维可以切换后续工作的默认部署，已经发生的运行仍能追溯到原先的定义。',
          },
          {
            en: 'Debug runs are another reason to keep the objects separate. Studio can exercise a candidate revision as a snapshot before it becomes the active deployment. In that path, business writes become previews. A debug run can still read authorized data and use an authorized model. Publishing is the change that makes the new definition available for regular project execution.',
            zh: '调试也依赖这三层分开。还没替换正式部署的候选修订，可以先作为快照试跑。调试流程会把业务写入变成参数预览，仍可以读取获授权的资料、调用允许使用的模型。完成调试后，发布才会让这个定义进入正常的项目执行入口。',
          },
        ],
      },
    ],
    implementation: [
      {
        title: { en: 'An editable request becomes a versioned plan', zh: '自然语言交办落实到可核对的计划' },
        figure: 'agent-run-link',
        paragraphs: [
          {
            en: 'The example starts with a member choosing the published maintenance assistant and asking for a recurring P-17 brief. The draft names the application and deployment, the equipment, the time and time zone, and the delivery destination. An ambiguous app name has to be resolved before approval. The selected version matters because two deployments with similar names can use different knowledge or workflow steps. The plan stays tied to the version the member actually approved.',
            zh: '示例从成员选择已发布的设备维护助手开始，再交办定期整理 P-17 简报。草稿列出应用和部署版本、设备、当地时间和时区，以及交付位置。出现重名应用时，需要先确认具体入口。名称相近的部署可能引用不同资料或执行不同步骤，批准计划时核对的是具体版本。即使同名应用之后改版，旧计划保存的仍是成员当时选定的版本。',
          },
          {
            en: 'At the due time the scheduler validates the current permissions, submits the application, saves the parent and child IDs and sets the occurrence to awaiting_app in the same transaction. A restarted scheduler can follow the saved child run. When the child finishes, the parent reads its terminal state. Failure, cancellation and rejection lead to distinct messages in the task record. A successful child still has to pass the release and access check before the parent records the result for delivery.',
            zh: '到点后，调度器在同一事务里核对权限、发起应用运行、保存父子编号，并把排期实例置为等待应用。重启后，可以沿保存的编号继续跟踪原来的子运行。子运行结束时，父任务读取其终态，失败、取消和拒绝审批分别留下不同提示。即使子运行已成功，父任务也要在处理交付前再核对发布策略与权限。',
          },
        ],
      },
      {
        title: { en: 'Workers persist progress at step boundaries', zh: '执行进度在步骤边界保存' },
        paragraphs: [
          {
            en: 'A workflow is a directed acyclic graph with an entry and at least one output. A worker takes a lease for the next eligible step in a short transaction and performs the call outside that transaction. Results, step events and deliverables are written as a checkpoint. A join waits for the paths it depends on to finish or be marked skipped. A long run can therefore resume from committed steps after a worker restart, while its in-progress call still needs to follow that call’s own retry or reconciliation policy.',
            zh: '工作流由有向无环图描述，包含一个触发入口，至少有一个成果节点。Worker 在短事务里领取下一个可执行步骤，随后在事务之外调用模型或工具，再把结果、步骤事件和产物一起提交为检查点。汇合点会等依赖路径完成或被标为跳过。Worker 重启后，长任务可以从已提交的步骤继续，而中断时正在进行的调用仍要按它自己的重试或核对规则处理。',
          },
          {
            en: 'The lease prevents an expired worker from writing another checkpoint. When a step is waiting for approval or an external callback, that status is stored and the run can leave the active queue. Approval or a valid callback makes it eligible to continue. This keeps a paused task visible to members without reserving a worker for the entire time it waits.',
            zh: '已经过期的 Worker 无法提交新的检查点。需要批准的操作或等待外部回调的步骤会保存当前状态，让运行暂时退出活动队列。收到有效审批或回调后，再转回可执行状态。这样，任务可以继续在成员工作区展示等待原因，又不用在人工处理期间一直占住 Worker。',
          },
        ],
      },
      {
        title: { en: 'The P-17 report preserves its sources and delivery state', zh: 'P-17 报告保留本次引用与投递状态' },
        paragraphs: [
          {
            en: 'The demo app uses the project’s equipment register and maintenance manual. When it retrieves a passage, the evidence includes the source locator, line number, text and content hash. The report can refer to the exact passage from that run. A reviewer can open it even if a later copy of the manual has different line numbers. The report, the JSON artifact and the run view all belong to the same execution, so each can be compared with its saved inputs and step results.',
            zh: '演示应用使用项目中的设备台账和维护手册。检索得到引用时，运行会保存来源位置、行号、文本与内容哈希，报告引用指向当次执行用到的原文。维护手册之后换版或改变行号，读者仍能核对原段落。简报、可以下载的 JSON 附件和运行详情都属于同一次应用执行，因而可以与当时的输入和步骤结果逐项对照。',
          },
          {
            en: 'The built-in project retrieval matches terms against source titles and lines, then returns a bounded set of excerpts. A published Agent can choose a different retriever through the extension contract, but results still have to carry the source identity and excerpt. That contract is the reason the report reader can open evidence without knowing how the passage was selected. It also gives review a sensible boundary. A citation can locate a passage, and a human or an evaluation rule still has to check whether the conclusion follows from it.',
            zh: '内置检索按词项匹配资料标题和正文行，返回有限数量的片段。发布的 Agent 可以通过扩展接口选择另一种检索实现，结果仍要携带来源标识和引用片段。报告阅读器因此可以直接检查证据，无需了解这段内容当初按哪种排序规则选出。一条引用证明系统实际用了哪段资料，结论是否能从这段资料推出，还需要人工复核或评测规则单独判断。',
          },
          {
            en: 'Application success and delivery are stored separately. For the web channel, the scheduler saves an inbox receipt once the report has been placed in the member’s inbox. The inbox uses the authorized run to open the report. External channels have their own sending and acknowledgement states. A successful provider receipt records acceptance by that channel; it does not say the recipient read the message. If a send becomes uncertain, the recorded state lets an operator reconcile it before authorizing another try.',
            zh: '应用成功与投递成功分别记账。网页渠道把成果放入成员收件箱后，调度端保存一条回执；打开正文时，收件箱再通过获授权的运行读取报告。外部渠道还要维护发送和确认状态，渠道回执表示对方平台接收，并不能说明收件人已读。一次发送结果不确定时，系统保留该状态，便于先核对实际去向，再决定是否重试。',
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
        title: { en: 'A resumed action keeps the approved parameters', zh: '恢复执行沿用已批准的具体参数' },
        paragraphs: [
          {
            en: 'A gated write is prepared and recorded before the connector executes it. The approval is bound to the action digest, which covers the relevant version, connector and parameters. Resuming checks permissions again. This matters if a member loses a role while a run is paused, or if a newer app version would propose a different write. A new deployment can be selected for later occurrences only after the older plan has been reviewed and approved again.',
            zh: '需要审批的写操作先准备并保存参数，连接器随后才可实际执行。审批绑定该动作的摘要，关联具体应用版本、连接器和参数，恢复时还会重新复核权限。如果成员在任务暂停期间被撤权，或新版应用会发出不同的写操作，旧审批无法直接放行。后续的排期想使用新的部署，要先核对旧计划并重新批准。',
          },
          {
            en: 'A target that supports a stable business key can return the same receipt after an interrupted call. If a connector’s external write offers no such contract and its reply is lost, the platform records an uncertain outcome instead of assuming nothing happened. The operator can record the confirmed receipt, authorize a retry or abandon that operation. The cost is a manual checkpoint on ambiguous calls. A lost acknowledgement therefore never triggers an automatic second write for that uncertain action.',
            zh: '如果目标系统支持稳定的业务幂等键，调用中断后可以用同一个键核对原回执。普通外部写入如果没有这个约定，又在发出后丢了响应，平台会保存不确定状态，由操作者确认已有回执、批准重试或关闭操作。这样会增加疑难调用的人工核对成本，但不会因为没有收到响应就自动再写一遍。',
          },
        ],
      },
      {
        title: { en: 'Read tools and business writes use different entry points', zh: '只读工具与业务写入走不同入口' },
        paragraphs: [
          {
            en: 'A regular Agent can list the permitted read tools in its definition. A write to a business system belongs to a workflow tool node. That node gives the runtime a fixed definition, step identity and connector contract against which to save a proposed action, its parameters and its receipt. The read-only P-17 brief can retrieve a maintenance rule without triggering a write. Adding a work-order update would require an explicit workflow step and its own approval.',
            zh: '普通 Agent 可以在定义中列出获授权的只读工具，业务系统的写入则通过工作流工具节点发起。节点为运行时提供固定的定义、步骤标识和连接器契约，使它能把拟执行的动作、具体参数和回执分别对应到同一步。P-17 只读简报可以查询维护要求；如果以后要增加工单更新，就需要定义一个显式的工作流步骤，并走该步骤自己的审批。',
          },
          {
            en: 'Keeping the connector contract versioned also makes recovery less ambiguous. Two versions of a tool can accept different parameters or have different side effects. The proposed operation is therefore bound to the connector used when it was prepared. An older approval cannot be interpreted as permission for a changed operation merely because the tool still has the same label in Studio.',
            zh: '给连接器契约保留版本，也便于在恢复时确认动作没有变化。同一个工具的新版可能接受不同参数，也可能产生不同副作用。审批保存的是准备动作时用到的连接器及具体内容。即使 Studio 中的工具名称相同，旧审批也不会因此变成对新动作的授权。',
          },
        ],
      },
    ],
    verification: [
      {
        title: { en: 'A real due time and separate recovery cases', zh: '真实排期触发与独立恢复用例' },
        figure: 'agent-report-evidence',
        paragraphs: [
          {
            en: 'The recorded screen walkthrough uses Run now to demonstrate the user journey. A separate acceptance case sets the next schedule and waits for the server clock to reach it. The evidence from that second case links the occurrence to the application run, the cited source lines and the saved web-inbox receipt. Using separate runs makes it clear which evidence establishes the scheduler actually started the work.',
            zh: '功能录屏用「立即运行」展示从交办到读报告的整个过程。另一个验收用例才设定下一次排期，并等待服务器时钟实际到点。第二次执行留下排期实例、关联应用运行、引用的资料行和网页收件箱回执。两份记录分开，可以明确哪一份验证了真实调度触发，哪一份展示了成员操作。',
          },
          {
            en: 'The PR records 70 server tests and 23 browser scenarios using the local evidence runtime. Those scenarios cover a changed deployment, revoked permissions, repeated runs, rejected write approval and pause/resume. They also exercise selecting between same-named apps, opening the source from a report and obtaining the attached artifact. The test data is synthetic, and the recorded receipt belongs to the web inbox. Reviewing production model answers and testing real external-channel receipts are separate acceptance tasks.',
            zh: '该 PR 记录了 70 项服务端测试和 23 项浏览器场景，使用本地证据运行时。除了正常交付，还覆盖换版、撤权、重复执行、拒绝写入审批和暂停后恢复。界面用例也检查了同名应用选择、从引用跳到原文和下载附件。验收使用合成数据，回执对应网页收件箱。真实业务资料上的模型答案质量、外部渠道实号回执，属于独立的验收工作。',
          },
        ],
      },
      {
        title: { en: 'The run record is the first place to investigate', zh: '从运行记录定位失败或等待步骤' },
        paragraphs: [
          {
            en: 'A member who sees no new brief can first open the task and inspect its latest occurrence. An occurrence waiting on the application leads to that application’s step history. A rejected write or a revoked app permission appears in its own state, while a completed app with delivery pending has progress on the application side and an open delivery action on the task side. Those records help the operator distinguish a scheduling problem from a tool or delivery problem.',
            zh: '成员没有收到新简报时，可以先打开任务看最近一次排期实例。实例若还在等待应用，就沿关联进入应用的步骤记录。外部写入被拒绝、应用权限被撤销都有自己的状态。如果应用已完成而投递仍待处理，应用侧已经有结果，任务侧则还有一条未完成的投递。两边合起来看，才能定位问题是在排期、工具调用还是发送环节。',
          },
          {
            en: 'The operations view can look up a run by its identity or source and show its timeline, failed steps and usage. The model call is accounted for on the application run; the scheduled occurrence is the trigger and delivery record that links back to it. The management view returns the metadata needed for investigation. Reading the actual report and sources still uses the application’s access checks.',
            zh: '运维视图可以从运行编号或来源查找，查看时间线、失败步骤和模型用量。模型调用记在应用执行里，排期实例记录触发及投递，再回链到对应运行。管理视图提供调查所需的元数据；打开报告正文和资料时，仍需要通过应用原来的访问权限检查。',
          },
        ],
      },
    ],
  },
};
