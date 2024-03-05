const express = require("express");
const mongoose = require("mongoose");
//const bodyParser = require("body-parser"); //can remove due to new version express provide this
const path = require("path");
const config = require("config");

const app = express();

//Bodyparser Middleware
app.use(express.json());

//DB Config
//const db = require("./config/keys").mongoURI; //get from config/keys.js
const db = config.get("mongoURI");

//Connect to Mongo
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected")) //at promise base API (synchronize function)
  .catch((err) => console.log(err));

//Use Routes
app.use("/api/items", require("./routes/api/items"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));

//Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));

  app.get("*", (res, req) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on ${port}`));
