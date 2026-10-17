require("dotenv").config();
const app = require("./app");
const connectDb = require("./db/db");

const PORT = process.env.PORT || 5000;

connectDb();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

