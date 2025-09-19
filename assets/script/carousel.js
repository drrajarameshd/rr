// carousel.js
const slides = document.getElementById("carouselSlides");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;
let autoPlayInterval = null;
const AUTO_PLAY_DELAY = 5000; // ms

function updateCarousel(animate = true) {
  if (animate) {
    slides.style.transition = "transform 0.6s ease-in-out";
  } else {
    slides.style.transition = "none";
  }
  slides.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Navigation
function goNext() {
  const totalSlides = slides.children.length;
  currentIndex = (currentIndex + 1) % totalSlides;
  updateCarousel();
}
function goPrev() {
  const totalSlides = slides.children.length;
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  updateCarousel();
}

nextBtn.addEventListener("click", () => {
  pauseAutoPlay();
  goNext();
  restartAutoPlay();
});
prevBtn.addEventListener("click", () => {
  pauseAutoPlay();
  goPrev();
  restartAutoPlay();
});

// Auto-play
function startAutoPlay() {
  if (autoPlayInterval) return;
  autoPlayInterval = setInterval(goNext, AUTO_PLAY_DELAY);
}
function pauseAutoPlay() {
  if (!autoPlayInterval) return;
  clearInterval(autoPlayInterval);
  autoPlayInterval = null;
}
function restartAutoPlay() {
  pauseAutoPlay();
  startAutoPlay();
}

// --- Touch / Pointer (swipe) support ---
let pointerActive = false;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
const SWIPE_THRESHOLD = 50; // px to trigger slide change

// Helper to get container width (used in calculations)
function containerWidth() {
  return slides.offsetWidth;
}

// When dragging, we apply a temporary transform (no transition)
function setTranslateX(px) {
  slides.style.transition = "none";
  slides.style.transform = `translateX(${px}px)`;
}

function onPointerDown(event) {
  // support touch and mouse via pointer events
  pointerActive = true;
  pauseAutoPlay();

  // For touch events clientX is in event.touches[0], but pointer events expose clientX directly
  startX = event.clientX;
  // compute current translate value in px
  prevTranslate = -currentIndex * containerWidth();
  currentTranslate = prevTranslate;

  // capture pointer to receive move/up outside element
  if (event.pointerId) slides.setPointerCapture?.(event.pointerId);
}

function onPointerMove(event) {
  if (!pointerActive) return;
  const dx = event.clientX - startX;
  currentTranslate = prevTranslate + dx;
  setTranslateX(currentTranslate);
}

function onPointerUp(event) {
  if (!pointerActive) return;
  pointerActive = false;

  const dx = event.clientX - startX;
  // decide
  if (dx > SWIPE_THRESHOLD) {
    // swipe right -> previous
    goPrev();
  } else if (dx < -SWIPE_THRESHOLD) {
    // swipe left -> next
    goNext();
  } else {
    // small movement -> snap back
    updateCarousel(true);
  }

  restartAutoPlay();

  // release pointer capture if held
  try { if (event.pointerId) slides.releasePointerCapture?.(event.pointerId); } catch (e) {}
}

// Fallback: if browser doesn't support pointer events, attach touch events too
const supportsPointer = window.PointerEvent !== undefined;

if (supportsPointer) {
  slides.addEventListener("pointerdown", onPointerDown);
  slides.addEventListener("pointermove", onPointerMove);
  slides.addEventListener("pointerup", onPointerUp);
  slides.addEventListener("pointercancel", onPointerUp);
  slides.addEventListener("pointerleave", (e) => {
    // treat leaving the slide while pressed as pointer up
    if (pointerActive) onPointerUp(e);
  });
} else {
  // touch events fallback
  slides.addEventListener("touchstart", (e) => onPointerDown(e.touches[0]));
  slides.addEventListener("touchmove", (e) => {
    // prevent page scrolling when swiping on carousel horizontally
    e.preventDefault();
    onPointerMove(e.touches[0]);
  }, { passive: false });
  slides.addEventListener("touchend", (e) => {
    // touchend has no coordinates, so use the last known position (currentTranslate)
    // compute dx from prevTranslate
    const dx = currentTranslate - prevTranslate;
    if (dx > SWIPE_THRESHOLD) goPrev();
    else if (dx < -SWIPE_THRESHOLD) goNext();
    else updateCarousel(true);
    restartAutoPlay();
  });
}

// Optional: keyboard navigation (left/right)
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    pauseAutoPlay();
    goNext();
    restartAutoPlay();
  } else if (e.key === "ArrowLeft") {
    pauseAutoPlay();
    goPrev();
    restartAutoPlay();
  }
});

// Ensure carousel snaps correctly on resize
window.addEventListener("resize", () => {
  // force recalculation of translate based on new width
  updateCarousel(false);
});

// Initialize
updateCarousel(false);
startAutoPlay();


