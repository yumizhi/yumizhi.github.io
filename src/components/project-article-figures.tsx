import Image from 'next/image';
import { ArrowLeftRight, ArrowRight, Check, CircleMinus, Clock3, Cpu, FileCode2, FileText, Inbox, MessageSquare, Monitor, RotateCcw, ShieldX } from 'lucide-react';
import { Fragment, type ReactNode } from 'react';
import { asset } from '@/lib/paths';
import type { ArticleFigure } from '@/lib/project-chapters';
import { Localized as Text } from './language';
import { Diagram, FlowArrow } from './project-architecture';
import { AgentRuntimeTrace } from './agent-runtime-trace';
import './project-article-figures.css';

function EpubWorkerFigure() {
  return (
    <Diagram id="epub-worker-handoff"
      title={{ en: 'Documents stay local as they move between threads', zh: '书籍文件在浏览器线程间交接' }}
      caption={{
        en: 'Preview reads the parsed summary. The same workspace can pass a finished Blob to Inspect or Split without writing another ZIP.',
        zh: '预览读取解析摘要。合并得到的 Blob 可以直接交给检查或拆分，无需额外打包。',
      }}>
      <div className="article-thread-map">
        <div className="article-thread">
          <div className="article-thread-title"><Monitor size={19} aria-hidden="true" /><strong><Text en="Main thread" zh="主线程" /></strong></div>
          <p><Text en="Book queue, order and current tool" zh="选书队列、卷序与当前工具" /></p>
          <code>File[] · mode · requestId</code>
        </div>
        <div className="article-messages">
          <div className="article-message"><span><Text en="File and request ID" zh="文件与请求编号" /></span><ArrowRight size={20} aria-hidden="true" /></div>
          <div className="article-message" data-return><span><Text en="Result with request ID" zh="带请求编号的结果" /></span><ArrowRight size={20} aria-hidden="true" /></div>
        </div>
        <div className="article-thread">
          <div className="article-thread-title"><Cpu size={19} aria-hidden="true" /><strong>Web Worker</strong></div>
          <p><Text en="Parse the package or write the archive" zh="解析包结构或写出归档" /></p>
          <code><Text en="Summary or Blob" zh="摘要或 Blob" /></code>
        </div>
      </div>
      <div className="article-figure-note"><RotateCcw size={15} aria-hidden="true" /><Text en="Cancel terminates the worker and invalidates the pending request." zh="取消会终止 Worker，并作废等待中的请求。" /></div>
    </Diagram>
  );
}

function PathCode({ path }: { path: string }) {
  return <code>{path.split(/(?<=\/)/).map((part, index) => (
    <Fragment key={index}>{index > 0 && <wbr />}<span>{part}</span></Fragment>
  ))}</code>;
}

function EpubPath({ step, path, reference }: { step: ReactNode; path: string; reference: string }) {
  return (
    <div className="article-path-sheet">
      <strong>{step}</strong>
      <div className="article-path-file"><FileCode2 size={16} aria-hidden="true" /><PathCode path={path} /></div>
      <div className="article-path-url"><span>CSS url()</span><PathCode path={reference} /></div>
    </div>
  );
}

function EpubRoundTrip() {
  return (
    <Diagram id="epub-path-roundtrip"
      title={{ en: 'The second volume’s stylesheet through merge and split', zh: '第二卷样式表的往返改写' }}
      caption={{
        en: 'These paths come from the resource regression fixture. The shared PNG occupies one slot in the collection. Split restores the local link and the original image bytes.',
        zh: '路径来自资源回归测试。共享图片在合集中只存一份，拆分会恢复第二卷的本地链接及图片原始字节。',
      }}>
      <div className="article-path-map">
        <EpubPath step={<Text en="Original volume" zh="原始分卷" />}
          path="OEBPS/Styles/book.css" reference="../Images/pixel.png" />
        <FlowArrow />
        <EpubPath step={<Text en="Merged collection" zh="合并后的合集" />}
          path="OEBPS/v2/OEBPS/Styles/book.css" reference="../../../v1/OEBPS/Images/pixel.png" />
        <FlowArrow />
        <EpubPath step={<Text en="Restored volume" zh="拆回的分卷" />}
          path="OEBPS/Styles/book.css" reference="../Images/pixel.png" />
      </div>
    </Diagram>
  );
}

function TeapotReport() {
  return (
    <Diagram id="originmark-teapot-report"
      title={{ en: 'Verification of the generated teapot', zh: '茶壶生成图的三项验证结果' }}
      caption={{
        en: 'The demo detected the TIDE signal in this generated image. The inspected file carried no C2PA credential. The watermark result is recorded separately.',
        zh: '这是演示生成图的实际结果。该文件检出了 TIDE 水印，未附带 C2PA 凭证，两项结论分别记录。',
      }}>
      <div className="article-evidence-split">
        <Image className="article-teapot" src={asset('/images/projects/originmark-cover.webp')} width={477} height={296}
          alt="Ceramic teapot and pitcher from the OriginMark verification example"
          sizes="(max-width: 700px) 88vw, 440px" />
        <dl className="article-checks">
          <div data-finding="positive"><dt><Check size={16} aria-hidden="true" /><Text en="TIDE presence" zh="TIDE 存在性" /></dt><dd><Text en="Detected" zh="检出水印" /></dd></div>
          <div><dt><CircleMinus size={16} aria-hidden="true" /><Text en="Payload watermark" zh="带载荷水印" /></dt><dd><Text en="Not run" zh="未检测" /></dd></div>
          <div><dt><CircleMinus size={16} aria-hidden="true" /><Text en="C2PA credential" zh="C2PA 内容凭证" /></dt><dd><Text en="No credential" zh="无凭证" /></dd></div>
        </dl>
      </div>
    </Diagram>
  );
}

