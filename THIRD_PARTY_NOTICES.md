# Third-party notices

- Original homepage: AcadHomepage, MIT, retained project LICENSE and Git history.
- shadcn/ui: MIT, official components sourced from https://github.com/shadcn-ui/ui at c0d63c339d6cd2fc26135590a54cf1f362269451. Component import paths adapted; Command dialog labeling placement adjusted.
- EPUB Toolkit screenshots: https://github.com/yumizhi/lightweight_epub_merge_tool, Apache-2.0. Copyright belongs to its authors. Saved real application captures are cropped and framed for presentation, then compressed to WebP; no controls are fabricated. Crop coordinates are recorded in docs/design/editorial/.
- Nanjing University seal: original university identity asset from the existing homepage; used for affiliation identification. University ownership remains unchanged.
- TIDE and SASBO figures: author-provided/public research figures; ownership remains with their authors and applicable publishers.
- Inter and Noto Sans SC: SIL Open Font License 1.1, distributed through the official Fontsource packages. License files are included in installed packages.
- Lucide: ISC license. React, Next.js, Tailwind CSS, Motion and other dependencies retain their respective licenses.

- Manrope: SIL Open Font License 1.1; self-hosted variable font. License: `public/fonts/Manrope-LICENSE.txt`.
- next-view-transitions 0.3.5: MIT, https://github.com/shuding/next-view-transitions.

## Research material review page

- Jay Alammar, *The Illustrated Stable Diffusion* (2022), https://jalammar.github.io/illustrated-stable-diffusion/ . The unchanged conditioned U-Net diagram and denoising video under `public/media/references/` are licensed CC BY-NC-SA 4.0: https://creativecommons.org/licenses/by-nc-sa/4.0/ . The denoising poster is an extracted frame. These assets are previews of foundational concepts, not TIDE outputs.
- ManimML, copyright (c) 2022 Alec Helbling, https://github.com/helblazer811/ManimML . Original README demonstration video and an extracted poster frame, MIT. Full license: `public/media/references/ManimML-LICENSE.txt`.
- LearnOpenCV's original generation GIF is externally linked on the material review page, with attribution and a link to its article; it is not copied into the local asset library.
- A 3Blue1Brown projection illustration is externally previewed with visible attribution, a link to the original lesson and added explanatory context. Author's stated reuse criteria: https://www.3blue1brown.com/about/ . No full lesson is copied or rehosted.

- Expanded reference previews: Motion's TSL particle-morph demo and Codrops Seam Transitions are embedded from their original sites. Adjacent screenshots document browser inspection and link back to each work; no Motion example source or source photos are copied into the implementation. Codrops Seam Transitions source is MIT.
- Two additional screenshots of the 3Blue1Brown Fourier interactive carry visible attribution and added discussion of their relation to TIDE. The interactive itself is not copied. Original: https://www.3blue1brown.com/lessons/fourier-transforms/ .

## TIDE pipeline refactor (2026-11-02)

- U-Net vector artwork: PlotNeuralNet, Haris Iqbal, MIT. Original: https://github.com/HarisIqbal88/PlotNeuralNet/blob/master/examples/Unet/Unet.pdf . Converted to SVG, text annotations removed and colors adjusted. Full notice: `public/media/tide/flow/PlotNeuralNet-LICENSE.txt`.
- Predicted-noise teaching images: Polo Club of Data Science, Diffusion Explainer, MIT. Sources: `assets/noises/noise_pred_empty.jpg` and `noise_pred_text.jpg`, https://github.com/poloclub/diffusion-explainer . Downsampled and tinted for illustrative tensors; the watermark-colored branch is not actual TIDE output. Full notice: `public/media/tide/flow/Diffusion-Explainer-LICENSE.txt`.
- React Flow 12.10.0, xyflow, MIT: https://github.com/xyflow/xyflow . Graph, connections, viewport, pan/zoom and accessibility; attribution is displayed.
- GSAP 3.15.0: https://gsap.com/standard-license/ . Shared time, DrawSVG path highlighting, and MotionPath curve generation. The image-sequence loading/playhead/drawing pattern adapts the official helper: https://gsap.com/docs/v3/HelperFunctions/helpers/imageSequenceScrub/ .
- Motion 14.0.0, MIT: https://github.com/motiondivision/motion . UI transitions.

The robot sequence is a new fixed-prompt, seed-42 run with the user's existing SD 2.1 and TIDE checkpoint, exported as clean-image estimates with injection at step 35/50. Its source metadata is `public/media/tide/sampling/manifest.json`; it is not the original Figure 2 trajectory. The mounted scene uses no branded photos from Apple, Google or Meta, no unrelated generated art and no raw decoded noisy-latent frames. The initial Gaussian view is a teaching representation. Fourier layers are graded captured spectra, separated using the actual active-channel mask. Residual ribbons and allocation history derive from fifteen captured guidance updates; removed components are magnified for legibility, and the optional turn control is illustrative. Older HDR/3D experiments are unmounted.
