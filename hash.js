const bcrypt = require("bcrypt");

//salt is a random string that is added before or after the password
async function run() {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash("1234", salt);
  console.log(salt);
  console.log(hashedPass);
}

run();
