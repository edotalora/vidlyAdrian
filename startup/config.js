const config = require("config");

module.exports = function name(params) {
  // console.log("key", config.get("jwtPrivateKey"));
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: JWT Private Key not defined.");
    //finish global process object code 0 = sucess 1= failure
    //process.exit(1);--dont need this anymore after refactoring
  }
};
