import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../index"; // Import your Express app
import User from "../models/user"; // Im// Import Dashboard model
import jwt from "jsonwebtoken";
import Dashboard from "../models/dashboard";

let mongoServer: MongoMemoryServer;
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mocked-jwt-token"),
}));
beforeAll(async () => {
  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Set the in-memory MongoDB URI for your application
  process.env.MONGO_URI = uri;

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
});

afterAll(async () => {
  // Stop the in-memory MongoDB server
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear collections before each test
  await User.deleteMany({});
  await Dashboard.deleteMany({});
});

describe("POST /api/auth/signup", () => {
  it("should register a new user and return JWT token in cookies", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      fullName: "John Doe",
      email: "john@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
    expect(res.body.user).toHaveProperty("email", "john@example.com");

    // Check JWT token in cookies
    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain("jwt");
  });

  it("should return 409 if user already exists", async () => {
    // Create a user first
    await new User({
      fullName: "John Doe",
      email: "john@example.com",
      password: "hashedpassword",
    }).save();

    const res = await request(app).post("/api/auth/signup").send({
      fullName: "John Doe",
      email: "john@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("User already exists with this email.");
  });

  it("should return 400 for invalid data", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      fullName: "", // Invalid fullName
      email: "john@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid Request"); // Adjust this based on your validation logic
  });
});
