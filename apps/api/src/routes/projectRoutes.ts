import { Router } from "express";
import {
    getProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject
} from "../services/projectService";
import authenticate from "../middleware/authenticate";

const router = Router();

// GET /projects
router.get("/", authenticate, async (req, res) => {
    try {
        const projects = await getProjects(
            req.user!.userId,
            req.user!.role
        );
        res.status(200).json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch projects"
        });
    }
});

//POST /projects

router.post("/", authenticate, async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({
            error: "Project name is required"
        });
    }

    try {
        const project = await createProject({
            name, 
            description,
            owner_id: req.user!.userId
        });
        res.status(201).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to create project"
        });
    }
});

//GET /projects/:id
router.get("/:id", authenticate, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const project = await getProjectById(id);
        if (!project) {
            return res.status(404).json({
                error: "Project not found"
            });
        }

        if (
            req.user!.role !== "admin" &&
            project.owner_id !== req.user!.userId
        ) {
            return res.status(403).json({
                error: "You do not have permission to view this project"
            });
        }
        res.json(project);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch project"
        });
    }
});

//PATCH /projects/:id
router.patch("/:id", authenticate, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const project = await getProjectById(id);

        if (!project) {
            return res.status(404).json({
                error: "Project not found"
            });
        }

        if (
            req.user!.role !== "admin" &&
            project.owner_id !== req.user!.userId
        ) {
            return res.status(403).json({
                error: "You do not have permission to modify this project"
            });
        }

        const updated = await updateProject(
            id, 
            req.body
        );

        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to update project"
        });
    }
});

//DELETE /projects/:id
router.delete("/:id", authenticate, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const project = await getProjectById(id);

        if (!project) {
            return res.status(404).json({
                error: "Project not found"
            });
        }

        if (
            req.user!.role !== "admin" &&
            project.owner_id !== req.user!.userId
        ) {
            return res.status(403).json({
                error: "You do not have permission to delete this project"
            });
        }

        await deleteProject(id);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to delete project"
        });
    }
});

export default router;