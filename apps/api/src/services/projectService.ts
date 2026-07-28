import { pool } from "../db/pool";

interface Project {
    id: number;
    name: string;
    description?: string;
    owner_id: number;
}

export async function getProjects(
    userId: number,
    role:string
): Promise<Project[]> {

    let result;

    if (role === "admin") {
        result = await pool.query(
           `SELECT id, name, description, owner_id
            FROM projects
            ORDER BY id`
        );
    } else {
        result = await pool.query(
            `SELECT id, name, description, owner_id
            FROM projects
            WHERE owner_id = $1
            ORDER BY id`,
            [userId]
        );
    }

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
        `SELECT id, name, description, owner_id
        FROM projects
        WHERE id = $1`,
        [id]
    );

    return result.rows[0];
}

export async function updateProject(
    id: number,
    updates: {
        name?: string;
        description?: string;
    }
): Promise<Project | undefined> {
    const existing = await getProjectById(id);
    if (!existing) {
        return undefined;
    }


    const result = await pool.query(
        `UPDATE projects
        SET name = $1,
            description = $2
        WHERE id = $3
        RETURNING id, name, description, owner_id`,
        [
            updates.name ?? existing.name,
            updates.description ?? existing.description ?? null,
            id
        ]
    );
    return result.rows[0];
}


export async function deleteProject(
    id:number
): Promise<boolean> {
    const result = await pool.query(
        `DELETE FROM projects
        WHERE id = $1`,
        [id]
    );

    return result.rowCount === 1;
}


export async function getProjectOwner(
    id: number
): Promise<number | undefined> {
    const result = await pool.query(
        `SELECT owner_id
        FROM projects
        WHERE id = $1`,
        [id]
    );

    if (result.rows.length === 0) {
        return undefined;
    }

    return result.rows[0].owner_id;
}