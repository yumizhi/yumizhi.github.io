import { Localized } from '../language';
import './study-frameworks.css';

// Each tile depicts the same four by four image patch. The mask and the
// amplitude field share coordinates, so their product can be read by eye.
const amplitudes = [1, -2, 1, -1, -1, 2, 1, 2, 2, -1, -2, 1, -2, 1, -1, 2];
const support = [1, 5, 8, 13];

export function SasboFramework() {
  const fields = [
    { kind: 'mask', symbol: 'M', en: 'Selected entries', zh: '选中的坐标' },
    { kind: 'amplitude', symbol: 'E', en: 'Candidate amplitudes', zh: '候选改动幅度' },
    { kind: 'result', symbol: 'δ', en: 'Applied changes', zh: '实际改动' },
  ];
  return <figure className="coordinate-field detail-figure">
    <div className="coordinate-equation" aria-hidden="true">
      {fields.map(({kind, symbol, en, zh}, i) => <div className="coordinate-term" key={kind}>
        {i > 0 && <span className="coordinate-operator">{i === 1 ? '⊙' : '='}</span>}
        <div className="coordinate-swatch">{amplitudes.map((a, j) =>
          <i key={j} data-tone={kind === 'mask' ? (support.includes(j) ? 'on' : 'off') : kind === 'result' && !support.includes(j) ? 'off' : a}/>)}</div>
        <b>{symbol}</b><span><Localized en={en} zh={zh}/></span>
      </div>)}
    </div>
    <dl className="study-sequence">
      <div><dt><Localized en="Select ↔ adjust" zh="选择 ↔ 调整"/></dt><dd><Localized en="Paired binary masks compare combinations of entries. A separate estimate adjusts amplitudes at the retained locations." zh="配对的二值掩码比较坐标组合；另一项估计在保留位置上调整幅度。"/></dd></div>
      <div><dt><Localized en="Rank → prune" zh="排序 → 剪除"/></dt><dd><Localized en="The learned probabilities order the entries of a successful mask. Shorter prefixes test which changes can be removed." zh="将有效掩码中的坐标按学习概率排序，缩短前缀，检查哪些改动可以省去。"/></dd></div>
      <div><dt><Localized en="Evaluate the subset" zh="评价保留的子集"/></dt><dd><Localized en="A final classification tests the retained changes. Success rate and mean ℓ₀ quantify different aspects of the result." zh="重新分类确认保留的改动仍然有效。成功率与平均 ℓ₀ 分别记录结果和代价。"/></dd></div>
    </dl>
    <figcaption><Localized en="One channel of an illustrative image patch. The dark squares select four entries. Blue and rose indicate changes of opposite sign; their intensity indicates magnitude. Only the selected entries survive in the final field." zh="示意图截取一个通道的局部。深色方格选出四个坐标，蓝色与玫红代表相反的改动方向，色深表示幅度。两张图逐项相乘，只有选中的改动留在右图。"/></figcaption>
  </figure>;
}
