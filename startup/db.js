const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function (params) {
  const db = config.get("db");
  //mongodb+srv://vidlyuser:admin@adriancluster-c8q9z.mongodb.net/vidly?retryWrites=true&w=majority
  //Change mongo connection mongodb://localhost/vidly
  //change it again mongodb://vidlyuser:admin@adriancluster-shard-00-00-c8q9z.mongodb.net:27017,adriancluster-shard-00-01-c8q9z.mongodb.net:27017,adriancluster-shard-00-02-c8q9z.mongodb.net:27017/vidly?ssl=true&replicaSet=adrianCluster-shard-0&authSource=admin&retryWrites=true&w=majority
  //"mongodb://vidlyuser:admin@adriancluster-shard-00-00-c8q9z.mongodb.net:27017,adriancluster-shard-00-01-c8q9z.mongodb.net:27017,adriancluster-shard-00-02-c8q9z.mongodb.net:27017/vidly?ssl=true&replicaSet=adrianCluster-shard-0&authSource=admin&retryWrites=true&w=majority"
  mongoose.connect(db).then(() => {
    winston.info(`connected to ${db}...`);
  });
};
