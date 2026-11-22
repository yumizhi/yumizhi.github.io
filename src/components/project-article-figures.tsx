import Image from 'next/image';
import { ArrowLeftRight, ArrowRight, Check, CircleMinus, Clock3, Cpu, FileCode2, FileText, Monitor, RotateCcw, ShieldX } from 'lucide-react';
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
      title={{ en: 'EPUB processing in a browser worker', zh: '浏览器工作线程中的 EPUB 处理' }}
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
        en: 'Two volumes share the same PNG. The collection stores it once. Splitting restores the image at the path used by each volume’s stylesheet.',
        zh: '两卷书共用同一张 PNG，合集只保存一份。拆分时，插图回到各卷样式表原先引用的位置。',
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
      title={{ en: 'Retrying a job after its lease expires', zh: '租约过期后的任务重试' }}
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
      title={{ en: 'Scheduled occurrence and application run', zh: '任务排期与对应的应用运行' }}
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

export function ProjectArticleFigure({ figure }: { figure: ArticleFigure }) {
  switch (figure) {
    case 'epub-worker-handoff': return <EpubWorkerFigure />;
    case 'epub-path-roundtrip': return <EpubRoundTrip />;
    case 'originmark-teapot-report': return <TeapotReport />;
    case 'originmark-lease-recovery': return <LeaseRecovery />;
    case 'agent-run-link': return <AgentRunLink />;
    case 'agent-runtime-trace': return <AgentRuntimeTrace />;
  }
}
