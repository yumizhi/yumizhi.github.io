import type { Bilingual } from './project-chapters';

type NodeKind = 'entry' | 'compute' | 'record' | 'output' | 'check';

type ArchitectureNode = {
  id: string;
  kind: NodeKind;
  column: number;
  row: number;
  title: Bilingual;
  detail: Bilingual;
};

type Edge = { path: string; routes: string[]; secondary?: boolean };

type Route = {
  id: string;
  label: Bilingual;
  description: Bilingual;
  stages: string[][];
};

type Architecture = {
  title: Bilingual;
  height: number;
  nodes: ArchitectureNode[];
  edges: Edge[];
  routes: Route[];
};

export const projectArchitecture: Record<string, Architecture> = {
  'epub-toolkit': {
    title: { en: 'The EPUB processing system', zh: 'EPUB 处理系统' },
    height: 335,
    nodes: [
      { id: 'reader', kind: 'entry', column: 0, row: 1, title: { en: 'Browser workspace', zh: '浏览器工作台' }, detail: { en: 'Merge · Split · Inspect', zh: '合并 · 拆分 · 检查' } },
      { id: 'worker', kind: 'compute', column: 1, row: 1, title: { en: 'Web Worker', zh: 'Web Worker' }, detail: { en: 'File / Blob · progress', zh: '文件 / Blob · 进度' } },
      { id: 'node', kind: 'entry', column: 2, row: 0, title: { en: 'Node CLI', zh: 'Node 命令行' }, detail: { en: 'File-backed input', zh: '文件作为输入' } },
      { id: 'core', kind: 'compute', column: 2, row: 1, title: { en: 'TypeScript engine', zh: 'TypeScript 引擎' }, detail: { en: 'Parse · remap · rewrite', zh: '解析 · 映射 · 改写' } },
      { id: 'archive', kind: 'output', column: 3, row: 1, title: { en: 'Collection EPUB', zh: 'EPUB 合集' }, detail: { en: 'Chapters · assets · TOC', zh: '章节 · 资源 · 目录' } },
      { id: 'record', kind: 'record', column: 3, row: 2, title: { en: 'Embedded merge record', zh: '内嵌合并记录' }, detail: { en: 'Source paths · metadata', zh: '分卷路径 · 元数据' } },
      { id: 'python', kind: 'entry', column: 0, row: 2, title: { en: 'Python CLI', zh: 'Python 命令行' }, detail: { en: 'Independent implementation', zh: '独立的标准库实现' } },
      { id: 'volumes', kind: 'output', column: 2, row: 2, title: { en: 'Reconstructed volumes', zh: '重建后的分卷' }, detail: { en: 'Independently readable', zh: '各卷可独立阅读' } },
    ],
    edges: [
      { path: 'M222 174H265', routes: ['merge', 'split'] },
      { path: 'M457 174H500', routes: ['merge', 'split'] },
      { path: 'M596 109V141', routes: ['split'] },
      { path: 'M692 174H735', routes: ['merge'] },
      { path: 'M831 207V239', routes: ['merge', 'split'], secondary: true },
      { path: 'M735 257H713V187H692', routes: ['split'], secondary: true },
      { path: 'M831 305V319H126V305', routes: ['split'], secondary: true },
      { path: 'M596 207V239', routes: ['split'] },
      { path: 'M222 272H500', routes: ['split'] },
    ],
    routes: [
      { id: 'merge', label: { en: 'Build the collection', zh: '生成合集' }, description: { en: 'The worker passes the selected books to the archive engine. The collection stores the rebuilt book and the record needed to reverse the merge.', zh: 'Worker 把选中的分卷交给引擎。合集既包含重建后的整本书，也携带日后拆回原卷所需的记录。' }, stages: [['reader'], ['worker'], ['core'], ['archive', 'record']] },
      { id: 'split', label: { en: 'Rebuild the volumes', zh: '还原分卷' }, description: { en: 'Browser and Node use the TypeScript engine. Python reads the same record with its own implementation. Both reconstruct individual EPUBs from it.', zh: '浏览器和 Node 调用 TypeScript 引擎，Python 用独立实现读取同一份合并记录。三者都可以从合集重建独立分卷。' }, stages: [['archive', 'record'], ['reader', 'node'], ['core', 'python'], ['volumes']] },
    ],
  },
  originmark: {
    title: { en: 'The OriginMark execution and evidence system', zh: 'OriginMark 执行与证据系统' },
    height: 343,
    nodes: [
      { id: 'studio', kind: 'entry', column: 0, row: 0, title: { en: 'Studio / API client', zh: '工作台 / API 客户端' }, detail: { en: 'Generate · Protect · Verify', zh: '生成 · 保护 · 验证' } },
      { id: 'api', kind: 'compute', column: 1, row: 0, title: { en: 'FastAPI', zh: 'FastAPI' }, detail: { en: 'Authorize · record input', zh: '权限校验 · 登记输入' } },
      { id: 'store', kind: 'record', column: 2, row: 0, title: { en: 'PostgreSQL', zh: 'PostgreSQL' }, detail: { en: 'Run · Job · outbox', zh: 'Run · Job · 待投递消息' } },
      { id: 'queue', kind: 'compute', column: 3, row: 0, title: { en: 'Dispatcher → RabbitMQ', zh: '分发器 → RabbitMQ' }, detail: { en: 'Confirmed dispatch', zh: '确认消息投递' } },
      { id: 'worker', kind: 'compute', column: 3, row: 1, title: { en: 'Worker', zh: 'Worker' }, detail: { en: 'Claim · lease · cancel', zh: '领取 · 租约 · 取消' } },
      { id: 'engines', kind: 'compute', column: 2, row: 1, title: { en: 'Model adapters', zh: '模型适配器' }, detail: { en: 'TrustMark · PixelSeal · TIDE', zh: 'TrustMark · PixelSeal · TIDE' } },
      { id: 'files', kind: 'record', column: 1, row: 1, title: { en: 'Object storage', zh: '对象存储' }, detail: { en: 'Input and derived files', zh: '输入与派生文件' } },
      { id: 'events', kind: 'entry', column: 0, row: 1, title: { en: 'Progress in Studio', zh: '工作台进度' }, detail: { en: 'Resumable event stream', zh: '可续接的事件流' } },
      { id: 'checks', kind: 'check', column: 3, row: 2, title: { en: 'Final-file checks', zh: '最终文件校验' }, detail: { en: 'Protect · sign · recheck', zh: '保护 · 签名 · 再检查' } },
      { id: 'release', kind: 'output', column: 2, row: 2, title: { en: 'Published release', zh: '正式发布记录' }, detail: { en: 'Lease + claim must match', zh: '租约与领取版本匹配' } },
      { id: 'verify', kind: 'output', column: 1, row: 2, title: { en: 'Verification evidence', zh: '验证证据' }, detail: { en: 'Watermark · C2PA · trust', zh: '水印 · C2PA · 签发者信任' } },
    ],
    edges: [
      { path: 'M222 76H265', routes: ['work', 'proof'] },
      { path: 'M457 76H500', routes: ['work', 'proof'] },
      { path: 'M692 76H735', routes: ['work', 'proof'] },
      { path: 'M831 109V141', routes: ['work', 'proof'] },
      { path: 'M735 174H692', routes: ['work', 'proof'] },
      { path: 'M500 174H457', routes: ['work'], secondary: true },
      { path: 'M550 109V125H126V141', routes: ['work', 'proof'], secondary: true },
      { path: 'M831 207V239', routes: ['proof'] },
      { path: 'M735 272H692', routes: ['proof'] },
      { path: 'M927 194H945V326H361V305', routes: ['proof'] },
      { path: 'M265 272H126V207', routes: ['proof'], secondary: true },
      { path: 'M596 305V314H126V272', routes: ['proof'], secondary: true },
    ],
    routes: [
      { id: 'work', label: { en: 'Dispatch a run', zh: '把任务交给模型' }, description: { en: 'Recording and dispatch are separate. A worker claims the job, reads its input, calls the right model and returns updates to the run record.', zh: '任务先落库，再由分发器发往队列。Worker 领取任务、读取输入、调用相应模型，进度回到运行记录供工作台读取。' }, stages: [['studio', 'api'], ['store', 'queue'], ['worker', 'engines', 'files'], ['events']] },
      { id: 'proof', label: { en: 'Publish or verify', zh: '发布与核验' }, description: { en: 'Protect commits a release after validating the signed file. Verify records independent findings about a supplied file. Both return their recorded results to Studio.', zh: '保护流程验证签名后的文件才登记发布。验证流程对输入文件逐项保存证据。两路结果都能回到工作台。' }, stages: [['studio', 'api'], ['store', 'queue'], ['worker', 'engines'], ['checks', 'release', 'verify'], ['events']] },
    ],
  },
  'personal-agent': {
    title: { en: 'The scheduled application system', zh: '定时应用执行系统' },
    height: 321,
    nodes: [
      { id: 'member', kind: 'entry', column: 0, row: 0, title: { en: 'Member workspace', zh: '成员工作区' }, detail: { en: 'Chat · hand off work', zh: '对话 · 交办任务' } },
      { id: 'plan', kind: 'record', column: 1, row: 0, title: { en: 'Approved plan', zh: '已批准的计划' }, detail: { en: 'Version · timing · recipient', zh: '版本 · 时间 · 收件人' } },
      { id: 'schedule', kind: 'compute', column: 2, row: 0, title: { en: 'Scheduler', zh: '调度器' }, detail: { en: 'Check plan · trigger on time', zh: '核对计划 · 到点触发' } },
      { id: 'queue', kind: 'record', column: 3, row: 0, title: { en: 'SQLite run queue', zh: 'SQLite 运行队列' }, detail: { en: 'Occurrence ↔ application run', zh: '排期实例 ↔ 应用运行' } },
      { id: 'studio', kind: 'entry', column: 0, row: 1, title: { en: 'Project Studio', zh: '项目 Studio' }, detail: { en: 'Edit · snapshot · deploy', zh: '编辑 · 快照 · 部署' } },
      { id: 'release', kind: 'record', column: 1, row: 1, title: { en: 'Application release', zh: '应用发布版本' }, detail: { en: 'Pinned agent or workflow', zh: '固定 Agent 或工作流' } },
      { id: 'knowledge', kind: 'record', column: 2, row: 1, title: { en: 'Project knowledge', zh: '项目知识' }, detail: { en: 'Authorized source lines', zh: '授权范围内的来源行' } },
      { id: 'runtime', kind: 'compute', column: 3, row: 1, title: { en: 'Node.js runtime', zh: 'Node.js 运行时' }, detail: { en: 'Worker · recorded steps', zh: 'Worker · 步骤记录' } },
      { id: 'inbox', kind: 'output', column: 0, row: 2, title: { en: 'Member inbox', zh: '成员收件箱' }, detail: { en: 'Receipt · return to the run', zh: '投递回执 · 回到运行' } },
      { id: 'report', kind: 'output', column: 2, row: 2, title: { en: 'Run deliverables', zh: '运行产物' }, detail: { en: 'Cited report · artifact', zh: '带引用的报告 · 附件' } },
      { id: 'approval', kind: 'check', column: 3, row: 2, title: { en: 'Tool authorization', zh: '工具授权' }, detail: { en: 'Approve a specific action', zh: '审批具体外部操作' } },
    ],
    edges: [
      { path: 'M222 76H265', routes: ['run'] },
      { path: 'M457 76H500', routes: ['run'] },
      { path: 'M692 76H735', routes: ['run'] },
      { path: 'M831 109V141', routes: ['run'] },
      { path: 'M222 174H265', routes: ['run'] },
      { path: 'M361 141V109', routes: ['run'], secondary: true },
      { path: 'M692 174H735', routes: ['result'], secondary: true },
      { path: 'M831 207V239', routes: ['result'], secondary: true },
      { path: 'M735 189H714V272H692', routes: ['result'] },
      { path: 'M500 272H222', routes: ['result'] },
    ],
    routes: [
      { id: 'run', label: { en: 'Schedule and run', zh: '排期与执行' }, description: { en: 'A project release pins the application definition. The approved plan chooses that version, and a scheduled occurrence follows its persisted application run.', zh: '项目发布固定应用定义，经批准的计划选择该版本。调度实例通过持久化关联跟进同一次应用运行。' }, stages: [['studio', 'release'], ['member', 'plan'], ['schedule', 'queue'], ['runtime']] },
      { id: 'result', label: { en: 'Trace a delivery', zh: '交付与溯源' }, description: { en: 'The runtime retrieves authorized sources and can pause on a concrete write. The report cites that execution’s sources. The inbox records delivery and links the report back to the run.', zh: '运行时读取获授权的来源，必要时停下来等待对具体写入的审批。报告引用本次执行的资料，收件箱记录投递并保留返回运行的入口。' }, stages: [['knowledge', 'runtime'], ['approval'], ['report'], ['inbox']] },
    ],
  },
};
