import { describe, expect, test, beforeEach } from "vitest";
import request from "supertest";
import {createApp} from "../src/server";
import {pool} from "../src/db/pool";
import bcrypt from "bcryptjs";

describe("Task API", () => {

    async function createTestUser(app: any) {
        await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "password123"
            });

        const login = await request(app)
            .post("/auth/login")
            .send({
                email: "test@example.com",
                password: "password123"
            });

        return login.body.token;
    }

    async function createTestProject(app: any, token: string) {
        const response = await request(app)
            .post("/projects")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Test Project",
                description: "Testing"
            });

        return response.body.id;
    }

    //resets for tasks for tests
    beforeEach(async () => {
        await pool.query("DELETE FROM tasks");
        await pool.query("DELETE FROM projects");
        await pool.query("DELETE FROM users");

        await pool.query("ALTER SEQUENCE tasks_id_seq RESTART WITH 1");
        await pool.query("ALTER SEQUENCE projects_id_seq RESTART WITH 1");
        await pool.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");

        const passwordHash = await bcrypt.hash("password123", 10);
        await pool.query(`
            INSERT INTO users (name, email, password_hash)
            VALUES ($1, $2, $3)
            `,
            [
                "Test User",
                "test@example.com",
                passwordHash
            ]
        );
        await pool.query(`
            INSERT INTO projects (name, owner_id)
            VALUES ('Test Project', 1)
            `);
    });

    test("GET /tasks returns a list of tasks", async() => {
        const app = createApp();
        const token = await createTestUser(app);
        const response = await request(app)
            .get("/tasks")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
    });

    test("POST /tasks creates a task", async () => {
        const app = createApp();
        const token = await createTestUser(app);
        const projectId = await createTestProject(app, token);
        const response = await request(app)
            .post("/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Create task API",
                project_id: projectId
            })
            .expect(201);

        expect(response.body).toEqual({
            id: expect.any(Number),
            title: "Create task API",
            status: "todo",
            project_id: expect.any(Number),
            description: null,
            assigned_to: null
        });
    });

    test("POST /tasks rejects missing title", async () => {
        const app = createApp();
        const token = await createTestUser(app);

        const response = await request(app)
            .post("/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({})
            .expect(400);

        
        expect(response.body).toEqual({
            error: "title is required"
        });
    });

    test("POST /tasks rejects title of incorrect type", async () => {
        const app = createApp();
        const token = await createTestUser(app);

        const response = await request(app)
            .post("/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: 123,
                project_id: 1
            })
            .expect(400);

        expect(response.body).toEqual({
            error: "title must be a string"
        });
    });

    test("GET /tasks/:id returns one task", async () => {
        const app = createApp();
        const token = await createTestUser(app);
        const projectId = await createTestProject(app, token);

        const created = await request(app)
            .post("/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Homework",
                project_id: projectId
            })
            .expect(201);

        const response = await request(app)
            .get(`/tasks/${created.body.id}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        expect(response.body.title).toBe("Homework");
    });

    test("GET /tasks/:id returns 404", async () => {
        const app = createApp();
        const token = await createTestUser(app);
        await request(app)
            .get("/tasks/999")
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    test("GET /tasks/:id rejects invalid id", async() => {
        const app = createApp();
        const token = await createTestUser(app);
        const response = await request(app)
            .get("/tasks/abc")
            .set("Authorization", `Bearer ${token}`)
            .expect(400);

        expect(response.body).toEqual({
            error: "Invalid task id"
        });
    });

    test("PATCH updates a task", async () => {
        const app = createApp();
        const token = await createTestUser(app);
        const projectId = await createTestProject(app, token);

        const created = await request(app)
            .post("/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Homework",
                project_id: projectId
            });

        const response = await request(app)
            .patch(`/tasks/${created.body.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                status: "done"
            })
            .expect(200);

        
        expect(response.body.status).toBe("done");
    });

    test("PATCH /tasks/:id rejects empty update", async () => {
        const app = createApp();
        const token = await createTestUser(app);
        const projectId = await createTestProject(app, token);
        const created = await request(app)
            .post("/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Homework",
                status: "todo",
                project_id: projectId
            });

        const response = await request(app)
            .patch(`/tasks/${created.body.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({})
            .expect(400);

        expect(response.body).toEqual({
            error: "Field required to update"
        });
    });

    test("DELETE removes  a task", async () => {
        const app = createApp();
        const token = await createTestUser(app);
        const projectId = await createTestProject(app, token);

        const created = await request(app)
            .post("/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Homework",
                project_id: projectId
            });

        await request(app)
            .delete(`/tasks/${created.body.id}`)
            .set("Authorization", `Bearer ${token}`)
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