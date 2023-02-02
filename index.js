import bodyParser from "body-parser";
import express, { json } from "express";
import * as dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(json());

app.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello from Express.js!</h1>");
  res.write("<h2>Server is Running</h2>");
  res.end();
});

app.listen(3001);
