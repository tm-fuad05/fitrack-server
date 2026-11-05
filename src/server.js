import "dotenv/config";
import { app } from "./app";

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
