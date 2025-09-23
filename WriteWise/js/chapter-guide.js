document.addEventListener("DOMContentLoaded", () => {
  // Tab navigation
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const target = btn.getAttribute("data-target");
      tabContents.forEach((content) => {
        content.classList.add("hidden");
      });

      document.getElementById(target).classList.remove("hidden");
    });
  });

  // Collapse sections
  const toggles = document.querySelectorAll(".collapse-toggle");
  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const content = toggle.nextElementSibling;
      const isVisible = content.style.display === "block";
      content.style.display = isVisible ? "none" : "block";
      toggle.textContent = isVisible ? "+ Objectives & Parts" : "− Objectives & Parts";
    });
  });
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

document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("toggleSidebar");
  const sidebar = document.querySelector(".sidebar");

  toggleBtn.addEventListener("click", function () {
    sidebar.classList.toggle("show");
  });
});