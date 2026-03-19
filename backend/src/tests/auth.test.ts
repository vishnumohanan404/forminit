import request from "supertest";
import User from "../models/user";
import { app } from "../app";

const VALID_USER = {
  fullName: "John Doe",
  email: "john@example.com",
  password: "Password1!",
};

describe("POST /api/auth/signup", () => {
  it("should register a new user and set jwt cookie", async () => {
    const res = await request(app).post("/api/auth/signup").send(VALID_USER);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
    expect(res.body.user).toHaveProperty("email", VALID_USER.email);

    const cookies = res.headers["set-cookie"] as unknown as string[];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain("jwt");
  });

  it("should return 409 if user already exists", async () => {
    await new User({
      fullName: "John Doe",
      email: "john@example.com",
      password: "hashedpassword",
    }).save();

    const res = await request(app).post("/api/auth/signup").send(VALID_USER);
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("User already exists with this email.");
  });

  it("should return 400 for missing fullName", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ ...VALID_USER, fullName: "" });
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 for a weak password", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ ...VALID_USER, password: "weakpassword" });
    expect(res.statusCode).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await request(app).post("/api/auth/signup").send(VALID_USER);
  });

  it("should login and set jwt cookie", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: VALID_USER.email, password: VALID_USER.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");

    const cookies = res.headers["set-cookie"] as unknown as string[];
    expect(cookies[0]).toContain("jwt");
  });

  it("should return 401 for wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: VALID_USER.email, password: "WrongPassword1!" });
    expect(res.statusCode).toBe(401);
  });

  it("should return 404 for unknown email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: VALID_USER.password });
    expect(res.statusCode).toBe(404);
  });
});
