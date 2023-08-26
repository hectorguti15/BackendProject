import MessagesDTO from "../DAO/DTO/messages.vista.dto.js";
import Messages from "../DAO/mongo/messages.vista.mongo.js";
import CustomError from "./errors/custom-error.js";
import EErros from "./errors/enum.js";
import { generateMessage } from "./errors/info.js";

class chatServices {
  constructor(dao) {
    this.dao = dao;
  }
  validateMessage(user, message) {
    try{
      if (!user || !message) {
        const message = { user, message };
        CustomError.createError({
          name: "Message creation error",
          cause: generateMessage(message),
          message: "Error trying to create a message",
          code: EErros.INVALID_TYPES_ERROR,
        });
      }
    }
    catch(e){
      throw (e)
    }
  }
  async getMessages() {
    const allMessages = await this.dao.getMessages();
    return allMessages;
  }
  async addMessages(messages) {
    const { user, message } = messages;

    this.validateMessage(user, message);
    const newMessage = new MessagesDTO(messages);

    const createdMessage = await this.dao.addMessages(newMessage);
    return createdMessage;
  }
}

export const ChatServices = new chatServices(new Messages());
