import { Fragment } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, BookOpen, Check, Clock3, FileText, Inbox, Layers3 } from 'lucide-react';
import { Localized } from './language';
import { asset } from '@/lib/paths';

const paths = {
  collect: ['chapters/01.xhtml', 'chapters/01.xhtml'],
  merge: ['v1/chapters/01.xhtml', 'v2/chapters/01.xhtml'],
  restore: ['chapters/01.xhtml', 'chapters/01.xhtml'],
};

function EpubTrace({ step, animate }: { step: string; animate: boolean }) {
  const phase = step === 'merge' || step === 'restore' ? step : 'collect';
  const merged = phase === 'merge';

  return (
    <div className="trace-epub" data-phase={phase}>
      <div className="trace-epub-volumes">
        {paths[phase].map((path, index) => (
          <div key={index}>
            <div className="trace-epub-label"><BookOpen size={15} aria-hidden="true" />
              <Localized en={index === 0 ? 'Volume A' : 'Volume B'} zh={index === 0 ? '分卷 A' : '分卷 B'} />
            </div>
            <code>
              {path.split('/').map((part, position, pieces) => (
                <Fragment key={part}>{part}{position < pieces.length - 1 && <>/<wbr /></>}</Fragment>
              ))}
            </code>
          </div>
        ))}
      </div>
      <svg className="trace-epub-connector" viewBox="0 0 400 34" preserveAspectRatio="none" aria-hidden="true">
        <motion.path
          d={phase === 'restore' ? 'M200 34 V20 H100 V0 M200 20 H300 V0' : 'M100 0 V14 H200 V34 M300 0 V14 H200'}
          initial={animate ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }}
          transition={{ duration: animate ? .42 : 0, ease: 'easeOut' }}
        />
      </svg>
      <div className="trace-epub-record">
        {merged ? <Layers3 size={17} aria-hidden="true" /> : <FileText size={17} aria-hidden="true" />}
        {merged
          ? <Localized en="One copy of the shared font, plus a mapping back to both volumes" zh="保留一份共用字体，并记录它与两卷书的对应关系" />
          : phase === 'restore'
            ? <Localized en="Both rebuilt volumes contain their own referenced font" zh="重建后的两卷都包含各自引用的字体" />
            : <Localized en="Same chapter path in separate books · same font in both" zh="两卷有同名章节，并引用同一份字体内容" />}
      </div>
    </div>
  );
}

function OriginTrace({ step, animate }: { step: string; animate: boolean }) {
  const verify = step === 'verify';
  const generate = step === 'generate';
  const records = verify ? [
    { key: 'watermark', en: 'TIDE watermark', zh: 'TIDE 水印', enValue: 'Detected', zhValue: '已检出' },
    { key: 'credential', en: 'Content credential', zh: '内容凭证', enValue: 'No credential', zhValue: '无凭证' },
    { key: 'issuer', en: 'Issuer trust', zh: '签发者信任', enValue: 'Not evaluated', zhValue: '未评估' },
  ] : generate ? [
    { key: 'reference', en: 'Reference branch', zh: '参考分支', enValue: 'Clean image', zhValue: '无水印图像' },
    { key: 'tide', en: 'TIDE branch', zh: 'TIDE 分支', enValue: 'Marked image', zhValue: '带水印图像' },
  ] : [
    { key: 'write', en: 'Write', zh: '写入', enValue: 'Watermark and signed credential', zhValue: '水印与签名凭证' },
    { key: 'check', en: 'Validate', zh: '校验', enValue: 'Check the final file', zhValue: '核验最终文件' },
    { key: 'release', en: 'Register', zh: '登记', enValue: 'Release tied to the checked file', zhValue: '发布记录绑定已校验文件' },
  ];

  return (
    <div className="trace-origin" data-phase={step}>
      <div className="trace-origin-image">
        <img src={asset(generate ? '/images/projects/originmark-generate.webp' : '/images/projects/originmark-cover.webp')}
          width={generate ? 868 : 477} height={generate ? 716 : 296} loading="lazy"
          alt={generate ? 'OriginMark comparison of the clean and watermarked generation' : 'Ceramic teapot and pitcher in the OriginMark demonstration'} />
        <span>{generate ? <Localized en="Generation pair" zh="生成样例" /> : <Localized en="Demo image" zh="演示图像" />}</span>
      </div>
      <dl className="trace-origin-evidence">
        {records.map((item, index) => (
          <motion.div key={item.key} data-evidence={item.key}
            initial={animate ? { opacity: 0, x: 6 } : false} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .16, delay: animate ? index * .055 : 0 }}>
            <dt><Localized en={item.en} zh={item.zh} /></dt>
            <dd><Localized en={item.enValue} zh={item.zhValue} /></dd>
          </motion.div>
        ))}
      </dl>
    </div>
  );
}

function AgentTrace({ step, animate }: { step: string; animate: boolean }) {
  if (step === 'plan') {
    return (
      <div className="trace-agent-sheet" data-phase="plan">
        <div className="trace-agent-sheet-title"><Clock3 size={17} aria-hidden="true" /><Localized en="Scheduled inspection plan" zh="定时巡检计划" /></div>
        <dl>
          <div><dt><Localized en="Task" zh="任务" /></dt><dd><Localized en="Prepare a P-17 inspection brief" zh="整理 P-17 泵组巡检简报" /></dd></div>
          <div><dt><Localized en="Assistant" zh="助手" /></dt><dd><Localized en="Equipment maintenance assistant" zh="设备维护助手" /></dd></div>
          <div><dt><Localized en="Delivery" zh="交付去向" /></dt><dd><Localized en="Web inbox" zh="网页收件箱" /></dd></div>
        </dl>
      </div>
    );
  }

  if (step === 'execute') {
    const events = [
      { en: 'Accept task input', zh: '接收任务输入' },
      { en: 'Run the approved assistant', zh: '运行已批准的助手' },
      { en: 'Generate the report', zh: '生成巡检报告' },
      { en: 'Deliver to the project inbox', zh: '投递到项目收件箱' },
    ];

    return (
      <ol className="trace-agent-events" data-phase="execute">
        {events.map((event, index) => (
          <motion.li key={event.en}
            initial={animate ? { opacity: 0, x: -6 } : false} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .16, delay: animate ? index * .09 : 0 }}>
            <Check size={15} aria-hidden="true" />
            <span><Localized {...event} /></span>
            <small><Localized en="Completed" zh="已完成" /></small>
          </motion.li>
        ))}
      </ol>
    );
  }

  return (
    <div className="trace-agent-delivery" data-phase="deliver">
      <div><FileText size={19} aria-hidden="true" /><strong><Localized en="Inspection brief" zh="巡检简报" /></strong><span><Localized en="Links to material used in this run" zh="包含本次运行使用的资料引用" /></span></div>
      <ArrowDown size={19} aria-hidden="true" />
      <div><Inbox size={19} aria-hidden="true" /><strong><Localized en="Inbox receipt" zh="收件箱回执" /></strong><span><Localized en="Web inbox accepted the report" zh="网页收件箱已接收报告" /></span></div>
    </div>
  );
}

export function ProjectTraceVisual({ slug, step, animate }: { slug: string; step: string; animate: boolean }) {
  if (slug === 'epub-toolkit') return <EpubTrace step={step} animate={animate} />;
  if (slug === 'originmark') return <OriginTrace step={step} animate={animate} />;
  if (slug === 'personal-agent') return <AgentTrace step={step} animate={animate} />;
  return null;
}
