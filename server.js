const app = require("./app");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", async function () {
  console.log("Database connection successful");
});

db.on("error", function (err) {
  console.error("Database connection error:", err);
  process.exit(1);
});

process.on("exit", function (code) {
  if (code === 1) {
    console.error("Application exited with error");
  }
});

app.listen(3000, () => {
  console.log("Server running. Use our API on port: 3000");
});
