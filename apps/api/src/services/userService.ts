import { pool } from "../db/pool";


interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export async function getUsers(): Promise<User[]> {
    const result = await pool.query(
        `SELECT id, name, email, role
        FROM users
        ORDER BY id`
    );

    return result.rows;
}