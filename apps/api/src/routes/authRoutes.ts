import { Router } from "express";
import {
    registerUser,
    loginUser
} from "../services/authService";
import authenticate from "../middleware/authenticate";

const router = Router();

router.get("/me", authenticate, (req, res) => {
    res.json({
        user: req.user
    });
});


//POST /auth/register
router.post ("/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({
            error: "name, email, and password  are required"
        });
    }


    try {
        const user = await registerUser({
            name, 
            email, 
            password
        });

        res.status(201).json(user);

    } catch (error: any) {
        console.error(error);

        //unique error
        if (error.code === "23505") {
            return res.status(400).json({
                error: "Email already exists"
            });
        }

        res.status(500).json({
            error: "failed to register user"
        });
    }
});


//POST /auth/login

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "email and password are required"
        });
    }


    try {
        const result = await loginUser(email, password);
        if (!result) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        res.json({
            token: result.token
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to login"
        });
    }
});

export default router;