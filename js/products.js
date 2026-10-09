/* ============================================
   Products JavaScript — Load & Render Products
   ============================================ */

// ===== Sample Product Data =====
// နောက်ပိုင်း data/products.json ကနေ load လုပ်မည်
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: 'Classic Linen Shirt',
    price: 45000,
    category: 'men',
    image: 'assets/images/products/product-1.jpg',
    badge: 'New',
    description: 'အရည်အသွေးမြင့် Linen Material ဖြင့် ချုပ်လုပ်ထားသည်'
  },
  {
    id: 2,
    name: 'Floral Summer Dress',
    price: 65000,
    category: 'women',
    image: 'assets/images/products/product-2.jpg',
    badge: 'Popular',
    description: 'နွေရာသီအတွက် ပေါ့ပါးသော အဝတ်အစား'
  },
  {
    id: 3,
    name: 'Cotton T-Shirt',
    price: 25000,
    category: 'unisex',
    image: 'assets/images/products/product-3.jpg',
    badge: '',
    description: '100% Cotton ဖြင့် ချုပ်လုပ်ထားသည်'
  },
  {
    id: 4,
    name: 'Denim Jacket',
    price: 95000,
    category: 'unisex',
    image: 'assets/images/products/product-4.jpg',
    badge: 'Sale',
    description: 'ကိုယ်ပိုင်ဒီဇိုင်း Denim Jacket'
  },
  {
    id: 5,
    name: 'Silk Scarf',
    price: 35000,
    category: 'accessories',
    image: 'assets/images/products/product-5.jpg',
    badge: '',
    description: 'မြန်မာပိုးဖြင့် ရက်လုပ်ထားသည်'
  },
  {
    id: 6,
    name: 'Kids Hoodie',
    price: 40000,
    category: 'kids',
    image: 'assets/images/products/product-6.jpg',
    badge: 'New',
    description: 'ကလေးများအတွက် နွေးထွေးသော Hoodie'
  }
];

// ===== State =====
let allProducts = [];
let currentFilter = 'all';

/* ===== Init ===== */
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('featuredProducts');
  const allProductsGrid = document.getElementById('allProducts');

  if (!container && !allProductsGrid) return;

  // Product များ Load
  allProducts = await loadProducts();

  // Featured Section (Home Page)
  if (container) {
    renderProducts(container, allProducts.slice(0, 3));
  }

  // All Products Section (Products Page)
  if (allProductsGrid) {
    renderProducts(allProductsGrid, allProducts);
    initFilters();
  }
});

/* ===== Load Products ===== */
async function loadProducts() {
  try {
    const res = await fetch('data/products.json');
    if (!res.ok) throw new Error('Failed to load');
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('⚠️ Using sample data (products.json not found)');
    return SAMPLE_PRODUCTS;
  }
}

/* ===== Render Products ===== */
function renderProducts(container, products) {
  if (!products.length) {
    container.innerHTML = '<div class="loading">ထုတ်ကုန် မရှိပါ</div>';
    return;
  }

  container.innerHTML = products.map((p) => `
    <article class="product-card fade-in-up" data-id="${p.id}" data-category="${p.category}">
      <div class="product-card__image">
        ${p.badge ? `<span class="product-card__badge">${escapeHTML(p.badge)}</span>` : ''}
        <img
          src="${escapeHTML(p.image)}"
          alt="${escapeHTML(p.name)}"
          loading="lazy"
          onerror="this.src='https://via.placeholder.com/400x533/f0f0f0/999?text=No+Image'"
        >
      </div>
      <div class="product-card__body">
        <h3 class="product-card__title">${escapeHTML(p.name)}</h3>
        <p class="product-card__price">${formatMMK(p.price)}</p>
      </div>
    </article>
  `).join('');

  // Click Event ထည့်
  container.querySelectorAll('.product-card').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      window.location.href = `product-detail.html?id=${id}`;
    });
  });
}

/* ===== Filter Products ===== */
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const grid = document.getElementById('allProducts');
  if (!grid) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      currentFilter = btn.dataset.filter;
      const filtered = currentFilter === 'all'
        ? allProducts
        : allProducts.filter((p) => p.category === currentFilter);

      renderProducts(grid, filtered);
    });
  });
}