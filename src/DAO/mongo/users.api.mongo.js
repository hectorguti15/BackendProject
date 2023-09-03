import { UserModel } from "./models/users.api.model.js";
export default class Users {
  constructor() {}
  createUser = async (user) => {
    try {
      const userCreated = await UserModel.create({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        cartId: user.cartId,
        age: user.age,
      });
      return userCreated;
    } catch (e) {
      throw new Error(e);
    }
  };
  foundUser = async (user) => {
    const foundUser = await UserModel.findOne({ email: user.email });
    return foundUser;
  };
  existUser = async (email) => {
    try{
      const existerUser = await UserModel.findOne({ email: email });
    return existerUser;
    }
    catch(e){
      throw(e)
    }
  };
}
