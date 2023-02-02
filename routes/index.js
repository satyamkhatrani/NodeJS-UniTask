import express from "express";
import { login, signup } from "./authController.js";

const apiRoute = express.Router();

apiRoute.get("/login", login);
apiRoute.post("/signup", signup);

export default apiRoute;
