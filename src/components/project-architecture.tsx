import { ArrowRight, CalendarClock, Database, FileCheck2, FileCode2, GitFork, Inbox, Layers3 } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { Localized as Text } from './language';
import './project-architecture.css';

type FigureProps = {
  id: string;
  project?: string;
  title: { en: string; zh: string };
  caption: { en: string; zh: string };
  children: ReactNode;
};

export function Diagram({ id, project, title, caption, children }: FigureProps) {
  return (
    <figure className="architecture-figure" id={id} data-project={project} aria-labelledby={`${id}-label`}>
      <div className="architecture-plate">
        <p className="architecture-plate-label" id={`${id}-label`}><Text {...title} /></p>
        {children}
      </div>
      <figcaption><Text {...caption} /></figcaption>
    </figure>
  );
}

export function FlowArrow() {
  return <ArrowRight className="architecture-arrow" size={22} strokeWidth={1.5} aria-hidden="true" />;
}

function EpubArchitecture() {
  return (
    <Diagram id="epub-toolkit-overview" project="epub-toolkit"
      title={{ en: 'The EPUB archive and its merge record', zh: 'EPUB 合集与内嵌合并记录' }}
      caption={{
        en: 'The combined EPUB 3 lists its resources in the manifest and its reading order in the spine. A separate merge record stores the source paths and chapter order used to reconstruct each volume.',
        zh: '合集按 EPUB 3 打包，manifest 列出可用资源，spine 规定章节顺序。拆分时用到的原始路径和各卷阅读顺序另存于合并记录。',
      }}>
      <div className="epub-map">
        <div className="epub-source">
          <p className="architecture-overline"><Text en="Source volumes" zh="原始分卷" /></p>
          <div className="epub-sheet" data-tint="purple">
            <FileCode2 size={19} aria-hidden="true" />
            <div><strong><Text en="Volume A" zh="第一卷" /></strong><code>chapters/01.xhtml</code></div>
          </div>
          <div className="epub-sheet" data-tint="blue">
            <FileCode2 size={19} aria-hidden="true" />
            <div><strong><Text en="Volume B" zh="第二卷" /></strong><code>chapters/01.xhtml</code></div>
          </div>
        </div>
        <FlowArrow />
        <div className="epub-engine">
          <p className="architecture-overline"><Text en="Browser worker · Node CLI" zh="浏览器 Worker · Node CLI" /></p>
          <strong><Text en="TypeScript archive engine" zh="TypeScript 归档引擎" /></strong>
          <ol className="epub-engine-operations">
            <li><Text en="Read OPF and navigation" zh="读取 OPF 与目录" /></li>
            <li><Text en="Assign resource paths" zh="分配资源路径" /></li>
            <li><Text en="Rewrite local references" zh="重写本地引用" /></li>
          </ol>
        </div>
        <FlowArrow />
        <div className="epub-archive">
          <div className="epub-archive-head"><Layers3 size={19} aria-hidden="true" /><strong><Text en="Merged EPUB" zh="EPUB 合集" /></strong></div>
          <ul role="list" className="epub-archive-contents">
            <li><code>v1/chapters/01.xhtml</code></li>
            <li><code>v2/chapters/01.xhtml</code></li>
            <li><Text en="Shared font · OPF · navigation" zh="共享字体 · OPF · 目录" /></li>
            <li className="epub-record"><Text en="Merge record" zh="合并记录" /><small><Text en="Original paths and reading order" zh="各卷原路径与阅读顺序" /></small></li>
          </ul>
        </div>
      </div>
      <div className="epub-recovery">
        <GitFork size={18} strokeWidth={1.65} aria-hidden="true" />
        <div>
          <strong><Text en="Splitting reads the same record" zh="拆分时读取同一份记录" /></strong>
          <p><Text en="The shared TypeScript engine and the independent Python CLI can both rebuild the original volumes." zh="共享的 TypeScript 引擎与独立的 Python 命令行工具都能按记录重建原卷。" /></p>
        </div>
      </div>
    </Diagram>
  );
}

const sequence = [
  { from: 1, to: 2, en: 'Submit operation', zh: '提交操作', parties: { en: 'Studio to API', zh: '工作台 → API' } },
  { from: 2, to: 3, en: 'Store Run, Job and outbox together', zh: '同一事务写入 Run、Job 和待投递消息', parties: { en: 'API to PostgreSQL', zh: 'API → PostgreSQL' } },
  { from: 3, to: 4, en: 'Dispatcher delivers through RabbitMQ', zh: '分发器经 RabbitMQ 投递', parties: { en: 'Outbox to Worker', zh: '待投递消息 → Worker' } },
  { from: 4, to: 3, en: 'Claim job and renew lease', zh: '领取任务并续租', parties: { en: 'Worker to PostgreSQL', zh: 'Worker → PostgreSQL' } },
  { from: 4, to: 5, en: 'Run the selected model', zh: '调用选定的模型', parties: { en: 'Worker to model runtime', zh: 'Worker → 模型运行时' } },
  { from: 5, to: 4, en: 'Return file or detection result', zh: '返回文件或检测结果', parties: { en: 'Model runtime to Worker', zh: '模型运行时 → Worker' } },
  { from: 4, to: 3, en: 'Commit output under the current lease', zh: '凭有效租约登记结果', parties: { en: 'Worker to PostgreSQL', zh: 'Worker → PostgreSQL' } },
  { from: 2, to: 1, en: 'Stream recorded events', zh: '推送已保存的事件', parties: { en: 'API to Studio', zh: 'API → 工作台' } },
];

