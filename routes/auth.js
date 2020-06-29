const express = require("express");
const { User } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { identity } = require("lodash");
const jwt = require("jsonwebtoken");

//router does not work when working with several modules
const router = express.Router();

//post method
//buils schema for input validation with joi
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Invalid email or password");
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid email or password");
  }

  const token = user.generateAuthToken();

  res.send(token);
});

//Information expert principle

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, schema);
}
module.exports = router;
