// contact.js
document.addEventListener('DOMContentLoaded', () => {
    // Accordion functionality
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        const icon = header.querySelector('.accordion-icon');

        if (!header || !content || !icon) return; // Safety check

        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';

            if (isExpanded) {
                header.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = null;
                content.style.paddingTop = null;
                content.style.paddingBottom = null;
                icon.textContent = '+';
            } else {
                header.setAttribute('aria-expanded', 'true');
                content.style.paddingTop = '1rem';
                content.style.paddingBottom = '1rem';
                content.style.maxHeight = content.scrollHeight + "px";
                icon.textContent = '–';
            }
        });
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    const contactFormMessageEl = document.getElementById('contactFormMessage');

    if (contactForm && contactFormMessageEl) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            contactFormMessageEl.textContent = '';
            contactFormMessageEl.className = 'form-message';

            const name = contactForm.contactName.value.trim();
            const email = contactForm.contactEmail.value.trim();
            const category = contactForm.concernCategory.value;
            const message = contactForm.contactMessage.value.trim();

            let errors = [];
            if (!name) errors.push("Name is required.");
            if (!email) errors.push("Email is required.");
            else if (!/^\S+@\S+\.\S+$/.test(email)) errors.push("Please enter a valid email address.");
            if (!category) errors.push("Please select a concern category.");
            if (!message) errors.push("Message cannot be empty.");

            if (errors.length > 0) {
                contactFormMessageEl.innerHTML = "<strong>Oops! Please correct the following:</strong><br>" + errors.join("<br>");
                contactFormMessageEl.classList.add('error');
                return;
            }

            console.log('Contact Form Submitted:', { name, email, category, message });
            contactFormMessageEl.innerHTML = 'Thank you for your message! We will get back to you soon. 😊';
            contactFormMessageEl.classList.add('success');
            contactForm.reset();

            setTimeout(() => {
                contactFormMessageEl.textContent = '';
                contactFormMessageEl.className = 'form-message';
            }, 7000);
        });
    }
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