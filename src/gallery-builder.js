// src/gallery-builder.js
export function buildGallery() {
  const images = import.meta.glob(
    '../public/assets/gallery/*.{jpg,png,webp}',
    {
      eager: true,
      as: 'url',
    }
  );

  const categorized = {};

  for (const [path, url] of Object.entries(images)) {
    const name = path.split('/').pop() || '';
    const prefix = name.split('_')[0].toLowerCase();
    if (!categorized[prefix]) {
      categorized[prefix] = [];
    }
    categorized[prefix].push(url);
  }

  const markup = {};

  for (const [category, urls] of Object.entries(categorized)) {
    markup[category] = urls
      .map(
        (src) => `
    <div class="gallery-item glass-card rounded-xl overflow-hidden">
      <img src="${src}" loading="lazy" />
    </div>
  `
      )
      .join('');
  }

  return markup;
}
