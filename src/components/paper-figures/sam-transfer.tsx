import { Localized } from '../language';

// CIFAR-10, Table VI, models 7–12. Both rows use 50 pixels at ε = 255.
const rows = [
  ['ResNeXt50', 67.2, 88.5], ['ResNet50', 64.3, 88.1],
  ['DenseNet161', 68.2, 91.5], ['GoogLeNet', 73.8, 86.6],
  ['MobileNetV2', 67.3, 79.4], ['MnasNet1.0', 69.8, 78.8],
] as const;

export function SamTransfer() {
  return <figure className="sam-transfer">
    <table>
      <caption><Localized en="Transfer across six held-out classifiers" zh="六种独立分类器上的迁移表现" /></caption>
      <thead><tr><th scope="col"><Localized en="Target" zh="目标模型" /></th><th scope="col">SA</th><th scope="col" className="sam-range"><span>0%</span><span>100%</span></th><th scope="col">SAM</th></tr></thead>
      <tbody>{rows.map(([model, sa, sam]) => <tr key={model}>
        <th scope="row">{model}</th><td>{sa.toFixed(1)}%</td>
        <td aria-hidden="true"><div className="sam-transfer-axis"><i style={{left: sa+'%',width: (sam-sa)+'%'}} /></div></td><td>{sam.toFixed(1)}%</td>
      </tr>)}</tbody>
    </table>
    <figcaption><Localized en="CIFAR-10, Table VI. Each line joins the single-model baseline (open dot) to SAM (filled dot) on the same target. Both use 50 pixels with an amplitude cap of 255." zh="CIFAR-10，论文表 VI。每条线连接同一目标模型上的单模型基线 SA（空心点）与 SAM（实心点）。两组均使用 50 个像素，幅度上限为 255。" /></figcaption>
  </figure>;
}
