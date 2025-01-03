const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/loaders/server")(); // Adjust the path to your server initialization file
const User = require("../src/models/user"); // Adjust the path to your User model
const connectToDatabase = require("../src/database/connection"); // Adjust the path to your DB connection file
const { JWT_SECRET } = require("../src/config/config"); // Adjust the path to your config file
const jwt = require("jsonwebtoken");

describe("POST /api/auth", () => {
    beforeAll(async () => {
        await connectToDatabase();
        await User.deleteMany({}); // Clear the User collection

        // Create a test user
        const hashedPassword = await bcrypt.hash("testpassword", 10);
        await User.create({ username: "testuser", password: hashedPassword });
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    test("should return 200 and a token for valid credentials", async () => {
        const res = await request(app)
            .post("/api/auth")
            .send({ username: "testuser", password: "testpassword" });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");

        // Verify the token
        const decoded = jwt.verify(res.body.token, JWT_SECRET);
        expect(decoded).toHaveProperty("userId");
        expect(decoded).toHaveProperty("username", "testuser");
    });

    test("should return 401 for invalid username", async () => {
        const res = await request(app)
            .post("/api/auth")
            .send({ username: "wronguser", password: "testpassword" });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("message", "Invalid username or password.");
    });

    test("should return 401 for invalid password", async () => {
        const res = await request(app)
            .post("/api/auth")
            .send({ username: "testuser", password: "wrongpassword" });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("message", "Invalid username or password.");
    });

    test("should return 400 for invalid input (username too short)", async () => {
        const res = await request(app)
            .post("/api/auth")
            .send({ username: "us", password: "testpassword" });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toContain("Username must be at least 3 characters long.");
    });

    test("should return 400 for invalid input (password too short)", async () => {
        const res = await request(app)
            .post("/api/auth")
            .send({ username: "testuser", password: "short" });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toContain("Password must be at least 6 characters long.");
    });
});
