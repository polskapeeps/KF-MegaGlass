// gallery-builder.js
export function buildGallery() {
  // pick up *all* JPG/PNG/SVG/etc under src/assets/gallery **and** any sub-folder
  const modules = import.meta.glob(
    '../assets/gallery/**/*.{jpg,jpeg,png,svg,gif}',
    { eager: true, import: 'default' }
  );
  return Object.values(modules)
    .map(
      (src) => `
      <div class="gallery-item glass-card rounded-xl overflow-hidden">
        <img src="${src}" loading="lazy" alt="">
      </div>
    `
    )
    .join('');
}
