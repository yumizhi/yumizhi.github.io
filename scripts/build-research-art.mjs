// Builds derived research artwork from the real TIDE sampling run in
// public/media/tide/sampling (SD 2.1, 50 steps, watermark written after step 35).
// Nothing here is synthesised: every pixel comes from the stored clean-image
// estimates, and the drift numbers are measured from those same frames.
//
//   node scripts/build-research-art.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'public/media/tide/sampling');
const out = path.join(root, 'public/images/art');
const STEPS = 50;
const frame = (mode, step) => path.join(source, `${mode}-${String(step).padStart(2, '0')}.webp`);

async function raw(mode, step, size) {
  return sharp(frame(mode, step)).resize(size, size).removeAlpha().raw().toBuffer();
}


/** The same idea as a wide banner: frames are scaled to the banner width and cropped to a band. */
async function wideSlice(mode, width, height, top, file) {
  const layers = [];
  for (let step = 1; step <= STEPS; step += 1) {
    const left = Math.round(((step - 1) * width) / STEPS);
    const stripWidth = Math.round((step * width) / STEPS) - left;
    const input = await sharp(frame(mode, step))
      .resize(width, width, { kernel: 'lanczos3' })
      .extract({ left, top, width: stripWidth, height })
      .toBuffer();
    layers.push({ input, left, top: 0 });
  }
  await sharp({ create: { width, height, channels: 3, background: '#000' } })
    .composite(layers)
    .webp({ quality: 82 })
    .toFile(path.join(out, file));
}

/** All 50 steps of one track in a 10 × 5 sheet, so the explorer can scrub without 150 requests. */
async function sprite(mode, cell, file) {
  const layers = await Promise.all(Array.from({ length: STEPS }, async (_, index) => ({
    input: await sharp(frame(mode, index + 1)).resize(cell, cell).toBuffer(),
    left: (index % 10) * cell,
    top: Math.floor(index / 10) * cell,
  })));
  await sharp({ create: { width: cell * 10, height: cell * 5, channels: 3, background: '#000' } })
    .composite(layers)
    .webp({ quality: 74 })
    .toFile(path.join(out, file));
}

/** A filmstrip of evenly spaced steps, used as one lane of the TIDE banner. */
async function lane(mode, steps, cell, file) {
  const layers = await Promise.all(steps.map(async (step, index) => ({
    input: await sharp(frame(mode, step)).resize(cell, cell).toBuffer(),
    left: index * cell,
    top: 0,
  })));
  await sharp({ create: { width: cell * steps.length, height: cell, channels: 3, background: '#000' } })
    .composite(layers)
    .webp({ quality: 80 })
    .toFile(path.join(out, file));
}

/** Mean absolute RGB difference (0–1) from the unwatermarked estimate at the same step. */
async function drift() {
  const size = 256;
  const rows = [];
  for (let step = 1; step <= STEPS; step += 1) {
    const [reference, tree, tide] = await Promise.all(['original', 'tree', 'tide'].map(mode => raw(mode, step, size)));
    const distance = other => {
      let total = 0;
      for (let i = 0; i < reference.length; i += 1) total += Math.abs(reference[i] - other[i]);
      return Number((total / reference.length / 255).toFixed(4));
    };
    rows.push({ step, tree: distance(tree), tide: distance(tide) });
  }
  return rows;
}

await fs.mkdir(out, { recursive: true });
const laneSteps = [1, 6, 12, 18, 24, 30, 35, 40, 45, 50];
await Promise.all([
  wideSlice('tide', 1800, 760, 150, 'tide-banner.webp'),
  ...['original', 'tree', 'tide'].map(mode => sprite(mode, 384, `tide-sprite-${mode}.webp`)),
  ...['original', 'tree', 'tide'].map(mode => lane(mode, laneSteps, 256, `tide-lane-${mode}.webp`)),
]);
const rows = await drift();
await fs.writeFile(
  path.join(root, 'src/data/tide-drift.json'),
  `${JSON.stringify({
    note: 'Mean absolute RGB difference (0–1) between the watermarked and unwatermarked clean-image estimates at the same denoising step. Measured from the stored frames of one run; not a metric reported in the paper.',
    laneSteps,
    steps: rows,
  }, null, 1)}\n`,
);
// The stored trace also carries 32-d display vectors; the site only needs the scalars.
const trace = JSON.parse(await fs.readFile(path.join(source, 'guidance-trace.json'), 'utf8'));
const round = value => Number(value.toFixed(4));
await fs.writeFile(
  path.join(root, 'src/data/tide-guidance.json'),
  `${JSON.stringify(trace.steps.map(step => ({
    step: step.step,
    conflict: round(step.semantic_conflict),
    curvature: round(step.trajectory_curvature),
    ratio: round(step.residual_ratio),
    eta: round(step.eta_t),
    text: round(step.text_weight),
    watermark: round(step.watermark_weight),
  })), null, 1)}\n`,
);
console.log('art written to public/images/art; drift at 1/20/35/36/50:', [1, 20, 35, 36, 50].map(s => JSON.stringify(rows[s - 1])).join(' '));
