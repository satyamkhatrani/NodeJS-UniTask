import Joi from "joi";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, isUnique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const validateRegisterUser = (body) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string(),
  });
  return schema.validate(body);
};

const UserModel = mongoose.model("user", userSchema);

export { UserModel, validateRegisterUser };
