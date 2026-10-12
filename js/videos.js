/* ============================================
   Video Gallery — YouTube + TikTok Support
   ============================================ */

// =====================================================
// ⭐ သင့် Videos များ ဤနေရာမှာ ထည့်ပါ
// =====================================================

const VIDEOS = [
  // ===== YouTube Videos =====
  {
    platform: 'youtube',
    id: 'dQw4w9WgXcQ',
    title: 'Classic Linen Shirt — Product Demo',
    description: 'ကိုယ်ပိုင်ဒီဇိုင်းဖြင့် ချုပ်လုပ်ထားသော Linen Shirt အသေးစိတ်',
    category: 'product',
    categoryLabel: 'Product Demo',
  },
  {
    platform: 'youtube',
    id: 'dQw4w9WgXcQ',
    title: 'Behind the Scenes — Workshop',
    description: 'ကျွန်ုပ်တို့၏ ချုပ်လုပ်တဲ့ လုပ်ငန်းစဉ်',
    category: 'behind',
    categoryLabel: 'Behind the Scenes',
  },

  // ===== TikTok Videos =====
  {
    platform: 'tiktok',
    id: '7692869850535955718',
    username: 'yannaung5920',
    thumbnail: 'assets/images/videos/tiktok-1.jpg',    // ⭐ ကိုယ်ပိုင် Thumbnail
    title: 'Floral Dress TikTok',
    description: 'နွေရာသီအတွက် ပေါ့ပါးသော ဂါဝန် — TikTok မှ',
    category: 'product',
    categoryLabel: 'Product Demo',
  },
  {
    platform: 'tiktok',
    id: '7234567890123456790',
    username: 'yourbrand',
    thumbnail: 'assets/images/videos/tiktok-2.jpg',    // ⭐ ကိုယ်ပိုင် Thumbnail
    title: 'Size Guide Tutorial',
    description: 'သင့်အရွယ်အစား မှန်ကန်စွာ တိုင်းတာနည်း',
    category: 'tutorial',
    categoryLabel: 'Tutorial',
  },
  {
    platform: 'tiktok',
    id: '7234567890123456791',
    username: 'yourbrand',
    thumbnail: 'assets/images/videos/tiktok-3.jpg',    // ⭐ ကိုယ်ပိုင် Thumbnail
    title: 'Behind the Scenes',
    description: 'အထည်ချုပ်လုပ်တဲ့ အခိုက်အတန့်',
    category: 'behind',
    categoryLabel: 'Behind the Scenes',
  },
];

// =====================================================
// Application Code — အောက်ပါ Code ကို မပြင်ပါနှင့်
// =====================================================

let currentPlatform = 'all';
let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
  initVideoGallery();
});

/* ===== Main Init ===== */
function initVideoGallery() {
  const grid = document.getElementById('videoGrid');
  if (!grid) return;

  renderVideos();
  initPlatformFilters();
  initCategoryFilters();
  initModalClose();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVideoModal();
  });
}

/* ===== Render Videos ===== */
function renderVideos() {
  const grid = document.getElementById('videoGrid');
  if (!grid) return;

  let filtered = VIDEOS;

  if (currentPlatform !== 'all') {
    filtered = filtered.filter((v) => v.platform === currentPlatform);
  }

  if (currentCategory !== 'all') {
    filtered = filtered.filter((v) => v.category === currentCategory);
  }

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">🎬</div>
        <h3>ဗီဒီယို မရှိပါ</h3>
        <p>ဤ Filter အတွက် ဗီဒီယို မရှိသေးပါ။</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map((video) => {
    // ===== ⭐ Thumbnail URL Logic =====
    let thumbUrl;

    // ၁။ ကိုယ်ပိုင် Thumbnail ရှိရင် သုံး
    if (video.thumbnail) {
      thumbUrl = video.thumbnail;
    }
    // ၂။ YouTube ဆိုရင် YouTube Thumbnail
    else if (video.platform === 'youtube') {
      thumbUrl = `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`;
    }
    // ၃။ Fallback — Local Placeholder
    else {
      thumbUrl = 'assets/images/videos/tiktok-placeholder.jpg';
    }

    // ===== Fallback — ပုံ မပေါ်ရင် =====
    const fallbackThumb = video.platform === 'youtube'
      ? `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`
      : 'assets/images/videos/tiktok-placeholder.jpg';

    const platformBadge = video.platform === 'youtube'
      ? `<span class="video-card__platform video-card__platform--youtube">▶️ YouTube</span>`
      : `<span class="video-card__platform video-card__platform--tiktok">🎵 TikTok</span>`;

    return `
      <article
        class="video-card video-card--${escapeHTML(video.platform)}"
        data-platform="${escapeHTML(video.platform)}"
        data-category="${escapeHTML(video.category)}"
        data-video-id="${escapeHTML(video.id)}"
        data-username="${escapeHTML(video.username || '')}"
      >
        <div class="video-card__thumbnail">
          ${platformBadge}
          <img
            src="${thumbUrl}"
            alt="${escapeHTML(video.title)}"
            loading="lazy"
            onerror="this.onerror=null; this.src='${fallbackThumb}'"
          >
          <div class="video-card__play"></div>
        </div>
        <div class="video-card__body">
          <span class="video-card__category">${escapeHTML(video.categoryLabel)}</span>
          <h3 class="video-card__title">${escapeHTML(video.title)}</h3>
          <p class="video-card__desc">${escapeHTML(video.description)}</p>
        </div>
      </article>
    `;
  }).join('');

  // Click Events
  grid.querySelectorAll('.video-card').forEach((card) => {
    card.addEventListener('click', () => {
      const { videoId, username, platform } = card.dataset;
      openVideoModal(platform, videoId, username);
    });
  });
}

