(function(){
  // Element refs + endpoint
  const form = document.getElementById('appointmentForm');
  const submitBtn = document.getElementById('formSubmit');
  const endpoint = 'https://script.google.com/macros/s/AKfycbyYnYR3kGeEhyzbUHwy57amAFMNhGuWDFE46zhBgTjk9gFxMGVadiyHE8Fj5sPCsYPe/exec';

  // helper to show inline errors
  function showError(id, message){
    const el = document.getElementById(id);
    if(el){
      el.textContent = message || '';
      el.setAttribute('aria-hidden', message ? 'false' : 'true');
    }
  }

  // validation function (fixed: declares `ok` and returns it)
  function validate(){
    let ok = true;
    // clear previous errors
    showError('err-name','');
    showError('err-phone','');
    showError('err-email','');
    showError('err-msg','');

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const msg = form.message.value.trim();

    if(!name){
      showError('err-name','Please enter your name.');
      ok = false;
    }
    if(!/^[6-9]\d{9}$/.test(phone)){
      showError('err-phone','Enter a valid 10-digit Indian phone number.');
      ok = false;
    }
    if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      showError('err-email','Enter a valid email address.');
      ok = false;
    }
    if(!msg){
      showError('err-msg','Please enter a brief message.');
      ok = false;
    }

    // honeypot should be empty (reject if filled)
    if(form.website && form.website.value.trim()){
      ok = false;
    }

    return ok;
  }

  // small accessible toast using alert role
  function showToast(text, isError){
    const t = document.createElement('div');
    t.className = 'form-toast';
    t.setAttribute('role','status');
    t.style.position = 'fixed';
    t.style.left = '50%';
    t.style.transform = 'translateX(-50%)';
    t.style.bottom = '28px';
    t.style.background = isError ? '#dc2626' : '#16a34a';
    t.style.color = '#fff';
    t.style.padding = '10px 14px';
    t.style.borderRadius = '8px';
    t.style.zIndex = 9999;
    t.textContent = text;
    document.body.appendChild(t);
    // fade + remove
    setTimeout(()=> { t.style.transition = 'opacity 0.4s'; t.style.opacity = '0'; }, 3500);
    setTimeout(()=> { t.remove(); }, 4200);
  }

  // submit handler
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(!validate()) return;

      submitBtn.disabled = true;
      submitBtn.textContent = '⏳ Sending...';

      const payload = {
        name: form.name.value.trim(),
        phone: form.phone.value.trim(),
        email: form.email.value.trim(),
        date: form.date.value || '',
        time: form.time.value || '',
        message: form.message.value.trim()
      };

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => res.text())
      .then(() => {
        showToast('✅ Request sent — we will contact you shortly');
        form.reset();
      })
      .catch(err => {
        console.error(err);
        showToast('❌ Submission failed. Please try again later.', true);
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Request';
      });
    });
  } else {
    console.warn('appointmentForm not found on page.');
  }
})();

