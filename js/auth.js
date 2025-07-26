function switchToRegister() {
  document.getElementById("login").classList.add("hidden");
  document.getElementById("register").classList.remove("hidden");
}

function switchToLogin() {
  document.getElementById("register").classList.add("hidden");
  document.getElementById("login").classList.remove("hidden");
}

// After successful login or registration, update navbar
function handleAuthSuccess(user) {
  document.getElementById("auth-link").classList.add("hidden");
  document.getElementById("user-info").classList.remove("hidden");
  document.getElementById("username").textContent = user.name;
  showToast("Welcome back, " + user.name);
  localStorage.setItem("user", JSON.stringify(user));
}

// Logout logic
function logoutUser() {
  localStorage.removeItem("user");
  document.getElementById("auth-link").classList.remove("hidden");
  document.getElementById("user-info").classList.add("hidden");
  showToast("Logged out successfully", "success");
}
// On load, check user
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) handleAuthSuccess(user);
});
