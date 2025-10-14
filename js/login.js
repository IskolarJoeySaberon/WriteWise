document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signUpForm = document.getElementById('signUpForm');

    const showLoginBtnTab = document.getElementById('showLoginBtnTab');
    const showSignUpBtnTab = document.getElementById('showSignUpBtnTab');

    const loginMessage = document.getElementById('loginMessage');
    const signUpMessage = document.getElementById('signUpMessage');

    // Setup for password visibility checkboxes
    const passwordFields = [
        { input: document.getElementById('loginPassword'), check: document.getElementById('loginShowPasswordCheck') },
        { input: document.getElementById('signUpPassword'), check: document.getElementById('signUpShowPasswordCheck') },
        { input: document.getElementById('signUpConfirmPassword'), check: document.getElementById('signUpConfirmShowPasswordCheck') }
    ];

    passwordFields.forEach(field => {
        if (field.input && field.check) {
            field.check.addEventListener('change', () => {
                field.input.type = field.check.checked ? 'text' : 'password';
            });
        }
    });

    function showForm(formToShow, formToHide, activeBtnTab, inactiveBtnTab) {
        formToShow.style.display = 'block';
        formToHide.style.display = 'none';

        if (activeBtnTab && inactiveBtnTab) {
            activeBtnTab.classList.add('active');
            inactiveBtnTab.classList.remove('active');
        }
        loginMessage.textContent = '';
        signUpMessage.textContent = '';
    }

    if (showLoginBtnTab && showSignUpBtnTab) {
        showLoginBtnTab.addEventListener('click', () => {
            showForm(loginForm, signUpForm, showLoginBtnTab, showSignUpBtnTab);
        });
        showSignUpBtnTab.addEventListener('click', () => {
            showForm(signUpForm, loginForm, showSignUpBtnTab, showLoginBtnTab);
        });
    }

    // --- Login form submission ---
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            loginMessage.textContent = '';
            loginMessage.classList.remove('success', 'error');

            const email = loginForm.loginEmail.value.trim();
            const passwordInput = passwordFields.find(f => f.check && f.check.id === 'loginShowPasswordCheck')?.input;
            const password = passwordInput ? passwordInput.value.trim() : '';

            if (!email || !password) {
                loginMessage.textContent = 'Please fill in all fields.';
                loginMessage.classList.add('error');
                return;
            }

            console.log('Login attempt with:', email, password);
            loginMessage.textContent = 'Login successful! Redirecting...';
            loginMessage.classList.add('success');
            setTimeout(() => {
                window.location.href = './chapter-guide.html';
            }, 1500);
        });
    }

    // --- Sign Up form submission ---
    if (signUpForm) {
        const usernameInput = document.getElementById('signUpUsername');
        const emailInput = document.getElementById('signUpEmail');
        const passwordInput = document.getElementById('signUpPassword');
        const confirmInput = document.getElementById('signUpConfirmPassword');
        const termsCheck = document.getElementById('termsCheck');

        const usernameFeedback = document.getElementById('usernameFeedback');
        const emailFeedback = document.getElementById('emailFeedback');
        const passwordFeedback = document.getElementById('passwordFeedback');
        const confirmFeedback = document.getElementById('confirmPasswordFeedback');
        const strengthBar = document.getElementById('strengthBar');

        // Password strength meter
        passwordInput.addEventListener('input', () => {
            const val = passwordInput.value;
            let strength = 0;
            if (val.length >= 6) strength++;
            if (/[A-Z]/.test(val)) strength++;
            if (/[0-9]/.test(val)) strength++;
            if (/[^A-Za-z0-9]/.test(val)) strength++;

            const percent = (strength / 4) * 100;
            strengthBar.style.width = percent + "%";
            strengthBar.style.background =
                percent < 50 ? "red" : percent < 75 ? "orange" : "green";

            passwordFeedback.textContent =
                percent < 50 ? "Weak password" :
                    percent < 75 ? "Medium strength" : "Strong password";
            passwordFeedback.className = "feedback " + (percent >= 50 ? "valid" : "");
        });

        // Confirm password match
        confirmInput.addEventListener('input', () => {
            if (confirmInput.value === passwordInput.value && confirmInput.value !== "") {
                confirmFeedback.textContent = "✔ Passwords match";
                confirmFeedback.className = "feedback valid";
            } else {
                confirmFeedback.textContent = "✘ Passwords do not match";
                confirmFeedback.className = "feedback";
            }
        });

        // Email validation
        emailInput.addEventListener('input', () => {
            const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
            emailFeedback.textContent = valid ? "✔ Valid email" : "✘ Invalid email";
            emailFeedback.className = "feedback " + (valid ? "valid" : "");
        });

        // Username feedback
        usernameInput.addEventListener('input', () => {
            if (usernameInput.value.length >= 3) {
                usernameFeedback.textContent = "✔ Looks good";
                usernameFeedback.className = "feedback valid";
            } else {
                usernameFeedback.textContent = "✘ Too short (min 3 chars)";
                usernameFeedback.className = "feedback";
            }
        });

        // Submit handler
        signUpForm.addEventListener('submit', (event) => {
            event.preventDefault();
            signUpMessage.textContent = '';
            signUpMessage.classList.remove('success', 'error');

            const username = usernameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmInput.value;

            if (!username || !email || !password || !confirmPassword) {
                signUpMessage.textContent = 'Please fill in all fields.';
                signUpMessage.classList.add('error');
                return;
            }
            if (password !== confirmPassword) {
                signUpMessage.textContent = 'Passwords do not match.';
                signUpMessage.classList.add('error');
                return;
            }
            if (!termsCheck.checked) {
                signUpMessage.textContent = 'You must agree to the Terms and Privacy Policy.';
                signUpMessage.classList.add('error');
                return;
            }

            console.log('Sign up attempt');
            signUpMessage.textContent = 'Sign up successful! Redirecting...';
            signUpMessage.classList.add('success');
            setTimeout(() => {
                window.location.href = './chapter-guide.html';
            }, 1500);
        });
    }

    // Google login button handler
    const googleBtn = document.querySelector('.google-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            // Call your Firebase Google login function here
        });
    }

    // Forgot password link handler (only if elements exist)
    const forgotLink = document.getElementById("forgotPasswordLink");
    const forgotModal = document.getElementById("forgotPasswordModal");
    const sendResetBtn = document.getElementById("sendResetBtn");

    if (forgotLink && forgotModal) {
        forgotLink.addEventListener("click", (e) => {
            e.preventDefault();
            forgotModal.style.display = "block";
        });
    }

    if (sendResetBtn) {
        sendResetBtn.addEventListener("click", () => {
            const email = document.getElementById("resetEmail").value;
            if (email) {
                // TODO: Call your backend or Firebase to send reset email
                alert("Password reset link sent to " + email);
            }
        });
    }

    const themeToggleLogin = document.getElementById("themeToggleLogin");

    function toggleTheme() {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem(
            "theme",
            document.body.classList.contains("dark-mode") ? "dark" : "light"
        );
        themeToggleLogin.innerHTML = document.body.classList.contains("dark-mode")
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';
    }

    if (themeToggleLogin) {
        themeToggleLogin.addEventListener("click", toggleTheme);
    }

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        themeToggleLogin.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
});