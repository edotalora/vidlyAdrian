const express = require("express");
const { Genre, validate } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

//router does not work when working with several modules
const router = express.Router();

//no if routes, all new paths are defined using router.get()
router.get("/", async (req, res) => {
  const genres = await Genre.find().select({ name: 1 }).sort({ name: 1 });
  res.send(genres);
});

//post method
//buils schema for input validation with joi
//include auth to be excuted before post.
router.post("/", auth, async (req, res) => {
  console.log("name parameter", req.body.name);
  const { error } = validate(req.body);
  if (error) {
    //return 400 response, bad request
    //include return to exit the function
    return res.status(400).send(error.details[0].message);
  }
  let genre = new Genre({
    name: req.body.name,
  });
  genre = await genre.save();
  res.send(genre);
});

//put request
router.put("/:id", auth, async (req, res) => {
  //validate genre found
  //object destructuring
  const { error } = validate(req.body);
  if (error) {
    //return 400 response, bad request
    res.status(400).send(error.details[0].message);
  }

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  //include retirn to exit the function if validation fails.
  if (!genre) return res.status(400).send("genre code not found");

  res.send(genre);
});

//delete request
router.delete("/:id", [auth, admin], async (req, res) => {
  console.log("delete parameter", req.params.id);
  const genre = await Genre.findByIdAndRemove(req.params.id);

  //include return to exit the function
  if (!genre) return res.status(400).send("genre code not found");

  //return same genre
  res.send(genre);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  //include return to exit the function
  if (!genre) return res.status(400).send("genre code not found");

  //return same genre
  res.send(genre);
});

module.exports = router;
