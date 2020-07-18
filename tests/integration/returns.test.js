const { Rental } = require("../../models/rental");
const { Movie } = require("../../models/movie");
const mongoose = require("mongoose");
const request = require("supertest");
const { User } = require("../../models/user");
const moment = require("moment");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let movie;

  beforeEach(async () => {
    server = require("../../index");
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    movie = new Movie({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      genre: { name: "12345" },
      numberInStock: 10,
    });
    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
      },
    });
    rental = await rental.save();
  });
  afterEach(async () => {
    await Rental.remove({});
    await Movie.remove({});
    await server.close();
  });

  let token;

  const exec = (body) => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send(body);
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec({ customerId: customerId, movieId: movieId });
    expect(res.status).toBe(401);
  });

  it("should return 400 if the customerId is not provided", async () => {
    const res = await exec({ movieId: movieId });
    expect(res.status).toBe(400);
  });
  it("should return 400 if the movieId is not provided", async () => {
    const res = await exec({ customerId: customerId });
    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental found for movieId/customerId provided", async () => {
    await Rental.remove({});
    const res = await exec({
      customerId: customerId,
      movieId: mongoose.Types.ObjectId(),
    });
    expect(res.status).toBe(404);
  });

  it("should return 400 if return is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec({ customerId: customerId, movieId: movieId });
    expect(res.status).toBe(400);
  });
  it("should return 200 if we have valid request", async () => {
    const res = await exec({ customerId: customerId, movieId: movieId });
    expect(res.status).toBe(200);
  });

  it("set the returned date if valid request", async () => {
    const res = await exec({ customerId: customerId, movieId: movieId });

    const rentalInDB = await Rental.findById(rental._id);
    const dateDifference = new Date() - rentalInDB.dateReturned;
    expect(dateDifference).toBeLessThan(10 * 1000); //10 second difference
  });
  it("calculate rental fee if valid input", async () => {
    rental.movie.dailyRentalRate = 10;
    rental.dateOut = moment().add(-7, "days").toDate();
    //rental returned today

    await rental.save();

    const res = await exec({ customerId: customerId, movieId: movieId });

    const rentalInDB = await Rental.findById(rental._id);
    expect(rentalInDB.rentalFee).toBe(70); //rental fee(numberOfDays * movie.dailyRentalRate
  });
  it("should increase stock, if valid input", async () => {
    const res = await exec({ customerId: customerId, movieId: movieId });

    const movieInDb = await Movie.findById(movieId);
    expect(movieInDb.numberInStock).toBe(11); //current number in stock +1;
  });
  it("should return a rental in the body of the response", async () => {
    const res = await exec({ customerId: customerId, movieId: movieId });

    const rentalInDB = await Rental.findById(rental._id);
    //expect(response.body).toMatchObject(rentalInDB); //problem with date data types
    expect(res.body).toHaveProperty("dateOut");
    expect(res.body).toHaveProperty("dateReturned");
    expect(res.body).toHaveProperty("rentalFee");
    expect(res.body).toHaveProperty("customer");
    expect(res.body).toHaveProperty("movie");

    //another approach
    //expect(Object.keys(res.body)).toEqual(expect.arrayContaining([dateOut,dateReturned,rentalFee,customer,movie]));
  });
});
