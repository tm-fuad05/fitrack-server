import "dotenv/config";
import app from "./app.js";
import { connect } from "./config/dbConnect.js";
const port = process.env.PORT || 5000;

app.listen(port, async () => {
  await connect();
  console.log(`Fitrack server running on port ${port}`);
});
