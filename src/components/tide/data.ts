// Numbers on the TIDE page. Every value is copied from the NeurIPS 2026 paper
// (public/files/tide-neurips-2026.pdf); the table it comes from is named beside it.
import guidance from '@/data/tide-guidance.json';
import drift from '@/data/tide-drift.json';

export const TOTAL_STEPS = 50;
export const INJECTION_STEP = 35;
export const GUIDANCE_SCALE = 7.5;

/** Table 1. AUC / TPR@1%FPR without attacks and averaged over the seven attacks. */
export const verification = [
  { method: 'DwtDct', family: 'post', clean: [0.974, 0.624], attacked: [0.574, 0.092] },
  { method: 'DwtDctSvd', family: 'post', clean: [1.0, 1.0], attacked: [0.702, 0.262] },
  { method: 'RivaGAN', family: 'post', clean: [0.999, 0.999], attacked: [0.854, 0.448] },
  { method: 'Stable Signature', family: 'in', clean: [1.0, 1.0], attacked: [0.82, 0.496] },
  { method: 'Gaussian Shading', family: 'in', clean: [1.0, 1.0], attacked: [0.829, 0.682] },
  { method: 'Tree-Ring (key)', family: 'in', clean: [1.0, 1.0], attacked: [0.975, 0.694] },
  { method: 'Tree-Ring (paired)', family: 'in', clean: [1.0, 1.0], attacked: [0.962, 0.765] },
  { method: 'ROBIN', family: 'in', clean: [1.0, 1.0], attacked: [0.981, 0.825] },
  { method: 'TIDE', family: 'ours', clean: [1.0, 1.0], attacked: [0.999, 0.986] },
] as const;

/** Table 2. Fidelity to the unwatermarked reference. FID† is measured against that reference. */
export const quality = [
  { method: 'Tree-Ring', psnr: 15.11, ssim: 0.546, msssim: 0.589, clip: 0.364, lpips: 0.501, fid: 26.05, fidRef: 10.84 },
  { method: 'ROBIN', psnr: 23.61, ssim: 0.757, msssim: 0.871, clip: 0.396, lpips: 0.157, fid: 26.86, fidRef: 6.37 },
  { method: 'TIDE', psnr: 24.53, ssim: 0.797, msssim: 0.895, clip: 0.403, lpips: 0.147, fid: 25.8, fidRef: 5.9 },
] as const;
export const unwatermarked = { clip: 0.403, fid: 25.63 };

export const attacks = [
  { id: 'blur', en: 'Blur', zh: '模糊', detail: 'Gaussian blur, radius 4' },
  { id: 'noise', en: 'Noise', zh: '噪声', detail: 'Gaussian noise, 10%' },
  { id: 'jpeg', en: 'JPEG', zh: 'JPEG', detail: 'JPEG, quality 25' },
  { id: 'rotation', en: 'Rotation', zh: '旋转', detail: 'Random rotation up to 75°' },
  { id: 'crop', en: 'Crop', zh: '裁剪', detail: '75% random crop and rescale' },
] as const;

export const injectionSteps = [5, 15, 25, 35, 45] as const;
export type Strategy = 'none' | 'fixed' | 'adaptive';

/**
 * Table 12 (TPR@1%FPR) and Table 14 (PSNR, SSIM). The watermark and its condition are
 * trained at step 35 and reused at the other steps without retraining.
 * TPR columns: blur, noise, JPEG, rotation, crop, average over these five.
 */
export const stepAblation: Record<Strategy, { tpr: number[]; psnr: number; ssim: number }[]> = {
  none: [
    { tpr: [0.882, 0.904, 0.793, 0.947, 0.999, 0.905], psnr: 17.39, ssim: 0.573 },
    { tpr: [0.903, 0.943, 0.845, 0.948, 1.0, 0.928], psnr: 19.75, ssim: 0.63 },
    { tpr: [0.909, 0.97, 0.938, 0.966, 1.0, 0.957], psnr: 22.02, ssim: 0.691 },
    { tpr: [0.846, 0.984, 0.972, 0.871, 0.999, 0.934], psnr: 23.75, ssim: 0.756 },
    { tpr: [0.202, 0.878, 0.908, 0.248, 0.89, 0.625], psnr: 23.45, ssim: 0.774 },
  ],
  fixed: [
    { tpr: [0.86, 0.935, 0.993, 0.336, 1.0, 0.825], psnr: 15.46, ssim: 0.51 },
    { tpr: [0.859, 0.955, 0.99, 0.363, 1.0, 0.833], psnr: 18.51, ssim: 0.606 },
    { tpr: [0.865, 0.954, 0.991, 0.617, 1.0, 0.885], psnr: 21.59, ssim: 0.697 },
    { tpr: [0.773, 0.971, 0.99, 0.597, 0.999, 0.866], psnr: 23.93, ssim: 0.769 },
    { tpr: [0.193, 0.897, 0.928, 0.186, 0.853, 0.611], psnr: 23.61, ssim: 0.779 },
  ],
  adaptive: [
    { tpr: [0.909, 0.92, 0.872, 0.929, 0.999, 0.926], psnr: 18.92, ssim: 0.582 },
    { tpr: [0.916, 0.963, 0.938, 0.918, 1.0, 0.947], psnr: 20.31, ssim: 0.64 },
    { tpr: [0.914, 0.978, 0.957, 0.935, 1.0, 0.957], psnr: 23.19, ssim: 0.702 },
    { tpr: [0.983, 0.984, 0.983, 0.964, 0.999, 0.983], psnr: 24.53, ssim: 0.797 },
    { tpr: [0.23, 0.895, 0.93, 0.271, 0.9, 0.645], psnr: 24.21, ssim: 0.814 },
  ],
};

/** Table 5. Seconds per generated image and per verification query. */
export const runtime = [
  { method: 'Stable Signature', generate: 2.2944, verify: 0.157 },
  { method: 'Tree-Ring (key)', generate: 2.2351, verify: 2.1632 },
  { method: 'Tree-Ring (paired)', generate: 2.2351, verify: 2.9513 },
  { method: 'ROBIN', generate: 2.3173, verify: 0.753 },
  { method: 'TIDE', generate: 2.2917, verify: 0.7395 },
] as const;

/**
 * One real sampling run (Stable Diffusion 2.1, seed 42, 50 steps, watermark written
 * after step 35). `guidance` holds the quantities TIDE computed at each later step;
 * `drift` is measured from the stored frames by scripts/build-research-art.mjs.
 */
export const run = {
  prompt: 'Giant female robot, digital art, mech, unreal engine, highly detailed, full body, standing in a futuristic city, blue and white armor',
  guidance,
  drift: drift.steps,
  laneSteps: drift.laneSteps,
};

export const frame = (mode: 'original' | 'tree' | 'tide', step: number) =>
  `/media/tide/sampling/${mode}-${String(step).padStart(2, '0')}.webp`;
