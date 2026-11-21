// Red and green encode the local surface normal. A flat face has neutral
// displacement. Each rounded corner joins the same shoulder as the straight sides.
export function makeLensMap(width: number, height: number, radius: number, shoulder: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const pixels = ctx.createImageData(width, height);
  const halfW = width / 2, halfH = height / 2;
  radius = Math.min(halfW, halfH, radius);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const px = x + .5 - halfW, py = y + .5 - halfH;
      const qx = Math.abs(px) - halfW + radius, qy = Math.abs(py) - halfH + radius;
      const cx = Math.max(qx, 0), cy = Math.max(qy, 0);
      const corner = Math.hypot(cx, cy);
      const depth = radius - corner - Math.min(Math.max(qx, qy), 0);
      const nx = Math.sign(px) * (corner ? cx / corner : Number(qx > qy));
      const ny = Math.sign(py) * (corner ? cy / corner : Number(qy >= qx));
      const bend = depth >= 0 && depth < shoulder ? 126 * (1 - depth / shoulder) ** 1.55 : 0;
      const i = (y * width + x) * 4;
      pixels.data[i] = 128 - nx * bend;
      pixels.data[i + 1] = 128 - ny * bend;
      pixels.data[i + 2] = 128;
      pixels.data[i + 3] = depth < 0 ? 0 : 255;
    }
  }
  ctx.putImageData(pixels, 0, 0);
  return canvas.toDataURL();
}
