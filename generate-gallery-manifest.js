const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, 'public/assets/gallery');
const files = fs.readdirSync(galleryDir).filter(f => /\.(jpe?g|png|webp)$/i.test(f));

const manifest = {
  showers: [],
  doors: [],
  partitions: [],
  railings: []
};

files.forEach(file => {
  const prefix = file.split('_')[0];
  const relPath = `assets/gallery/${file}`;
  switch (prefix) {
    case 'showers':
      manifest.showers.push(relPath);
      break;
    case 'doors':
      manifest.doors.push(relPath);
      break;
    case 'partition':
      manifest.partitions.push(relPath);
      break;
    case 'railing':
      manifest.railings.push(relPath);
      break;
    default:
      break;
  }
});

fs.writeFileSync(path.join(__dirname, 'public/gallery-manifest.json'), JSON.stringify(manifest, null, 2));
console.log('Generated public/gallery-manifest.json');
