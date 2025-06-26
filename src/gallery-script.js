// Add this to your src/script.js or create a separate gallery script

import {
  galleryData,
  getImagesByCategory,
  getAllImages,
} from './gallery-data.js';

// Gallery functionality
class GalleryManager {
  constructor() {
    this.currentFilter = 'all';
    this.allImages = [];
    this.lightbox = null;
    this.currentImageIndex = 0;

    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Only run on gallery page
    if (!document.querySelector('.gallery-filter')) return;

    this.setupFilters();
    this.renderGallery();
    this.setupLightbox();
    this.setupIntersectionObserver();
  }

  setupFilters() {
    const filters = document.querySelectorAll('.gallery-filter');

    filters.forEach((filter) => {
      filter.addEventListener('click', (e) => {
        // Update active state
        filters.forEach((f) => f.classList.remove('active'));
        e.target.classList.add('active');

        // Update filter
        this.currentFilter = e.target.dataset.filter;
        this.renderGallery();
      });
    });
  }

  renderGallery() {
    const containers = document.querySelectorAll('[data-category]');

    containers.forEach((container) => {
      const category = container.dataset.category;
      const grid = container.querySelector('.gallery-grid');

      if (!grid) return;

      // Clear existing content
      grid.innerHTML = '';

      // Hide all containers first
      container.style.display = 'none';

      // Show based on filter
      if (this.currentFilter === 'all' || this.currentFilter === category) {
        container.style.display = 'block';

        const images = getImagesByCategory(category);

        images.forEach((image, index) => {
          const item = this.createGalleryItem(image, category, index);
          grid.appendChild(item);
        });
      }
    });

    // Update allImages for lightbox navigation
    if (this.currentFilter === 'all') {
      this.allImages = getAllImages();
    } else {
      this.allImages = getImagesByCategory(this.currentFilter);
    }
  }

  createGalleryItem(image, category, index) {
    const div = document.createElement('div');
    div.className =
      'gallery-item glass-card rounded-xl overflow-hidden cursor-pointer';
    div.innerHTML = `
      <img 
        src="${image.thumbnail}" 
        data-src="${image.path}"
        alt="${image.name}"
        class="w-full h-full object-cover lazy-load"
        loading="lazy"
      />
    `;

    div.addEventListener('click', () => {
      this.openLightbox(image, this.allImages.indexOf(image));
    });

    return div;
  }

  setupLightbox() {
    this.lightbox = document.getElementById('lightbox');
    if (!this.lightbox) return;

    const close = this.lightbox.querySelector('.lightbox-close');
    const prev = this.lightbox.querySelector('.lightbox-prev');
    const next = this.lightbox.querySelector('.lightbox-next');

    close?.addEventListener('click', () => this.closeLightbox());
    prev?.addEventListener('click', () => this.navigateLightbox(-1));
    next?.addEventListener('click', () => this.navigateLightbox(1));

    // Close on background click
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('active')) return;

      switch (e.key) {
        case 'Escape':
          this.closeLightbox();
          break;
        case 'ArrowLeft':
          this.navigateLightbox(-1);
          break;
        case 'ArrowRight':
          this.navigateLightbox(1);
          break;
      }
    });
  }

  openLightbox(image, index) {
    this.currentImageIndex = index;
    const img = this.lightbox.querySelector('.lightbox-content');

    img.src = image.path;
    img.alt = image.name;

    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  navigateLightbox(direction) {
    this.currentImageIndex += direction;

    // Wrap around
    if (this.currentImageIndex < 0) {
      this.currentImageIndex = this.allImages.length - 1;
    } else if (this.currentImageIndex >= this.allImages.length) {
      this.currentImageIndex = 0;
    }

    const image = this.allImages[this.currentImageIndex];
    const img = this.lightbox.querySelector('.lightbox-content');

    img.src = image.path;
    img.alt = image.name;
  }

  setupIntersectionObserver() {
    // Lazy load full resolution images
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        }
      });
    });

    // Observe all lazy-load images
    document.querySelectorAll('.lazy-load').forEach((img) => {
      imageObserver.observe(img);
    });

    // Fade in animation for sections
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    });

    document.querySelectorAll('.fade-in').forEach((el) => {
      fadeObserver.observe(el);
    });
  }
}

// Initialize gallery
const gallery = new GalleryManager();

export { gallery };
