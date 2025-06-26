import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, extname, basename } from 'path';
import sharp from 'sharp'; // You'll need to install: npm install sharp

const CONFIG = {
  sourceDir: './public/assets/gallery',
  outputFile: './src/gallery-data.json',
  thumbnailDir: './public/assets/gallery/thumbnails',
  supportedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
  compression: {
    quality: 85,
    maxWidth: 1920,
    maxHeight: 1080,
    thumbnailSize: 400
  }
};

// Gallery categories configuration
const CATEGORIES = {
  showers: {
    name: 'Shower Enclosures',
    pattern: /shower/i,
    description: 'Custom frameless shower enclosures designed for elegance and functionality'
  },
  doors: {
    name: 'Glass Doors', 
    pattern: /door/i,
    description: 'Seamless frameless glass doors for modern architectural solutions'
  },
  partitions: {
    name: 'Glass Partitions',
    pattern: /partition/i,
    description: 'Professional glass partition systems for offices and modern spaces'
  },
  railings: {
    name: 'Glass Railings',
    pattern: /railing/i,
    description: 'Stunning glass railings for balconies, stairs, and outdoor spaces'
  }
};

class GalleryBuilder {
  constructor() {
    this.images = [];
  }

  async build() {
    console.log('🖼️  Building gallery...');
    
    try {
      // Ensure directories exist
      await this.ensureDirectories();
      
      // Scan for images
      const files = await readdir(CONFIG.sourceDir);
      const imageFiles = files.filter(file => 
        CONFIG.supportedFormats.includes(extname(file).toLowerCase())
      );
      
      console.log(`Found ${imageFiles.length} images`);
      
      // Process each image
      for (const file of imageFiles) {
        await this.processImage(file);
      }
      
      // Generate gallery data
      const galleryData = this.generateGalleryData();
      
      // Write to JSON file
      await writeFile(
        CONFIG.outputFile, 
        JSON.stringify(galleryData, null, 2)
      );
      
      console.log('✅ Gallery build complete!');
      console.log(`📄 Data written to ${CONFIG.outputFile}`);
      
      // Generate a module file for easy importing
      await this.generateGalleryModule(galleryData);
      
    } catch (error) {
      console.error('❌ Error building gallery:', error);
      process.exit(1);
    }
  }

  async ensureDirectories() {
    if (!existsSync(CONFIG.thumbnailDir)) {
      await mkdir(CONFIG.thumbnailDir, { recursive: true });
    }
  }

  async processImage(filename) {
    const inputPath = join(CONFIG.sourceDir, filename);
    const name = basename(filename, extname(filename));
    
    try {
      // Get image metadata
      const metadata = await sharp(inputPath).metadata();
      
      // Determine category
      const category = this.categorizeImage(filename);
      
      // Check if image needs compression
      const needsCompression = 
        metadata.width > CONFIG.compression.maxWidth || 
        metadata.height > CONFIG.compression.maxHeight;
      
      if (needsCompression) {
        console.log(`📦 Compressing ${filename}...`);
        await this.compressImage(inputPath, inputPath);
      }
      
      // Generate thumbnail if it doesn't exist
      const thumbnailPath = join(CONFIG.thumbnailDir, filename);
      if (!existsSync(thumbnailPath)) {
        console.log(`🔍 Creating thumbnail for ${filename}...`);
        await this.createThumbnail(inputPath, thumbnailPath);
      }
      
      // Add to images array
      this.images.push({
        filename,
        name,
        category,
        path: `/assets/gallery/${filename}`,
        thumbnail: `/assets/gallery/thumbnails/${filename}`,
        width: metadata.width,
        height: metadata.height,
        aspectRatio: (metadata.width / metadata.height).toFixed(2),
        size: metadata.size,
        format: metadata.format
      });
      
    } catch (error) {
      console.error(`Error processing ${filename}:`, error);
    }
  }

  categorizeImage(filename) {
    const lowerName = filename.toLowerCase();
    
    for (const [key, config] of Object.entries(CATEGORIES)) {
      if (config.pattern.test(lowerName)) {
        return key;
      }
    }
    
    // Default category based on naming pattern
    if (lowerName.includes('_')) {
      const prefix = lowerName.split('_')[0];
      for (const [key, config] of Object.entries(CATEGORIES)) {
        if (config.pattern.test(prefix)) {
          return key;
        }
      }
    }
    
    return 'uncategorized';
  }

  async compressImage(inputPath, outputPath) {
    await sharp(inputPath)
      .resize(CONFIG.compression.maxWidth, CONFIG.compression.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: CONFIG.compression.quality })
      .toFile(outputPath + '.tmp');
    
    // Replace original with compressed version
    await sharp(outputPath + '.tmp').toFile(outputPath);
  }

  async createThumbnail(inputPath, outputPath) {
    await sharp(inputPath)
      .resize(CONFIG.compression.thumbnailSize, CONFIG.compression.thumbnailSize, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toFile(outputPath);
  }

  generateGalleryData() {
    // Group images by category
    const categorized = {};
    
    for (const image of this.images) {
      if (!categorized[image.category]) {
        categorized[image.category] = {
          name: CATEGORIES[image.category]?.name || image.category,
          description: CATEGORIES[image.category]?.description || '',
          images: []
        };
      }
      categorized[image.category].images.push(image);
    }
    
    // Sort images within each category
    for (const category of Object.values(categorized)) {
      category.images.sort((a, b) => a.filename.localeCompare(b.filename));
    }
    
    return {
      generated: new Date().toISOString(),
      totalImages: this.images.length,
      categories: categorized,
      allImages: this.images.sort((a, b) => a.filename.localeCompare(b.filename))
    };
  }

  async generateGalleryModule(data) {
    const moduleContent = `// Auto-generated gallery data
// Generated: ${new Date().toISOString()}

export const galleryData = ${JSON.stringify(data, null, 2)};

export const getImagesByCategory = (category) => {
  return galleryData.categories[category]?.images || [];
};

export const getAllImages = () => {
  return galleryData.allImages;
};

export const getCategories = () => {
  return Object.keys(galleryData.categories);
};

export const getCategoryInfo = (category) => {
  return galleryData.categories[category] || null;
};
`;

    await writeFile('./src/gallery-data.js', moduleContent);
    console.log('📦 Gallery module generated at ./src/gallery-data.js');
  }
}

// Run the builder
const builder = new GalleryBuilder();
builder.build();