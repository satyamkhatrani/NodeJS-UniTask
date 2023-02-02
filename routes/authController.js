import md5 from "md5";
import { handleError, handleResponse } from "../config/reqResHandler.js";
import { getAccessToken } from "../middleware/auth.js";
import { UserModel, validateRegisterUser } from "../models/user.js";

const checkEmailExist = async (email) => {
  const result = await UserModel.findOne({
    email: email,
  });
  return result;
};

export const signup = async (req, res) => {
  try {
    // validate body
    const { error } = validateRegisterUser(req.body);

    if (error) {
      return handleError({ res, err_msg: error.message });
    }

    // check Email Exist
    const userEmail = await checkEmailExist(req.body.email);
    if (userEmail) {
      return handleError({
        res,
        statusCode: 400,
        err_msg: "Email already registered.",
      });
    }

    // Encrypt Password
    req.body.password = md5(req.body.password);

    // register new user
    const newUser = new UserModel({ ...req.body });
    newUser.save((err, userData) => {
      if (err) {
        return handleError({ res, statusCode: 401, err_msg: err.message });
      }
      if (userData) {
        return handleResponse({
          res,
          msg: "Registered Successfully",
        });
      }
    });
  } catch (err) {
    return handleError({
      res,
      statusCode: err.statusCode ?? 500,
      err_msg: err.message || "Something Went Wrong",
      err: err,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return handleError({
        res,
        err_msg: "Enter Email & Password",
      });
    }

    // Check user registered or not
    const userData = await checkEmailExist(email);
    if (!userData) {
      return handleError({
        res,
        statusCode: 400,
        err_msg: "Email address is not registered",
      });
    }

    // check password validate or not
    if (userData.password !== md5(req.body.password)) {
      return handleError({
        res,
        statusCode: 400,
        err_msg: "Invalid Credentials",
      });
    }

    userData.token = await getAccessToken(userData._id);

    await userData.save();

    return handleResponse({
      res,
      msg: "Login Successfully",
      data: userData.token,
    });
  } catch (err) {
    return handleError({
      res,
      statusCode: err.statusCode ?? 500,
      err_msg: err.message || "Something Went Wrong",
      err: err,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userData = await UserModel.findOneAndUpdate(
      { _id: req.userId },
      { $set: { token: "" } }
    );
    return handleResponse({ res, ...userData });
  } catch (err) {
    return handleError({
      res,
      statusCode: err.statusCode ?? 500,
      err_msg: err.message || "Something Went Wrong",
      err: err,
    });
  }
};
