import configDotEnv from "./config";
import express, { json } from "express";
import { notFound } from "./middleware/not-found";
import { usersRouter } from "./routes/users";
import { connect } from "./database/connection";
import { errorHandler } from "./middleware/error-handler";
import morgan from "morgan";
import cors from "cors";
import { cardsRouter } from "./routes/cards";
import { Logger } from "./logs/logger";
import { cartRouter } from "./routes/cart";
configDotEnv();
connect();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.static("public"));
app.use(json());
app.use(morgan("dev"));
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);
app.use("/cart", cartRouter);
app.use(errorHandler);
app.use(notFound);

const PORT = process.env.PORT ?? 8080;

app.listen(process.env.PORT, () => {
  Logger.info(`App is running: http://localhost:${PORT}`);
});
