import { connect } from "mongoose";

export async function connectMongo(mongoUrl) {
  try {
    await connect(
      `${mongoUrl}`
      
    );
    console.log("plug to mongo!");
  } catch (e) {
    req.logger.error(e.message)
    throw "can not  connect to the db";
  }
}
