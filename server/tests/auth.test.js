// Trigger CI: test comment for new repo
// Trigger CI: test comment
import dotenv from "dotenv";
import { jest } from "@jest/globals";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js";
import User from "../models/User.js";

dotenv.config({ path: new URL("../.env", import.meta.url).pathname });

jest.setTimeout(30000);

describe("Auth Routes", () => {
  beforeAll(async () => {
    const testDbUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;

    if (!testDbUri) {
      throw new Error(
        "MONGO_URI_TEST (or fallback MONGO_URI) must be defined for tests.",
      );
    }

    await mongoose.connect(testDbUri);
    await User.deleteMany({});
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("should register a new user successfully", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
    });

    // Intentionally break the test for CI failure scenario
    // Fixed: expect correct status code
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("email", "testuser@example.com");
  });

  test("should fail to register with an existing email", async () => {
    await request(app).post("/api/users/register").send({
      name: "Existing User",
      email: "existing@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/users/register").send({
      name: "Another User",
      email: "existing@example.com",
      password: "differentpassword",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message.toLowerCase()).toContain("already exists");
  });

  test("should fail to register with missing required fields", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: "Incomplete User",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  test("should log in with correct credentials", async () => {
    await request(app).post("/api/users/register").send({
      name: "Login Test User",
      email: "login@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/users/login").send({
      email: "login@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("success", true);
  });

  test("should fail to log in with wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Password Test User",
      email: "wrongpass@example.com",
      password: "correctpassword",
    });

    const res = await request(app).post("/api/users/login").send({
      email: "wrongpass@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });
});
// PR demo comment
