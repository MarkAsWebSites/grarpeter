// Array to hold the image data with enhanced information for SEO
let imagesArray = [
    {
        src: 'images/seat.jpeg',
        alt: 'תמונה של רכב סיאט בגלריית גרר פיטר - שירותי גרירה מקצועיים'
    },
    {
        src: 'images/yacht.jpeg',
        alt: 'תמונה של יאכטה יוקרתית בגלריית גרר פיטר - שירותי גרירה ימית'
    },
    {
        src: 'images/ford.jpeg',
        alt: 'תמונה של רכב פורד בגלריית גרר פיטר - גרירת רכבים אמריקאיים'
    },
    {
        src: 'images/tesla.jpeg',
        alt: 'תמונה של רכב טסלה חשמלי בגלריית גרר פיטר - גרירת רכבים חשמליים'
    },
    {
        src: 'images/mitsu.jpeg',
        alt: 'תמונה של רכב מיצובישי בגלריית גרר פיטר - גרירת רכבים יפניים'
    }
];

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    const imageGallery = document.getElementById('imageGallery');
    const loading = document.getElementById('loading');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    // Function to create gallery items (clean, no overlay text)
    function createGalleryItem(imageData, index) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.style.animationDelay = `${index * 0.1}s`;

        // Create clean image without overlay descriptions
        galleryItem.innerHTML = `
            <img src="${imageData.src}" 
                 alt="${imageData.alt}" 
                 loading="lazy"
                 onclick="openLightbox('${imageData.src}', '${imageData.alt}')">
        `;

        return galleryItem;
    }

    // Function to load images with delay for better UX
    function loadGallery() {
        // Simulate loading time for better UX
        setTimeout(() => {
            imagesArray.forEach((imageData, index) => {
                const galleryItem = createGalleryItem(imageData, index);
                imageGallery.appendChild(galleryItem);
            });

            // Hide loading and show gallery
            loading.style.display = 'none';
            imageGallery.style.display = 'grid';

            // Add fade-in animation to gallery items
            const items = document.querySelectorAll('.gallery-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(30px)';
                    item.style.transition = 'all 0.6s ease';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                }, index * 100);
            });

        }, 1000); // 1 second loading simulation (reduced from 1.5s)
    }

    // Lightbox functionality
    window.openLightbox = function(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent body scroll
        
        // Track image view for analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'image_view', {
                'custom_parameter': src
            });
        }
    };

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore body scroll
    }

    // Event listeners for lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });

    // Error handling for images
    function handleImageErrors() {
        const images = document.querySelectorAll('.gallery-item img');
        images.forEach(img => {
            img.addEventListener('error', function() {
                this.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'image-placeholder';
                placeholder.innerHTML = `
                    <i class="fas fa-image" style="font-size: 3rem; color: #ccc;"></i>
                    <p style="margin-top: 10px; color: #666; font-family: Heebo, Arial, sans-serif;">תמונה לא נמצאה</p>
                `;
                placeholder.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 250px;
                    background: #f8f9fa;
                    border-radius: 15px;
                `;
                this.parentNode.insertBefore(placeholder, this);
            });
        });
    }

    // Performance optimization - preload images
    function preloadImages() {
        imagesArray.forEach(imageData => {
            const img = new Image();
            img.src = imageData.src;
        });
    }

    // Intersection Observer for lazy loading and animations
    function setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            // Observe images after they're loaded
            setTimeout(() => {
                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            }, 1200);
        }
    }

    // Initialize gallery
    loadGallery();
    
    // Setup additional features after gallery loads
    setTimeout(() => {
        handleImageErrors();
        preloadImages();
        setupIntersectionObserver();
    }, 1500);

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Add resize handler for responsive adjustments
    window.addEventListener('resize', function() {
        const gallery = document.getElementById('imageGallery');
        if (gallery) {
            gallery.style.transition = 'all 0.3s ease';
        }
    });
});

// SEO: Add structured data for images (simplified)
function addImageStructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        "name": "גלריית גרר פיטר",
        "description": "גלריית תמונות של רכבים ויאכטות - שירותי גרירה מקצועיים",
        "image": imagesArray.map(img => ({
            "@type": "ImageObject",
            "url": img.src,
            "description": img.alt
        }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}

// Initialize structured data
document.addEventListener('DOMContentLoaded', addImageStructuredData);