function LeaseRecovery() {
  return (
    <Diagram id="originmark-lease-recovery"
      title={{ en: 'One job can outlive a worker lease', zh: '同一任务在租约失效后继续执行' }}
      caption={{
        en: 'In this recovery path, attempts remain in the retry budget. Publication checks the current claim version, the lease and the running state together.',
        zh: '图示假定任务还有剩余重试次数。发布时同时核对当前领取版本、租约和任务运行状态。',
      }}>
      <div className="article-job-label"><Text en="Same Job" zh="同一个 Job" /></div>
      <div className="article-lease-map">
        <div className="article-lease-step">
          <Clock3 size={18} aria-hidden="true" />
          <strong><Text en="Worker A claims the job" zh="Worker A 领取任务" /></strong>
          <small><Text en="A begins model execution." zh="开始调用模型。" /></small>
        </div>
        <FlowArrow />
        <div className="article-lease-step" data-expiry>
          <RotateCcw size={18} aria-hidden="true" />
          <strong><Text en="Lease expires" zh="A 的租约过期" /></strong>
          <small><Text en="Recovery invalidates A’s claim and requeues the job." zh="恢复逻辑作废 A 的领取并重新排队。" /></small>
        </div>
        <FlowArrow />
        <div className="article-lease-step">
          <Check size={18} aria-hidden="true" />
          <strong><Text en="Worker B claims the job" zh="Worker B 重新领取" /></strong>
          <small><Text en="B can commit under its own valid claim." zh="B 凭自己的有效领取提交结果。" /></small>
        </div>
      </div>
      <div className="article-stale-output"><ShieldX size={17} aria-hidden="true" /><Text en="A returns late → publication rejects the stale claim." zh="A 的计算随后返回 → 旧领取无法登记发布。" /></div>
    </Diagram>
  );
}

function AgentRunLink() {
  return (
    <Diagram id="agent-run-link"
      title={{ en: 'A schedule occurrence keeps its child run', zh: '排期实例保存对应的子运行' }}
      caption={{
        en: 'The association and waiting state are saved when the app starts. After a scheduler restart, the parent follows the same child run.',
        zh: '应用启动时同时保存父子关联和等待状态。调度器重启后，父任务继续跟踪同一个子运行。',
      }}>
      <div className="article-agent-link">
        <div className="article-agent-record">
          <Clock3 size={18} aria-hidden="true" />
          <strong><Text en="Scheduled occurrence" zh="排期实例" /></strong>
          <span><Text en="Due time, pinned version and destination" zh="执行时间、固定版本与交付去向" /></span>
          <code>awaiting_app</code>
        </div>
        <div className="article-agent-join"><ArrowLeftRight size={22} aria-hidden="true" /><strong>SQLite</strong><code>parent ↔ child</code></div>
        <div className="article-agent-record">
          <Cpu size={18} aria-hidden="true" />
          <strong><Text en="Application run" zh="应用子运行" /></strong>
          <span><Text en="Model calls, steps and evidence" zh="模型调用、步骤与执行证据" /></span>
          <code><Text en="Run outcome" zh="运行终态" /></code>
        </div>
      </div>
      <div className="article-figure-note"><RotateCcw size={15} aria-hidden="true" /><Text en="A successful child still passes a fresh access check before delivery." zh="子运行成功后，投递前还要重新核对访问权限。" /></div>
    </Diagram>
  );
}

function AgentReportEvidence() {
  return <Diagram id="agent-report-evidence"
    title={{ en: 'What the corrected report inherits', zh: '更正报告沿用了什么' }}
    caption={{ en: 'Both runs used the same workflow version. The second read the sources again and obtained a separate approval and receipt.', zh: '两次运行采用同一工作流版本。第二次重新读取来源，并取得独立的审批与回执。' }}>
    <div className="article-agent-link">
      <div className="article-agent-record"><FileText size={18} /><strong><Text en="Original report" zh="执行原稿" /></strong><code>09:04 · 54 min</code><span><Text en="Order approved · correction requested" zh="工单已批准 · 复核要求更正" /></span></div>
      <div className="article-agent-join"><ArrowRight size={22} /><strong><Text en="Same workflow" zh="同一流程版本" /></strong></div>
      <div className="article-agent-record"><FileText size={18} /><strong><Text en="Corrected report" zh="更正报告" /></strong><code>08:49 · 39 min</code><span><Text en="New approval · new receipt" zh="重新审批 · 新工单回执" /></span></div>
    </div>
  </Diagram>;
}

