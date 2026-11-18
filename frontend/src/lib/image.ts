/**
 * Turns a user-selected JPG/PNG into a compressed JPEG data URL (small enough to upload quickly on mobile data).
 * Betslips are tall, so we limit width (1200px) and height (4000px) rather than a single longest side.
 */
export async function fileToCompressedDataUrl(file: File): Promise<string> {
  if (!/^image\/(png|jpeg)$/.test(file.type)) throw new Error('Only JPG or PNG images are allowed');

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1200 / bitmap.width, 4000 / bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Your browser could not process this image');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();

  // Server rejects images over ~1.5MB, so step quality down if needed
  for (const quality of [0.85, 0.7, 0.55]) {
    const url = canvas.toDataURL('image/jpeg', quality);
    if (url.length * 0.75 < 1_400_000) return url;
  }
  throw new Error('That image is too large even after compressing. Crop the screenshot and try again.');
}
