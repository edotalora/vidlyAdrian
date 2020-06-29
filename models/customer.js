const mongoose = require("mongoose");
const Joi = require("joi"); //class

const customerSchema = new mongoose.Schema({
  // _id: String,
  name: {
    type: String,
    required: true,
  },
  isGold: {
    type: Boolean,
  },
  phone: {
    type: String,
    required: true,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = {
    _id: Joi.number(),
    isGold: Joi.boolean(),
    name: Joi.string().min(3).required(),
    phone: Joi.string().required(),
  };
  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
