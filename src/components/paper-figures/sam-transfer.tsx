import { Localized } from '../language';

// CIFAR-10, Table VI, models 7–12. Columns are SA and SAM in each setting.
const rows = [
  ['ResNeXt50', 67.2, 88.5, 31.3, 43.9], ['ResNet50', 64.3, 88.1, 23.2, 50.8],
  ['DenseNet161', 68.2, 91.5, 25.8, 48.5], ['GoogLeNet', 73.8, 86.6, 20.8, 45.8],
  ['MobileNetV2', 67.3, 79.4, 24.4, 43.3], ['MnasNet1.0', 69.8, 78.8, 28.2, 57.0],
] as const;

export function SamTransfer() {
  return <figure className="sam-transfer detail-figure"><div className="sam-transfer-panels">
    {([0,1] as const).map(setting => <table key={setting}>
      <caption>{setting === 0 ? <Localized en="50 pixels · ε = 255" zh="50 个像素 · ε = 255"/> : <Localized en="300 pixels · ε = 16" zh="300 个像素 · ε = 16"/>}</caption>
      <thead><tr><th scope="col"><Localized en="Target" zh="目标模型" /></th><th scope="col">SA</th><th scope="col" className="sam-range"><span>0%</span><span>100%</span></th><th scope="col">SAM</th></tr></thead>
      <tbody>{rows.map(([model, sa1, sam1, sa2, sam2]) => {
        const [sa, sam] = setting === 0 ? [sa1, sam1] : [sa2, sam2];
        return <tr key={model}><th scope="row">{model}</th><td>{sa.toFixed(1)}%</td>
          <td aria-hidden="true"><div className="sam-transfer-axis"><i style={{left: sa+'%',width: (sam-sa)+'%'}} /></div></td><td>{sam.toFixed(1)}%</td>
        </tr>;
      })}</tbody>
    </table>)}
    </div><figcaption><Localized en="CIFAR-10, Table VI. Each line joins the success rates of the single-model baseline SA (open dot) and SAM (filled dot) on one held-out classifier. Both panels use the same percentage scale. The six targets contributed no gradients during optimization." zh="CIFAR-10，论文表 VI。每条线连接同一独立分类器上的成功率：空心点为单模型基线 SA，实心点为 SAM。两组共用相同的百分比尺度。六个目标分类器均未参与优化。" /></figcaption>
  </figure>;
}
