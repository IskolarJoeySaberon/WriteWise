document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------
  // Chat button
  // -------------------------------
  const chatButton = document.querySelector(".chat-button");
  if (chatButton) {
    chatButton.addEventListener("click", () => {
      alert("Launching the live chat...");
      // Trigger live chat modal or functionality here
    });
  }

  // -------------------------------
  // Testimonials carousel
  // -------------------------------
  const testimonialItems = document.querySelectorAll(".testimonial");
  if (testimonialItems.length > 0) {
    // Ensure only the first testimonial is visible initially
    testimonialItems.forEach((it, idx) => {
      it.style.display = idx === 0 ? 'block' : 'none';
    });
    let currentIndex = 0;
    setInterval(() => {
      testimonialItems[currentIndex].style.display = 'none';
      currentIndex = (currentIndex + 1) % testimonialItems.length;
      testimonialItems[currentIndex].style.display = 'block';
    }, 5000);
  }

  // -------------------------------
  // Mobile nav toggle
  // -------------------------------
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".responsive-nav");
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("show");
    });
  }

  // -------------------------------
  // Sidebar + Theme toggles
  // -------------------------------
  // Sidebar and theme toggles are handled centrally by js/site-utils.js.
  // Per-page initialization removed to avoid duplicate listeners.
});