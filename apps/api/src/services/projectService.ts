import { pool } from "../db/pool";

interface Project {
    id: number;
    name: string;
    description?: string;
    owner_id: number;
}

export async function getProjects(): Promise<Project[]> {
    const result = await pool.query(
        `SELECT id, name, description, owner_id
         FROM projects
         ORDER BY id`
    );

    return result.rows;
}

export async function createProject(data: {
    name: string;
    description?: string;
    owner_id: number;
}): Promise<Project> {
    const result = await pool.query(
        `INSERT INTO projects (name, description, owner_id)
        VALUES ($1, $2, $3)
        RETURNING id, name, description, owner_id`,
        [
            data.name,
            data.description ?? null,
            data.owner_id
        ]
    );
    return result.rows[0];
}

export async function getProjectById(
    id: number
): Promise<Project | undefined> {
    const result = await pool.query(
        `SLECT id, name, description, owner_id
        FROM projects
        WHERE id = $1`,
        [id]
    );

    return result.rows[0];
}