function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `fixed bottom-4 right-4 bg-${
    type === "error" ? "red" : "green"
  }-600 text-white px-4 py-2 rounded shadow-lg z-50`;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3000);
}
