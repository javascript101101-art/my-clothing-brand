/* ============================================
   Product Detail Page — Dynamic Rendering
   Query String (?id=1) မှ Product ID ကို ယူပြီး
   products.json မှ Data ကို ဆွဲယူပြသသည်
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initProductDetail();
});

/* ===== Main Init ===== */
async function initProductDetail() {
  const container = document.getElementById('productDetailContainer');
  if (!container) return;

  // ၁။ Query String မှ Product ID ကို ယူပါ
  const productId = getProductIdFromUrl();

  // ၂။ ID မရှိရင် Error ပြပါ
  if (!productId) {
    renderError(container, 'ထုတ်ကုန် ID မရှိပါ', 'ထုတ်ကုန်စာရင်းသို့ ပြန်သွားပါ');
    return;
  }

  // ၃။ Loading State ပြပါ
  renderLoading(container);

  try {
    // ၄။ Product Data ကို Load လုပ်ပါ
    const products = await loadProducts();

    // ၅။ သက်ဆိုင်ရာ Product ကို ရှာပါ
    const product = products.find((p) => String(p.id) === String(productId));

    // ၆။ Product မတွေ့ရင် Error ပြပါ
    if (!product) {
      renderError(
        container,
        'ထုတ်ကုန် မတွေ့ပါ',
        `ID "${productId}" ဖြင့် ထုတ်ကုန် မရှိပါ`
      );
      return;
    }

    // ၇။ Product အသေးစိတ်ကို Render လုပ်ပါ
    renderProductDetail(container, product);
  } catch (error) {
    console.error('Product detail error:', error);
    renderError(
      container,
      'Data ဆွဲယူ၍ မရပါ',
      'နောက်မှ ပြန်ကြိုးစားပါ သို့မဟုတ် ဆက်သွယ်ပါ'
    );
  }
}

/* ===== Query String မှ Product ID ယူခြင်း ===== */
function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

/* ===== Product Data Load လုပ်ခြင်း ===== */
async function loadProducts() {
  const res = await fetch('data/products.json');
  if (!res.ok) throw new Error('Failed to load products');
  return res.json();
}

/* ===== Loading State ===== */
function renderLoading(container) {
  container.innerHTML = `
    <div class="state-box">
      <div class="state-box__icon">⏳</div>
      <h2>ထုတ်ကုန် အချက်အလက် ဆွဲယူနေသည်...</h2>
      <p>ခဏစောင့်ပါ</p>
    </div>
  `;
}

/* ===== Error State ===== */
function renderError(container, title, message) {
  container.innerHTML = `
    <div class="state-box">
      <div class="state-box__icon">😕</div>
      <h2>${escapeHTML(title)}</h2>
      <p>${escapeHTML(message)}</p>
      <a href="products.html" class="btn btn--primary">ထုတ်ကုန်စာရင်းသို့ ပြန်သွားရန်</a>
    </div>
  `;
}

