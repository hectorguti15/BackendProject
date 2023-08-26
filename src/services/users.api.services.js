import UsersDto from "../DAO/DTO/users.api.dto.js";
import Users from "../DAO/mongo/users.api.mongo.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { CartsService } from "./carts.api.service.js";
//import  Users  from "../DAO/memory/users.api.memory.js";

class userService {
  constructor(dao) {
    this.dao = dao;
  }
  validateUser = async (user)  => {
    const { firstName, lastName, age, email, password } = user;
    if (!firstName || !lastName || !age || !email || !password) {
      throw new Error("Complete todos los campos");
    }
  }
  createUser = async (user) => {
    try {
      await this.validateUser(user);
      const cart = await CartsService.createCart();
      user.cartId = cart._id;
      user.password = createHash(user.password)
      const userDto = new UsersDto(user);
      const createdUser = this.dao.createUser(userDto);
      return createdUser;
    } catch (e) {
      throw new Error(e.message);
    }
  };
  foundUser = async(user) =>{
    try{
        const foundUser = await this.dao.foundUser(user)
        if(foundUser && isValidPassword(user.password, foundUser.password)){
            return foundUser;
        }
        else{
            throw new Error("Email o contraseñas invalido")
        }
    }
    catch(e){
        throw new Error(e.message)
    }
  }
}


export const UserService = new userService(new Users)