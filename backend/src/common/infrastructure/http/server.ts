import "reflect-metadata";

import "@/common/infrastructure/container";
import { dataSource } from "@/common/infrastructure/typeorm";
import { env } from "../env";
import { app } from "./app";

dataSource
  .initialize()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`Application successfully started on port ${env.PORT}`);
    });
  })
  .catch(error => {
    console.error("Error initializing data source:", error);
  });
