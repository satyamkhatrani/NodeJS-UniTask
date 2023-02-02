import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { handleError } from "../config/reqResHandler.js";
import { UserModel } from "../models/user.js";

export const getAccessToken = async (userId) => {
  const data = { userId };
  return jwt.sign({ data }, config.jwtSecret, {
    expiresIn: config.jwtExpireTime,
  });
};

export const verifyLoginUser = async (req, res, next) => {
  try {
    let token =
      req.headers.Authorization ||
      req.headers.authorization ||
      req.headers["x-access-token"] ||
      req.header("token");
    if (!token) {
      return handleError({
        res,
        statusCode: 400,
        err_msg: "Please Login first.",
      });
    }

    token = token.split(" ")[1];
    const userData = await UserModel.findOne({ token: token });
    if (userData) {
      try {
        await jwt.verify(token, config.jwtSecret);
        req.userId = userData._id;
        return next();
      } catch (err) {
        userData.token = "";
        await userData.save();
        return handleError({
          res,
          statusCode: 400,
          err_msg: "Token Expired",
        });
      }
    } else {
      return handleError({
        res,
        statusCode: 400,
        err_msg: "Token Expired, Please Login first.",
      });
    }
  } catch (error) {
    return handleError({
      res,
      statusCode: error.statusCode ?? 500,
      err_msg: error.message,
    });
  }
};
