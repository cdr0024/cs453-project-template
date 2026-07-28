import { Router } from "express";
import {
    getProjects,
    createProject,
    getProjectById
} from "../services/projectService";

const router = Router();

// GET /projects
router.get("/", async (_req, res) => {
    try {
        const projects = await getProjects();
        res.status(200).json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch projects"
        });
    }
});

//POST /projects

router.post("/", async (req, res) => {
    const { name, description, owner_id } = req.body;

    if (!name || !owner_id) {
        return res.status(400).json({
            error: "Project name and owner_id are required"
        });
    }

    try {
        const project = await createProject({
            name, 
            description,
            owner_id
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
router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const project = await getProjectById(id);
        if (!project) {
            return res.status(404).json({
                error: "Project not found"
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


export default router;