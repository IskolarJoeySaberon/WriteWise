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

    // --- AI Chatbot Support (FAQ + AI) ---
    const chatbotForm = document.getElementById('chatbotForm');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.getElementById('chatbot-messages');
    let chatbotWaiting = false;

    function appendChatbotMessage(text, sender = 'user') {
        const msg = document.createElement('div');
        msg.className = 'chatbot-message ' + sender;
        msg.textContent = text;
        chatbotMessages.appendChild(msg);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    async function handleChatbotSend(e) {
        e.preventDefault();
        if (chatbotWaiting) return;
        const question = chatbotInput.value.trim();
        if (!question) return;
        appendChatbotMessage(question, 'user');
        chatbotInput.value = '';
        chatbotWaiting = true;
        appendChatbotMessage('Thinking...', 'bot');
        // Simulate async AI response (replace with real API call if needed)
        setTimeout(() => {
            // Remove 'Thinking...'
            const last = chatbotMessages.querySelector('.chatbot-message.bot:last-child');
            if (last && last.textContent === 'Thinking...') chatbotMessages.removeChild(last);
            appendChatbotMessage('Sorry, I am just a demo AI. I received your question and will try to help!', 'bot');
            chatbotWaiting = false;
            chatbotInput.focus();
        }, 1200);
    }

    if (chatbotForm && chatbotInput && chatbotMessages) {
        chatbotForm.addEventListener('submit', handleChatbotSend);
        chatbotInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleChatbotSend(e);
            }
        });
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

    // Sidebar and theme toggles are handled centrally by js/site-utils.js.
    // Per-page initialization removed to avoid duplicate listeners.
});