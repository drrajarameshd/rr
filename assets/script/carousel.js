// assets/script/carousel.js
(function () {
  const slidesEl = document.getElementById("slides");
  if (!slidesEl) return;
  const slides = Array.from(slidesEl.children);
  const total = slides.length;

  let index = 0;
  let isDragging = false;
  let startX = 0;
  let autoplayTimer = null;
  const AUTOPLAY_INTERVAL = 4500; // ms
  const SWIPE_THRESHOLD = 60; // px

  // keep transform and UI update simple
  function updateUI() {
    slidesEl.style.transition = "transform 400ms cubic-bezier(.2,.9,.2,1)";
    slidesEl.style.transform = `translateX(${-index * 100}%)`;
  }

  function goTo(i) {
    index = (i + total) % total;
    updateUI();
    restartAutoplay();
  }

  // pointer (touch/drag) support
  slidesEl.addEventListener("pointerdown", (e) => {
    isDragging = true;
    startX = e.clientX;
    slidesEl.style.transition = "none";
    // capture pointer so pointerup fires even if pointer leaves element
    slidesEl.setPointerCapture && slidesEl.setPointerCapture(e.pointerId);
  });

  slidesEl.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    slidesEl.style.transform = `translateX(${
      -index * 100 + (dx / slidesEl.clientWidth) * 100
    }%)`;
  });

  slidesEl.addEventListener("pointerup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    slidesEl.style.transition = "transform 400ms cubic-bezier(.2,.9,.2,1)";
    const dx = e.clientX - startX;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0) goTo(index + 1);
      else goTo(index - 1);
    } else {
      updateUI();
    }
    try { slidesEl.releasePointerCapture && slidesEl.releasePointerCapture(e.pointerId); } catch (err) {}
  });

  // also handle pointercancel (e.g., system cancel)
  slidesEl.addEventListener("pointercancel", () => {
    if (!isDragging) return;
    isDragging = false;
    updateUI();
  });

  // Autoplay
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      index = (index + 1) % total;
      updateUI();
    }, AUTOPLAY_INTERVAL);
  }
  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
  function restartAutoplay() {
    stopAutoplay();
    // small delay to avoid immediate flip after user interaction
    autoplayTimer = setTimeout(startAutoplay, 600);
  }

  // Pause autoplay while user is interacting (pointer down), resume after pointerup
  slidesEl.addEventListener("pointerdown", stopAutoplay);
  slidesEl.addEventListener("pointerup", () => {
    restartAutoplay();
  });
  slidesEl.addEventListener("pointercancel", () => {
    restartAutoplay();
  });

  // Accessibility: allow keyboard left/right to still move slides (optional)
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(index - 1);
    if (e.key === "ArrowRight") goTo(index + 1);
  });

  // init
  updateUI();
  startAutoplay();

  // If user wants autoplay to pause when page/tab not visible:
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });
})();

