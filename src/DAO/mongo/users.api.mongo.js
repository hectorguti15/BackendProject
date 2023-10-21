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
  existUser = async (email) => {
    try {
      const existerUser = await UserModel.findOne({ email: email });
      return existerUser;
    } catch (e) {
      throw e;
    }
  };
  foundUser = async (id) => {
    try {
      const foundUser = await UserModel.findOne({ _id: id });
      return foundUser;
    } catch (e) {
      throw e;
    }
  };
  updateRol = async (id, rol) => {
    try {
      const updateRol = await UserModel.updateOne({ _id: id }, { rol: rol });
      return updateRol;
    } catch (e) {
      throw e;
    }
  };
  updateDocuments = async (id, documents) => {
    try {
      const updateDocuments = await UserModel.findByIdAndUpdate(
        id,
        { $push: { documents: { $each: documents } } },
        { new: true }
      );
      return updateDocuments;
    } catch (e) {
      throw e;
    }
  };
  getUsers = async (fechaDiasAtras) => {
    try {
      const users = await UserModel.find({});
      if (fechaDiasAtras) {
        await UserModel.find({
          last_connection: { $lt: fechaDiasAtras },
        });
      }
      return users;
    } catch (e) {
      throw e;
    }
  };
  deleteUsers = async (fechaDiasAtras) => {
    try {
      const deletedUsers = await UserModel.deleteMany({
        last_connection: { $lt: fechaDiasAtras },
      });
      return deletedUsers;
    } catch (e) {
      throw e;
    }
  };
}
