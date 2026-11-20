/** Keep compound research terms intact while allowing the title to wrap naturally. */
export function PaperTitle({ children }: { children: string }) {
  return <>{children.split(/(Trajectory-Aware|Text-to-Image)/).map((part, index) =>
    /^(Trajectory-Aware|Text-to-Image)$/.test(part)
      ? <span key={index} style={{ whiteSpace: 'nowrap' }}>{part}</span>
      : part
  )}</>;
}
