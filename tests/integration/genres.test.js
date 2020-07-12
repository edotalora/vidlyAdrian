const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

let server;
describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    //clean up existing records
    await Genre.remove({});
  });
  describe("GET /", () => {
    it("should return all genres", async () => {
      Genre.collection.insertMany([
        { name: "genreTest1" },
        { name: "genreTest2" },
      ]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(
        res.body.some((g) => {
          g.name === "genreTest1";
        })
      );
      expect(
        res.body.some((g) => {
          g.name === "genreTest2";
        })
      );
    });
  });
  describe("GET /:id", () => {
    it("should return a genre if valid id is passed", async () => {
      const genre = new Genre({ name: "Accion" });
      await genre.save();
      const response = await request(server).get("/api/genres/" + genre._id);

      expect(response.status).toBe(200);
      //expect(response.body).toMatchObject(genre);
      expect(response.body).toHaveProperty("name", genre.name);
    });
    it("should return 404 if the id is not valid", async () => {
      const response = await request(server).get("/api/genres/1");

      expect(response.status).toBe(404);
      //expect(response.body).toMatchObject(genre);
      //expect(response.body).toHaveProperty("name", genre.name);
    });
  });
  describe("POST /", () => {
    //Define the happy path, and then in each test we change
    //one parameter that clearly aligns with the test name
    let token;
    let name;
    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "Accion";
    });
    it("should return 401 if client not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });
    it("should return 400 if genre is less tha 5 characters", async () => {
      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "1234" });

      expect(res.status).toBe(400);
    });
    it("should return 400 if genre is more than 50 characters", async () => {
      const name = new Array(52).join("a");

      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: name });

      expect(res.status).toBe(400);
    });
    it("should persist a genre in the db if all the validations are ok", async () => {
      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "Accion" });
      const genre = await Genre.find({ name: "Accion" });
      expect(res.status).toBe(200);
      expect(genre).not.toBeNull();
    });
    it("should return the genre if it is valid in the reponse", async () => {
      const res = await exec();
      const genre = await Genre.find({ name: "Accion" });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "Accion");
    });
  });
});
