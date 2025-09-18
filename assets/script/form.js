// assets/script/form.js
(function () {
  const form = document.getElementById('appointmentForm');
  const submitBtn = document.getElementById('formSubmit');

  // your deployed Web App (exec) URL
  const endpoint = 'https://script.google.com/macros/s/AKfycbxTfTr5aJcp6OFO4gjWvw74qMETwAnQ4uYobbDwQYwiwjJ_yZzIZx637wjh-s-IA8PV/exec';

  function showError(id, message) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message || '';
    if (message) {
      el.classList.add('active');
      el.style.display = 'block';
      el.setAttribute('aria-hidden', 'false');
    } else {
      el.classList.remove('active');
      el.style.display = 'none';
      el.setAttribute('aria-hidden', 'true');
    }
  }

  function showToast(message, isError) {
    const t = document.createElement('div');
    t.className = 'form-toast';
    t.setAttribute('role', 'status');
    t.style.position = 'fixed';
    t.style.left = '50%';
    t.style.transform = 'translateX(-50%)';
    t.style.bottom = '24px';
    t.style.zIndex = 9999;
    t.style.padding = '10px 14px';
    t.style.borderRadius = '8px';
    t.style.color = '#fff';
    t.style.background = isError ? '#dc2626' : 'var(--primary-dark, #16a34a)';
    t.textContent = message;
    document.body.appendChild(t);
    // fade after 3s
    setTimeout(() => { t.style.transition = 'opacity .35s'; t.style.opacity = '0'; }, 3000);
    setTimeout(() => t.remove(), 3600);
  }

  function clearAllErrors() {
    showError('err-name', '');
    showError('err-phone', '');
    showError('err-email', '');
    showError('err-msg', '');
  }

  function validate() {
    let ok = true;
    clearAllErrors();

    const name = document.getElementById('p_name').value.trim();
    const phone = document.getElementById('p_phone').value.trim();
    const email = document.getElementById('p_email').value.trim();
    const msg = document.getElementById('p_msg').value.trim();

    if (!name) {
      showError('err-name', 'Please enter your name.');
      ok = false;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      showError('err-phone', 'Enter a valid 10-digit Indian phone number.');
      ok = false;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('err-email', 'Enter a valid email address.');
      ok = false;
    }
    if (!msg) {
      showError('err-msg', 'Please enter a brief message.');
      ok = false;
    }

    return ok;
  }

  if (!form) {
    console.warn('appointmentForm not found on page.');
    return;
  }

  // clear individual errors while user types
  ['p_name', 'p_phone', 'p_email', 'p_msg'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      const map = { 'p_name': 'err-name', 'p_phone': 'err-phone', 'p_email': 'err-email', 'p_msg': 'err-msg' };
      showError(map[id], '');
    });
  });

  form.addEventListener('submit', async function (ev) {
    ev.preventDefault();

    if (!validate()) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '⏳ Sending...';
    }

    // URL-encoded payload avoids CORS preflight
    const params = new URLSearchParams();
    params.append('name', document.getElementById('p_name').value.trim());
    params.append('phone', document.getElementById('p_phone').value.trim());
    params.append('email', document.getElementById('p_email').value.trim());
    params.append('message', document.getElementById('p_msg').value.trim());

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: params.toString()
      });

      const txt = await res.text().catch(() => '');
      console.debug('Server response (text):', txt);

      let parsed = null;
      try {
        parsed = txt ? JSON.parse(txt) : null;
        console.debug('Server response parsed as JSON:', parsed);
      } catch (parseErr) {
        // not JSON — fine
      }

      if (!res.ok) {
        const errMsg = (parsed && parsed.message) ? parsed.message : (txt || `Server returned ${res.status}`);
        throw new Error(errMsg);
      }
      if (parsed && parsed.status === 'error') {
        throw new Error(parsed.message || 'Server returned an error');
      }

      showToast('✅ Request sent — we will contact you shortly');
      form.reset();
      clearAllErrors();

    } catch (err) {
      console.error('Form submit error:', err);
      showToast('❌ Submission failed. Please try again later.', true);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Request';
      }
    }
  });
})();
