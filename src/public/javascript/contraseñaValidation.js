function validatePasswords() {
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const passwordMismatchError = document.getElementById(
    "password-mismatch-error"
  );

  if (passwordInput.value !== confirmPasswordInput.value) {
    passwordMismatchError.style.display = "block";
    return false;
  } else {
    passwordMismatchError.style.display = "none";
    return true;
  }
}
