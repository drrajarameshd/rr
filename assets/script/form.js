(function(){
if(!name){ showError('err-name','Please enter your name.'); ok=false; }
if(!/^[6-9]\d{9}$/.test(phone)){ showError('err-phone','Enter a valid 10-digit Indian phone number.'); ok=false; }
if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ showError('err-email','Enter a valid email address.'); ok=false; }
if(!msg){ showError('err-msg','Please enter a brief message.'); ok=false; }


// honeypot should be empty
if(form.website && form.website.value.trim()){ ok=false; }
return ok;
}


function showToast(text, isError){
// small accessible toast using alert role
const t = document.createElement('div');
t.className = 'form-toast';
t.setAttribute('role','status');
t.style.position = 'fixed'; t.style.left='50%'; t.style.transform='translateX(-50%)'; t.style.bottom='28px';
t.style.background = isError? '#dc2626' : '#16a34a'; t.style.color='#fff'; t.style.padding='10px 14px'; t.style.borderRadius='8px'; t.style.zIndex=9999;
t.textContent = text;
document.body.appendChild(t);
setTimeout(()=> t.style.opacity='0',3500);
setTimeout(()=> t.remove(),4200);
}


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
})();
