import { describe, expect, test, beforeEach } from "vitest";
import request from "supertest";
import {createApp} from "../src/server";
import {resetTasks} from "../src/services/taskService";


describe("Task API", () => {

    //resets for tasks for tests
    beforeEach(() => {
        resetTasks();
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
            error: "Title is required"
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

});