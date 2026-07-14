import { describe, expect, test, beforeEach } from "vitest";
import request from "supertest";
import {createApp} from "../src/server";
import {pool} from "../src/db/pool";

describe("Task API", () => {

    //resets for tasks for tests
    beforeEach(async () => {
        await pool.query("DELETE FROM tasks");
        await pool.query("ALTER SEQUENCE tasks_id_seq RESTART WITH 1");
    });

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
            error: "title is required"
        });
    });

    test("POST /tasks rejects title of incorrect type", async () => {
        const app = createApp();
        const response = await request(app)
            .post("/tasks")
            .send({
                title: 123
            })
            .expect(400);

        expect(response.body).toEqual({
            error: "title must be a string"
        });
    });

    test("GET /tasks/:id returns one task", async () => {
        const app = createApp();
        const created = await request(app)
            .post("/tasks")
            .send({
                title: "Homework"
            });

        const response = await request(app)
            .get(`/tasks/${created.body.id}`)
            .expect(200);

        expect(response.body.title).toBe("Homework");
    });

    test("GET /tasks/:id returns 404", async () => {
        const app = createApp();
        await request(app)
            .get("/tasks/999")
            .expect(404);
    });

    test("GET /tasks/:id rejects invalid id", async() => {
        const app = createApp();
        const response = await request(app)
            .get("/tasks/abc")
            .expect(400);

        expect(response.body).toEqual({
            error: "Invalid task id"
        });
    });

    test("PATCH updates a task", async () => {
        const app = createApp();
        const created = await request(app)
            .post("/tasks")
            .send({
                title: "Homework"
            });

        const response = await request(app)
            .patch(`/tasks/${created.body.id}`)
            .send({
                status: "done"
            })
            .expect(200);

        
        expect(response.body.status).toBe("done");
    });

    test("PATCH /tasks/:id rejects empty update", async () => {
        const app = createApp();
        const created = await request(app)
            .post("/tasks")
            .send({
                title: "Homework",
                status: "todo"
            });

        const response = await request(app)
            .patch(`/tasks/${created.body.id}`)
            .send({})
            .expect(400);

        expect(response.body).toEqual({
            error: "Field required to update"
        });
    });

    test("DELETE removes  a task", async () => {
        const app = createApp();

        const created = await request(app)
            .post("/tasks")
            .send({
                title: "Homework"
            });

        await request(app)
            .delete(`/tasks/${created.body.id}`)
            .expect(204);
    });

    test("Unknown routes return 404", async () => {
        const app = createApp();
        const response = await request(app)
            .get("/wrong-route")
            .expect(404);

        expect(response.body).toEqual({
            error: "Not found"
        });
    });

});