const winston = require("winston");
//require("winston-mongodb");
require("express-async-errors");

module.exports = function name(params) {
  process.on("uncaughtException", (ex) => {
    console.log("uncaught exception");
    winston.error(ex.message, ex);
    process.exit(1);
  });

  //there is an option to use a different file for uncauhgt exceptions.
  //using winston.handleExceptions

  //on rejection exception is a good practice to terminate the process
  process.on("unhandledRejection", (ex) => {
    console.log("uncaught promise rejection");
    winston.error(ex.message, ex);
    process.exit(1);
    //throw ex -- to make it uncaught exception and pass it to winston and terminate the promise
  });

  winston.add(
    new winston.transports.Console({
      colorize: true,
      prettyPrint: true,
    })
  );

  winston.add(
    new winston.transports.File({
      filename: "logfile.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    })
  );

  // winston.add(
  //   new winston.transports.MongoDB({
  //     db: "mongodb://localhost/vidly",
  //   })
  // );

  //example of uncaught exception error
  //throw new Error("Something failed during startup");

  //example of uncaught promise rejection error

  //const p = Promise.reject(new Error("Something failed in the promise"));
  //p.then(() => console.log("Done"));
};
