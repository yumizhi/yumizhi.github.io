import Image from 'next/image';
import { ArrowLeftRight, ArrowRight, Check, CircleMinus, Clock3, Cpu, FileCode2, FileText, Inbox, MessageSquare, Monitor, RotateCcw, ShieldX } from 'lucide-react';
import { Fragment, type ReactNode } from 'react';
import { asset } from '@/lib/paths';
import type { ArticleFigure } from '@/lib/project-chapters';
import { Localized as Text } from './language';
import { Diagram, FlowArrow } from './project-architecture';
import { AgentRuntimeTrace } from './agent-runtime-trace';
import { AgentCollectionSchedule, AgentDigestReplay } from './agent-source-replays';
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
  const records = [
    { name: { en: 'Workflow', zh: '工作流' }, a: { en: 'Published inspection version', zh: '已发布的巡检版本' }, b: { en: 'Same version', zh: '沿用原版本' } },
    { name: { en: 'Register entry', zh: '交接登记' }, a: { en: 'Logged 09:04', zh: '09:04 确认' }, b: { en: 'Logged 08:49', zh: '08:49 确认' } },
    { name: { en: 'Clause', zh: '时限条款' }, a: { en: 'Retrieved and cited', zh: '检索并引用' }, b: { en: 'Retrieved again', zh: '重新检索' } },
    { name: { en: 'Work order', zh: '工单写入' }, a: { en: 'First approval and receipt', zh: '首次审批与回执' }, b: { en: 'New approval and receipt', zh: '独立审批与回执' } },
  ];
  return <Diagram id="agent-report-evidence"
    title={{ en: 'The audit trail after a correction', zh: '更正前后的两份记录' }}
    caption={{ en: 'The review stays attached to the original report. Following its correction link opens the second run with its own sources and receipt.', zh: '复核意见保存在执行原稿上。沿更正记录进入第二次运行，可以找到这次读到的条款和写入回执。' }}>
    <table className="agent-records">
      <thead><tr><th scope="col"><Text en="Record" zh="记录项" /></th><th scope="col"><Text en="Original" zh="原运行" /></th><th scope="col"><Text en="Correction" zh="更正运行" /></th></tr></thead>
      <tbody>{records.map(row => <tr key={row.name.en}><th scope="row"><Text {...row.name} /></th><td><Text {...row.a} /></td><td><Text {...row.b} /></td></tr>)}</tbody>
    </table>
  </Diagram>;
}

function AgentWatchReplay() {
  const checks = [
    { time: '13:00', changed: 2, pending: 1, delivered: 1, event: { en: 'Priority release', zh: '优先发布' } },
    { time: '14:00', changed: 1, pending: 2, delivered: 0, event: { en: 'Lowered priority', zh: '降低优先级' } },
    { time: '18:00', changed: 0, pending: 0, delivered: 2, event: { en: 'Evening digest', zh: '晚间摘要' } },
    { time: '19:00', changed: 0, pending: 0, delivered: 0, event: { en: 'No change', zh: '无变化' } },
    { time: '23:00', changed: 1, pending: 1, delivered: 0, event: { en: 'Quiet hours', zh: '免打扰' } },
    { time: '07:00', changed: 0, pending: 0, delivered: 1, event: { en: 'Next morning', zh: '次日早晨' } },
    { time: '08:00', changed: null, pending: null, delivered: 0, event: { en: 'Source failed', zh: '来源故障' } },
  ];
  return <Diagram id="agent-watch-replay" title={{ en: 'One evening in the digest queue', zh: '一份晚报的入队与投递' }}
    caption={{ en: 'Three afternoon checks from a seven-check replay, using synthetic releases and a working web inbox. In the full log, each dot is one item. A dash marks missing source data.', zh: '图中三个时刻取自七次采集回放，使用合成发布数据和实际网页收件箱。完整记录里每个点代表一条内容，短横表示缺少来源数据。' }}>
    <AgentDigestReplay>
    <table className="agent-watch-table"><thead><tr>
      <th scope="col"><Text en="Check" zh="采集" /></th><th scope="col"><Text en="Updates" zh="有变化" /></th><th scope="col"><Text en="Queued" zh="待汇总" /></th><th scope="col"><Text en="Sent" zh="已送达" /></th>
    </tr></thead><tbody>{checks.map(row => <tr key={row.time} data-morning={row.time === '07:00' || undefined}>
      <th scope="row"><time>{row.time}</time><span className="agent-watch-event"><Text {...row.event} /></span></th>
      {(['changed','pending','delivered'] as const).map(field => <td key={field} data-stage={field}>
        <span className="sr-only">{row[field] === null ? <Text en="Unavailable" zh="暂无数据" /> : row[field]}</span>
        <span className="agent-count" aria-hidden="true">{row[field] === null ? '—' : row[field] === 0 ? '0' : Array.from({length: row[field]}, (_,i) => <i key={i} />)}</span>
      </td>)}</tr>)}</tbody></table>
    </AgentDigestReplay>
  </Diagram>;
}

