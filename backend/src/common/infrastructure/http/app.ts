import express, { Express } from "express";
import { errorHandler } from "./middleware/errorHandlers";
import { router } from "./route";

export const app: Express = express();

app.use(express.json());
app.use(router);
app.use(errorHandler);
