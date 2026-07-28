import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";


interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
        role: string;
    };
}

export default function authenticate(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const authorization = req.get("authorization");


    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Authentication required"
        });
    }

    const token = authorization.substring("Bearer ".length);


    try {
        const user = jwt.verify(token, env.jwtSecret);
        if (typeof user === "string") {
            return res.status(401).json({
                error: "Invalid token"
            });
        }

        req.user = {
            userId: user.userId,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        return res.status(401).json({
            error: "Authentication required"
        });
    }
}