import { Router } from "express";
import {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask
} from "../services/taskService";
import validateTask from "../middleware/validateTask";

const router = Router ();

//GET /tasks
router.get("/", async (_req, res) => {
    try {
        const tasks = await getTasks();
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch tasks"
        });
    }
});

//POST /tasks
router.post("/", validateTask, async (req, res) => {
    const { title, status } = req.body;

    try{
        const task = await createTask({
            title,
            status
        });
    res.status(201).json(task);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to create task"
        });
    }
});

//GET /tasks/:id
router.get("/:id", validateTask, async (req, res) => {
    try{
        const id = Number(req.params.id);
        const task = await getTaskById(id);
        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }
        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch task"
        });
    }
});

//PATCH /tasks/:id

router.patch("/:id", validateTask, async (req, res) => {
    try{
        const id = Number(req.params.id);
        const task = await updateTask(id, req.body);

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.json(task);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to update task"
        });
    }
});

//DELETE /tasks/:id
router.delete("/:id", validateTask, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const deleted = await deleteTask(id);

        if (!deleted) {
            return res.status(404).json({
                error: "Task not found"
            });
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "failed to delete task"
        });
    }
});

export default router;