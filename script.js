const imageSets = {
  house1: ["house1-1.jpg","house1-2.jpg","house1-3.jpg","house1-4.jpg","house1-5.jpg","house1-6.jpg","house1-7.jpg"],
  house2: ["house2-1.jpg","house2-2.jpg","house2-3.jpg","house2-4.jpg","house2-5.jpg","house2-6.jpg","house2-7.jpg"],
  house3: ["house3-1.jpg","house3-2.jpg","house3-3.jpg","house3-4.jpg","house3-5.jpg","house3-6.jpg","house3-7.jpg","house3-8.jpg"],
  car1:   ["car1-1.jpg","car1-2.jpg","car1-3.jpg","car1-4.jpg","car1-5.jpg","car1-6.jpg"],
  car2:   ["car2-1.jpg","car2-2.jpg","car2-3.jpg","car2-4.jpg","car2-5.jpg","car2-6.jpg","car2-7.jpg"],
  car3:   ["car3-1.jpg","car3-2.jpg","car3-3.jpg","car3-4.jpg","car3-5.jpg","car3-6.jpg"],
  car4:   ["car4-1.jpg","car4-2.jpg","car4-3.jpg","car4-4.jpg","car4-5.jpg","car4-6.jpg","car4-7.jpg","car4-8.jpg"],
  car5:   ["car5-1.jpg","car5-2.jpg","car5-3.jpg","car5-4.jpg","car5-5.jpg","car5-6.jpg","car5-7.jpg","car5-8.jpg","car5-9.jpg","car5-10.jpg"]
};

const slideshow = document.getElementById("slideshow");
const slideImage = document.getElementById("slide-image");
const slideCaption = document.getElementById("slide-caption");
const thumbsEl = document.getElementById("thumbs");
const playBtn = document.querySelector(".play-btn");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const closeBtn = document.querySelector(".close");
const header = document.getElementById("header");

let currentGallery = [];
let currentIndex = 0;
let autoPlay = false;
let autoInterval = null;

window.addEventListener("scroll", () => {
  const h = header || document.querySelector("header");
  if (!h) return;
  if (window.scrollY > 60) h.classList.add("scrolled");
  else h.classList.remove("scrolled");
});

function openSlideshow(key) {
  const set = imageSets[key];
  if (!set || !set.length) {
    console.warn("No images for", key);
    return;
  }

  currentGallery = set.slice();
  currentIndex = 0;
  renderThumbs();
  showSlide();
  showModal();
}

function showModal() {
  if (!slideshow) return;
  slideshow.style.display = "flex";
  slideshow.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  updatePlayBtn();
}

function closeSlideshow() {
  if (!slideshow) return;
  slideshow.style.display = "none";
  slideshow.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  stopAuto();
}

function renderThumbs() {
  if (!thumbsEl) return;
  thumbsEl.innerHTML = "";
  currentGallery.forEach((src, i) => {
    const t = document.createElement("div");
    t.className = "thumb";
    if (i === currentIndex) t.classList.add("active");
    t.innerHTML = `<img src="${src}" alt="thumb ${i+1}">`;
    t.addEventListener("click", (e) => {
      currentIndex = i;
      showSlide();
    });
    thumbsEl.appendChild(t);
  });
}

function showSlide() {
  if (!slideImage) return;
  slideImage.style.opacity = 0;
  setTimeout(() => {
    slideImage.src = currentGallery[currentIndex];
    slideImage.alt = `Slide ${currentIndex + 1} of ${currentGallery.length}`;
    slideCaption.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
    highlightThumb();
    slideImage.onload = () => { slideImage.style.opacity = 1; };
    setTimeout(() => slideImage.style.opacity = 1, 500);
  }, 180);
}

function highlightThumb() {
  const thumbs = thumbsEl.querySelectorAll(".thumb");
  thumbs.forEach((t, i) => {
    t.classList.toggle("active", i === currentIndex);
  });
}

function nextSlide() {
  if (!currentGallery.length) return;
  currentIndex = (currentIndex + 1) % currentGallery.length;
  showSlide();
}
function prevSlide() {
  if (!currentGallery.length) return;
  currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
  showSlide();
}

function startAuto() {
  stopAuto();
  autoPlay = true;
  updatePlayBtn();
  autoInterval = setInterval(() => nextSlide(), 3000);
}
function stopAuto() {
  autoPlay = false;
  updatePlayBtn();
  if (autoInterval) { clearInterval(autoInterval); autoInterval = null; }
}
function togglePlay() {
  if (autoPlay) stopAuto(); else startAuto();
}
function updatePlayBtn() {
  if (!playBtn) return;
  playBtn.textContent = autoPlay ? "⏸ Pause" : "▶ Auto Play";
}

if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); prevSlide(); });
if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); nextSlide(); });
if (playBtn) playBtn.addEventListener("click", (e) => { e.stopPropagation(); togglePlay(); });
if (closeBtn) closeBtn.addEventListener("click", (e) => { e.stopPropagation(); closeSlideshow(); });

if (slideshow) {
  slideshow.addEventListener("click", (e) => {
    if (e.target === slideshow) closeSlideshow();
  });
}

document.addEventListener("keydown", (e) => {
  if (slideshow && slideshow.style.display === "flex") {
    if (e.key === "Escape") closeSlideshow();
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  }
});

document.querySelectorAll(".listing").forEach(el => {
  const key = el.dataset.key;
  if (key) el.addEventListener("click", () => openSlideshow(key));
});

const contactForm = document.getElementById("contact-form");

if (contactForm) {

  emailjs.init("JH1QdJFTlstYHt1SB");

  contactForm.addEventListener("submit", function(e){
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      alert("Please fill all fields.");
      return;
    }

    emailjs.send(
      "service_okv6b6r",
      "template_yad9l3l",
      {
        from_name: name,
        reply_to: email,
        message: message
      }
    )
    .then(() => {
      alert("Message sent successfully!");
      contactForm.reset();
    })
    .catch((err) => {
      console.error("EmailJS Error:", err);
      alert("Failed to send message. Please try again.");
    });
  });
}


window.addEventListener("beforeunload", () => stopAuto());