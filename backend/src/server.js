require("dotenv").config();
const app = require("./app");
const connectDb = require("./db/db");
connectDb();

app.listen(process.env.PORT||5000, () => {
  console.log("server is running on port 5000");
});
