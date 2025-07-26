// Toggle mobile nav menu
function toggleNavMenu() {
  const nav = document.getElementById("navmenu");
  nav.style.maxHeight =
    nav.style.maxHeight === "0px" || !nav.style.maxHeight
      ? nav.scrollHeight + "px"
      : "0px";
}

// Dummy logout function
function logoutUser() {
  alert("You have been logged out.");
  window.location.href = "/";
}

// Function to update the cart count in the navbar
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("#cartCount").forEach((el) => {
    el.textContent = totalCount;
  });
}

// Simulate login state (replace with real check in production)
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = false; // change to true if logged in
  const before = document.getElementById("beforeLogin");
  const after = document.getElementById("afterLogin");
  if (before) before.style.display = isLoggedIn ? "none" : "block";
  if (after) after.style.display = isLoggedIn ? "block" : "none";

  // Always update cart count on page load
  updateCartCount();
});

// Alpine.js Shop Component
document.addEventListener("alpine:init", () => {
  Alpine.data("shopComponent", () => ({
    showCategory: "kids",
    kidsProducts: [
      {
        id: 1,
        name: "Kids Body Lotion",
        description: "Hydrating and nourishing lotion for all baby skin types.",
        price: 15.99,
        cartonPrice: 89.99,
        unit: "piece",
        image: "/image/babylotionBg.jpg",
        quantity: 1,
      },
      {
        id: 2,
        name: "Kids Body Wash",
        description: "Refreshing body wash with a long-lasting fragrance.",
        price: 12.99,
        cartonPrice: 75.99,
        unit: "piece",
        image: "/image/product19.jpg",
        quantity: 1,
      },
    ],
    adultsProducts: [
      {
        id: 3,
        name: "Adult Face Serum",
        description: "Brightening serum for radiant skin.",
        price: 22.0,
        cartonPrice: 110.0,
        unit: "piece",
        image: "/image/product1.jpg",
        quantity: 1,
      },
      {
        id: 4,
        name: "Adult Body Butter",
        description: "Deeply hydrating formula for dry skin.",
        price: 19.99,
        cartonPrice: 95.99,
        unit: "piece",
        image: "/image/product15.jpg",
        quantity: 1,
      },
    ],
    toggleCategory(category) {
      this.showCategory = category;
    },
    changeUnit(product, unitType) {
      product.unit = unitType;
    },
    incrementQty(product) {
      product.quantity++;
    },
    decrementQty(product) {
      if (product.quantity > 1) product.quantity--;
    },
    addToCart(product) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existing = cart.find(
        (p) => p.id === product.id && p.unit === product.unit
      );

      const price =
        product.unit === "carton" ? product.cartonPrice : product.price;

      if (existing) {
        existing.quantity += product.quantity;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          unit: product.unit,
          quantity: product.quantity,
          price: price,
          image:
            typeof product.image === "string"
              ? product.image
              : product.image?.[0] || "",
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      toast.success(`${product.name} (${product.unit}) added to cart!`);

      // ✅ Update cart count immediately
      updateCartCount();
    },
  }));
});

// Toast notifications
const toast = {
  success(msg) {
    Toastify({
      text: msg,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#C8A2C8",
    }).showToast();
  },
  error(msg) {
    Toastify({
      text: msg,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#580f41",
    }).showToast();
  },
};
