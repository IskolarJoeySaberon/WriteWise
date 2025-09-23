document.addEventListener("DOMContentLoaded", function () {
  // Mobile responsive JS behavior (if needed for interactive components)
  document.addEventListener('DOMContentLoaded', () => {
    // Example of handling chat button interactions (could be expanded later)
    const chatButton = document.querySelector('.chat-button');

    chatButton.addEventListener('click', () => {
      alert('Launching the live chat...');
      // Trigger live chat modal or functionality here.
    });

    // Testimonials carousel animation (if needed for a more interactive experience)
    const testimonialItems = document.querySelectorAll('.testimonial');
    let currentIndex = 0;

    setInterval(() => {
      testimonialItems[currentIndex].style.display = 'none';
      currentIndex = (currentIndex + 1) % testimonialItems.length;
      testimonialItems[currentIndex].style.display = 'block';
    }, 5000);
  });

  document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".responsive-nav");

    if (menuToggle && navMenu) {
      menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("show");
      });
    }

    // Collapse sections (your existing code here)
  });

  const themeToggle = document.getElementById("themeToggle");

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Save the theme preference
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");

    // Change the icon dynamically
    themeToggle.innerHTML = document.body.classList.contains("dark-mode")
      ? '<i class="fa-solid fa-sun"></i>'  // Sun icon for light mode
      : '<i class="fa-solid fa-moon"></i>'; // Moon icon for dark mode
  });

  // Load theme preference on page refresh
  window.onload = () => {
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-mode");
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
  };

  // Load theme preference on page load
  if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark-mode");

  const toggleBtn = document.getElementById("toggleSidebar");
  const sidebar = document.querySelector(".sidebar");

  toggleBtn.addEventListener("click", function () {
    sidebar.classList.toggle("show");
  });
});
