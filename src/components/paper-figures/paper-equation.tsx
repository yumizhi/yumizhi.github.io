import katex from 'katex';

export function PaperEquation({ math, number }: { math: string; number?: string }) {
  const markup = katex.renderToString(math, {
    displayMode: true,
    output: 'htmlAndMathml',
    throwOnError: true,
  });

  return (
    <div className="paper-equation" data-numbered={Boolean(number)}>
      <div className="paper-equation-math" dangerouslySetInnerHTML={{ __html: markup }} />
      {number && <span className="paper-equation-number">({number})</span>}
    </div>
  );
}
