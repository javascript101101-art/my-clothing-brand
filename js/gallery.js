/* ============================================
   Gallery JavaScript — Simple Lightbox
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length) return;

  // ===== Simple Lightbox =====
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const imgSrc = item.querySelector('img')?.src;
      if (imgSrc) openLightbox(imgSrc);
    });
  });

  function openLightbox(src) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close">&times;</button>
        <img src="${src}" alt="Gallery Image">
      </div>
    `;

    // Styles Inject
    overlay.style.cssText = `
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.92);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 20px;
      animation: fadeIn 0.3s ease;
    `;

    const content = overlay.querySelector('.lightbox-content');
    content.style.cssText = 'position: relative; max-width: 90vw; max-height: 90vh;';

    const img = overlay.querySelector('img');
    img.style.cssText = 'max-width: 100%; max-height: 90vh; border-radius: 8px;';

    const closeBtn = overlay.querySelector('.lightbox-close');
    closeBtn.style.cssText = `
      position: absolute; top: -40px; right: 0;
      background: none; border: none; color: white;
      font-size: 32px; cursor: pointer; line-height: 1;
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Close handlers
    const close = () => {
      overlay.remove();
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }
});