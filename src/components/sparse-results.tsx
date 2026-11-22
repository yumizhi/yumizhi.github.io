import { Localized } from './language';
import { ComparisonChart } from './comparison-chart';

// Tables 1 and 3, CIFAR-10. l0 counts nonzero tensor entries.
const methods = [
  ['PGD-ℓ₀ + ℓ∞', 48.01, 54.03], ['SparseFool', 22.03, null],
  ['GreedyFool', 12.29, 48.99], ['SASBO', 3.95, 14.88],
] as const;

export function SparseResults() {
  return <>
    <ComparisonChart
      title={{en:'Coordinate cost at equal success', zh:'相同成功率下的坐标开销'}}
      note={{en:'CIFAR-10, ε = 255. Horizontal axis: mean number of changed entries. Every displayed method reached 100% success in its reported setting.', zh:'CIFAR-10，ε = 255。横轴为改动坐标数的均值。所示方法在各自有报告的设置下均达到 100% 成功率。'}}
      series={[{label:{en:'Untargeted',zh:'非定向'}},{label:{en:'Targeted',zh:'定向'},accent:true}]}
      rows={methods.flatMap(([label,a,b])=> b === null ? [] : [{label,values:[a,b]}])}
      maximum={60} suffix="" decimals={2} />
    <div className="tide-table-wrap"><table>
      <caption><Localized en="Tables 1 and 3 · CIFAR-10, ε = 255 · ASR (%) and mean ℓ₀ (entries)" zh="表 1、3 · CIFAR-10，ε = 255 · 成功率（%）与平均 ℓ₀（坐标数）" /></caption>
      <thead><tr><th rowSpan={2} scope="col"><Localized en="Method" zh="方法" /></th>
        <th colSpan={2} scope="colgroup"><Localized en="Untargeted" zh="非定向" /></th><th colSpan={2} scope="colgroup"><Localized en="Targeted" zh="定向" /></th>
      </tr><tr><th scope="col">ASR</th><th scope="col">ℓ₀</th><th scope="col">ASR</th><th scope="col">ℓ₀</th></tr></thead>
      <tbody>{methods.map(([name,u,t])=><tr key={name}><th scope="row">{name}</th><td>100</td><td>{u.toFixed(2)}</td><td>{t === null ? '—' : '100'}</td><td>{t?.toFixed(2) ?? '—'}</td></tr>)}</tbody>
    </table><p><Localized en="SparseFool was evaluated only in the untargeted comparison. Each target label in the targeted comparison was shared across methods." zh="SparseFool 仅参与非定向对照。定向对照为每张图指定同一目标类别，供所有方法比较。" /></p></div>
  </>;
}

// Transposed from Tables 1–4 so that each self-contained row fits a phone.
const amplitudeSweep = [
  ['CIFAR-10', false, ['3.95', '7.90', '144.21']],
  ['CIFAR-10', true, ['14.88', '29.94', '324.14']],
  ['ImageNet', false, ['50.87', '145.77', '1051.24']],
  ['ImageNet', true, ['272.95', '600.80', '4782.61']],
] as const;

export function SparseAmplitudeTable() {
  return <div className="tide-table-wrap detail-text parameter-table"><table>
    <caption><Localized en="Tables 1–4 · SASBO mean ℓ₀ under three amplitude caps" zh="表 1–4 · SASBO 在三个幅度上限下的平均 ℓ₀"/></caption>
    <thead><tr><th scope="col"><Localized en="Setting" zh="实验设置"/></th>{[255,100,10].map(e=><th scope="col" key={e}>ε = {e}</th>)}</tr></thead>
    <tbody>{amplitudeSweep.map(([data,targeted,results])=><tr key={data+targeted}><th scope="row">{data}<br/>
      {targeted ? <Localized en="Targeted" zh="定向"/> : <Localized en="Untargeted" zh="非定向"/>}</th>{results.map((r,i)=><td key={i}>{r}</td>)}</tr>)}</tbody>
  </table><p><Localized en="Mean number of nonzero image entries. SASBO recorded 100% success in all twelve settings. Targeted and untargeted comparisons used the same amplitude caps on their respective datasets." zh="数值为图像非零改动坐标数的均值。SASBO 在这十二个设置的成功率均为 100%。同一数据集的定向与非定向实验采用相同的幅度上限。"/></p></div>;
}
