const express = require("express");
//express application
const app = express();
const winston = require("winston");

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

//logger has a transport which is a storing device for the logs.--console, files, http, mongoDB, couchDB, Logly

//environment variable to define port number
//named PORT
//use process object
const port = process.env.PORT || 3000;
//port and function called after app is listening
const server = app.listen(port, () => {
  winston.info(`Listening on port ${port}...`);
});

module.exports = server;
