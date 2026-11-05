import "dotenv/config";
import "./config/dbConnect.js";
import app from "./app.js";
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Fitrack server running on port ${port}`);
});
