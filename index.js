import bodyParser from "body-parser";
import express, { json } from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import ConnectMongoDBSession from "connect-mongodb-session";
import session from "express-session";
import config from "./config/index.js";
import apiRoute from "./routes/index.js";

dotenv.config();
const app = express();

const MongoDBStore = ConnectMongoDBSession(session);

const store = new MongoDBStore({
  uri: config.db.uri,
  collection: "session",
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(json());

app.use(
  session({
    cookie: { maxAge: 999999999999 },
    secret: `It's top Secret`,
    resave: true,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, PUT, OPTIONS, DELETE, GET"
  );
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello from Express.js!</h1>");
  res.write("<h2>Server is Running</h2>");
  res.end();
});

app.use("/api/users", apiRoute);

mongoose
  .connect(config.db.uri, config.db.options)
  .then(() => {
    app.listen(config.port);
    console.info(`server started on port ${config.port}`);
  })
  .catch((err) => {
    console.error(err);
  });
