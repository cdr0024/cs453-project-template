import { Request, Response, NextFunction } from "express";


export default function authorize(...roles: string[]) {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        if (!req.user) {
            return res.status(401).json({
                error: "Authentication required"
            });
        }


        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: "You do not have permission to perform this action"
            });
        }

        next();
    };
}