function AgentContextSelection() {
  const strips = [
    { id: 'recent', title: { en: 'Recent turns only', zh: '只取最近对话' }, turns: [22, 23, 24] },
    { id: 'selected', title: { en: 'Selected for the SQLite request', zh: '为本次 SQLite 请求选取' }, turns: [3, 23, 24] },
  ];
  return <Diagram id="agent-context-selection" title={{ en: 'An earlier procedure fits back into the prompt', zh: '让早先的操作步骤回到提示里' }}
    caption={{ en: 'Each tick is one conversation turn, earliest on the left. Both selections had a 4,000-byte ceiling. The second also included the confirmed memory and used 3,894 bytes in total.', zh: '每一格代表一轮对话，按时间从左到右排列。两种选法的上限都是 4,000 字节。第二种还读入了已确认的记忆，共占 3,894 字节。' }}>
    <div className="agent-context-strips">{strips.map(strip => <div key={strip.id}>
      <div className="agent-strip-heading"><strong><Text {...strip.title} /></strong><span><Text en="Turns" zh="轮次" /> {strip.turns.join(' · ')}</span></div>
      <div className="agent-turns" aria-hidden="true">{Array.from({length: 24}, (_,i) => <i key={i} data-kept={strip.turns.includes(i + 1) || undefined} data-early={i === 2 && strip.id === 'selected' || undefined} />)}</div>
    </div>)}</div>
    <div className="agent-memory-note"><span className="agent-key-dot" aria-hidden="true" /><Text en="Turn 3 contains the earlier SQLite procedure." zh="第 3 轮保存了早先讨论的 SQLite 操作步骤。" /></div>
  </Diagram>;
}

function AgentBrowserMeasurements() {
  const measures = [
    { label: { en: 'API response per send', zh: '每次发送后的 API 回传' }, before: '31,645 B', after: '1,977 B', ratio: 1977 / 31645 },
    { label: { en: 'Request body sent to the model', zh: '发往模型的请求体' }, before: '30,591 B', after: '12,011 B', ratio: 12011 / 30591 },
    { label: { en: 'Send to first visible text', zh: '点击发送至首段可见' }, before: '19.2 ms', after: '19.0 ms', ratio: 19 / 19.2 },
  ];
  return <Diagram id="agent-browser-measurements" title={{ en: 'Response size fell. First-text latency held steady.', zh: '回传数据变少，首段等待时间几乎持平' }}
    caption={{ en: 'Medians from five fresh browser contexts per build, with 20 synthetic turns and a fixed streaming provider. Each pair uses its own baseline as the full width. B denotes bytes.', zh: '每版各用五个冷启动浏览器环境，采用相同的 20 轮合成历史与固定流式服务，图中为中位数。每组以自身基线为满宽。B 为字节。' }}>
    <div className="agent-measure-legend"><span><i aria-hidden="true" /><Text en="Baseline" zh="基线" /></span><span><i aria-hidden="true" /><Text en="Integrated build" zh="集成版" /></span></div>
    <dl className="agent-measures">{measures.map(metric => <div key={metric.label.en}>
      <dt><Text {...metric.label} /></dt>
      <dd><span aria-hidden="true" className="agent-bar" /><span><span className="sr-only"><Text en="Baseline" zh="基线" /> </span>{metric.before}</span></dd>
      <dd><span aria-hidden="true" className="agent-bar" style={{width: (metric.ratio * 100) + '%'}} /><span><span className="sr-only"><Text en="Integrated build" zh="集成版" /> </span>{metric.after}</span></dd>
    </div>)}</dl>
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
    case 'agent-collection-schedule': return <AgentCollectionSchedule />;
    case 'agent-context-selection': return <AgentContextSelection />;
    case 'agent-browser-measurements': return <AgentBrowserMeasurements />;
    case 'agent-watch-replay': return <AgentWatchReplay />;
    case 'agent-run-link': return <AgentRunLink />;
    case 'agent-report-evidence': return <AgentReportEvidence />;
    case 'agent-runtime-trace': return <AgentRuntimeTrace />;
    case 'agent-workflow-data': return <AgentWorkflowData />;
    case 'agent-message-transport': return <AgentMessageTransport />;
  }
}
