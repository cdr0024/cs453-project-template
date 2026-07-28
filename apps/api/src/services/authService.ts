import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool";
import { env } from "../config/env";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export async function registerUser(data: {
    name: string;
    email: string;
    password: string;
}): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 10);

    const result = await pool.query(
        `INSERT INTO users
        (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, role`,
        [
            data.name,
            data.email,
            passwordHash
        ]
    );
    return result.rows[0];
}


export async function loginUser(
    email: string,
    password: string
): Promise<{ token: string; user: User } | undefined> {

    const result = await pool.query(
        `SELECT id, name, email, password_hash, role
        FROM users
        WHERE email = $1`,
        [email]
    );

    const user = result.rows[0];

    if (!user) {
        return undefined;
    }

    const passwordMatches = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatches) {
        return undefined;
    }

    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email,
            role: user.role
        },
        env.jwtSecret,
        {
            expiresIn:"1h"
        }
    );


    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
}