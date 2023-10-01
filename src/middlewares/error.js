import EErros from "../services/errors/enum.js";



export default (error, req, res, next) => {
  req.logger.info(error.cause);
  console.log(error);
  switch (error.code) {
    case EErros.INVALID_TYPES_ERROR:
      res
        .status(400)
        .send({ status: "error", error: error.name, cause: error.cause });
      break;
    case EErros.DATABASES_ERROR:
      res
        .status(500)
        .send({ status: "error", error: error.namem, cause: error.cause });
    case EErros.ROUTING_ERROR:
      res
        .status(404)
        .send({ status: "error", error: error.namem, cause: error.cause });
    default:
      res.send({ status: "error", error: "Unhandled error" });
      break;
  }
};
