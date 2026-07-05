import { describe, expect, test, beforeEach } from "vitest";
import request from "supertest";
import {createApp} from "../src/server";

describe("Task API", () => {
    test("GET /tasks returns a list of tasks", async() => {
        const app = createApp();
        const response = await request(app)
            .get("/tasks")
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
    });

    test("POST /tasks creates a task", async () => {
        const app = createApp();
        const response = await request(app)
            .post("/tasks")
            .send({
                title: "Create task API"
            })
            .expect(201);

        expect(response.body).toEqual({
            id: expect.any(Number),
            title: "Create task API",
            status: "todo"
        });
    });

    test("POST /tasks rejects missing title", async () => {
        const app = createApp();

        const response = await request(app)
            .post("/tasks")
            .send({})
            .expect(400);

        
        expect(response.body).toEqual({
            error: "Title is required"
        });
    });
});