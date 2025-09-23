document.addEventListener("DOMContentLoaded", () => {

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