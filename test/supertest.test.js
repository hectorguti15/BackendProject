import chai from "chai";
import supertest from "supertest";
import { faker } from "@faker-js/faker";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test", () => {
  describe("Test de productos", () => {
    it("En endpoint GET /api/products debe devolver todos los productos", async () => {
      const response = await requester.get("/api/products");

      expect(response.status).to.be.eql(200);
      expect(response.payload);
    });
    it("Debe subir un producto", async () => {
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
        .attach("thumbnails", "./test/peperoni.jpg");

      expect(result.status).to.be.eql(200);
      expect(result.body).to.have.property("message", "added product");
    });
    it("Actualizar un producto", async () => {
      const pizza = {
        title: "Pizza Pepperoni",
        description: "Pizza llena de pepperoni",
        code: "PEP101",
        price: 15.9,
        stock: 20,
        owner: "admin",
      };

      const result = await requester
        .put("/api/products/64dfdf7cdd397dac259103c8")
        .field("title", pizza.title)
        .field("description", pizza.description);

      expect(result.status).to.be.eql(200);
      expect(result.body).to.have.property("message", "Product updated");
    });
  });

  describe("Test de carts", () => {
    it("En endpoint GET /api/carts/:cid debe devolver un cart", async () => {
      const response = await requester.get(
        "/api/carts/64e8029c6593f78c53e1a646"
      );

      expect(response.status).to.be.eql(200);
      expect(response.body).to.have.property("message", "Cart found");
    });
    it("En endpoint post /api/carts debe devolver un cart creado", async () => {
      const response = await requester.post("/api/carts");

      expect(response.status).to.be.eql(200);
      expect(response.body).to.have.property("message", "Cart created");
    });
    it("En endpoint delete  /api/carts/:cid/products/:pid carrito eliminando el producto", async () => {
      const response = await requester.delete(
        "/api/carts/64e8029c6593f78c53e1a646/products/64dfdf7cdd397dac259103c1"
      );

      expect(response.status).to.be.eql(400);
      expect(response.body).to.have.property("message");
    });
  });

  describe("Test de sessions ,Registro, Login and Current", () => {
    const mockUser = {
      first_name: "Hector",
      last_name: "Gutierrez",
      email: faker.internet.email(),
      password: "123",
    };

    it("Debe registrar un usuario", async () => {
      const { _body } = await requester.post("/register").send(mockUser);
      expect(_body.playload).to.be.ok;
      expect(_body).to.have.property("message","Usuario registrado");
    });

    it("Debe loggear un user y DEVOLVER UNA COOKIE", async () => {
      const { _body } = await requester.post("/login").send({
        email: mockUser.email,
        password: mockUser.password,
      });

      expect(_body.playload).to.be.ok;
      expect(_body).to.have.property("message","Usuario logeado");
    });

    it("Enviar cookie para ver el contenido del user", async () => {
      const { _body } = await requester
        .get("/sessions/current")

      expect(_body.payload);
    });
  });
});
