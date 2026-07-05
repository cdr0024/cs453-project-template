import { Router } from "express";
import {
    getTasks,
    createTask
} from "../services/taskService";

const router = Router ();

//GET /tasks
router.get("/", (_req, res) => {
    const tasks = getTasks();

    res.status(200).json(tasks);
});

//POST /tasks
router.post("/", (req, res) => {
    const { title, status } = req.body;

    if (!title) {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    const task = createTask({
        title,
        status
    });
    res.status(201).json(task);
});

export default router;