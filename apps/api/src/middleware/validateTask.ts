import { Request, Response, NextFunction } from "express";

export default function validateTask(
    req: Request, 
    res: Response, 
    next: NextFunction
) {
    const {title, status} = req.body || {};

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

    //validate status
    if(status !== undefined && typeof status !== "string") {
        return res.status(400).json({
            error: "status must be a string"
        });
    }

    //POST needs title
    if (req.method === "POST") {
        if (title === undefined) {
            return res.status(400).json({
                error: "title is required"
            });
        }
    }

    //PATCH needs a field to update
    if (req.method === "PATCH") {
        if (title === undefined && status === undefined) {
            return res.status(400).json({
                error: "Field required to update"
            });
        }
    }

    next();
}