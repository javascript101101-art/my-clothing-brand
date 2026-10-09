/* ============================================
   Contact Form — Using Formspree (Free)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Loading State
    submitBtn.textContent = 'ပို့နေသည်...';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        showMessage('✅ သင့်စာ ပို့ပြီးပါပြီ။ မကြာမီ ပြန်လည်ဆက်သွယ်ပါမည်။', 'success');
        form.reset();
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      showMessage('❌ ပို့၍ မရပါ။ နောက်မှ ပြန်ကြိုးစားပါ။', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  function showMessage(text, type) {
    const msg = document.createElement('div');
    msg.textContent = text;
    msg.style.cssText = `
      padding: 12px 20px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-weight: 500;
      background: ${type === 'success' ? '#d1fae5' : '#fee2e2'};
      color: ${type === 'success' ? '#065f46' : '#991b1b'};
    `;
    form.insertBefore(msg, form.firstChild);
    setTimeout(() => msg.remove(), 5000);
  }
});