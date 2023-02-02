import axios from "axios";
import { handleError, handleResponse } from "../config/reqResHandler.js";
import { UserModel } from "../models/user.js";

const JOKE_URL = "https://api.chucknorris.io/jokes/random";

export const myProfile = async (req, res) => {
  try {
    const user = await UserModel.findOne(
      {
        _id: req.userId,
      },
      {
        firstName: 1,
        lastName: 1,
        email: 1,
      }
    );
    if (user) {
      return handleResponse({
        res,
        msg: "Profile fetch Successfully",
        data: user,
      });
    } else {
      return handleError({
        res,
        statusCode: 404,
        err_msg: "User not found",
      });
    }
  } catch (err) {
    return handleError({
      res,
      statusCode: err.statusCode ?? 401,
      err_msg: err.message || "Something went Wrong",
    });
  }
};

export const getJoke = async (req, res) => {
  try {
    axios.get(JOKE_URL).then((resp) => {
      if (resp.status === 200) {
        return handleResponse({ res, data: resp.data });
      } else {
        return handleError({
          res,
          statusCode: resp.status,
          err_msg: "API not working",
        });
      }
    });
  } catch (err) {
    return handleError({
      res,
      statusCode: err.statusCode ?? 401,
      err_msg: err.message || "Something went Wrong",
    });
  }
};
