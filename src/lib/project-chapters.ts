export type Bilingual = { en: string; zh: string };

export type ArticleFigure = 'epub-worker-handoff' | 'epub-path-roundtrip' | 'originmark-teapot-report' |
  'originmark-lease-recovery' | 'agent-run-link' | 'agent-runtime-trace';

export type CaseCheck = {title: Bilingual; body: Bilingual};
export type ProjectStep = CaseCheck & { id: string; label: Bilingual; output: Bilingual };
type CaseFigure = ArticleFigure | 'gallery' | 'architecture' | 'merge-record' | 'epub-docs' | 'tide-link' | 'calibration';
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
      title: { en: "Links and resources in a restored volume", zh: "分卷还原后的链接与资源" },
      blocks: [
        {
          title: { en: "Chapter links, fonts and navigation", zh: "章节链接、字体和导航" },
          paragraphs: [
            { en: "A restored volume can contain its original chapter and directory structure even when the collection stores only one copy of a font. Each volume has its own link map. That map also preserves the fragments in chapter links and the paths in nested stylesheets. An SVG that refers to other files keeps its original directory context.", zh: "两卷书即使共用同一份字体，拆开后仍各自保有完整的资源目录。合集为每卷保存了引用关系，其中包括章内跳转的片段、嵌套样式表中的相对路径。对还会引用其他文件的 SVG，引擎会保留它原来的目录关系。" },
            { en: "The browser, Node.js and Python versions read the same merge record. A collection made on a laptop in the browser can later be split with the Python command line. The exported collection and its restored volumes can also be checked with EPUBCheck.", zh: "浏览器、Node.js 和 Python 版本能读取同一种合并记录。在笔记本浏览器里做好的合订本，以后也能用 Python 命令行拆回去。合订本和还原出的分卷都可以用 EPUBCheck 检查。" },
          ],
        },
        {
          checks: [
            {
              title: { en: "A pooled resource still resolves after splitting", zh: "资源合并去重后，拆开仍能正确引用" },
              body: { en: "A shared image occupies one place in the collection. Splitting copies its bytes back to each volume that used it, so a chapter or stylesheet still resolves the corresponding relative URL.", zh: "共用插图在合集里只存一份。拆开时，引擎将图片按原路径写回用到它的各卷，章节和样式表里的相对链接仍能找到原图。" },
            },
            {
              title: { en: "Missing resources and unsupported formats", zh: "缺失资源与不支持的版式" },
              body: { en: "A missing resource stops the merge before a download is offered. Fixed-layout books and synchronized media overlays are outside the reflowable format supported here. A collection needs a merge record to restore its original volumes.", zh: "包中缺少被引用的资源时，合并会停止。固定版式与同步媒体叠加超出了工具支持的可重排版式范围。要恢复原分卷，合集还需保留合并记录。" },
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
            { en: "Each entry in the batch manifest carries the file’s status and hash. A publisher can distribute the successful files immediately and use that manifest, in JSON or CSV, to check the download or find an item that needs another attempt.", zh: "发布清单为每个文件保留处理状态和哈希。发布者可以先交付已经签发的图片，使用 JSON 或 CSV 清单核对下载件，也能单独找出需要再处理的文件。" },
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
      label: { en: "Calibration and reports", zh: "校准与核验报告" },
      title: { en: "Release evidence and its limits", zh: "发布证据与校准范围" },
      blocks: [
        {
          title: { en: "Calibrating a TIDE presence finding", zh: "TIDE 存在性检测的阈值" },
          paragraphs: [
            { en: "The TIDE detector compares a recovered spectrum with the watermark template. Turning that distance into a presence finding requires a threshold associated with the generation and inversion settings. A change in either can shift the distances, even on unmarked images.", zh: "TIDE 检测器计算反演得到的频谱与水印模板之间的距离。判定水印存在需要一道与生成、反演配置匹配的阈值。配置改变后，同一批无水印图像的距离分布也可能变化。" },
            { en: "A calibration record specifies the sampler, inversion settings and watermark configuration associated with its threshold. When a run uses another profile, the report still retains its raw score. The detection field stays inconclusive until the matching profile has a calibration record.", zh: "校准记录将阈值绑定到采样器、反演设置和水印配置。换用另一组设置时，报告仍保留原始分数。对应配置没有校准记录，检测结论就保留为未定。" },
            { en: "The full TIDE profile used 5,000 unmarked images to set a threshold, then evaluated it on separate images. At a nominal 1% false-positive rate the detector found the watermark in all 1,000 marked PNGs. The observed false-positive rates varied among generated JPEGs, photographs and additional PNG controls. These groups contain unedited images. Some PNG controls share image content with the JPEG group.", zh: "完整 TIDE 配置用 5,000 张无水印图像确定阈值，再用另一组图像评估。在标称误报率为 1% 的阈值下，1,000 张带水印 PNG 全部检出。实际误报率随图像来源而异，生成 JPEG、照片和额外的 PNG 对照分别列在下图中。各组图像均未经编辑，部分 PNG 对照与 JPEG 组共享图像内容。" },
          ],
        },
        {
          figure: "calibration",
        },
        {
          title: { en: "Sharing a verification report", zh: "核验报告的交付" },
          paragraphs: [
            { en: "A recipient can reopen an image verification report through a read-only link, or keep a PDF alongside the downloaded image. The report keeps the watermark finding, credential integrity and issuer trust separate. An image with a detected watermark can still have no signed credential attached.", zh: "收件人可以通过只读链接打开图像的核验报告，也可以把 PDF 和下载的图片一起保存。报告分别记录水印检出、凭证完整性和签发者信任情况。一张检测出水印的图片也可能没有附加签名凭证。" },
            { en: "A publisher handling many files can export the verification data as JSON. The release association and file hash tie each report to the particular copy checked. A resized copy has different bytes and can be submitted for its own verification.", zh: "批量处理图片时，发布者可以导出 JSON 格式的验证数据。关联的发布记录和文件哈希标明了本次核验使用的那一份图片。图片缩放后字节已经改变，新文件可以单独送检。" },
          ],
        },
      ],
    },
  ],
  "personal-agent": [
    {
      id: "design", label: { en: "Workspace", zh: "工作台" },
      title: { en: "The work that stays after a conversation", zh: "对话结束后的任务" },
      blocks: [{ paragraphs: [
        { en: "A request for a daily brief may take one message to describe, but the work recurs long after the conversation ends. Personal Agent gives that request a place of its own. A member can draft it in a chat, confirm the sources, local time and destination, and later find both the schedule and the reports in the web workspace. The browser can be closed between runs.", zh: "一句“每天早上把我关注的更新发给我”，说完就可以关掉对话，背后却有件事得每天有人做。Personal Agent 会把这类请求存成任务。成员可以在聊天里起草，确认订阅来源、当地时间和收件渠道。过几天再打开工作台，排期还在，之前收到的简报也能找到。" },
        { en: "The same installation also hosts applications built in Studio. A member can run a published assistant in a private chat without having to edit its workflow. Its author can continue working on a draft while the published version serves existing requests.", zh: "有些工作还需要一套固定的工具和流程。作者在 Studio 里编排、发布应用，获得授权的成员就能在网页或绑定的私聊中使用。作者随后可以继续改草稿，已经发起的任务仍然使用当时发布的版本。" },
      ] }],
    },
    {
      id: "preview", label: { en: "Product views", zh: "产品界面" },
      title: { en: "The member workspace and Studio", zh: "成员工作台与 Studio" },
      blocks: [
        { figure: "gallery" },
        { paragraphs: [
          { en: "The member workspace keeps a report with the task that produced it. A notification is useful when a report arrives, but the workspace matters a week later, when the member wants to reopen the original source or adjust the next delivery. Changing the destination or the sources of a watch creates a new plan for approval.", zh: "成员收到通知时，可以直接打开报告。过一周想找回当时引用的文章，或者改一下下次的发送时间，也能顺着任务找到原来那份计划。长期关注任务更换来源或收件范围后，会产生一份需要重新确认的计划。" },
          { en: "Studio has separate editors for an agent and a workflow. The agent editor sets the model, knowledge and tools available in a conversation. The workflow editor arranges steps on a canvas. Selecting a node exposes its inputs and exits, so the author can change a parameter, insert a step or reconnect a branch. On a narrow screen the steps can also be edited as a list.", zh: "Studio 里有两种编辑工作。配置 Agent 时，作者选择它可以调用的模型、知识集合和工具。编排工作流时，画布上显示的是步骤和连线。选中节点就能修改参数、插入步骤或重接出口；手机上也可以用步骤列表编辑同一个流程。" },
        ] },
      ],
    },
    {
      id: "decisions", label: { en: "Source watches", zh: "长期关注" },
      title: { en: "Following a source without repeating every update", zh: "长期关注与定时摘要" },
      blocks: [{ paragraphs: [
        { en: "A watch can follow a release feed, an arXiv subscription or an RSS feed. Members choose which topics warrant a prompt notification, which updates can wait for the digest, and when notifications should be quiet. Marking an item as irrelevant lowers the priority of later matches on that topic. The subscription itself stays in place.", zh: "成员可以订阅软件发布动态、arXiv 或 RSS，指定优先关注的主题、摘要时间和免打扰时段。这样，一个重要版本有更新时可以单独提醒，其余消息留到日报。如果某条更新选得不合适，标记“不相关”就会降低同主题后续更新的优先级，原来的订阅仍然保留。" },
        { en: "Each poll compares source addresses and fingerprints of titles and excerpts with the last successful snapshot. Changes selected for a digest remain pending until delivery. The original links travel with the excerpts. If a member enables model commentary, it is stored separately, and the source material can still be delivered when there is no model response.", zh: "系统每次采集都会和上一次成功读取的快照比较。它用规范化后的链接识别条目，用标题和摘录的指纹判断内容有没有变化。待汇总的条目会一直保留到摘要发送时。原文链接随摘录保存；成员启用模型解读后，解读单独呈现。即使没有得到模型回复，来源材料仍能送达。" },
        { en: "A useful watch can be saved as a reusable method after a successful run. The member reviews its sources, keywords and delivery rules before saving a version. Reusing it for another goal requires a new schedule, recipient and approval. This keeps the useful reading routine portable while leaving the original authorization with its task.", zh: "一次关注任务运行得合适，成员可以把这次用过的方法留下来。保存前能核对来源、关键词和摘要规则。下次换个关注目标时，这份配置可以复用，新的时间、收件渠道和授权则要单独确认。" },
      ] }],
    },
    {
      id: "architecture", label: { en: "Execution paths", zh: "执行路径" },
      title: { en: "One scheduled task can run a published application", zh: "定时任务调用已发布应用" },
      blocks: [
        { figure: "architecture" },
        { paragraphs: [
          { en: "Web, QQ and WeChat identify the member at the edge of the system. A scheduled task belongs to that member. An application has a published definition, project permissions and its own run history. When the schedule calls an application, the scheduler records which application run belongs to this occurrence. The result can then be delivered through the member’s chosen channel and reopened from the originating task.", zh: "网页、QQ 和微信负责识别发起请求的成员。定时任务属于个人；应用则有自己的发布版本、项目权限和运行历史。排期触发应用时，调度器会记下这一次任务对应哪一条应用运行。结果可以送回成员选定的渠道，后来在工作台上打开原任务，也能找到同一份结果。" },
          { en: "The distinction matters when a process restarts. A recurring task may already have launched its application when the scheduler stops. Recording their association lets the scheduler pick up the existing run. Inside the workflow, completed steps have checkpoints in SQLite. A new worker can resume at the next eligible step, including after a pause for human approval.", zh: "如果调度器恰好在应用启动后重启，这层关联就派上了用场。调度器恢复后可以继续等原来那次运行，避免为同一份排期再次启动应用。工作流内部则把已完成的步骤写入 SQLite。换一个工作进程，或者等一次人工审批回来，执行都可以从下一个可运行的节点接续。" },
        ], figure: "agent-run-link" },
      ],
    },
    {
      id: "implementation", label: { en: "Model & tools", zh: "模型与工具" },
      title: { en: "Model context and tool access", zh: "模型上下文与工具权限" },
      blocks: [
        { paragraphs: [
          { en: "A Pi model turn runs with the tools and knowledge available to its deployment. A read request is checked before the result returns to the model. The workflow engine owns the longer-lived state, including which step is active, which result has been saved and whether a proposed external action needs approval. A model call can finish before the person who will approve that action is online.", zh: "Pi 的一次模型调用只能使用当前部署获准的工具和知识。读取请求经过校验，结果再回到本轮对话。哪一步已经执行、哪份结果已经保存、哪项外部操作还在等待批准，这些状态由工作流引擎接管。一轮模型调用可以很快结束，负责审批的人晚些时候上线也能接着处理。" },
        ], figure: "agent-runtime-trace" },
        { paragraphs: [
          { en: "Personal conversations have a different context boundary. Recent turns take priority. Within the remaining budget, the system selects confirmed memories, linked tasks and older turns that match the request, then restores chronological order for the model. A member can withdraw a saved memory. Group conversations do not inherit that member’s private memories.", zh: "个人对话有自己的上下文范围。系统优先保留最近几轮，再按当前请求的文字相关度选择已确认的记忆、关联任务和较早的消息，交给模型前恢复时间顺序。成员可以撤回一条记忆。进入群聊后，个人记忆也不会自动带进群里的上下文。" },
        ] },
      ],
    },
    {
      id: "workflow-review", label: { en: "Report review", zh: "报告复核" },
      title: { en: "What happens to a report after a correction", zh: "报告更正后保留两次运行" },
      blocks: [{ paragraphs: [
        { en: "A project report can cite the records behind its conclusion. A reviewer can attach a decision and reason to the report or request a correction to its input. Resubmission runs the same workflow version with the corrected input and retrieves the relevant material again. The earlier report remains available beside the new one.", zh: "项目报告可以附上支持结论的来源。复核人发现输入有误时，可以在原报告上记录原因并要求更正。重新提交后，同一工作流版本会用改正后的输入重新执行，也重新读取这次判断所需的资料。原报告保留下来，两次结论各有各的依据。" },
        { en: "If the corrected report proposes an external write, its parameters go through a fresh approval. The new receipt belongs to the new run. That separation preserves a record of the action that was actually approved, even if someone later changes the underlying input.", zh: "如果更正后的报告还要触发外部写入，新参数需要重新审批，新的回执也归入这次运行。这样，即使后来有人修改了输入，仍能分清当时批准的是哪一次操作。" },
      ] }],
    },
  ],
};
