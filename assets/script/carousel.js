// assets/script/carousel.js
(function () {
  const slidesEl = document.getElementById("slides");
  const slides = Array.from(slidesEl.children);
  const total = slides.length;
  const dotbar = document.getElementById("dotbar");
  const thumbs = document.getElementById("thumbs");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  let index = 0;
  let isDragging = false;
  let startX = 0;
  let autoplayTimer = null;
  const AUTOPLAY_INTERVAL = 4500;

  function createControls() {
    for (let i = 0; i < total; i++) {
      // Dots
      const d = document.createElement("button");
      d.className = "dot";
      d.setAttribute("aria-label", "Go to slide " + (i + 1));
      d.dataset.index = i;
      d.addEventListener("click", () => goTo(i));
      dotbar.appendChild(d);

      // Thumbnails
      const t = document.createElement("button");
      t.className = "thumb";
      t.dataset.index = i;
      t.setAttribute("aria-label", "Thumbnail " + (i + 1));
      const img = slides[i].querySelector("img").cloneNode();
      img.loading = "lazy";
      img.width = 280;
      img.height = 187;
      t.appendChild(img);
      t.addEventListener("click", () => goTo(i));
      thumbs.appendChild(t);
    }
  }

  function updateUI() {
    slidesEl.style.transform = `translateX(${-index * 100}%)`;

    dotbar
      .querySelectorAll(".dot")
      .forEach((d, i) => d.setAttribute("aria-current", i === index));

    thumbs
      .querySelectorAll(".thumb")
      .forEach((t, i) => t.setAttribute("aria-current", i === index));
  }

  function goTo(i) {
    index = (i + total) % total;
    updateUI();
    restartAutoplay();
  }

  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(index - 1);
    if (e.key === "ArrowRight") goTo(index + 1);
  });

  // Drag/swipe navigation
  slidesEl.addEventListener("pointerdown", (e) => {
    isDragging = true;
    startX = e.clientX;
    slidesEl.style.transition = "none";
  });

  window.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    slidesEl.style.transform = `translateX(${
      -index * 100 + (dx / slidesEl.clientWidth) * 100
    }%)`;
  });

  window.addEventListener("pointerup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    slidesEl.style.transition = "transform 400ms cubic-bezier(.2,.9,.2,1)";
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 60) {
      if (dx < 0) goTo(index + 1);
      else goTo(index - 1);
    } else {
      updateUI();
    }
  });

  // Autoplay
  function startAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goTo(index + 1), AUTOPLAY_INTERVAL);
  }
  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Pause on hover/focus
  const carousel = document.querySelector(".carousel");
  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", startAutoplay);

  // Init
  createControls();
  updateUI();
  startAutoplay();
})();
