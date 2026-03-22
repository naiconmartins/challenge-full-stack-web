import cors from "cors";
import express, { Express } from "express";
import { errorHandler } from "./middleware/errorHandlers";
import { routes } from "./route";

export const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errorHandler);
