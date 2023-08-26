const socket = io();

const enviar = document.getElementById("enviar");
enviar.addEventListener("click", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre");
  const descripcion = document.getElementById("descripcion");
  const code = document.getElementById("code");
  const price = document.getElementById("price");
  const stock = document.getElementById("stock");

  let product = {
    title: nombre.value,
    description: descripcion.value,
    code: code.value,
    thumbnails: "",
    price: price.value,
    stock: stock.value,
  };

  nombre.value = "";
  descripcion.value = "";
  code.value = "";
  price.value = "";
  stock.value = "";

  socket.emit("addProduct", product);
});

const productsContainer = document.getElementById("productsContainer");
socket.on("getProducts", (products) => {
  productsContainer.innerHTML = "";

  products.map((product) => {
    const imageUrl =
      product.thumbnails !== ""
        ? product.thumbnails
        : "http://localhost:8080/images/pizzaerror.jpg";

    productsContainer.innerHTML += `
        <div class="productChild">
          <div class="imgProductContainer">        
              <img
                class="imgProductChild"
                src=${imageUrl}
                alt=${product.title}
              />
          </div>
          <div class="infoProductContainer">
            <span>${product.title}</span>
            <span>${product.description}</span>
            <div class="buyInfo">
              <span>S/. ${product.price}</span>
              <button class="buyButton">Agregar al carrito</button>
            </div>
          </div>
        </div>`;
  });
});
