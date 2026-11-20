import { Localized } from '@/components/language';
import { asset } from '@/lib/paths';
import './sparse-covers.css';

/** Paper figures stay intact; the surrounding page provides the study title. */
export function SparseStudyCover({ study }: { study: 'sasbo' | 'sam' }) {
  if (study === 'sam') {
    return (
      <figure className="sparse-study-cover sparse-study-cover--sam">
        <img
          className="sparse-study-method"
          src={asset('/images/sam-meta-learning.webp')}
          width={964}
          height={604}
          alt="Meta-learning: episodes drawn from a base set during meta-training, and separate support and query sets during meta-testing."
          loading="lazy"
        />
      </figure>
    );
  }

  return (
    <figure className="sparse-study-cover sparse-study-cover--sasbo">
      <div className="sparse-study-plate">
        <img
          src={asset('/images/sasbo-comparison-plate.webp')}
          width={693}
          height={460}
          alt="SASBO comparison: original images, adversarial images and sparse perturbations, for a beagle and a flower."
          loading="lazy"
        />
        <div className="sparse-study-labels" aria-hidden="true">
          <span><Localized en="Original" zh="原图" /></span>
          <span><Localized en="SASBO" zh="SASBO" /></span>
          <span><Localized en="Perturbation" zh="扰动" /></span>
        </div>
      </div>
    </figure>
  );
}
