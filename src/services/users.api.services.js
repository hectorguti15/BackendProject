import UsersDto from "../DAO/DTO/users.api.dto.js";
import Users from "../DAO/mongo/users.api.mongo.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { CartsService } from "./carts.api.service.js";
//import  Users  from "../DAO/memory/users.api.memory.js";

class userService {
  constructor(dao) {
    this.dao = dao;
  }
  validateUser = async (user) => {
    const { firstName, lastName, age, email, password } = user;
    if (!firstName || !lastName || !age || !email || !password) {
      throw new Error("Complete todos los campos");
    }
  };
  existUser = async (email) => {
    try {
      let result = await this.dao.existUser(email);
      return result;
    } catch (e) {
      throw new Error(e.message);
    }
  };
  createUser = async (user) => {
    try {
      await this.validateUser(user);
      const cart = await CartsService.createCart();
      user.cartId = cart._id;
      user.password = createHash(user.password);
      const userDto = new UsersDto(user);
      const createdUser = this.dao.createUser(userDto);
      return createdUser;
    } catch (e) {
      throw new Error(e.message);
    }
  };
  checkUserEmailAndPassword = async (user) => {
    try {
      const existUser = await this.dao.existUser(user.email);
      if (existUser && isValidPassword(user.password, foundUser.password)) {
        return foundUser;
      } else {
        throw new Error("Email o contraseñas invalido");
      }
    } catch (e) {
      throw new Error(e.message);
    }
  };
  foundUser = async (id) => {
    try {
      const foundUser = await this.dao.foundUser(id);
      return foundUser;
    } catch (e) {
      throw new Error(e.message);
    }
  };
  updateRol = async (id,rol) => {
    try {
      const updateRol = await this.dao.updateRol(id,rol);
      return updateRol;
    } catch (e) {
      throw new Error(e.message);
    }
  };
  updateDocuments = async (id,documents) => {
    try {
      const updateRol = await this.dao.updateDocuments(id,documents);
      return updateRol;
    } catch (e) {
      throw new Error(e.message);
    }
  };
  getUsers = async(fechaDiasAtras)=>{
    try {
      const users = await this.dao.getUsers(fechaDiasAtras);
      return users;
    } catch (e) {
      throw e;
    }
  }
  deleteUsers = async(fechaDiasAtras)=>{
    try {
      const users = await this.dao.deleteUsers(fechaDiasAtras);
      return users;
    } catch (e) {
      throw e;
    }
  }
}

export const UserService = new userService(new Users());