/* ===== Product အသေးစိတ် Render လုပ်ခြင်း ===== */
function renderProductDetail(container, product) {
  // ===== ၁။ Dynamic SEO Meta Tags Update =====
  updateDynamicSEO(product);

  // ===== ၂။ Size / Color Options များ ဖန်တီးပါ =====
  const sizesHTML = (product.sizes || [])
    .map(
      (size, i) =>
        `<span class="product-options__item ${i === 0 ? 'active' : ''}" data-size="${escapeHTML(size)}">${escapeHTML(size)}</span>`
    )
    .join('');

  const colorsHTML = (product.colors || [])
    .map(
      (color, i) =>
        `<span class="product-options__item ${i === 0 ? 'active' : ''}" data-color="${escapeHTML(color)}">${escapeHTML(color)}</span>`
    )
    .join('');

  // ===== ၃။ Main HTML =====
  container.innerHTML = `
    <!-- Breadcrumb -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="index.html">Home</a>
      <span class="breadcrumb__sep">/</span>
      <a href="products.html">Products</a>
      <span class="breadcrumb__sep">/</span>
      <span>${escapeHTML(product.name)}</span>
    </nav>

    <!-- Product Detail -->
    <div class="product-detail">
      <!-- Image Gallery -->
      <div class="product-gallery">
        <div class="product-gallery__main">
          <img
            id="mainImage"
            src="${escapeHTML(product.image)}"
            alt="${escapeHTML(product.name)} — My Clothing Brand"
            loading="eager"
            onerror="this.src='https://via.placeholder.com/600x800/f0f0f0/999?text=No+Image'"
          >
        </div>
        <div class="product-gallery__thumbs">
          <div class="product-gallery__thumb active">
            <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)} — View 1"
              loading="lazy"
              onerror="this.src='https://via.placeholder.com/100x100/f0f0f0/999?text=1'">
          </div>
          <div class="product-gallery__thumb">
            <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)} — View 2"
              loading="lazy"
              onerror="this.src='https://via.placeholder.com/100x100/f0f0f0/999?text=2'">
          </div>
          <div class="product-gallery__thumb">
            <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)} — View 3"
              loading="lazy"
              onerror="this.src='https://via.placeholder.com/100x100/f0f0f0/999?text=3'">
          </div>
        </div>
      </div>

      <!-- Product Info -->
      <div class="product-info">
        ${product.badge ? `<span class="product-info__badge">${escapeHTML(product.badge)}</span>` : ''}

        <h1 class="product-info__title">${escapeHTML(product.name)}</h1>

        <div class="product-info__price">${formatMMK(product.price)}</div>

        <p class="product-info__desc">${escapeHTML(product.description || '')}</p>

        <!-- Meta Info -->
        <div class="product-info__meta">
          <div class="product-info__meta-row">
            <span class="product-info__meta-label">အမျိုးအစား</span>
            <span class="product-info__meta-value">${escapeHTML(product.category || 'N/A')}</span>
          </div>
          <div class="product-info__meta-row">
            <span class="product-info__meta-label">ရနိုင်သော Size</span>
            <span class="product-info__meta-value">${(product.sizes || []).join(', ') || 'N/A'}</span>
          </div>
          <div class="product-info__meta-row">
            <span class="product-info__meta-label">ရနိုင်သော အရောင်</span>
            <span class="product-info__meta-value">${(product.colors || []).join(', ') || 'N/A'}</span>
          </div>
        </div>

        <!-- Size Options -->
        ${sizesHTML ? `
          <div class="product-options">
            <label class="product-options__label">Size ရွေးပါ</label>
            <div class="product-options__list" id="sizeOptions">
              ${sizesHTML}
            </div>
          </div>
        ` : ''}

        <!-- Color Options -->
        ${colorsHTML ? `
          <div class="product-options">
            <label class="product-options__label">အရောင် ရွေးပါ</label>
            <div class="product-options__list" id="colorOptions">
              ${colorsHTML}
            </div>
          </div>
        ` : ''}

        <!-- Actions -->
        <div class="product-actions">
          <div class="product-actions__primary">
            <a href="https://m.me/yourbrandpage?ref=product-${product.id}" target="_blank" rel="noopener" class="btn btn--messenger">
              💬 Messenger မှ မှာရန်
            </a>
            <a href="viber://chat?number=%2B959xxxxxxxxx" class="btn btn--viber">
              📞 Viber
            </a>
          </div>
          <button class="btn btn--outline" id="shareBtn">
            🔗 Link ကို Copy လုပ်ရန်
          </button>
        </div>
      </div>
    </div>
  `;

  // ===== ၄။ Event Listeners များ ထည့်ပါ =====
  attachOptionListeners();
  attachShareListener(product);
  attachThumbnailListeners();
}

