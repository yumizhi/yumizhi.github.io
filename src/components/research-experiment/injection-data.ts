// TIDE, Tables 12 and 14. Each watermark is trained at step 35 and
// transferred to the other injection times without retraining.
// TPR columns: blur, noise, JPEG, rotation, crop, five-attack average.
export const injectionSteps = [5, 15, 25, 35, 45] as const;
export type GuidanceStrategy = 'none' | 'fixed' | 'adaptive';
export const injectionData: Record<GuidanceStrategy, {
  tpr: number[];
  psnr: number;
  ssim: number;
}[]> = {
  none: [
    { tpr: [.882, .904, .793, .947, .999, .905], psnr: 17.39, ssim: .573 },
    { tpr: [.903, .943, .845, .948, 1, .928], psnr: 19.75, ssim: .630 },
    { tpr: [.909, .970, .938, .966, 1, .957], psnr: 22.02, ssim: .691 },
    { tpr: [.846, .984, .972, .871, .999, .934], psnr: 23.75, ssim: .756 },
    { tpr: [.202, .878, .908, .248, .890, .625], psnr: 23.45, ssim: .774 },
  ],
  fixed: [
    { tpr: [.860, .935, .993, .336, 1, .825], psnr: 15.46, ssim: .510 },
    { tpr: [.859, .955, .990, .363, 1, .833], psnr: 18.51, ssim: .606 },
    { tpr: [.865, .954, .991, .617, 1, .885], psnr: 21.59, ssim: .697 },
    { tpr: [.773, .971, .990, .597, .999, .866], psnr: 23.93, ssim: .769 },
    { tpr: [.193, .897, .928, .186, .853, .611], psnr: 23.61, ssim: .779 },
  ],
  adaptive: [
    { tpr: [.909, .920, .872, .929, .999, .926], psnr: 18.92, ssim: .582 },
    { tpr: [.916, .963, .938, .918, 1, .947], psnr: 20.31, ssim: .640 },
    { tpr: [.914, .978, .957, .935, 1, .957], psnr: 23.19, ssim: .702 },
    { tpr: [.983, .984, .983, .964, .999, .983], psnr: 24.53, ssim: .797 },
    { tpr: [.230, .895, .930, .271, .900, .645], psnr: 24.21, ssim: .814 },
  ],
};