function OriginMarkArchitecture() {
  return (
    <Diagram id="originmark-overview" project="originmark"
      title={{ en: 'OriginMark job dispatch and publication', zh: 'OriginMark 的任务分发与发布登记' }}
      caption={{
        en: 'PostgreSQL records both the work and its outcome. The worker calls the selected engine and controls publication. Studio reads the recorded events after a reconnect.',
        zh: 'PostgreSQL 保存任务与结果，Worker 调用模型并负责登记发布。工作台可以在重新连接后接着读取已保存的事件。',
      }}>
      <div className="origin-sequence">
        <div className="origin-lanes" aria-hidden="true">
          <span><Text en="Studio" zh="工作台" /></span><span>FastAPI</span><span>PostgreSQL</span><span>Worker</span><span><Text en="Model runtime" zh="模型运行时" /></span>
        </div>
        <ol className="origin-events" role="list">
          {sequence.map(event => (
            <li key={event.en} className="origin-event">
              <span className="origin-event-parties"><Text {...event.parties} /></span>
              <div className="origin-event-track" data-direction={event.from < event.to ? 'right' : 'left'}
                style={{
                  gridColumn: `${Math.min(event.from, event.to)} / ${Math.max(event.from, event.to) + 1}`,
                  '--lane-inset': `${50 / (Math.abs(event.from - event.to) + 1)}%`,
                } as CSSProperties}>
                <span><Text en={event.en} zh={event.zh} /></span>
                <i aria-hidden="true" />
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="origin-results">
        <div>
          <strong><Text en="Protect" zh="保护" /></strong>
          <p><Text en="Final PNG → watermark and signature checks → published release" zh="最终 PNG → 回读水印与验签 → 发布记录" /></p>
        </div>
        <div>
          <strong><Text en="Verify" zh="验证" /></strong>
          <p><Text en="Supplied file → separate watermark, signature and issuer findings" zh="输入文件 → 分别报告水印、签名和签发者信任" /></p>
        </div>
      </div>
    </Diagram>
  );
}

function AgentArchitecture() {
  return (
    <Diagram id="personal-agent-overview" project="personal-agent"
      title={{ en: 'Personal tasks, project runs and delivery', zh: '个人任务、项目执行与结果投递' }}
      caption={{ en: 'The workspace and Studio use the same identity and model-access system. A scheduled application links the member’s task to a versioned project run. Personal memory stays scoped to the member.', zh: '成员工作台和 Studio 使用同一套账号和模型授权。定时调用应用时，个人任务关联到锁定版本的项目运行。个人记忆始终受成员权限约束。' }}>
      <ol className="agent-map" role="list">
        <li className="agent-stage">
          <div className="agent-stage-head"><CalendarClock size={21} aria-hidden="true" /><strong><Text en="Work & Build" zh="交办与构建" /></strong></div>
          <dl>
            <dt><Text en="Web, QQ & WeChat" zh="网页、QQ 与微信" /></dt>
            <dd><Text en="A bound identity drafts and approves a task." zh="在已绑定的身份下起草、批准任务。" /></dd>
            <dt><Text en="Studio" zh="开发者工作室" /></dt>
            <dd><Text en="Test an agent or workflow and publish its snapshot." zh="调试 Agent 或工作流，发布版本快照。" /></dd>
          </dl>
        </li>
        <li className="agent-stage">
          <FlowArrow />
          <div className="agent-stage-head"><Database size={21} aria-hidden="true" /><strong><Text en="Execution" zh="持久化执行" /></strong></div>
          <dl>
            <dt><Text en="Scheduler & worker" zh="调度器与工作进程" /></dt>
            <dd><Text en="Claim due work and commit each finished step to SQLite." zh="领取到期任务，把已完成的步骤写入 SQLite。" /></dd>
            <dt><Text en="Runtime & tools" zh="运行时与工具" /></dt>
            <dd><Text en="Resolve the model, retrieve scoped evidence and obtain approval for writes." zh="选择获准的模型，检索范围内的资料，为写入请求审批。" /></dd>
          </dl>
        </li>
        <li className="agent-stage">
          <FlowArrow />
          <div className="agent-stage-head"><Inbox size={21} aria-hidden="true" /><strong><Text en="Results" zh="成果与回查" /></strong></div>
          <dl>
            <dt><Text en="Inbox or bound channel" zh="收件箱或绑定渠道" /></dt>
            <dd><Text en="Read the report and open its sources and attachments." zh="阅读报告，打开对应来源和附件。" /></dd>
            <dt><Text en="Replay & evaluation" zh="执行回放与评测" /></dt>
            <dd><Text en="Revisit the run and keep the original input for a future version." zh="重看当次执行，用原始输入检验后续版本。" /></dd>
          </dl>
        </li>
      </ol>
      <div className="agent-evidence">
        <FileCheck2 size={18} aria-hidden="true" />
        <strong><Text en="Saved evidence" zh="运行保留的证据" /></strong>
        <ul role="list"><li><Text en="Workflow version" zh="工作流版本" /></li><li><Text en="Cited passage" zh="引用原文" /></li><li><Text en="Delivery receipt" zh="投递回执" /></li></ul>
      </div>
    </Diagram>
  );
}

export function ProjectArchitecture({ slug }: { slug: string }) {
  switch (slug) {
    case 'epub-toolkit': return <EpubArchitecture />;
    case 'originmark': return <OriginMarkArchitecture />;
    case 'personal-agent': return <AgentArchitecture />;
    default: return null;
  }
}
