import { Localized } from '../language';
import { injectionData, injectionSteps } from '../research-experiment/injection-data';

const quality = [
  ['PSNR ↑', '∞', '15.11', '23.61', '24.53'],
  ['SSIM ↑', '1.000', '0.546', '0.757', '0.797'],
  ['MS-SSIM ↑', '1.000', '0.589', '0.871', '0.895'],
  ['CLIP-S ↑', '0.403', '0.364', '0.396', '0.403'],
  ['LPIPS ↓', '0', '0.501', '0.157', '0.147'],
  ['FID ↓', '25.63', '26.05', '26.86', '25.80'],
  ['FID† ↓', '0', '10.84', '6.37', '5.90'],
];

export function TideQualityTable() {
  return <div className="tide-table-wrap detail-text parameter-table"><table>
    <caption><Localized en="Table 2 · Fidelity on Stable Diffusion 2.1" zh="表 2 · Stable Diffusion 2.1 的图像保真度"/></caption>
    <thead><tr><th scope="col"><Localized en="Metric" zh="指标"/></th><th scope="col"><Localized en="Clean" zh="无水印"/></th><th scope="col">Tree-Ring</th><th scope="col">ROBIN</th><th scope="col">TIDE</th></tr></thead>
    <tbody>{quality.map(([label,...values]) => <tr key={label}><th scope="row">{label}</th>{values.map((v,i) => <td key={i}>{v}</td>)}</tr>)}</tbody>
  </table><p><Localized en="Reported means. PSNR is in dB. Arrows give the favourable direction. The clean column is the unwatermarked generator; the paper also reports variation across runs." zh="表中列出论文均值，PSNR 单位为 dB，箭头指示指标的较优方向。无水印列对应原生成器，各次运行间的波动见原论文。"/></p></div>;
}

export function TideTimingTable() {
  return <div className="tide-table-wrap detail-text parameter-table"><table>
    <caption><Localized en="Table 12 · Injection time and mean detection rate" zh="表 12 · 注入时刻与平均检出率"/></caption>
    <thead><tr><th scope="col"><Localized en="Step" zh="注入步"/></th><th scope="col"><Localized en="No guidance" zh="无引导"/></th><th scope="col"><Localized en="Fixed" zh="固定引导"/></th><th scope="col"><Localized en="Adaptive" zh="自适应引导"/></th></tr></thead>
    <tbody>{injectionSteps.map((step,index) => <tr key={step}><th scope="row">{step}</th>
      {(['none','fixed','adaptive'] as const).map(strategy => <td key={strategy}>{(injectionData[strategy][index].tpr[5] * 100).toFixed(1)}%</td>)}</tr>)}</tbody>
  </table><p><Localized en="Stable Diffusion 2.1. The entries are TPR at 1% FPR, averaged over blur, noise, JPEG, rotation and cropping. Table 1 additionally includes two reconstruction attacks." zh="Stable Diffusion 2.1。表中为 1% 假阳性率下的真阳性率，取模糊、加噪、JPEG、旋转和裁剪五项的均值。主表 1 还包含两种重建攻击。"/></p></div>;
}