/* ===== ⭐ Dynamic SEO Meta Tags Update ===== */
function updateDynamicSEO(product) {
  const BASE_URL = 'https://javascript101101-art.github.io/my-clothing-brand';
  const fullImageUrl = `${BASE_URL}/${product.image}`;
  const currentUrl = window.location.href;

  // ===== ၁။ Title Update =====
  document.title = `${product.name} — My Clothing Brand`;

  // ===== ၂။ Meta Description =====
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content',
    product.description || `${product.name} — ${product.price} Ks | My Clothing Brand`
  );

  // ===== ၃။ Meta Keywords =====
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    document.head.appendChild(metaKeywords);
  }
  const keywords = [
    product.name,
    product.nameMy,
    product.category,
    'My Clothing Brand',
    'မြန်မာအထည်',
    'လက်လုပ်အထည်',
  ].filter(Boolean).join(', ');
  metaKeywords.setAttribute('content', keywords);

  // ===== ၄။ Canonical URL Update =====
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', currentUrl);

  // ===== ၅။ Open Graph Tags (Facebook) =====
  const ogTags = {
    'og:type': 'product',
    'og:url': currentUrl,
    'og:title': product.name,
    'og:description': product.description || '',
    'og:image': fullImageUrl,
    'og:image:width': '800',
    'og:image:height': '1067',
    'og:site_name': 'My Clothing Brand',
    'og:locale': 'my_MM',
  };

  Object.entries(ogTags).forEach(([property, content]) => {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', property);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  });

  // ===== ၆။ Twitter Card Tags =====
  const twitterTags = {
    'twitter:card': 'summary_large_image',
    'twitter:url': currentUrl,
    'twitter:title': product.name,
    'twitter:description': product.description || '',
    'twitter:image': fullImageUrl,
  };

  Object.entries(twitterTags).forEach(([name, content]) => {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  });

  // ===== ၇။ Product Structured Data (JSON-LD) =====
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    alternateName: product.nameMy || product.name,
    image: [fullImageUrl],
    description: product.description || '',
    sku: `SKU-${product.id}`,
    category: product.category || '',
    brand: {
      '@type': 'Brand',
      name: 'My Clothing Brand',
    },
    offers: {
      '@type': 'Offer',
      url: currentUrl,
      priceCurrency: 'MMK',
      price: product.price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'My Clothing Brand',
      },
    },
  };

  // ရှိပြီးသား Schema ရှိရင် ဖျက်
  const existingSchema = document.getElementById('product-dynamic-schema');
  if (existingSchema) existingSchema.remove();

  // Schema အသစ် ထည့်
  const schemaScript = document.createElement('script');
  schemaScript.type = 'application/ld+json';
  schemaScript.id = 'product-dynamic-schema';
  schemaScript.textContent = JSON.stringify(productSchema);
  document.head.appendChild(schemaScript);

  console.log('✅ SEO updated for:', product.name);
}

/* ===== Size / Color Option Listeners ===== */
function attachOptionListeners() {
  const sizeOptions = document.querySelectorAll('#sizeOptions .product-options__item');
  const colorOptions = document.querySelectorAll('#colorOptions .product-options__item');

  sizeOptions.forEach((opt) => {
    opt.addEventListener('click', () => {
      sizeOptions.forEach((o) => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  colorOptions.forEach((opt) => {
    opt.addEventListener('click', () => {
      colorOptions.forEach((o) => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });
}

/* ===== Share Button Listener ===== */
function attachShareListener(product) {
  const shareBtn = document.getElementById('shareBtn');
  if (!shareBtn) return;

  shareBtn.addEventListener('click', async () => {
    const url = window.location.href;
    const shareData = {
      title: product.name,
      text: `${product.name} — ${formatMMK(product.price)}`,
      url: url,
    };

    // ===== Native Share API (Mobile) =====
    if (navigator.share && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name === 'AbortError') return; // User က Cancel လုပ်လို့
      }
    }

    // ===== Clipboard Copy (Desktop Fallback) =====
    try {
      await navigator.clipboard.writeText(url);
      showToast('✅ Link ကို Copy လုပ်ပြီးပါပြီ!');
    } catch (err) {
      // Old Browser Fallback
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      showToast('✅ Link ကို Copy လုပ်ပြီးပါပြီ!');
    }
  });
}

/* ===== Thumbnail Listener ===== */
function attachThumbnailListeners() {
  const mainImage = document.getElementById('mainImage');
  const thumbs = document.querySelectorAll('.product-gallery__thumb');

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      thumbs.forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');

      const img = thumb.querySelector('img');
      if (img && mainImage) {
        mainImage.src = img.src;
      }
    });
  });
}

/* ===== Toast Message ===== */
function showToast(message) {
  // ရှိပြီးသား Toast ရှိရင် ဖျက်
  const existingToast = document.querySelector('.toast-message');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: #1a1a1a;
    color: white;
    padding: 14px 28px;
    border-radius: 9999px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    animation: fadeInUp 0.3s ease;
    max-width: 90vw;
    text-align: center;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/* ===== Utility: Escape HTML ===== */
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}