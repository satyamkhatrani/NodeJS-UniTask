import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { handleError } from "../config/reqResHandler.js";

export const getAccessToken = async (userId) => {
  const data = { userId };
  return jwt.sign({ data }, config.jwtSecret, {
    expiresIn: config.jwtExpireTime,
  });
};
