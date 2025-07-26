function addToCart(item) {
  // logic to add item to localStorage or backend
  updateCartCount();
  showToast('Item added to cart');
}

function removeFromCart(itemId) {
  // logic to remove item
  updateCartCount();
  showToast('Item removed from cart', 'error');
}
