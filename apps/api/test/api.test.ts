import { describe, expect, test, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../src/server";
import { pool } from "../src/db/pool";


describe("CS453 API", () => {

    async function registerUser(
        app: any,
        email = "user@test.com",
        name = "Test User"
    ) {
        return await request(app)
            .post("/auth/register")
            .send({
                name,
                email,
                password: "password123"
            });
    }


    async function loginUser(
        app: any,
        email = "user@test.com"
    ) {
        const response = await request(app)
            .post("/auth/login")
            .send({
                email,
                password: "password123"
            })
            .expect(200);

        return response.body.token;
    }


    async function createProject(
        app: any,
        token: string
    ) {
        const response = await request(app)
            .post("/projects")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Test Project",
                description: "Testing project"
            })
            .expect(201);

        return response.body.id;
    }


    beforeEach(async () => {
        await pool.query("DELETE FROM tasks");
        await pool.query("DELETE FROM projects");
        await pool.query("DELETE FROM users");

        await pool.query("ALTER SEQUENCE tasks_id_seq RESTART WITH 1");
        await pool.query("ALTER SEQUENCE projects_id_seq RESTART WITH 1");
        await pool.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    });

    describe("Authentication", () => {

        test("A user can register", async () => {
            const app = createApp();
            const response = await registerUser(app);

            expect(response.status).toBe(201);
            expect(response.body.email).toBe("user@test.com");
        });


        test("A registered user can log in", async () => {
            const app = createApp();
            await registerUser(app);

            const response = await request(app)
                .post("/auth/login")
                .send({
                    email: "user@test.com",
                    password: "password123"
                })
                .expect(200);

            expect(response.body.token).toBeDefined();
        });


        test("Login returns a JWT", async () => {
            const app = createApp();
            await registerUser(app);
            const token = await loginUser(app);

            expect(typeof token).toBe("string");
        });



        test("Incorrect login credentials are rejected", async () => {
            const app = createApp();
            await registerUser(app);
            const response = await request(app)
                .post("/auth/login")
                .send({
                    email: "user@test.com",
                    password: "wrongpassword"
                })
                .expect(401);

            expect(response.body.error).toBeDefined();
        });


        test("Protected route rejects missing token", async () => {
            const app = createApp();

            await request(app)
                .get("/tasks")
                .expect(401);
        });


        test("Protected route accepts valid token", async () => {
            const app = createApp();
            await registerUser(app);
            const token = await loginUser(app);

            await request(app)
                .get("/tasks")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);
        });

    });



    describe("Projects API", () => {

        test("Authenticated user can create project", async () => {
            const app = createApp();
            await registerUser(app);
            const token = await loginUser(app);
            const response = await request(app)
                .post("/projects")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    name: "CS453 Project",
                    description: "Project Test"
                })
                .expect(201);

            expect(response.body.name).toBe("CS453 Project");
        });


        test("Task can be associated with a project", async () => {
            const app = createApp();
            await registerUser(app);
            const token = await loginUser(app);
            const projectId = await createProject(app, token);

            const response = await request(app)
                .post("/tasks")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    title: "Project Task",
                    project_id: projectId
                })
                .expect(201);


            expect(response.body.project_id).toBe(projectId);
        });


        test("User cannot modify another user's project", async () => {
            const app = createApp();
            await registerUser(app, "user1@test.com");

            const token1 = await loginUser(app, "user1@test.com");
            const projectId = await createProject(app, token1);
            await registerUser(app, "user2@test.com");

            const token2 = await loginUser(app, "user2@test.com");
            await request(app)
                .patch(`/projects/${projectId}`)
                .set(
                    "Authorization",
                    `Bearer ${token2}`
                )
                .send({
                    name: "Changed Project"
                })
                .expect(403);
        });

    });

    describe("Tasks", () => {

        test("GET /tasks returns a list of tasks", async () => {
            const app = createApp();
            await registerUser(app);
            const token = await loginUser(app);
            const response = await request(app)
                .get("/tasks")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });

        test("POST /tasks creates a task", async () => {
            const app = createApp();
            await registerUser(app);
            const token = await loginUser(app);
            const projectId = await createProject(app, token);

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
            await registerUser(app);
            const token = await loginUser(app);
            const response = await request(app)
                .post("/tasks")
                .set("Authorization", `Bearer ${token}`)
                .send({})
                .expect(400);


            expect(response.body).toEqual({
                    error: "title is required"
                });
        });

        test("POST /tasks rejects missing project_id", async () => {
            const app = createApp();
            await registerUser(app);
            const token = await loginUser(app);
            const response = await request(app)
                .post("/tasks")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    title: "No project"
                })
                .expect(400);

            expect(response.body).toEqual({
                    error: "project_id is required"
                });
        });

        test("GET /tasks/:id returns a task", async () => {
            const app = createApp();
            await registerUser(app);
            const token = await loginUser(app);
            const projectId = await createProject(app, token);
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
            await registerUser(app);
            const token = await loginUser(app);
            await request(app)
                .get("/tasks/999")
                .set("Authorization", `Bearer ${token}`)
                .expect(404);
        });



        test("PATCH updates a task", async () => {
            const app = createApp();
            await registerUser(app);
            const token = await loginUser(app);
            const projectId = await createProject(app, token);

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

        test("DELETE removes a task", async () => {
            const app = createApp();
            await registerUser(app);
            const token = await loginUser(app);
            const projectId = await createProject(app, token);

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

    });



    describe("Authorization", () => {
        test("Normal user cannot access admin-only operation", async () => {
            const app = createApp();
            await registerUser(app);
            const token = await loginUser(app);

            await request(app)
                .get("/users")
                .set("Authorization", `Bearer ${token}`)
                .expect(403);
        });

        test("Admin can access admin-only operation", async () => {
            const app = createApp();
            await registerUser(app, "admin@test.com");

            await pool.query(
                `UPDATE users
                 SET role = 'admin'
                 WHERE email = $1`,
                ["admin@test.com"]
            );

            const token = await loginUser(app, "admin@test.com");

            const response = await request(app)
                .get("/users")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);


            expect(Array.isArray(response.body))
                .toBe(true);
        });

        test("Unknown routes return 404", async () => {
            const app = createApp();
            const response = await request(app)
                .get("/does-not-exist")
                .expect(404);

            expect(response.body).toEqual({
                error: "Not found"
            });
        });

    });

});