const socket = io();

const addButtons = document.getElementsByClassName('buttonProducts');

for (let i = 0; i < addButtons.length; i++) {
  const button = addButtons[i];
  button.addEventListener("click", function addToCart() {
    const productId = this.getAttribute("data-product-id");
    const cartId = document.getElementById('cart').getAttribute('data-cart-id');

    console.log(cartId,productId)
    socket.emit("addProductInCart", productId, cartId)
  });
}
