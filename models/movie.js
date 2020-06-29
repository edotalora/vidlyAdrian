const mongoose = require("mongoose");
const Joi = require("joi"); //class
const { Genre } = require("../models/genre");

//const genreSchema = new mongoose.Schema({
//name: String,
//});

//const Genre = mongoose.model("Genre", genreSchema);

const movieSchema = new mongoose.Schema({
  // _id: String,
  title: {
    type: String,
    required: true,
  },
  genre: Genre.schema,
  numberInStock: {
    type: Number,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
  const schema = {
    _id: Joi.number(),
    title: Joi.string().required(),
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number(),
    genreId: Joi.objectId(),
  };
  return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;
//exports.Genre = Genre;
//exports.validate = validateMovie;
