import { Router } from "express";
import {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    getTaskOwner
} from "../services/taskService";
import validateTask from "../middleware/validateTask";
import authenticate from "../middleware/authenticate";
import { getProjectOwner } from "../services/projectService";

const router = Router ();

//GET /tasks
router.get("/", authenticate, async (_req, res) => {
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
router.post("/", authenticate, validateTask, async (req, res) => {
    const { title, description, status, project_id, assigned_to } = req.body;
    const ownerId = await getProjectOwner(project_id);

    if (ownerId === undefined) {
        return res.status(404).json({
            error: "Project not found"
        });
    }

    if (
        req.user!.role !== "admin" &&
        ownerId !== req.user!.userId
    ) {
        return res.status(403).json({
            error: "You do not have permission to add tasks to this project"
        });
    }

    try{
        const task = await createTask({
            title,
            description,
            status,
            project_id,
            assigned_to
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
router.get("/:id", authenticate, validateTask, async (req, res) => {
    try{
        const id = Number(req.params.id);
        const task = await getTaskById(id);
        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        const ownerId = await getTaskOwner(id);
        if (
            req.user!.role !== "admin" &&
            ownerId !== req.user!.userId
        ) {
            return res.status(403).json({
                error: "You do not have permission to view this task"
            })
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

router.patch("/:id", authenticate, validateTask, async (req, res) => {
    try{
        const id = Number(req.params.id);

        const ownerId = await getTaskOwner(id);
        if (ownerId === undefined) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        if (
            req.user!.role !== "admin" &&
            ownerId !== req.user!.userId
        ) {
            return res.status(403).json({
                error: "Youd do not have permission to modify this task"
            });
        }

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
router.delete("/:id", authenticate, async (req, res) => {
    try {
        const id = Number(req.params.id);

        const ownerId = await getTaskOwner(id);
        if (ownerId === undefined) {
            return res.status(404).json({
                error: "task not found"
            });
        }

        if (
            req.user!.role !== "admin" &&
            ownerId !== req.user!.userId
        ) {
            return res.status(403).json({
                error: "Youd do not have permission to delete this task"
            });
        }

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