const slides = document.getElementById("carouselSlides");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsContainer = document.getElementById("carouselDots");

let currentIndex = 0;
const totalSlides = slides.children.length;
const AUTO_PLAY_DELAY = 4500;
let autoPlayInterval = null;

// Create dots dynamically
for (let i=0; i<totalSlides; i++){
  const dot = document.createElement("span");
  dot.className = "carousel-dot" + (i===0 ? " active" : "");
  dot.dataset.index = i;
  dot.addEventListener("click", ()=>{
    goToIndex(i);
    restartAutoPlay();
  });
  dotsContainer.appendChild(dot);
}

function updateCarousel(animate = true){
  slides.style.transition = animate ? "transform 0.6s ease-in-out" : "none";
  slides.style.transform = `translateX(-${currentIndex * 100}%)`;
  updateDots();
}

function updateDots(){
  const dots = dotsContainer.children;
  for (let i=0; i<dots.length; i++){
    dots[i].classList.toggle("active", i === currentIndex);
  }
}

function goNext(){
  currentIndex = (currentIndex + 1) % totalSlides;
  updateCarousel();
}
function goPrev(){
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  updateCarousel();
}
function goToIndex(i){
  currentIndex = Math.max(0, Math.min(i, totalSlides-1));
  updateCarousel();
}

// Button events
nextBtn.addEventListener("click", ()=>{ pauseAutoPlay(); goNext(); restartAutoPlay(); });
prevBtn.addEventListener("click", ()=>{ pauseAutoPlay(); goPrev(); restartAutoPlay(); });

// Auto-play
function startAutoPlay(){
  if (!autoPlayInterval) autoPlayInterval = setInterval(goNext, AUTO_PLAY_DELAY);
}
function pauseAutoPlay(){
  clearInterval(autoPlayInterval);
  autoPlayInterval = null;
}
function restartAutoPlay(){
  pauseAutoPlay();
  startAutoPlay();
}

// Swipe support
let startX = 0, isDown = false, prevTranslate = 0;
const SWIPE_THRESHOLD = 50;

slides.addEventListener("pointerdown", e=>{
  isDown = true;
  pauseAutoPlay();
  startX = e.clientX;
  prevTranslate = -currentIndex * slides.offsetWidth;
  slides.setPointerCapture(e.pointerId);
});
slides.addEventListener("pointermove", e=>{
  if (!isDown) return;
  const dx = e.clientX - startX;
  slides.style.transition = "none";
  slides.style.transform = `translateX(${prevTranslate + dx}px)`;
});
slides.addEventListener("pointerup", e=>{
  if (!isDown) return;
  isDown = false;
  const dx = e.clientX - startX;
  if (dx > SWIPE_THRESHOLD) goPrev();
  else if (dx < -SWIPE_THRESHOLD) goNext();
  else updateCarousel(true);
  restartAutoPlay();
});

// Keyboard
window.addEventListener("keydown", e=>{
  if (e.key === "ArrowRight"){ pauseAutoPlay(); goNext(); restartAutoPlay(); }
  if (e.key === "ArrowLeft"){ pauseAutoPlay(); goPrev(); restartAutoPlay(); }
});

// Resize fix
window.addEventListener("resize", ()=> updateCarousel(false));

// Init
updateCarousel(false);
startAutoPlay();
