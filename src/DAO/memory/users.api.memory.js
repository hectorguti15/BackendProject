import fs from "fs";
import path from "path";
import { __dirname } from "../../dirname.js";

export default class Users {
  #privatePathUser;
  constructor() {
    this.#privatePathUser = path.join(
      __dirname,
      "./DAO/memory/FileSystem/users.json"
    );
    this.users = [];
  };
  createUser = async (user) => {
    try {
      this.users = await JSON.parse(
        await fs.promises.readFile(this.#privatePathUser, "utf-8")
      );
      const userCreated = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        cartId: user.cartId,
        age: user.age,
      };
      this.users.push(userCreated);
      await fs.promises.writeFile(
        this.#privatePathUser,
        JSON.stringify(this.users)
      );

      return userCreated;
    } catch (e) {
      throw new Error(e);
    }
  };
  foundUser = async (user) => {
    this.users = await JSON.parse(
      await fs.promises.readFile(this.#privatePathUser, "utf-8")
    );
    const foundUser = this.users.find( foundUser => foundUser.email == user.email);
    return foundUser;
  };
}
