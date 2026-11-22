export type Bilingual = { en: string; zh: string };

export type ArticleFigure = 'epub-worker-handoff' | 'epub-path-roundtrip' | 'originmark-teapot-report' |
  'originmark-lease-recovery' | 'agent-run-link' | 'agent-report-evidence' | 'agent-runtime-trace' |
  'agent-workflow-data' | 'agent-message-transport' | 'agent-watch-replay' | 'agent-browser-measurements' | 'agent-context-selection' | 'agent-collection-schedule' | 'agent-handoff-comparison';

export type CaseCheck = {title: Bilingual; body: Bilingual};
export type ProjectStep = CaseCheck & { id: string; label: Bilingual; output: Bilingual };
type CaseFigure = ArticleFigure | 'gallery' | 'architecture' | 'merge-record' | 'epub-docs' | 'tide-link' | 'calibration' | 'member-evidence' | 'deployment-scopes';
export type CaseBlock = { title?: Bilingual; id?: string; paragraphs?: Bilingual[]; figure?: CaseFigure; checks?: CaseCheck[]; steps?: ProjectStep[] };
export type CaseSection = {id: string; label: Bilingual; title: Bilingual; blocks: CaseBlock[]};

export const projectArticles: Record<string, CaseSection[]> = {
  "epub-toolkit": [
    {
      id: "design",
      label: { en: "Motivation", zh: "开发缘起" },
      title: { en: "A single edition for a series of books", zh: "为系列书制作合订本" },
      blocks: [
        {
          paragraphs: [
            { en: "On an e-reader, separately distributed volumes have separate library entries and tables of contents. Reading straight through a series means reopening the next file at every volume boundary. EPUB Toolkit builds one edition with a continuous reading order. It also records which chapters and resources belonged to each volume, so a single book can later be copied to another device.", zh: "分卷发行的电子书在阅读器上各占一条书架记录，也各有一份目录。连续阅读时，每读完一卷就得返回书架打开下一本。EPUB Toolkit 将多卷编成一册，章节可以连续翻阅。合订本同时保存各卷的章节和资源归属，以后只想带走其中一卷时，仍能单独导出。" },
          ],
        },
      ],
    },
    {
      id: "preview",
      label: { en: "Reading a series", zh: "阅读一套分卷书" },
      title: { en: "Volume order and table of contents", zh: "卷序与目录预览" },
      blocks: [
        {
          figure: "gallery",
        },
        {
          paragraphs: [
            { en: "The workspace lists the selected files in reading order. The preview shows where each chapter will appear in the combined table of contents. Dragging a volume changes that order immediately. Grouped navigation retains a heading for each volume, while continuous navigation lists the chapters consecutively.", zh: "添加文件后，工作区按卷序列出书名，右侧预览显示各章在合集目录中的位置。拖动一卷，目录随之调整。分组模式为每卷保留一级标题，连续模式则依卷序排列章节。" },
            { en: "A finished collection can go straight into Inspect or Split. Each tool keeps its own working files until the reader clears them. Changing the merge settings invalidates the previous output, while visiting another tool preserves the current work.", zh: "合并完成后，可以把合集直接交给「检查」或「拆分」。各工具分别保留当前会话中的文件和结果。修改合并设置会使旧下载失效，切去查看另一个工具则会保留手头的进度。" },
          ],
        },
        {
          steps: [
            {
              id: "collect",
              label: { en: "Input", zh: "原始分卷" },
              title: { en: "Read two self-contained books", zh: "读取两卷各自独立的书" },
              body: { en: "Each package defines its own resource paths and reading order. The same path in a different archive can point to different content.", zh: "每卷的包文档分别规定资源路径和阅读顺序。两个包里的同名路径可能指向完全不同的内容。" },
              output: { en: "Two independent package maps", zh: "两份独立的包结构" },
            },
            {
              id: "merge",
              label: { en: "Merge", zh: "合为一书" },
              title: { en: "Separate chapter paths and pool the font", zh: "分开章节路径，让两卷共用字体" },
              body: { en: "The engine namespaces chapter paths, maps identical font bytes to a shared destination, and rewrites references before writing the collection.", zh: "引擎按卷区分章节路径，把字节相同的字体映射到同一个位置，再重写引用并保存合集。" },
              output: { en: "A new EPUB plus its merge record", zh: "新 EPUB 与合并记录" },
            },
            {
              id: "restore",
              label: { en: "Split", zh: "拆回分卷" },
              title: { en: "Follow the mapping back to each volume", zh: "沿着映射还原每一卷" },
              body: { en: "The split engine uses the stored mapping to copy the font into each output and point each reconstructed chapter to its local resource path.", zh: "拆分引擎按已保存的映射，把共用字体放回每个输出文件，并让重建的章节重新指向本卷资源。" },
              output: { en: "Two independently readable EPUBs", zh: "两本可独立阅读的 EPUB" },
            },
          ],
          title: { en: "Chapter paths in the original, merged and restored books", zh: "原卷、合订本与还原分卷的章节路径" },
        },
      ],
    },
    {
      id: "implementation",
      label: { en: "Reversible paths", zh: "可逆的路径" },
      title: { en: "The merge record inside the EPUB", zh: "EPUB 内的合并记录" },
      blocks: [
        {
          paragraphs: [
            { en: "Both volumes can contain a file named chapters/01.xhtml. Copying the two files into the same directory would overwrite a chapter. The merge engine assigns each volume a directory and records the destination of each resource. Stylesheets need the same treatment as chapter links. A reader can open every chapter in an EPUB that has silently lost its font because a CSS reference still points at the old directory.", zh: "两卷书里都可能有 chapters/01.xhtml，直接放进同一目录就会覆盖其中一章。合并引擎给每卷分配目录，并记录每项资源在合集中的位置。样式表也有相对路径：即使目录里的每一章都能打开，一条仍然指向旧位置的 CSS 引用就可能让整本书用上阅读器的默认字体。" },
          ],
        },
        {
          figure: "merge-record",
        },
        {
          title: { en: "One shared asset, two local references", zh: "一份共享资源与两条本地引用" },
          figure: "epub-path-roundtrip",
          paragraphs: [
            { en: "When two volumes contain identical font bytes with the same media type, one copy remains in the collection. The second volume’s mapping points to the first copy. A stylesheet under v2/ may now refer to a font under v1/. The rewriter resolves the old URL relative to the source stylesheet, looks up the stored font and computes its path relative to the relocated stylesheet. It preserves the original query string and fragment.", zh: "两卷使用的字体字节和媒体类型完全相同时，合集只保留一份字体，第二卷的映射指向已有文件。这样一来，v2/ 下的样式表可能需要引用 v1/ 下的字体。改写器按旧样式表的位置解析原 URL，用映射找到字体的新地址，并按新样式表的位置计算相对路径。原有查询参数和片段标识随链接保留。" },
            { en: "The rewriter recognizes link attributes in XHTML and SVG and URL tokens and imports in CSS. A filename in a comment or a quoted passage stays untouched. External links and data URLs pass through without a download. Assembly also checks local targets when the collection has no duplicate resources. A stylesheet missing from the ZIP is reported during the merge.", zh: "改写器在 XHTML 和 SVG 中识别链接属性，在 CSS 中识别 URL 和导入语句。注释和引文里碰巧同名的文件保留原文，外链与 data URL 原样保留。即使合集没有重复资源，引擎也会核对本地引用。如果样式表在 ZIP 中缺失，合并时就会报错。" },
          ],
        },
      ],
    },
    {
      id: "architecture",
      label: { en: "Local processing", zh: "本地处理" },
      title: { en: "The browser worker and the shared EPUB format", zh: "浏览器工作线程与跨实现的书籍格式" },
      blocks: [
        {
          paragraphs: [
            { en: "The browser and Node share a TypeScript engine for inspecting, merging and splitting books. A separate Python implementation reads and writes the same merge record. The record travels inside the book, which allows an archive created in the browser to be split later from the command line.", zh: "浏览器和 Node 共用一套 TypeScript 引擎处理检查、合并和拆分。独立的 Python 实现读写同一种合并记录。记录随书保存，所以在浏览器中合出的 EPUB，日后也能在命令行里拆回分卷。" },
          ],
        },
        {
          figure: "architecture",
        },
        {
          title: { en: "Book metadata, previews and output files", zh: "书籍元数据、目录预览和输出文件" },
          figure: "epub-worker-handoff",
          paragraphs: [
            { en: "Selecting an EPUB gives the browser a File. The analysis pass produces a smaller record with the package metadata, reading order and resolved navigation. The preview uses that record when a volume moves. Only export needs the writer to assemble a ZIP and return a Blob. Inspect and Split can take that Blob as a File in the same browser session, without another file selection or compression pass.", zh: "选中的 EPUB 以 File 对象保存在浏览器里。解析产生一份较小的记录，包含书籍信息、阅读顺序和已解析的目录链接。拖动分卷时，预览只需更新这份记录。导出时，写入器才组装 ZIP 并返回 Blob。「检查」与「拆分」可以直接把它当作输入文件，因此无需重复选书或压缩。" },
            { en: "Each mode has its own files, results and errors. An in-flight job keeps the identity of the mode that started it. Changing a merge setting clears that mode’s downloadable result because it belongs to the previous inputs. Switching modes keeps the result. Cancel terminates the worker and invalidates the pending request. The next operation uses a fresh worker, and a late message from the cancelled job cannot repopulate the old result.", zh: "三个工具分别保存自己的文件、结果和错误。运行中的请求始终带着发起它的工具标识。调整合并设置会清掉当前下载，因为那是按旧设置生成的文件；单纯切到别的工具则保留结果。取消处理会结束 Worker，并作废等待中的请求，下一次操作启动新的 Worker。这样就算旧任务的消息迟到，也不会把过时的结果重新显示出来。" },
          ],
        },
        {
          title: { en: "Reading order and relative references", zh: "阅读顺序与相对引用" },
          paragraphs: [
            { en: "The path in container.xml locates the OPF package. Its manifest lists resources and its spine specifies reading order. EPUB 2 NCX and EPUB 3 navigation documents can live outside the OPF directory. Each link is relative to the file containing it. Links are URIs, while ZIP member names are literal paths. The resolver decodes a URI once for lookup and encodes it again when writing a link, preserving the query and fragment.", zh: "container.xml 记着 OPF 包文档的位置。OPF 的 manifest 列出资源，spine 标明阅读顺序。EPUB 2 的 NCX 和 EPUB 3 的导航文档都可能放在 OPF 目录以外，每条引用都以所在文件为基准。文档里的链接是 URI，ZIP 内则按实际路径查找文件。解析器在查找时解码一次，写回链接时重新编码，并保留查询参数和片段标识。" },
            { en: "For example, a link in an EPUB can encode a space as %20 even though the ZIP member name contains a literal space. The engine decodes once when looking up the member and re-encodes the path when writing a link. The original OPF path stored in the merge record is already a literal archive path. Decoding that value again would change the member name in some books.", zh: "例如，链接里可能用 %20 表示空格，ZIP 成员名称里却是字面上的空格。引擎查找成员时解码一次，写出链接时再编码。合并记录里的原 OPF 路径已经是 ZIP 中的字面路径，如果读到后再解码一次，某些书的成员名称反而会被改掉。" },
          ],
        },
      ],
    },
    {
      id: "decisions",
      label: { en: "Format limits", zh: "格式边界" },
      title: { en: "Reconstruction limits and memory costs", zh: "分卷恢复的范围与内存开销" },
      blocks: [
        {
          title: { en: "Memory use during local processing", zh: "本地处理的内存开销" },
          paragraphs: [
            { en: "The browser loads sources one at a time and inflates individual members as needed. The writer retains output chunks. That reduces the decoded working set while still keeping the current compressed input and the eventual downloads in memory. Very large collections are subject to browser memory limits. The architecture notes describe a compressed-entry pass-through prototype that was slower on the tested image workload and would have required a second path for the synchronous API. The shipped browser and Node tools keep one ZIP engine and one reference planner.", zh: "浏览器逐卷加载，按需解压单个成员，写入器保留输出分块。这样减少了同时存在的解压内容，但当前卷的压缩数据和最终下载结果仍需要内存，超大合集仍受浏览器容量限制。仓库还记录过直接复用压缩条目的原型。它在所测图像负载上耗时更高，还要为原有同步 API 另维护一条处理路径，因此发布版继续让浏览器和 Node 共用一个 ZIP 引擎和一套引用规划。" },
          ],
        },
        {
          title: { en: "Invalid inputs and unsupported books", zh: "输入损坏与格式限制" },
          paragraphs: [
            { en: "A manifest can list a resource that is absent from the ZIP. Malformed XML can prevent the reader from locating the OPF or interpreting its spine. Both conditions stop the operation with an error before the workspace offers a download. A supported reflowable book can still reference an unsupported packaging feature such as media overlays. This is a compatibility boundary even when the ZIP itself is readable: dropping an overlay would change synchronized narration, and treating a fixed-layout title as ordinary reflowable text would change the presentation.", zh: "有些文件能解压，但清单指向的资源根本不在 ZIP 里；也可能因为 XML 损坏，读不到 OPF 或无法解释 spine。这两类错误会中止处理，工作台不会提供成品。还存在 ZIP 结构有效、书籍特性超出支持范围的输入，例如媒体叠加或固定版式。忽略媒体叠加会丢掉同步朗读，按普通可重排内容处理固定版式也会改变原来的呈现，因此这些书需要在预检或处理时明确报出限制。" },
            { en: "An ordinary EPUB without a merge record still opens in Inspect, where its metadata, navigation and resources are available. Split uses the recorded volume boundaries. Two publishers’ divisions can produce the same combined navigation, so the table of contents on its own does not identify the original files.", zh: "没有合并记录的普通 EPUB 也能在「检查」里打开，查看元数据、目录和资源。「拆分」依赖合并时记下的卷界。相同的合集目录可能来自几种不同的原始分卷，单凭章名和顺序无法确定原卷文件。" },
          ],
        },
      ],
    },
    {
      id: "verification",
      label: { en: "Round-trip checks", zh: "往返验证" },
      title: { en: "Round-trip tests on restored volumes", zh: "还原分卷的往返测试" },
      blocks: [
        {
          title: { en: "Chapter links, fonts and navigation", zh: "章节链接、字体和导航" },
          paragraphs: [
            { en: "The resource fixtures check the relative URL emitted in the merged XHTML and CSS, reopen a reconstructed volume and check those links again. The font fixture verifies that both sources can recover the font bytes and that SVGs with local references still have distinct entries. Other fixtures exercise EPUB 2 NCX, nested EPUB 3 navigation, filenames with spaces, query and fragment preservation, and old v1 records without the optional package metadata.", zh: "资源测试先检查合并后 XHTML 和 CSS 写出的具体相对链接，再打开重建的分卷，核对链接是否恢复。字体用例会比对恢复后的字体字节，并检查含有本地引用的 SVG 仍然分别保存。其余样本覆盖 EPUB 2 的 NCX、嵌套的 EPUB 3 目录、带空格的文件名、查询参数和片段，以及缺少可选包元数据的旧版 v1 合并记录。" },
            { en: "EPUBCheck validates the container and package documents in both the combined and split files. Separate round trips merge with TypeScript and split with Python, then reverse the two implementations. Browser tests exercise cancellation, stale download URLs and offline worker operation.", zh: "合订本和拆出的分卷都经过 EPUBCheck 检查，覆盖容器和包文档。跨实现测试分别用 TypeScript 合并、Python 拆分，以及 Python 合并、TypeScript 拆分。浏览器测试另外覆盖取消操作、过期下载地址和离线工作线程。" },
          ],
        },
        {
          checks: [
            {
              title: { en: "A pooled resource still resolves after splitting", zh: "资源合并去重后，拆开仍能正确引用" },
              body: { en: "The resource tests merge books with shared binaries and nested CSS references. They read the merged files, split the collection, then resolve the restored references again.", zh: "资源测试用包含共用二进制资源和嵌套 CSS 引用的电子书执行合并，检查合集中的文件，再拆分并重新解析恢复后的引用。" },
            },
            {
              title: { en: "Missing resources and unsupported formats", zh: "缺失资源与不支持的版式" },
              body: { en: "Compatibility tests exercise missing resources, fixed-layout books and media overlays. A merge record is required for volume reconstruction.", zh: "兼容性测试包含缺失资源、固定版式和媒体叠加包。重建分卷时，引擎要求合集包含合并记录。" },
            },
          ],
        },
        {
          figure: "epub-docs",
        },
      ],
    },
  ],
  originmark: [
    {
      id: "design",
      label: { en: "Motivation", zh: "开发缘起" },
      title: { en: "Verifying an image after export", zh: "发布文件的水印与签名" },
      blocks: [
        {
          paragraphs: [
            { en: "A generator saves the prompt, seed and image. A watermark encoder modifies the pixels. Signing can change the exported file again. A publisher who wants to register the result needs the bytes that a recipient will actually download, together with the checks that ran on those bytes. OriginMark keeps the generator output, the signed file and the verification report in the same project.", zh: "生成器保存提示词、种子和图像；水印编码器会修改像素，签名又会改变导出文件。发布者要登记的是收件人实际下载的版本，以及针对这份文件做过的检查。OriginMark 在同一项目里保留生成原件、签名文件和核验报告，日后收到一张图时还能查回相应记录。" },
          ],
        },
      ],
    },
    {
      id: "preview",
      label: { en: "A release in Studio", zh: "工作台中的一次发布" },
      title: { en: "A release in Studio", zh: "工作台中的一次发布" },
      blocks: [
        {
          figure: "gallery",
        },
        {
          paragraphs: [
            { en: "Protect and Verify accept the current canvas image directly. The image stays in place as the controls change. The corresponding Activity entry identifies both the file and the operation that produced it.", zh: "保护和验证都可以直接使用画布中的文件。切换操作时图像保留在原处，侧边显示相应控件。Activity 中的运行条目同时记录文件和生成它的操作。" },
            { en: "Verify has separate entries for the watermark, signature integrity and issuer trust. When a detector is still running or lacks a matching calibration, the interface retains the other results and shows the unresolved check on its own.", zh: "验证页为水印检测、签名完整性和签发者信任分别保留一项结果。某个检测器还在运行或缺少匹配的校准时，页面保留其他已获得的证据，并单独显示尚未确定的项目。" },
          ],
        },
        {
          steps: [
            {
              id: "generate",
              label: { en: "Generate", zh: "生成" },
              title: { en: "Produce a comparable pair", zh: "生成可直接比较的一对图像" },
              body: { en: "TIDE runs with the same prompt and seed to produce a clean reference and a marked image. Studio can compare both before either output is used in another operation.", zh: "TIDE 使用相同的提示词和随机种子生成无水印参考图与带水印图。工作台先展示这组对照，产物随后可以进入其他操作。" },
              output: { en: "Reference and marked image files", zh: "无水印与带水印图像文件" },
            },
            {
              id: "protect",
              label: { en: "Protect", zh: "保护" },
              title: { en: "Check the file that will actually be published", zh: "核对真正要发布的输出文件" },
              body: { en: "The worker embeds a watermark, checks the serialized image and attaches the content credential. The final file goes through another check before its publication record is committed.", zh: "处理进程写入水印，检查序列化后的图像，再附加内容凭证。最终文件会再经过检查，确认后才登记发布记录。" },
              output: { en: "Protected file and its publication record", zh: "受保护文件及对应发布记录" },
            },
            {
              id: "verify",
              label: { en: "Verify", zh: "验证" },
              title: { en: "Read each evidence channel independently", zh: "分别核对每一路证据" },
              body: { en: "A verifier checks the supplied image for watermark signals and reads any signed content credential. A report keeps the individual findings visible, including cases where a check cannot reach a result.", zh: "验证工具检查输入图像里的水印信号，并读取存在的签名内容凭证。报告分别保留各路结果，包括某项检查暂时无法判断的情况。" },
              output: { en: "Evidence and verification report", zh: "独立证据与验证报告" },
            },
          ],
          title: { en: "Generating a pair, protecting a file and checking the evidence", zh: "生成对照图、保护文件和核对证据" },
        },
      ],
    },
    {
      id: "implementation",
      label: { en: "Release identity", zh: "发布身份" },
      title: { en: "Release records and file identity", zh: "发布记录与文件身份" },
      blocks: [
        {
          paragraphs: [
            { en: "Every release has an identifier, a hash of its downloadable file and the evidence supporting publication. The encoder, signer and download service can each produce a different representation of the same picture. A content hash links a release to the particular byte sequence that passed verification.", zh: "每条发布记录保存编号、下载文件的哈希，以及准予发布的核验结果。编码、签名和下载环节都可能产生视觉相同但字节不同的图像。登记内容哈希后，就能确定究竟哪一份文件通过了检查。" },
          ],
        },
        {
          title: { en: "The same file can participate in several operations", zh: "同一份文件可以参与多次操作" },
          figure: "originmark-teapot-report",
          paragraphs: [
            { en: "A generated teapot in the Library is an Artifact. Its record gives it a role, byte hash, MIME type, dimensions and originating Run. When it becomes an input to Protect, the service can materialize or reuse an Asset for those bytes. The new Run refers to that input and records the selected engine and policy. Its eventual protected file and report get their own Artifact records. This is the relationship Activity follows when a user opens a file and traces it back to the operation that produced it.", zh: "素材库里刚生成的茶壶是一条 Artifact，记录文件用途、字节哈希、媒体类型、尺寸及来源 Run。将它送入保护流程时，服务会为同一份文件建立或复用对应的输入 Asset。新的 Run 引用该输入，并保存所选引擎和策略。保护后生成的文件与报告再各建一条 Artifact。用户从素材库打开文件时，运行记录正是沿这些关联找回当时的操作。" },
            { en: "An image in the library can have a thumbnail, a source file and a signed download. They may look alike even when their bytes differ. Verify takes the file actually submitted and searches the current project for a published record matching its recovered token. The report retains that input snapshot alongside the verification findings.", zh: "一张图在素材库里可以同时有缩略图、原件和签名下载件。它们看起来相似，字节却可能不同。验证以实际提交的文件为输入，按读回的令牌在当前项目中查找对应的发布记录，并把当次输入快照和检验结果一起保存。" },
          ],
        },
        {
          title: { en: "Watermark readback after signing", zh: "签名文件的水印回读" },
          paragraphs: [
            { en: "For a signed release, the worker normalizes the input and embeds the expected payload in a candidate PNG. It decodes those PNG bytes to check the watermark and applies the configured quality threshold. Adding the C2PA credential produces a second file. The worker validates its signature, compares the pixels before and after signing and reads the expected payload from the signed file. The release record refers to that second file.", zh: "签发时，工作进程对输入进行规范化，将预期载荷写入候选 PNG，并从生成的 PNG 字节中读回水印、检查图像质量。附加 C2PA 凭证后会得到另一份文件。进程在签名件上校验签名、比对签名前后的像素，并再次读回预期载荷。发布记录引用的正是这份签名件。" },
            { en: "The worker uploads the final file under its content hash, locks the job and checks its state, claim version and lease. The release, output artifact and publication event are registered in the same database transaction. If the worker crashes after upload but before commit, an unreferenced object may remain in storage. The release does not appear in Studio until the transaction commits.", zh: "最终文件按内容哈希写入对象存储。进程锁定任务，核对运行状态、领取版本和租约，并在同一事务中写入发布记录、输出产物和发布事件。如果进程在上传后、提交前崩溃，存储里可能留下未被引用的对象。事务成功提交后，Studio 才会显示正式发布。" },
          ],
        },
        {
          title: { en: "Batch requests retain the outcome of each image", zh: "批量发布保留每张图自己的结果" },
          paragraphs: [
            { en: "The directory demo repeats the single-image path for multiple inputs. A batch groups the jobs and provides an aggregate status, while each item has its own attempts and output. An item that fails the watermark or quality check can be retried without asking the user to regenerate successful outputs. A batch can therefore finish with usable released files and a list of failed items at the same time.", zh: "目录批量示例把单张图片的流程用于一组输入。Batch 聚合任务并给出总体进度，每个成员仍有自己的尝试记录与输出。某张图在水印回读或质量检查时失败，可以单独重试，其他已发布文件仍可下载。批次结束时可以同时交付成功的文件，并列出失败项，而不必让整组结果一起作废。" },
            { en: "A JSON or CSV batch manifest lists each item’s status and final file hash. An importer can match a download against its release record using those fields. Repeating the directory submission in the recorded test reused the existing batch identities. Individual jobs still use their own leases and publication transactions.", zh: "批次的 JSON 或 CSV 清单逐项列出状态和最终文件哈希。上游导入时据此核对下载件与发布记录。目录验收中，重复提交相同输入复用了已有批次标识；批次内的计算任务仍按各自的租约和发布事务执行。" },
          ],
        },
      ],
    },
    {
      id: "architecture",
      label: { en: "Model execution", zh: "模型执行" },
      title: { en: "The job queue and model workers", zh: "任务队列与模型进程" },
      blocks: [
        {
          paragraphs: [
            { en: "A generation or detection job often runs longer than the browser connection that submitted it. Studio opens a persistent run when a user submits the image. Reopening Activity later retrieves its progress and output even if the original tab was closed.", zh: "生成和检测任务经常比发起它的浏览器连接持续更久。提交图像时，Studio 就建立持久化的运行记录。关闭原标签页后，仍能在 Activity 中重新查看同一任务的进度和产物。" },
            { en: "The API saves a Run with an immutable input snapshot and links it to a release, a verification case or a laboratory run. PostgreSQL holds the job and its dispatch record. RabbitMQ wakes the worker, which claims an execution lease and calls an engine adapter. Files are uploaded to object storage before a fenced database transaction makes their artifact records visible. This order leaves a failed upload or an expired worker unable to advertise a finished release.", zh: "API 先保存本次操作的输入快照，将运行关联到发布、验证案例或实验。PostgreSQL 保存任务与待投递记录，RabbitMQ 通知工作进程。进程领取租约后才经适配器调用算法。结果文件先上传对象存储，再由核对租约的数据库事务登记为可见产物。上传中断或旧进程迟到，都不能凭一次模型返回就把文件标为已发布。" },
          ],
        },
        {
          figure: "architecture",
        },
        {
          title: { en: "Model adapters and runtime isolation", zh: "模型适配器与运行隔离" },
          paragraphs: [
            { en: "TrustMark runs in a resident CPU subprocess. Its process can be stopped when a call times out, while the worker keeps running. PixelSeal uses Ray Serve, which batches requests with compatible dimensions and operations on GPU replicas and maps the outputs back to their request IDs. TIDE keeps its pinned research environment and exchanges files with the worker through a versioned runner, preserving its generation and inversion profile.", zh: "TrustMark 运行在常驻 CPU 子进程里，调用超时时可以结束该进程，Worker 仍能继续服务。PixelSeal 交给 Ray Serve，在 GPU 副本上将尺寸和操作兼容的请求组成实际计算批次，再按请求编号对应输出。TIDE 保留独立的研究环境，通过有版本的文件接口交接输入与结果，保留其生成与反演配置。" },
            { en: "Adapters give the worker one interface for model inputs and outputs. The worker holds the lease, handles cancellation and checks the final file. A model runtime can restart or move to another service while the release rules stay with the worker.", zh: "模型的输入输出由适配器统一。Worker 负责续租、取消和最终文件的校验，模型的独立重启或迁移不影响发布规则。" },
          ],
        },
        {
          title: { en: "Recovery treats a lost worker and a cancelled job differently", zh: "Worker 掉线与主动取消走不同的恢复路径" },
          figure: "originmark-lease-recovery",
          paragraphs: [
            { en: "When a heartbeat lease expires, reconciliation advances the claim version and closes the old attempt. A job with a pending cancellation is marked cancelled. A running job with attempts left can return to the queue, while a job that has exhausted its attempt budget becomes failed. A GPU call may return after any of those transitions. The stale attempt can no longer commit results. This separates scheduling a retry from granting permission to publish.", zh: "某次心跳租约过期后，恢复逻辑会推进领取版本，并结清旧 Attempt。已请求取消的任务进入取消态；仍在运行且有剩余尝试次数的任务可以重新排队；耗尽次数的任务进入失败态。已经发给 GPU 的计算可能在这些状态变化之后才返回，旧尝试也无法再提交结果。是否安排一次重试和这次计算是否仍有资格发布，由此可以分别处理。" },
            { en: "Verify has a related but narrower recovery unit. A case stores separate detector steps. C2PA can finish first, followed later by a CPU or GPU result. If one detector fails, the report still shows the available findings and marks the unresolved check. Retrying that step leaves earlier credential results in place. A valid signature from an untrusted issuer also remains valid integrity evidence with a separate trust result.", zh: "验证的恢复粒度更细。每个案例分别保存各路检测步骤，C2PA 可能先完成，CPU 或 GPU 的检测随后返回。一路失败时，报告仍呈现已获得的结果，并标明未完成的检查。只需重试失败的步骤，不用丢掉前面已经取得的凭证结果。签名完整但签发者不在信任范围内时，也分别记录完整性成立和信任未通过。" },
          ],
        },
        {
          figure: "tide-link",
        },
      ],
    },
    {
      id: "decisions",
      label: { en: "Evidence channels", zh: "证据通道" },
      title: { en: "Watermark detection, credential integrity and issuer trust", zh: "水印检出、凭证完整性与签发者信任" },
      blocks: [
        {
          title: { en: "Independent watermark and credential results", zh: "独立的水印与凭证结果" },
          paragraphs: [
            { en: "A generated file can return a TIDE watermark finding with no C2PA credential present. TIDE needs a matching calibration profile to report a detection or non-detection. Payload-based engines can also recover a token and look up the corresponding release. C2PA records signature integrity and issuer trust independently. The report preserves the status of each check, including missing or inconclusive evidence. A detected signal supports a watermark finding. Claims about authorship or ownership depend on separate evidence.", zh: "生成图可能检出 TIDE 水印，但没有附带 C2PA 凭证。TIDE 只有在匹配校准配置时才给出检出或未检出的结论。载荷型引擎还能读回令牌并查找关联的发布记录。C2PA 则独立核对签名完整性和签发者信任。报告逐项保留结果，包括缺少证据和无法判断的情况。检出的信号支持水印结论，作者身份或所有权需要各自的证据。" },
            { en: "A verification step is stored per case and detector. On completion, a worker updates its own step and recomputes the case state while holding the parent record lock. A CPU detector and a GPU detector can therefore finish in either order without losing the earlier result. If the credential check succeeds and one detector times out, the case exposes its available evidence as a partial result. Retrying reopens the affected detector step.", zh: "每个验证案例为每种检测器保留独立步骤。某一路结束时，Worker 在锁住父记录的事务里更新该步骤，并重新计算整案状态。CPU 与 GPU 检测器可以按任意顺序返回，先返回的结果也不会被后来的覆盖。如果凭证检查已完成而某个检测器超时，案例仍会展示已有的部分证据。重试只重新打开受影响的检测步骤。" },
          ],
        },
        {
          paragraphs: [
            { en: "These fields can disagree on the same file. A generated PNG may have a detectable TIDE signal and no signed credential. A signed file may pass integrity checks while its issuer is absent from the configured trust list. The verification case stores the file, the detector profile and the credential results together for a later review.", zh: "同一文件可以得到几项不同的结论。生成的 PNG 可能检出 TIDE 水印，却没有签名凭证。另一份文件的签名可以完整有效，签发者却不在当前信任列表中。验证案例一并保存文件、检测配置和凭证结果，供以后复查。" },
          ],
        },
      ],
    },
    {
      id: "verification",
      label: { en: "Calibration & release tests", zh: "校准与签发试验" },
      title: { en: "Release evidence and its limits", zh: "发布证据与校准范围" },
      blocks: [
        {
          title: { en: "Runner parity and detector calibration", zh: "运行器一致性与检测器校准" },
          paragraphs: [
            { en: "The integration tests ran the original TIDE script, its wrapper and the product runner with the same inputs and pinned settings. The recorded fixtures produced identical PNG hashes and raw detector scores. Estimating false positives required a different dataset: unmarked images that the runner had not used to set its threshold.", zh: "接入 TIDE 时，原研究脚本、适配层和产品运行器使用相同输入和固定配置。记录中的样本产生了完全一致的 PNG 哈希和原始检测分数。误报率另用负样本测量，测试图像与选定阈值所用图像分开统计。" },
            { en: "A calibration record specifies the sampler, inversion settings and watermark configuration associated with its threshold. When a run uses another profile, the report still retains its raw score. The detection field stays inconclusive until the matching profile has a calibration record.", zh: "校准记录将阈值绑定到采样器、反演设置和水印配置。换用另一组设置时，报告仍保留原始分数。对应配置没有校准记录，检测结论就保留为未定。" },
            { en: "The isolated TIDE evaluation set its threshold on 5,000 negative images and froze it for the remaining tests. All 1,000 marked PNGs were detected. At the 1% false-positive target, 12 of 2,500 generated JPEGs, 52 of 2,500 photographs and 24 of 1,000 additional PNG controls crossed the threshold. These rates describe the unedited cohorts. Some PNG controls share image content with the JPEG cohort.", zh: "独立 TIDE 验收用 5,000 张负样本确定阈值，其余测试均使用这个固定值。1,000 张带水印 PNG 全部检出。误报目标为 1%，实测有 12/2,500 张生成 JPEG、52/2,500 张照片和 24/1,000 张额外 PNG 对照超过阈值。各组均为未经编辑的图像，部分 PNG 对照与 JPEG 组共享图像内容。" },
          ],
        },
        {
          figure: "calibration",
        },
        {
          title: { en: "Browser, batch and fault-injection evidence", zh: "浏览器、批量与故障注入的验收记录" },
          paragraphs: [
            { en: "The recorded browser run used the marked TIDE output for a verification, returned to the same artifact in Library, ran TrustMark Protect and checked the downloaded signed PNG. The recovered payload matched the registered release, and the verification report could be exported as PDF. A separate directory test published six images in two batches, downloaded the six outputs and checked their SHA-256 values. Repeating that submission reused the saved batch identities.", zh: "浏览器验收先验证 TIDE 生成的标记图，再从素材库复用同一产物执行 TrustMark 保护，最后核对下载的签名 PNG。回读水印载荷能匹配已登记发布，验证报告也可导出为 PDF。另一次目录验收把六张图分成两批发布，下载六份结果并逐一比对 SHA-256。重复提交时，保存的批次身份保持一致。" },
            { en: "The reliability checks separately stopped a TIDE runner while it was handling a detection. The interrupted task failed, the worker stayed available, and the next detection succeeded. Earlier runtime checks on a dedicated demo also exercised duplicate delivery, active cancellation and a result-write failure after computation. These cases check recovery and publication behavior on those environments. Model robustness under arbitrary edits and production-wide performance require their own workload and evidence.", zh: "可靠性验收还在一次检测进行中终止 TIDE runner。被打断的任务记录为失败，Worker 继续存活，后续检测成功。较早一轮独立演示环境的运行时验收覆盖了重复投递、运行中取消，以及计算完成后数据库结果写入失败。它们检验的是这些环境下的任务恢复与发布行为。任意图像编辑后的水印鲁棒性和线上容量需要各自的负载与测量。" },
          ],
        },
        {
          checks: [
            {
              title: { en: "Payload match on the signed download", zh: "签名下载件的载荷匹配" },
              body: { en: "The TrustMark protection check validated the signed file and matched its recovered payload to the registered release. The Studio walkthrough carried the generated artifact through to that check and exported the verification report as PDF.", zh: "TrustMark 保护验收核对了签名文件，并将恢复的水印载荷与已登记的发布记录匹配。工作台演示沿用前面生成的产物完成检查，并导出验证报告。" },
            },
            {
              title: { en: "Detector recovery after an interrupted call", zh: "检测进程中断后的恢复" },
              body: { en: "Reliability checks interrupted the TIDE runner and observed the current job fail. The worker remained available and the subsequent detection ran successfully.", zh: "可靠性检查主动中断 TIDE 计算进程，当前任务记录为失败，处理进程仍然可用，随后一次检测成功完成。" },
            },
          ],
        },
      ],
    },
  ],
  "personal-agent": [
    {
      id: "design",
      label: { en: "Motivation", zh: "开发缘起" },
      title: { en: "Scheduled tasks in a personal workspace", zh: "个人工作台里的定时任务" },
      blocks: [
        {
          paragraphs: [
            { en: "“Send me a maintenance brief every morning” specifies a recurring job as well as a request for information. The assistant needs a local time, a source and a destination for the finished report. Personal Agent stores those choices in the member’s workspace. The scheduler can run while the browser is closed, and the member can reopen yesterday’s brief on the web or receive the next one in a bound chat.", zh: "“每天早上给我一份维护简报”需要明确几点执行、查哪份资料，以及把报告发到哪里。Personal Agent 将这些设置保存在成员工作台里。浏览器关闭期间，调度器照常执行。成员可以在网页上翻看昨天的简报，也可以在绑定的聊天渠道里收到今天的报告。" },
          ],
        },
      ],
    },
    {
      id: "preview",
      label: { en: "Member workspace", zh: "成员工作台" },
      title: { en: "Tasks, results and the Studio editor", zh: "成员任务、运行结果和 Studio 编辑器" },
      blocks: [
        {
          figure: "gallery",
        },
        {
          paragraphs: [
            { en: "A request in Web Chat or a bound private chat opens a task draft. The member can edit its local time, recurrence and destination before approving it. Today lists the next occurrence alongside pending approvals. Results keeps the finished report, sources and attachments. Its run record shows whether the delivery channel has acknowledged receipt, including when the report is already available on the web and the external receipt is still pending.", zh: "在网页对话或已绑定的私聊中交代任务后，工作台会生成草稿，成员可以修改当地时间、周期和收件渠道。批准后，「今日」列出下一次排期和待处理审批。「成果」保留报告、引用和附件，并关联运行记录。有时报告已经能在网页打开，聊天渠道的回执还在等待确认，两种状态都能查到。" },
            { en: "Studio is the authoring side of the same product. A developer gives an agent a bounded set of tools, wires steps into a workflow, tests an input, then publishes a version. A member with access can invoke that application from their workspace. In Studio, the developer can reopen the resulting run, inspect a particular step and turn the original input into an evaluation case. Operate gives administrators a separate view of queues, channels and model usage.", zh: "Studio 面向搭建助手的人。开发者给 Agent 配置工具，把读取资料、计算、审批等步骤连成工作流，用示例输入调试，再发布一个版本。获得授权的成员就能在个人工作台调用它。一次回答有问题，开发者可以回到 Studio，定位当次运行的具体步骤，把原始输入固定成下次发布前的评测案例。管理员则从 Operate 查看队列、渠道和模型用量。" },
          ],
        },
        {
          figure: "member-evidence",
        },
      ],
    },
    {
      id: "architecture",
      label: { en: "Execution paths", zh: "执行路径" },
      title: { en: "Personal tasks and published applications", zh: "个人任务与已发布应用" },
      blocks: [
        {
          paragraphs: [
            { en: "Web, QQ and WeChat adapters identify the member and normalize incoming messages. Personal tasks enter through the member workspace. Published applications enter through Studio, the SDK or a trigger. Both use the account’s model grants and a SQLite store, but the project worker reads inputs and knowledge scoped to its project. Joining a project leaves the member’s private conversation history outside the application context.", zh: "网页、QQ 与微信的适配器识别成员，把各自的消息转换成平台可处理的输入。个人任务从工作台进入，项目应用则可由 Studio、SDK 或定时触发启动。两条路径复用账号、模型授权和 SQLite 存储。项目工作进程只读取当前项目允许使用的输入和知识；成员加入项目后，个人对话和私人记忆仍留在个人空间。" },
          ],
        },
        {
          figure: "architecture",
        },
        {
          title: { en: "Run identity for a recurring task", zh: "周期任务的运行关联" },
          paragraphs: [
            { en: "The studio saves a published definition as a snapshot. Each workflow run pins that version and the input supplied by the caller. A worker claims a ready step with a lease and commits its output to SQLite. A later worker can continue at the next eligible step, even if the browser and original worker have both gone away. Before writing to an external system, the platform freezes the proposed operation and its parameters for the approving member.", zh: "Studio 把发布的定义保存为快照。每次运行都锁定版本和调用者交来的输入。工作进程凭租约领取一个可执行节点，完成后把输出提交到 SQLite。即使浏览器关闭、原进程退出，后续进程也能从下一个满足条件的节点接续。涉及外部写入时，平台会先冻结这次操作及其参数，交给成员批准。" },
            { en: "A recurring personal task can also invoke a published application. At each due time the scheduler stores the link between the occurrence and its child application run. After a restart, that link lets the parent wait for the existing child and route its result back to the member. Starting the application again would create two executions for one morning’s brief.", zh: "周期任务也可以调用已发布的应用。执行时间到达时，调度器记下本次排期与应用子运行之间的关联。服务重启后，父任务沿这条记录找到仍在进行的子运行，等它完成，再把成果送回成员。如果每次恢复都重新启动应用，同一份早报就可能执行两遍。" },
          ],
          figure: "agent-run-link",
        },
        {
          title: { en: "Channel delivery receipts", zh: "渠道投递回执" },
          paragraphs: [
            { en: "Project reports appear in the project inbox. Personal tasks can send results to the web inbox or a bound chat. On input, a channel adapter normalizes the message and checks its identity for duplicates. On output, the run records model completion, report creation and channel acknowledgement separately. A missing acknowledgement leaves delivery pending for reconciliation because the remote service may already have accepted the message.", zh: "项目报告写入项目收件箱，个人任务还可以选择网页收件箱或绑定的聊天渠道。接收消息时，适配器统一消息格式，按消息标识去重。投递结果时，运行记录分别保存模型结束、报告生成和渠道确认。若最后一次确认丢失，消息可能已经送达，系统会保留待核对状态。" },
          ],
          id: "agent-messages",
          figure: "agent-message-transport",
        },
      ],
    },
    {
      id: "implementation",
      label: { en: "Model & tools", zh: "模型与工具" },
      title: { en: "Model calls and workflow checkpoints", zh: "模型调用与工作流检查点" },
      blocks: [
        {
          paragraphs: [
            { en: "Evidence retrieval usually finishes within a worker’s turn. An external write can pause the same workflow until someone approves it, sometimes long after the worker exits. The engine commits each completed node to SQLite. A later worker reads the checkpoint and claims the next eligible node. Pi is invoked only for steps that specify a model turn.", zh: "读取资料可以在一次任务领取期间完成，外部写入却可能一直等到成员批准，那时原进程也许已经退出。引擎把每个已完成节点的结果提交到 SQLite，后续进程读取检查点，领取下一个满足执行条件的节点。只有配置了模型调用的步骤才交给 Pi。" },
          ],
        },
        {
          title: { en: "Pi and read-only tools", zh: "Pi 与只读工具" },
          paragraphs: [
            { en: "The platform can run Pi for a model turn. It gives the model scoped context and read tools, validates tool calls and returns their results to the same turn. The workflow engine owns the checkpoints and authorization for a business write. The I-204 inspection template, for example, selects the deterministic local evidence runtime. The recorded arithmetic, mock work order and restart exercise therefore remain reproducible without depending on a particular model response.", zh: "工作台可以通过 Pi 执行模型回合：装配本次可见的上下文与只读工具，校验调用参数，再把工具结果送回同一回合。步骤持久化和业务写入审批由外层工作流管理。I-204 模板选择了确定性的本地证据运行时，因此核算、模拟工单和恢复演练可以重复执行，无需等待某个模型再次给出相同回答。" },
          ],
          id: "agent-pi-runtime",
          figure: "agent-runtime-trace",
        },
        {
          paragraphs: [
            { en: "Publishing an application binds a deployment to a workflow or agent snapshot, the allowed models, tools and knowledge collections. A bound QQ or WeChat account can invoke an authorized application, then continue its conversation or retrieve the asynchronous result. A later deployment can point at a new snapshot while an older run still refers to its original definition. Revoking a member’s grant also removes access through their application key.", zh: "发布应用时，部署同时固定 Agent 或工作流快照，以及允许的模型、工具和知识集合。获准的成员可在绑定的 QQ 或微信私聊调用应用，之后接续会话，或取回异步结果。部署更新可以指向新快照，先前运行仍然指向原定义。撤销成员授权时，其个人应用密钥也失去访问能力。" },
            { en: "The distinction shows up in an application replay. A member asked for the P-17 maintenance record twice, using the same published definition. The first deployment could read the register and the manual. The owner then removed both resources from the deployment. The second run still completed, but its report had no source for an inspection interval. Because the earlier result keeps its deployment identity, a reviewer can account for the difference without attributing it to a change of model.", zh: "一次应用回放固定了助手版本和问题。成员两次查询 P-17 检修记录。第一次部署允许读取设备台账和手册；随后，项目所有者收回了这两项资源的使用权限。第二次运行依然完成，报告里却找不到可用来判断检修周期的依据。回看第一份报告时，其部署身份和检索记录仍在，这就能解释两次回答的差异。" },
          ],
          figure: "deployment-scopes",
        },
      ],
    },
    {
      id: "decisions",
      label: { en: "Watches & memory", zh: "订阅与记忆" },
      title: { en: "Source watches and conversation memory", zh: "订阅通知与对话记忆" },
      blocks: [
        {
          title: { en: "Immediate and scheduled notifications", zh: "即时通知与定时摘要" },
          figure: "agent-watch-replay",
          paragraphs: [
            { en: "The source-watch preview is part of the changes in PRs #14–17. A member chooses subscriptions, priority topics, quiet hours and a digest time. Hourly checks compare canonical URLs and fingerprints of titles and excerpts against a bounded snapshot. Unchanged items generate no notification. Priority matches can notify immediately, while ordinary changes queue for the digest. Pending items and the report are committed together. After a restart, another worker can deliver the saved items.", zh: "PR #14–17 的开发预览包含长期订阅。成员设置订阅来源、优先主题、免打扰时段和摘要时间。每小时采集保留一份有大小限制的快照，依据规范网址、标题和摘录指纹识别变化。未变更的条目不通知，命中优先主题的更新可以即时投递，其余进入摘要队列。待发条目和报告在同一事务中提交，重启后的工作进程可以接续投递。" },
            { en: "In the synthetic release replay, the 13:00 poll found two changes. A priority match went straight to the inbox and the other item stayed queued. The member lowered the topic priority before the 14:00 poll found another release, bringing the queue to two. At 18:00 there were no new items. The scheduled digest contained the two saved updates.", zh: "合成版本发布回放中，13:00 的采集发现两项变化，命中优先主题的一项立即进入收件箱，另一项留在待发队列。成员调低主题优先级后，14:00 的新版本也进入队列，此时共有两项待发。18:00 的采集没有新增内容，当天摘要收录了此前保存的两项更新。" },
            { en: "At 23:00 another item arrives during quiet hours. It remains pending until the following morning. At 08:00 the source fails altogether. Both checks are silent at the moment they run, but their recovery paths differ. The first has a saved item ready to deliver. The second has an outstanding fetch to retry. Treating a failed fetch as an empty snapshot would turn an outage into a misleading “no change” entry in the history.", zh: "夜里十一点还有一条更新，免打扰时段把它留到次日早晨再送。次日八点，上游请求失败，那一轮同样没有通知。翻开记录，两次沉默有不同的后续：前者已经拿到内容，只欠投递；后者连快照都没拿到，还得重新采集。把请求失败记成空快照，会让来源故障在历史里看起来像一切正常。" },
          ],
        },
        {
          title: { en: "Reusing a watch configuration", zh: "复用订阅配置" },
          paragraphs: [
            { en: "A delivered digest records the source endpoints, keywords, digest rules and quiet hours used for that run. The member can save those settings as a versioned recipe with a reference to the original run. Extraction skips runs with a partial source failure because some subscriptions were never checked.", zh: "已送达的摘要记录了当次使用的来源地址、关键词、摘要规则和免打扰时段。成员可以把这组设置保存为一个版本，并保留它与原运行的关联。若有来源采集失败，该运行就不参与提取，因为部分订阅没有完成检查。" },
            { en: "Reusing a recipe creates a new task with its own goal, schedule, destination and approval. The old task keeps its model choice and recipient. In the replay, a new task successfully delivered a second digest using the saved recipe. After the source endpoint changed, the next run stopped and recorded the address change pending approval of the revised plan.", zh: "复用订阅配置会创建独立任务，另行填写目标、排期和收件渠道并取得批准。上一任务的模型和收件人保留在原记录中。回放里，新任务使用保存的配置送达了第二份摘要。替换来源地址后，下一次执行暂停，记录中标明地址已变更，等待成员批准更新后的计划。" },
          ],
        },
        {
          title: { en: "Context selection in a long conversation", zh: "长对话里的上下文选择" },
          paragraphs: [
            { en: "In a replay about SQLite backups, the user asks for an earlier procedure at turn 24. Keeping only the most recent exchanges selects turns 22, 23 and 24. The procedure is in turn 3. The revised selector reserves two recent turns, ranks older eligible turns by words in the current request and reads confirmed memory for this member. It restores chronological order before building the prompt. The 4,000-byte budget accommodates both turn 3 and the current preference.", zh: "在一次有关 SQLite 备份的回放中，成员于第 24 轮询问早先定下的操作步骤。只保留最近记录时，入选的是第 22、23、24 轮，操作约定却写在第 3 轮。修改后的策略为最近两轮预留空间，按当前请求中的词语匹配较早记录，并读取该成员已确认的记忆。入选对话按时间顺序写入提示，第 3 轮和当前偏好都能放进 4,000 字节的预算。" },
            { en: "The replay also edits the saved preference to specify the weekly copy, then withdraws it. Each subsequent selection reads the current record. After withdrawal the private memory is absent even though the conversation still exists. The trace retains references to the entries actually selected. Those references make a missing preference diagnosable: it may have been withdrawn, excluded by the member boundary, or simply missed by lexical matching after the user paraphrased the request.", zh: "验收接着把已确认的备份偏好改成“使用每周副本”，随后撤回。每次准备下一轮输入时，系统都重读当前记录；撤回后，会话还在，私有记忆已退出选集。每轮留下实际入选的条目引用。排查一次遗漏时可以据此区分几种情况：用户撤回了偏好，当前会话无权读取，或者用户换了说法，词项匹配没有找回原句。群聊也不会因此读到成员的私人记忆。" },
            { en: "A separate CPU run used Pi and Qwen2.5-0.5B with a fixed seed. Sixteen unrelated turns separated a saved SQLite backup preference and the final request. In three repetitions, the old context omitted the requested time and used 1,125 tokens per run. The revised context recovered 23:15 UTC and used 728 tokens on each run. The inputs were identical across repetitions. Paraphrased requests and conflicting preferences were outside this test.", zh: "另一次 CPU 测试使用 Pi、Qwen2.5-0.5B 和固定随机种子。SQLite 备份偏好与最终请求之间隔了 16 轮无关对话。相同输入重复三次，旧上下文每次消耗 1,125 tokens，均未答出时间。新版每次消耗 728 tokens，三次都找回 23:15 UTC。这次测试没有更换请求措辞，也没有加入相互冲突的偏好。" },
          ],
          figure: "agent-context-selection",
        },
        {
          title: { en: "Source excerpts and optional interpretation", zh: "来源摘要与按需解读" },
          paragraphs: [
            { en: "Routine digests use the release title, source excerpt and canonical address. In one local-model trial the generated text paraphrased the member’s goal. Another output shortened a source URL. The collector now supplies canonical links directly. Model interpretation is optional, so the original source record can still be delivered after an inference failure.", zh: "常规摘要列出版本标题、原文摘录和规范网址。一次本地模型测试只生成了对订阅目标的复述，另一次输出截短了来源网址。现在由采集器直接提供规范链接，模型解读是可选步骤。推理失败时，原文摘录和完整链接仍可照常投递。" },
            { en: "Automatic interpretation is available for priority matches and reports spanning multiple sources. With fewer than 512 daily tokens remaining, the task delivers source excerpts directly. Below 1,024 it favors the configured fast model when interpretation is enabled. A recent failure temporarily excludes that model from automatic selection for the member. Explicit model choices stay pinned. External writes continue to require approval through the workflow engine.", zh: "自动解读适用于命中优先主题或涉及多个来源的报告。当天剩余额度低于 512 tokens 时直接投递原文摘录；低于 1,024 tokens 且需要解读时优先采用已配置的快速模型。近期调用失败的模型会暂时退出该成员的自动候选列表，手动指定的模型保持固定。外部写入仍由工作流执行审批。" },
          ],
        },
      ],
    },
    {
      id: "workflow-review",
      label: { en: "Recoverable writes", zh: "可恢复的写入" },
      title: { en: "Review and correction of an approved work order", zh: "已批准工单的复核与更正" },
      blocks: [
        {
          title: { en: "A corrected timestamp changes the finding", zh: "一处录入更正改变了巡检结论" },
          paragraphs: [
            { en: "The inspection template in the development preview uses a fictional handoff, I-204, to exercise the durable engine. The register shows a start at 08:10 UTC and an acknowledgement at 09:04. With 45 minutes allowed, the calculation records a nine-minute overrun. A reviewer later supplies 08:49 as the corrected acknowledgement. By then the first report has already led to an approved mock work order.", zh: "开发预览中的巡检模板用虚构的 I-204 交接走通这套引擎。登记表里的开始时间为 08:10 UTC，确认时间为 09:04；协议允许 45 分钟，因此初次核算超时 9 分钟。复核人后来拿出更正后的确认时间 08:49。此时第一份报告已经触发过一笔获批的模拟工单。" },
          ],
          figure: "agent-handoff-comparison",
        },
        {
          title: { en: "The contractual handoff limit", zh: "交接协议规定的时限" },
          paragraphs: [
            { en: "The inspection pack supplies two passages about the same equipment. One is a historical handoff that took 39 minutes. The other sets a 45-minute allowance for a standard I-204 handoff. Both are relevant search results and both contain a number. Only the agreement can supply the threshold. The read tool checks the record and category against the retrieved clause, requires a unique applicable limit and parses the UTC timestamps. Missing or ambiguous evidence stops the calculation.", zh: "模板里有两段容易混淆的文字。一段历史记录写着同一设备上次交接用了 39 分钟，另一段约定规定 I-204 的标准交接时限是 45 分钟。按设备检索，两段都相关，也都有数字。计算工具需要的是约定中的时限。它核对登记编号、类别和检索到的条款，找到唯一适用的时限后才解析 UTC 时间；缺少依据或出现歧义时就停下来。" },
            { en: "The corrected timestamps yield 39 minutes, also the value in the historical record. The calculation uses 08:49 minus 08:10. The report stores the timestamps, source lines and revision hashes so the calculation and the coincidentally identical historical observation remain distinguishable.", zh: "更正后的用时是 39 分钟，碰巧与历史记录相同。本次计算采用的字段是 08:49 和 08:10。报告保存原始时间戳、来源行和修订哈希，可以区分这次计算结果与上一次交接的实测值。" },
          ],
          id: "agent-workflow-handoff",
          figure: "agent-workflow-data",
        },
        {
          title: { en: "Review history and resubmission", zh: "复核记录与重新提交" },
          paragraphs: [
            { en: "A reviewer records a decision and a reason against the original artifact digest and the last review version. Submitting the same request again returns the existing version. Two reviewers starting from the same revision cannot silently overwrite one another. The original report keeps the reviewer’s reason for requesting a correction, even if nobody resubmits the task.", zh: "复核人把决定和理由提交到原稿摘要与上一复核版本上。同一请求重试时返回已保存的版本；两个人从同一旧版本编辑，后提交的人需要先处理版本冲突。即便后来没有人提交更正，原稿旁边也留着当时提出异议的理由。" },
            { en: "Resubmission pins the original workflow version and supplies the corrected input. Retrieval runs again against the current agreement. A new approval covers the revised work-order parameters and its receipt belongs to the new run. The original run retains its own inputs, approval and receipt.", zh: "重新提交时锁定原工作流版本，输入改用更正后的记录。检索重新读取当前生效的协议，更新后的工单参数单独发起审批，回执登记在本次运行。原运行的输入、审批与回执按原样保存。" },
          ],
          figure: "agent-report-evidence",
        },
      ],
    },
    {
      id: "verification",
      label: { en: "Measured outcomes", zh: "实测结果" },
      title: { en: "Measurements and replay results", zh: "性能测量与回放结果" },
      blocks: [
        {
          title: { en: "Response size and time to first text", zh: "响应体积与首段文字延迟" },
          paragraphs: [
            { en: "In five fresh browser contexts with a synthetic 20-turn chat and a fixed streaming provider, the earlier build returned 31,645 API bytes after a send. The integrated build returned 1,977 by sending just the new turn. Loading workspace features on demand also cut initial uncompressed JavaScript from 730,841 to 488,594 bytes. Median time to the first visible reply stayed close to 19 milliseconds on both builds. Most of the observed gain was in transfer volume.", zh: "在五个冷启动浏览器环境中，使用同一份 20 轮合成对话和固定流式服务。早期版本每发一条消息，API 回传 31,645 字节；集成版只回传本轮记录，降到 1,977 字节。工作台按需加载后，首屏未压缩 JavaScript 从 730,841 降至 488,594 字节。两版首段文字可见的中位时间都在 19 毫秒左右，这组数据里最明显的收益在传输量。" },
            { en: "The earlier client fetched the full conversation once more at the end of a send. The completion event now carries the new turn, which the browser appends to its local history. The removed request used to grow with every exchange. In this test the streaming provider had a fixed schedule, and the smaller API response changed the byte count much more than the time to first text.", zh: "旧客户端在一轮发送结束时还会取一次完整历史，对话越长，重复传输量越大。现在完成事件直接携带新增回合，浏览器追加到本地历史即可。测试使用按固定节奏输出的流式服务，因此响应体积的变化明显大于首段文字延迟的变化。" },
          ],
          figure: "agent-browser-measurements",
        },
        {
          title: { en: "Concurrent polling of six sources", zh: "六个来源的并发采集" },
          paragraphs: [
            { en: "The worker collects up to three independent read-only sources concurrently and returns their items in subscription order. Seven replays used six sources with a fixed 25-millisecond delay each. Median collection time was 160.7 milliseconds with sequential requests and 54.0 with three requests in flight. Both configurations issued six requests and returned six items. The fixed-delay replay did not simulate upstream rate limits.", zh: "工作进程最多同时读取三个相互独立的只读来源，返回结果按订阅顺序排列。七次回放均使用六个来源，每个来源固定延迟 25 毫秒。顺序采集的中位耗时为 160.7 毫秒，三路并发为 54.0 毫秒。两组都发出六次请求并取得六条记录，回放没有模拟上游限流。" },
          ],
          figure: "agent-collection-schedule",
        },
        {
          title: { en: "Database recovery between approvals", zh: "两次审批之间的数据库恢复" },
          paragraphs: [
            { en: "The replay uses an isolated SQLite database, fictional inspection records and a mock service desk. After the corrected run is created, a backup is restored to a new file. The replay checks integrity, foreign keys, links to the original and the behavior of a duplicate submission before approving the second write. A final attempt substitutes a clause for the wrong category. Its calculation fails and no third receipt appears. The two successful runs and that failed one test different properties of the same workflow.", zh: "回放使用独立 SQLite 数据库、合成交接记录和模拟工单服务。更正运行建立后，将备份恢复到新文件，核对数据库完整性、外键、原稿关联和重复提交，再批准第二次写入。最后把条款换成不适用的类别，核算步骤失败，始终没有第三份回执。前两次运行完成了交付。第三次因条款不适用而停在审批之前，工单服务没有收到写入请求。" },
          ],
        },
        {
          checks: [
            {
              title: { en: "QQ task submission and delivery receipt", zh: "QQ 任务提交与投递回执" },
              body: { en: "A local WebSocket peer submitted a task under a bound QQ account. The member reviewed the time, version and destination in the web workspace. When the task came due the peer received one message. The browser displayed the corresponding delivery receipt. This replay used a local protocol peer in place of an external QQ recipient.", zh: "本机 WebSocket 对端使用绑定的 QQ 测试账号提交任务，成员在工作台核对时间、版本和目的地。任务到期时，对端收到一条消息，网页显示相应投递回执。本次回放的收件端是本机协议对端，未向外部 QQ 账号投递。" },
            },
            {
              title: { en: "One maintenance answer, two retrieved passages", zh: "一份维护回答与两条检索记录" },
              body: { en: "A local Pi run with Qwen2.5-0.5B returned the recorded 72-hour inspection interval for P-17. Retrieval found two source lines, but the reply itself contained zero exact citations. The result page records the retrieved passages and exact citations separately. This single grounded question exposed a gap between finding the manual and citing it in a generated answer.", zh: "一次使用 Pi 与本地 Qwen2.5-0.5B 的运行，回答了 P-17 的 72 小时巡检周期。检索找到了两行原文，模型回答中的精确引用却是零。成果页分别显示检索到的资料和回答中的引用。这道有明确依据的问题，暴露出了找到手册与在回答里准确引用手册之间的落差。" },
            },
            {
              title: { en: "Six successful polls, three notifications", zh: "六次成功采集，三次通知" },
              body: { en: "In a seven-check replay with synthetic release events, six polls succeeded and one source failed. A policy that notified on every successful poll would have sent six notifications. The watch sent three. The run measures interruption frequency on that event stream.", zh: "在七次合成发布事件回放中，六次采集成功，一次上游故障。若每次成功都通知，会发送六次；长期关注策略实际发送三次。这组记录度量的是这段事件流上的打扰次数。" },
            },
          ],
        },
      ],
    },
    {
      id: "development",
      label: { en: "Development scope", zh: "开发边界" },
      title: { en: "Implemented features and open work", zh: "已实现功能与待验证事项" },
      blocks: [
        {
          paragraphs: [
            { en: "The merged workspace supports conversational task drafts, scheduled application runs, versioned workflows and results delivered through a member’s authorized channels. The source-watch, context-selection, adaptive-execution and inspection-review changes discussed here are implemented on four stacked review branches. Their replays use controlled sources and test accounts. Real business corpora, multi-host recovery and delivery to external QQ and WeChat accounts still need acceptance testing in their target environments.", zh: "已合并的工作台支持对话起草、定时调用应用、版本化工作流及授权渠道投递。本文介绍的长期关注、上下文选择、自适应执行和巡检复核已经在四个依次衔接的评审分支上实现。回放使用受控来源与测试账号；真实业务语料、多主机恢复以及外部 QQ 和微信收件账号仍需各自验收。" },
            { en: "Current watches run against goals and schedules that members have approved. Future work includes detecting a new task from incoming events, estimating the cost before proposing it and revising the plan when the evidence changes. The current replays cover approved tasks and their delivery. They do not measure how often the agent would propose a useful new task on its own.", zh: "目前的订阅任务使用成员已批准的目标与排期。后续设想包括根据新事件发现任务、在提议时估计成本，以及结合新增资料调整计划。现有回放覆盖已批准任务的执行与投递，尚未评估系统自行提出新任务的命中率。" },
          ],
        },
      ],
    },
  ],
};
