import { ChatModel } from "./models/messages.vista.model.js";
export default class Messages {
  constructor() {}
  getMessages = async () => {
    try {
      const messages = await ChatModel.find({});
      return messages;
    } catch (e) {
      req.logger.error(e.message);
    }
  };
  async addMessages(message) {
    try {
      const createdMessage = await ChatModel.create({ user: message.user, message: message.message });
      return createdMessage;
    } catch (e) {
      req.logger.error(e.message);
    }
  }
}