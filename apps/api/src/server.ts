import express from "express";
import { env } from "./config/env";
import  taskRoutes from "./routes/taskRoutes"
import { pool } from "./db/pool";

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
	return app;
}
if (process.env.NODE_ENV !== "test") {
	const app = createApp();

	app.listen(env.port, () => {
		console.log(`Server running at http://localhost:${env.port}`);
	});

}