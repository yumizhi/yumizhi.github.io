import { asset } from '@/lib/paths';
import './tide-cover.css';

const samples = [
  { scene: 'interior', alt: 'A room lit by a tall window' },
  { scene: 'car', alt: 'A red sports car on a road' },
  { scene: 'street', alt: 'A street at dusk' },
  { scene: 'guitar', alt: 'An illustrated guitarist' },
];

export function TideCover({ priority = false }: { priority?: boolean }) {
  return (
    <div className="tide-cover">
      {samples.map(({ scene, alt }, index) => (
        <img key={scene} src={asset(`/images/tide-paper/tide-${scene}.webp`)} alt={alt} width={226} height={226}
          loading={priority ? 'eager' : 'lazy'} fetchPriority={priority && index === 0 ? 'high' : undefined} />
      ))}
    </div>
  );
}
