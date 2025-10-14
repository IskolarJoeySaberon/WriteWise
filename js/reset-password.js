document.addEventListener("DOMContentLoaded", () => {
  const resetForm = document.getElementById("resetForm");
  const resetEmail = document.getElementById("resetEmail");
  const resetMessage = document.getElementById("resetMessage");

  resetForm.addEventListener("submit", (e) => {
    e.preventDefault();
    resetMessage.textContent = "";
    resetMessage.classList.remove("success", "error");

    const email = resetEmail.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!valid) {
      resetMessage.textContent = "Please enter a valid email address.";
      resetMessage.classList.add("error");
      return;
    }

    // Simulate sending reset link
    console.log("Reset link sent to:", email);
    resetMessage.textContent = "Reset link has been sent to your email.";
    resetMessage.classList.add("success");
  });
});