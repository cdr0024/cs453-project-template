import { Router } from "express";
import {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask
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

//GET /tasks/:id
router.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = getTaskById(id);
    if (!task) {
        return res.status(404).json({
            error: "Task not found"
        });
    }
    res.json(task);
});

//PATCH /tasks/:id

router.patch("/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = updateTask(id, req.body);

    if (!task) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    res.json(task);
});

//DELETE /tasks/:id
router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    const deleted = deleteTask(id);

    if (!deleted) {
        return res.status(404).json({
            error: "Task not found"
        });
    }
    res.status(204).send();
});

export default router;