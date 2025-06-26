// gallery-builder.js - Better solution for public directory
export function buildGallery() {
  // Since you have 300 images in public/assets/gallery/, 
  // let's use a dynamic approach that generates the list
  
  const generateImageList = (prefix, maxCount = 100) => {
    const images = [];
    for (let i = 1; i <= maxCount; i++) {
      const paddedNum = i.toString().padStart(2, '0');
      images.push(`${prefix}_${paddedNum}.jpg`);
    }
    return images;
  };

  // Generate lists for each category (adjust maxCount based on your actual images)
  const imageManifest = {
    showers: generateImageList('showers', 99), // showers_01.jpg to showers_99.jpg
    doors: generateImageList('doors', 20),     // doors_01.jpg to doors_20.jpg  
    partitions: generateImageList('partition', 10), // partition_01.jpg to partition_10.jpg
    railings: generateImageList('railing', 15)      // railing_01.jpg to railing_15.jpg
  };

  const markup = {};

  for (const [category, filenames] of Object.entries(imageManifest)) {
    markup[category] = filenames
      .map(filename => `/assets/gallery/${filename}`)
      .map(src => `
        <div class="gallery-item glass-card rounded-xl overflow-hidden">
          <img src="${src}" loading="lazy" alt="${category} installation" onerror="this.parentElement.style.display='none'" />
        </div>
      `)
      .join('');
  }

  return markup;
}