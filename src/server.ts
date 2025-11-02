import { createApp } from "./app";
import { appConfig } from "./config";

const app = createApp();

app.listen(appConfig.port, () => {
  console.log(`Server started on port ${appConfig.port}`);
});
