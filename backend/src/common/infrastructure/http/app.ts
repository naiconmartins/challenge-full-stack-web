import express, { Express } from "express";
import { router } from "./route";

export const app: Express = express();

app.use(express.json());
app.use(router);
