// gallery-builder.js
export function buildGallery() {
  const images = import.meta.glob('../assets/gallery/*.{jpg,png,webp}', {
    eager: true,
    as: 'url',
  });

  // Map singular file prefixes to the plural category names used in the HTML
  const prefixMap = {
    partition: 'partitions',
    railing: 'railings',
  };

  const categorized = {};

  for (const [path, url] of Object.entries(images)) {
    const name = path.split('/').pop() || '';
    const rawPrefix = name.split('_')[0].toLowerCase();
    const prefix = prefixMap[rawPrefix] || rawPrefix;
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
