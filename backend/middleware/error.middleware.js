import logger from "../services/logger.service.js";
import { sendError } from "../services/response.service.js";
import { HTTP_STATUS } from "../constant.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(err.stack || err.message);

  return sendError(
    res,
    err.statusCode || HTTP_STATUS.INTERVAL_SERVER_ERROR,
    err.message || "Internal Server Error"
  );
};