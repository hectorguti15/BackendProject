import fs from "fs";
import path from "path";
import { __dirname } from "../../dirname.js";

export default class Messages {
  #privatePath;
  constructor() {
    (this.#privatePath = path.join(
      __dirname,
      "./DAO/memory/FileSystem.messages.json"
    )),
      (this.messages = []);
  }
  getMessages = async () => {
    try {
      this.messages = JSON.parse(
        await fs.promises.readFile(this.#privatePath, "utf-8")
      );
      return messages;
    } catch (e) {
      req.logger.error(e.message)
    }
  };
  async addMessages(message) {
    try {
      this.messages = JSON.parse(
        await fs.promises.readFile(this.#privatePath, "utf-8")
      );

      const createdMessage = {
        user: message.user,
        message: message.message,
      };
      this.messages.push(createdMessage);
      await fs.promises.writeFile(
        this.#privatePath,
        JSON.stringify(this.messages)
      );
      return createdMessage;
    } catch (e) {
      req.logger.error(e.message)
    }
  }
}
