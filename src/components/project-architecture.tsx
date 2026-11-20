import { ArrowRight, CalendarClock, Database, FileCheck2, FileCode2, GitFork, Inbox, Layers3 } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { Localized as Text } from './language';
import './project-architecture.css';

type FigureProps = {
  slug: string;
  title: { en: string; zh: string };
  caption: { en: string; zh: string };
  children: ReactNode;
};

function Diagram({ slug, title, caption, children }: FigureProps) {
  return (
    <figure className="architecture-figure" data-project={slug} aria-labelledby={`architecture-${slug}-label`}>
      <div className="architecture-plate">
        <p className="architecture-plate-label" id={`architecture-${slug}-label`}><Text {...title} /></p>
        {children}
      </div>
      <figcaption><Text {...caption} /></figcaption>
    </figure>
  );
}

function FlowArrow() {
  return <ArrowRight className="architecture-arrow" size={22} strokeWidth={1.5} aria-hidden="true" />;
}

function EpubArchitecture() {
  return (
    <Diagram slug="epub-toolkit"
      title={{ en: 'The EPUB archive and its merge record', zh: 'EPUB 合集与内嵌合并记录' }}
      caption={{
        en: 'The output is a regular EPUB 3. Its manifest and spine serve the reader, and the embedded merge record gives the split tool the source paths and reading order for each volume.',
        zh: '合集按 EPUB 3 打包。阅读器通过清单和 spine 打开书籍，拆分工具则读取随书保存的原始路径和各卷阅读顺序。',
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
    <Diagram slug="originmark"
      title={{ en: 'An OriginMark run from submission to commit', zh: 'OriginMark 任务从提交到结果登记' }}
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
    <Diagram slug="personal-agent"
      title={{ en: 'A scheduled application and its delivery records', zh: '定时应用的执行与交付记录' }}
      caption={{
        en: 'The approved plan pins the application release. SQLite links each scheduled occurrence to its run. The inbox receipt leads back to that run and its evidence.',
        zh: '批准计划时固定应用版本。SQLite 保存每次排期触发与应用运行的关联。收件箱的投递回执可以追溯到这次运行及其引用资料。',
      }}>
      <ol className="agent-map" role="list">
        <li className="agent-stage">
          <div className="agent-stage-head"><CalendarClock size={21} strokeWidth={1.65} aria-hidden="true" /><strong><Text en="Before the scheduled time" zh="排期确认" /></strong></div>
          <dl>
            <dt><Text en="Project Studio" zh="项目 Studio" /></dt>
            <dd><Text en="Publish an agent or workflow snapshot." zh="发布 Agent 或工作流的版本快照。" /></dd>
            <dt><Text en="Approved plan" zh="已批准的计划" /></dt>
            <dd><Text en="Pin the app version, time zone and recipient." zh="固定应用版本、时区和收件人。" /></dd>
          </dl>
        </li>
        <li className="agent-stage">
          <FlowArrow />
          <div className="agent-stage-head"><Database size={21} strokeWidth={1.65} aria-hidden="true" /><strong><Text en="When the schedule fires" zh="后台执行" /></strong></div>
          <dl>
            <dt><Text en="Scheduler → SQLite" zh="调度器 → SQLite" /></dt>
            <dd><Text en="Link this occurrence to its application run." zh="保存本次排期实例与应用运行的关联。" /></dd>
            <dt><Text en="Application worker" zh="应用 Worker" /></dt>
            <dd><Text en="Read project sources and wait for approval on a gated write." zh="读取项目资料，需审批的写入先挂起。" /></dd>
          </dl>
        </li>
        <li className="agent-stage">
          <FlowArrow />
          <div className="agent-stage-head"><Inbox size={21} strokeWidth={1.65} aria-hidden="true" /><strong><Text en="After the run" zh="结果交付" /></strong></div>
          <dl>
            <dt><Text en="Report and artifact" zh="报告与附件" /></dt>
            <dd><Text en="Store the citations from this run." zh="保留本次运行所用的原文引用。" /></dd>
            <dt><Text en="Member inbox" zh="成员收件箱" /></dt>
            <dd><Text en="Record delivery and link to the original run." zh="记录投递结果，并链接到原运行。" /></dd>
          </dl>
        </li>
      </ol>
      <div className="agent-evidence">
        <FileCheck2 size={18} strokeWidth={1.65} aria-hidden="true" />
        <strong><Text en="Trace from the report" zh="从报告回溯" /></strong>
        <ul role="list">
          <li><Text en="Run record" zh="运行记录" /></li>
          <li><Text en="Cited passage" zh="引用原文" /></li>
          <li><Text en="Delivery receipt" zh="投递回执" /></li>
        </ul>
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
