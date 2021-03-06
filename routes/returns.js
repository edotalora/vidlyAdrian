const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");
const { date } = require("joi");
const moment = require("moment");
const validate = require("../middleware/validate");
const Joi = require("joi");

//const Fawn = require("fawn");
//const auth = require("../middleware/auth");
//inicalizar fwan wnviando un objeto mogoose
//Fawn.init(mongoose);
//auth,
router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) {
    return res.status(404).send("no rental was found");
  }
  if (rental.dateReturned)
    return res.status(400).send("Return already processed");

  //logic encapsulated in the rental object
  rental.return();

  await rental.save();
  await Movie.update(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );

  return res.send(rental);
});

function validateReturn(req) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
