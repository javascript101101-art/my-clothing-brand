/* ============================================
   Animations & Effects — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initBackToTop();
  initHeroParallax();
  initImageFadeIn();
  console.log('✨ Animations initialized');
});

/* ===== 1. Scroll Reveal ===== */
function initScrollReveal() {
  // Observer တည်ဆောက်
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // တစ်ကြိမ်သာ လုပ်ဆောင်
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  // Auto Reveal လိုချင်တဲ့ Selectors
  const autoRevealSelectors = [
    '.section-title',
    '.product-card',
    '.story__image',
    '.story__content',
    '.contact-info__item',
    '.video-wrapper',
    '.gallery-item',
    '.hero__content',
  ];

  const applyReveal = (root = document) => {
    autoRevealSelectors.forEach((selector) => {
      root.querySelectorAll(`${selector}:not(.reveal)`).forEach((el) => {
        el.classList.add('reveal');
        observer.observe(el);
      });
    });

    // data-reveal Attribute ရှိသူများ
    root.querySelectorAll('[data-reveal]:not(.reveal)').forEach((el) => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  };

  // ပထမဆုံး Run
  applyReveal();

  // Dynamic Content (Product Cards စသည်) အတွက် Watch
  const mutationObserver = new MutationObserver(() => {
    applyReveal();
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

/* ===== 2. Back to Top Button ===== */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Back to top');
  btn.setAttribute('title', 'အပေါ်သို့ ပြန်တက်');
  document.body.appendChild(btn);

  // Scroll လုပ်ရင် ပြ/ဖျောက်
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 400) {
          btn.classList.add('show');
        } else {
          btn.classList.remove('show');
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // Click လုပ်ရင် အပေါ်သို့ တက်
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== 3. Hero Parallax ===== */
function initHeroParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const viewportHeight = window.innerHeight;

        // Hero က Viewport ထဲ ရှိရင်သာ လုပ်ဆောင်
        if (scrolled < viewportHeight) {
          const translateY = scrolled * 0.35;
          const opacity = Math.max(0, 1 - scrolled / (viewportHeight * 0.9));

          hero.style.transform = `translateY(${translateY}px)`;
          hero.style.opacity = opacity;
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ===== 4. Image Fade In on Load ===== */
function initImageFadeIn() {
  const images = document.querySelectorAll('img:not(.no-fade)');

  images.forEach((img) => {
    img.classList.add('lazy-load');

    if (img.complete && img.naturalHeight !== 0) {
      // Cache မှ ချက်ချင်း Load ဖြစ်သွားရင်
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'));
      img.addEventListener('error', () => img.classList.add('loaded'));
    }
  });
}