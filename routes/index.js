import express from "express";
import { verifyLoginUser } from "../middleware/auth.js";
import { getJoke, myProfile } from "./appController.js";
import { login, logout, signup } from "./authController.js";

const apiRoute = express.Router();

apiRoute.get("/users/login", login);
apiRoute.post("/users/signup", signup);

// authenticated Routes
apiRoute.get("/users/me", verifyLoginUser, myProfile);
apiRoute.get("/random-joke", verifyLoginUser, getJoke);
apiRoute.patch("/users/logout", verifyLoginUser, logout);

export default apiRoute;
