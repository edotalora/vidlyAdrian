const config = require("config");
const express = require("express");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

console.log("key", config.get("jwtPrivateKey"));
if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: JWT Private Key not defined.");
  //finish global process object code 0 = sucess 1= failure
  process.exit(1);
}

//express application
const app = express();

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch(() => {
    console.log("error connecting to the db");
  });

app.use(express.json()); //req.body

app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

//environment variable to define port number
//named PORT
//use process object
const port = process.env.PORT || 3000;
//port and function called after app is listening
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