/* ===== Platform Filter ===== */
function initPlatformFilters() {
  const container = document.getElementById('platformFilters');
  if (!container) return;

  const btns = container.querySelectorAll('.platform-filter-btn');

  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      btns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentPlatform = btn.dataset.platform;
      renderVideos();
    });
  });
}

/* ===== Category Filter ===== */
function initCategoryFilters() {
  const container = document.getElementById('categoryFilters');
  if (!container) return;

  const btns = container.querySelectorAll('.category-filter-btn');

  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      btns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      renderVideos();
    });
  });
}

/* ===== Open Video Modal ===== */
function openVideoModal(platform, videoId, username) {
  // ===== TikTok — New Tab မှာ ဖွင့် =====
  if (platform === 'tiktok') {
    const cleanUsername = username.replace(/^@/, '');
    const tiktokUrl = `https://www.tiktok.com/@${cleanUsername}/video/${videoId}`;

    // User ကို သတိပေးချက် ပြပြီး New Tab မှာ ဖွင့်
    showTikTokToast(tiktokUrl);
    return;
  }

  // ===== YouTube — Modal မှာ ဖွင့် =====
  const modal = document.getElementById('videoModal');
  const content = document.getElementById('videoModalContent');
  const playerContainer = document.getElementById('videoPlayerContainer');
  if (!modal || !playerContainer || !content) return;

  content.className = 'video-modal__content';
  content.classList.add(`video-modal__content--youtube`);

  playerContainer.innerHTML = '';

  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  iframe.title = 'YouTube Video';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  playerContainer.appendChild(iframe);

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/* ===== TikTok Toast — New Tab ဖွင့်ရန် ===== */
function showTikTokToast(url) {
  // ရှိပြီးသား Toast ရှိရင် ဖျက်
  const existing = document.querySelector('.tiktok-redirect-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'tiktok-redirect-toast';
  toast.innerHTML = `
    <div style="font-size: 24px; margin-bottom: 8px;">🎵</div>
    <div style="font-weight: 600; margin-bottom: 4px;">TikTok Video</div>
    <div style="font-size: 13px; opacity: 0.9; margin-bottom: 16px;">
      TikTok မှာ ကြည့်ရန် အောက်ပါ Button ကို နှိပ်ပါ
    </div>
    <a
      href="${url}"
      target="_blank"
      rel="noopener"
      style="
        display: inline-block;
        padding: 10px 24px;
        background: #ff0050;
        color: white;
        border-radius: 9999px;
        font-weight: 600;
        text-decoration: none;
        font-size: 14px;
      "
    >
      🎵 TikTok မှာ ကြည့်ရန်
    </a>
  `;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: #1a1a1a;
    color: white;
    padding: 24px 32px;
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    z-index: 9999;
    max-width: 90vw;
    animation: fadeInUp 0.3s ease;
    font-family: var(--font-body);
  `;

  document.body.appendChild(toast);

  // Auto Open New Tab (Browser Block လုပ်နိုင်သည်)
  window.open(url, '_blank', 'noopener');

  // ၁၀ စက္ကန့်အကြာမှာ Toast ဖျက်
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }
  }, 10000);
}
/* ===== Close Video Modal ===== */
function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  const playerContainer = document.getElementById('videoPlayerContainer');
  if (!modal || !playerContainer) return;

  modal.classList.remove('active');
  playerContainer.innerHTML = '';
  document.body.style.overflow = '';
}

/* ===== Modal Close Events ===== */
function initModalClose() {
  const modal = document.getElementById('videoModal');
  const closeBtn = document.getElementById('videoModalClose');
  if (!modal) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', closeVideoModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeVideoModal();
  });
}

/* ===== Utility: Escape HTML ===== */
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}