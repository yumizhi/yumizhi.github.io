import { education, experience } from '@/lib/content';
import { Localized } from './language';

export function HomeBackground() {
  const internship = experience[0];

  return (
    <div className="ph-records">
      <div className="ph-record-group">
        <h3><Localized en="Education" zh="教育" /></h3>
        <ul>
          {education.map((entry, index) => (
            <li key={entry.period}>
              <span className="ph-date">
                <Localized en={entry.period} zh={index === 0 ? '2023 — 至今' : '2019 — 2023'} />
              </span>
              <div>
                <strong><Localized en="Nanjing University" zh="南京大学" /></strong>
                <p><Localized en={entry.title} zh={index === 0 ? '计算机科学与技术 · 博士研究生' : '计算机科学与技术 · 本科'} /></p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="ph-record-group">
        <h3><Localized en="Experience" zh="经历" /></h3>
        <ul>
          <li>
            <span className="ph-date"><Localized en={internship.period} zh="2025 — 至今" /></span>
            <div>
              <strong><Localized en={internship.institution} zh="国电南京自动化股份有限公司" /></strong>
              <p><Localized en={internship.title} zh="研究实习生" /></p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
