'use client';

import { useState } from 'react';
import { Localized } from '@/components/language';

const models = ['VGG19', 'VGG16', 'ResNet101', 'ResNet152', 'DenseNet201', 'DenseNet169'];

/** Fixed sequence of tasks, so the first render is identical on server and client. */
const tasks = [
  [0, 3, 4, 2],
  [5, 1, 2, 0],
  [3, 4, 5, 1],
  [2, 0, 5, 4],
  [1, 3, 0, 5],
  [4, 2, 1, 3],
];

/** One meta-learning task: the sampled models split into a support set and one query model. */
export function TaskLab() {
  const [index, setIndex] = useState(0);
  const task = tasks[index % tasks.length];
  const query = task[task.length - 1];
  const support = task.slice(0, -1);

  return (
    <div className="task-lab">
      <div className="task-lab-models">
        {models.map((name, id) => {
          const role = id === query ? 'query' : support.includes(id) ? 'support' : undefined;
          return (
            <div className="task-model" data-role={role} key={name}>
              <strong>{name}</strong>
              <span>
                {role === 'query' ? <Localized en="Query · held out" zh="查询集 · 留出" />
                  : role === 'support' ? <Localized en="Support" zh="支持集" />
                  : <Localized en="Not sampled" zh="未被采样" />}
              </span>
            </div>
          );
        })}
      </div>
      <div className="task-lab-steps">
        <div>
          <p className="label"><Localized en="Meta-training · K steps" zh="元训练 · K 步" /></p>
          <p>
            <Localized
              en={`Average the gradients of ${support.map(id => models[id]).join(', ')} and step the image along their sign.`}
              zh={`对 ${support.map(id => models[id]).join('、')} 的梯度加权平均，沿其符号方向更新图像。`}
            />
          </p>
        </div>
        <div>
          <p className="label"><Localized en="Meta-testing · 1 step" zh="元测试 · 1 步" /></p>
          <p>
            <Localized
              en={`Take the gradient of ${models[query]} at the updated image and apply it to the task's starting point.`}
              zh={`在更新后的图像上计算 ${models[query]} 的梯度，并将其作用于本任务的起点。`}
            />
          </p>
        </div>
      </div>
      <div className="task-lab-controls">
        <span><Localized en={`Task ${index + 1} · n = 4 models sampled from 6`} zh={`任务 ${index + 1} · 从 6 个模型中采样 n = 4 个`} /></span>
        <button className="pill" type="button" onClick={() => setIndex(value => value + 1)}>
          <Localized en="Sample next task" zh="采样下一个任务" />
        </button>
      </div>
    </div>
  );
}
