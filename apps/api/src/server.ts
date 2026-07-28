import express from "express";
import { env } from "./config/env";
import  taskRoutes from "./routes/taskRoutes";
import projectRoutes from "./routes/projectRoutes";
import { pool } from "./db/pool";
import errorHandler from "./middleware/errorHandler";
import authRoutes from "./routes/authRoutes";

export function createApp(){

	const app = express();

	app.use(express.json());

	app.get("/health", (_req, res) => {
		res.json({
			status: "ok",
			service: "cs453-api",
		});
	});

	app.use("/tasks", taskRoutes);
	app.use("/projects", projectRoutes);
	app.use("/auth", authRoutes);

	app.use((_req, res) => {
		res.status(404).json({
			error: "Not found"
		});
	});

	app.use(errorHandler);
	return app;
}
if (process.env.NODE_ENV !== "test") {
	const app = createApp();

	app.listen(env.port, () => {
		console.log(`Server running at http://localhost:${env.port}`);
	});

}