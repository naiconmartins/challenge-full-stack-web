import { env } from "../env";
import { app } from "./app";

app.listen(env.PORT, () => {
  console.log(`Application successfully started on port ${env.PORT}`);
});
