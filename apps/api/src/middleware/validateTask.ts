import { Request, Response, NextFunction } from "express";

export default function validateTask(
    req: Request, 
    res: Response, 
    next: NextFunction
) {
    const {title, description, status, project_id, assigned_to} = req.body || {};

    //validate task id
    if (req.params.id !== undefined) {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                error: "Invalid task id"
            });
        }
    }

    //validate title
    if (title !== undefined && typeof title !== "string") {
        return res.status(400).json({
            error: "title must be a string"
        });
    }

    //validate description
    if (description !== undefined && typeof description !== "string") {
        return res.status(400).json({
            error:"description must be a string"
        });
    }

    //validate status
    if(status !== undefined && typeof status !== "string") {
        return res.status(400).json({
            error: "status must be a string"
        });
    }

    //validate project_id
    if (project_id !== undefined && typeof project_id !== "number") {
        return res.status(400).json({
            error: "project_id must be a number"
        });
    }

    //validate assigned_to
    if (assigned_to !== undefined && typeof assigned_to !== "number") {
        return res.status(400).json({
            error: "assigned_to must be a number"
        });
    }

    //POST needs title and project_id
    if (req.method === "POST") {
        if (title === undefined) {
            return res.status(400).json({
                error: "title is required"
            });
        }
        if (project_id === undefined) {
            return res.status(400).json({
                error: "project_id is required"
            });
        }
    }

    //PATCH needs a field to update
    if (req.method === "PATCH") {
        if (title === undefined && description === undefined && status === undefined && project_id === undefined && assigned_to === undefined) {
            return res.status(400).json({
                error: "Field required to update"
            });
        }
    }

    next();
}