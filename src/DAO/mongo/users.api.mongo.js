import { UserModel } from "./models/users.api.models.js";

export default class Users {
  constructor() {}
  createUser = async (user) => {
    try {
      const userCreated = await UserModel.create({ firstName: user.firstName, lastName: user.lastName, email: user.email, password:user.password, cartId: user.cartId, age: user.age });
      return userCreated;
    } catch (e) {
      throw new Error(e);
    }
  };
  foundUser = async(user) =>{
    const foundUser = await UserModel.findOne({email: user.email});
    return foundUser;
  }
}
