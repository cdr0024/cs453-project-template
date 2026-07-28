import { Router } from "express";
import {getUsers} from "../services/userService";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const router = Router();

router.get("/", authenticate, authorize("admin"), async (_req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch users"
        });
    }
});


export default router;