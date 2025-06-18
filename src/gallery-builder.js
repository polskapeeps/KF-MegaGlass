// src/gallery-builder.js
export function buildGallery() {
  const images = import.meta.glob('/src/assets/gallery/*.{jpg,png,webp}', {
    eager: true,
  });
  return Object.values(images)
    .map(
      (m) => `
    <div class="gallery-item glass-card rounded-xl overflow-hidden">
      <img src="${m.default}" loading="lazy" />
    </div>
  `
    )
    .join('');
}
