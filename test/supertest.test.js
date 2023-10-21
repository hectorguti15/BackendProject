import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test", () => {
  let cookieName;
  let cookieValue;
  const mockUser = {
    firstName: "Hector",
    lastName: "Gutierrez",
    email: "c@c.com",
    password: "123",
    rol: "admin",
  };

  describe("Test de sessions ,Registro, Login and Current", () => {
    it("Debe registrar un usuario", async () => {
      const response = await requester.post("/register").send(mockUser);
      const cookie = response.headers["set-cookie"][0];
      expect(cookie).to.be.ok;
    });

    it("Debe loggear un user y devolver una cookie", async () => {
      const response = await requester.post("/login").send({
        email: mockUser.email,
        password: mockUser.password,
      });
      const cookie = response.headers["set-cookie"][0];
      expect(cookie).to.be.ok;

      cookieName = cookie.split("=")[0];
      cookieValue = cookie.split("=")[1];
      expect(cookieValue).to.be.ok;
      expect(response.header.location).to.equal("/vista/productos");
    });

    it("Enviar cookie para ver el contenido del user", async () => {
      const { _body } = await requester
        .get("/sessions/current")
        .set("Cookie", [`${cookieName}=${cookieValue}`]);
      expect(_body.payload);
    });
  });

  describe("Test de productos", () => {
    it("En endpoint GET /api/products debe devolver todos los productos", async () => {
      const response = await requester.get("/api/products/");

      expect(response.status).to.be.eql(200);
      expect(response.payload);
    });
    it("En endpoint GET /api/products/:pid debe devolver el producto buscado por mediante el parametro pid", async () => {
      const response = await requester.get(
        "/api/products/652c5f7124193efb051f2746"
      );

      expect(response.status).to.be.eql(200);
      expect(response.body).to.have.property("message", "Product found");
    });
    it("Debe subir un producto con una imagen y validar su sesión", async () => {
      const pizza = {
        title: "Pizza Pepperoni",
        description: "Pizza llena de pepperoni",
        code: "PEP101",
        price: 15.9,
        stock: 20,
        owner: "admin",
      };

      const result = await requester
        .post("/api/products")
        .field("title", pizza.title)
        .field("description", pizza.description)
        .field("price", pizza.price)
        .field("code", pizza.code)
        .field("stock", pizza.stock)
        .field("owner", pizza.owner)
        .attach("thumbnails", "./test/peperoni.jpg")
        .set("Cookie", [`${cookieName}=${cookieValue}`]);

      expect(result.status).to.be.eql(200);
      expect(result.body).to.have.property("message", "added product");
    });
    it("Actualizar un producto", async () => {
      const pizza = {
        title: "Pizza Pepperoni Queso Extra",
        description: "Pizza llena de pepperoni con mas queso añadido ahora",
        code: "PEP101",
        price: 15.9,
        stock: 20,
        owner: "admin",
      };

      const result = await requester
        .put("/api/products/652c5f7124193efb051f2746")
        .send(pizza)
        .set("Cookie", [`${cookieName}=${cookieValue}`]);

      expect(result.status).to.be.eql(200);
      expect(result.body).to.have.property("message", "Product updated");
    });
    it("Eliminar un producto", async () => {
      const result = await requester
        .delete("/api/products/653082cbc8bbf3671999ba74")
        .set("Cookie", [`${cookieName}=${cookieValue}`]);

      expect(result.status).to.be.eql(200);
      expect(result.body).to.have.property("message", "Product deleted");
    });
  });

  describe("Test de carts", () => {
    it("En endpoint GET /api/carts/:cid debe devolver un cart", async () => {
      const response = await requester.get(
        "/api/carts/652c57f50a20530dc7a42025"
      );

      expect(response.status).to.be.eql(200);
      expect(response.body).to.have.property("message", "Cart found");
    });
    it("En endpoint post /api/carts debe devolver un cart creado", async () => {
      const response = await requester.post("/api/carts");

      expect(response.status).to.be.eql(200);
      expect(response.body).to.have.property("message", "Cart created");
    });
    it("En endpoint post /api/carts/:cid/product/:pid añade un producto al carrito", async () => {
      const response = await requester
        .post(
          "/api/carts/652c57f50a20530dc7a42023/product/64dfdf7cdd397dac259103c1"
        )
        .set("Cookie", [`${cookieName}=${cookieValue}`]);
      expect(response.status).to.be.eql(200);
      expect(response.body).to.have.property("message", "product added");
    });
    it("En endpoint delete /api/carts/:cid/products/:pid carrito eliminando el producto", async () => {
      const response = await requester
        .delete(
          "/api/carts/652c57f50a20530dc7a42023/products/64dfdf7cdd397dac259103c1"
        )
        .set("Cookie", [`${cookieName}=${cookieValue}`]);

      expect(response.status).to.be.eql(200);
      expect(response.body).to.have.property("message", "Product deleted");
    });
  });
});
