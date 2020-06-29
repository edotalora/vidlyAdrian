const express = require("express");
const { Customer, validate } = require("../models/customer");
const auth = require("../middleware/auth");

//router does not work when working with several modules
const router = express.Router();

//no if routes, all new paths are defined using router.get()
router.get("/", async (req, res) => {
  const customers = await Customer.find().sort({ name: 1 });
  res.send(customers);
});

//post method
//buils schema for input validation with joi
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    //return 400 response, bad request
    //include return to exit the function
    return res.status(400).send(error.details[0].message);
  }
  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  customer = await customer.save();
  res.send(customer);
});

//put request
router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    //return 400 response, bad request
    res.status(400).send(error.details[0].message);
  }

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, isGold: req.body.isGold, phone: req.body.phone },
    { new: true }
  );

  //include retirn to exit the function if validation fails.
  if (!customer) return res.status(400).send("customer code not found");

  res.send(customer);
});

router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  //include return to exit the function
  if (!customer) return res.status(400).send("customer code not found");

  //return same customer
  res.send(customer);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  //include return to exit the function
  if (!customer) return res.status(400).send("customer code not found");

  //return same customer
  res.send(customer);
});

module.exports = router;
