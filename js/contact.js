/* ============================================
   Contact Form — Formspree Integration
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // ===== Button Loading State =====
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '⏳ ပို့နေသည်...';
    submitBtn.disabled = true;

    // ===== Status Message ရှင်းလင်း =====
    statusEl.innerHTML = '';

    try {
      const formData = new FormData(form);

      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        // ✅ အောင်မြင်သည်
        showStatus('✅ သင့်စာ ပို့ပြီးပါပြီ။ မကြာမီ ပြန်လည်ဆက်သွယ်ပါမည်။', 'success');
        form.reset();
      } else {
        // ❌ Formspree Error
        const data = await response.json();
        const errMsg = data.errors
          ? data.errors.map((err) => err.message).join(', ')
          : 'ပို့၍ မရပါ';
        showStatus(`❌ ${errMsg}`, 'error');
      }
    } catch (error) {
      // ❌ Network Error
      console.error('Contact form error:', error);
      showStatus('❌ ကွန်ရက် ပြဿနာ ရှိပါသည်။ နောက်မှ ပြန်ကြိုးစားပါ။', 'error');
    } finally {
      // ===== Button ပြန်လည် အသက်သွင်း =====
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  /* ===== Status Message ပြသရန် Function ===== */
  function showStatus(text, type) {
    statusEl.textContent = text;
    statusEl.style.cssText = `
      padding: 14px 20px;
      border-radius: 8px;
      margin-top: 16px;
      font-weight: 500;
      font-size: 14px;
      text-align: center;
      background: ${type === 'success' ? '#d1fae5' : '#fee2e2'};
      color: ${type === 'success' ? '#065f46' : '#991b1b'};
      border: 1px solid ${type === 'success' ? '#6ee7b7' : '#fca5a5'};
    `;

    // ၇ စက္ကန့်အကြာမှာ Message ဖျက် (အောင်မြင်ရင်သာ)
    if (type === 'success') {
      setTimeout(() => {
        statusEl.innerHTML = '';
        statusEl.style.cssText = '';
      }, 7000);
    }
  }
});