function AgentWatchReplay() {
  const checks = [
    ['13:00', 'Notify', '优先通知'], ['14:00', 'Defer', '留待摘要'], ['18:00', 'Deliver digest', '发送摘要'],
    ['19:00', 'No change', '条目无变化'], ['23:00', 'Quiet hours', '免打扰'],
    ['07:00', 'Deliver', '恢复投递'], ['08:00', 'Retry queued', '等待重试'],
  ];
  return <Diagram id="agent-watch-replay" title={{en:'Seven checks across two days', zh:'跨两天的七次采集'}}
    caption={{en:'Purple marks a delivery. The final source request failed and was queued for retry. Times follow the replay clock.',zh:'紫色标记实际投递。最后一次来源请求失败，进入重试队列。时间取自回放时钟。'}}>
    <ol className="watch-log">{checks.map(([time,en,zh],index) => <li key={time} data-delivered={[0,2,5].includes(index) || undefined}><time>{time}</time><span><Text en={en} zh={zh} /></span></li>)}</ol>
  </Diagram>;
}

function AgentWorkflowData() {
  return (
    <Diagram id="agent-workflow-data"
      title={{ en: 'From two passages to one calculation', zh: '从两条检索结果到一次核算' }}
      caption={{
        en: 'This graph illustrates the workflow contract. Each edge carries the results of a completed predecessor in the same run.',
        zh: '图中是维护流程的配置示意。连线表示下游读取同一次运行中已完成的上游结果。',
      }}>
      <div className="article-path-map">
        <div className="article-channel-input">
          <div><strong><Text en="Register lookup" zh="交接登记" /></strong><code>record</code></div>
          <div><strong><Text en="Agreement search" zh="检索适用条款" /></strong><code>citations</code></div>
        </div>
        <FlowArrow />
        <div className="article-thread">
          <div className="article-thread-title"><Cpu size={18} aria-hidden="true" /><strong><Text en="Elapsed-time tool" zh="只读耗时工具" /></strong></div>
          <p><Text en="Match the category and subtract the timestamps" zh="匹配交接类别，再计算时间差" /></p>
          <code>elapsed · limit · overdue</code>
        </div>
        <FlowArrow />
        <div className="article-thread">
          <div className="article-thread-title"><FileText size={18} aria-hidden="true" /><strong><Text en="Approval and report" zh="审批与报告" /></strong></div>
          <p><Text en="Approve the work order and attach its receipt to the report" zh="批准工单，随报告保存此次写入的回执" /></p>
        </div>
      </div>
    </Diagram>
  );
}

function AgentMessageTransport() {
  return (
    <Diagram id="agent-message-transport"
      title={{ en: 'Different chat transports, one persisted inbox', zh: '不同的接入方式，共用持久收件箱' }}
      caption={{
        en: 'For a published app invoked from a bound private chat, the message key identifies the invocation. A later lookup can continue following the same run.',
        zh: '从绑定私聊调用已发布应用时，消息键也用作调用键。之后查询可以继续跟踪同一次运行。',
      }}>
      <div className="transport-map">
        <div className="transport-sources">
          <div><strong>QQ</strong><code>WebSocket</code></div>
          <div><strong><Text en="WeChat" zh="微信" /></strong><code><Text en="Long poll · cursor" zh="长轮询 · 查询游标" /></code></div>
        </div>
        <svg className="transport-fork" viewBox="0 0 88 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M2 25H18C45 25 39 50 62 50H87" />
          <path d="M2 75H18C45 75 39 50 62 50" />
        </svg>
        <div className="transport-stop">
          <Inbox size={24} aria-hidden="true" /><strong><Text en="Channel gateway" zh="渠道网关" /></strong>
          <p><Text en="Normalize, deduplicate and order per peer" zh="归一化、去重、保持会话内顺序" /></p>
          <code>inbox · receipts</code>
        </div>
        <FlowArrow />
        <div className="transport-stop">
          <Cpu size={24} aria-hidden="true" /><strong><Text en="Published app" zh="已发布应用" /></strong>
          <p><Text en="Open the existing run or submit a new invocation" zh="查找已有运行，或提交一次新调用" /></p>
          <code>key → run ID</code>
        </div>
      </div>
    </Diagram>
  );
}

export function ProjectArticleFigure({ figure }: { figure: ArticleFigure }) {
  switch (figure) {
    case 'epub-worker-handoff': return <EpubWorkerFigure />;
    case 'epub-path-roundtrip': return <EpubRoundTrip />;
    case 'originmark-teapot-report': return <TeapotReport />;
    case 'originmark-lease-recovery': return <LeaseRecovery />;
    case 'agent-watch-replay': return <AgentWatchReplay />;
    case 'agent-run-link': return <AgentRunLink />;
    case 'agent-report-evidence': return <AgentReportEvidence />;
    case 'agent-runtime-trace': return <AgentRuntimeTrace />;
    case 'agent-workflow-data': return <AgentWorkflowData />;
    case 'agent-message-transport': return <AgentMessageTransport />;
  }
}
