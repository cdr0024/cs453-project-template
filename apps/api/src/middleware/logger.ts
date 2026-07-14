import { Request, Response } from "express";
import type { NextFunction } from "express";


export default function logger(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const startTime = Date.now();

    res.on("finish", () => {
        const timeTaken = Date.now() - startTime;

        console.log(
            `${req.method} ${req.path} ${res.statusCode} - ${timeTaken}ms`
        );
    });
    next();
}