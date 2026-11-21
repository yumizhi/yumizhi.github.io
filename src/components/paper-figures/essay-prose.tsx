import { Localized } from '../language';
import type { EssayChapter } from './essay-chapters';

export function EssayProse({ chapters }: { chapters: EssayChapter[] }) {
  return chapters.flatMap(({ title, body }) => {
    const paragraphs = body.map(paragraph => (
      <p key={paragraph.en} className="tide-prose"><Localized {...paragraph} /></p>
    ));
    return title ? [
      <section key={title.en}>
        <h3 className="paper-subsection"><Localized {...title} /></h3>
        {paragraphs}
      </section>,
    ] : paragraphs;
  });
}
