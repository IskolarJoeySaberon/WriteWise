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
                if (field.check.checked) {
                    field.input.type = 'text';
                } else {
                    field.input.type = 'password';
                }
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

    // --- Form submission logic ---
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
                window.location.href = '../WriteWise/chapter-guide.html';
            }, 1500);
        });
    }

    if (signUpForm) {
        signUpForm.addEventListener('submit', (event) => {
            event.preventDefault();
            signUpMessage.textContent = '';
            signUpMessage.classList.remove('success', 'error');

            const username = signUpForm.signUpUsername.value.trim();
            const email = signUpForm.signUpEmail.value.trim();

            const passwordInput = passwordFields.find(f => f.check && f.check.id === 'signUpShowPasswordCheck')?.input;
            const password = passwordInput ? passwordInput.value : '';

            const confirmPasswordInput = passwordFields.find(f => f.check && f.check.id === 'signUpConfirmShowPasswordCheck')?.input;
            const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';


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

            console.log('Sign up attempt');
            signUpMessage.textContent = 'Sign up successful! Redirecting...';
            signUpMessage.classList.add('success');
            setTimeout(() => {
                window.location.href = '../WriteWise/chapter-guide.html';
            }, 1500);
        });
    }
});