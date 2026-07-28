import { pool } from "../db/pool"

interface Task {
    id: number;
    title: string,
    description?: string;
    status: string;
    project_id: number;
    assigned_to?: number;
}
 
export async function getTasks(): Promise<Task[]> {
    const result = await pool.query(
        `SELECT id, title, description, status, project_id, assigned_to
        FROM tasks
        ORDER BY id`
    );
    return result.rows;
}

export async function createTask(data: {
    title: string;
    description?: string;
    status?: string;
    project_id: number;
    assigned_to?: number;
}): Promise<Task> {
    const result = await pool.query(
        `INSERT INTO tasks (title, description, status, project_id, assigned_to)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, title, description, status, project_id, assigned_to`,
        [
            data.title,
            data.description ?? null,
            data.status ?? "todo",
            data.project_id,
            data.assigned_to ?? null
        ]
    );

    return result.rows[0];
}

export async function getTaskById(id: number): Promise<Task | undefined> {
    const results = await pool.query(
        `SELECT id, title, description, status, project_id, assigned_to
        FROM tasks
        WHERE id = $1`,
        [id]
    );

    return results.rows[0];

}

export async function updateTask(
    id: number,
    updates: {
        title?: string;
        description?: string;
        status?: string;
        project_id?: number;
        assigned_to?: number;
    }
): Promise<Task | undefined> {
    const existing = await getTaskById(id);
    if (!existing) {
        return undefined;
    }

    const result = await pool.query(
        `UPDATE tasks
        SET title = $1,
            description = $2,
            status = $3,
            project_id = $4,
            assigned_to = $5,
            updated_at = NOW()
        WHERE id = $6
        RETURNING id, title, description, status, project_id, assigned_to`,
        [
            updates.title ?? existing.title,
            updates.description ?? existing.description,
            updates.status ?? existing.status,
            updates.project_id ?? existing.project_id,
            updates.assigned_to ?? existing.assigned_to ?? null,
            id
        ]
    );
    return result.rows[0];
}


export async function deleteTask(id: number): Promise<boolean> {
    const result = await pool.query(
        `DELETE FROM tasks
        WHERE id = $1`,
        [id]
    );

    return result.rowCount === 1;
}

export async function getTaskOwner(
    id: number
): Promise<number | undefined> {
    const result = await pool.query(
        `SELECT projects.owner_id
        FROM tasks
        JOIN projects
        ON tasks.project_id = projects.id
        WHERE tasks.id = $1`,
        [id]
    );


    if (result.rows.length === 0) {
        return undefined;
    }

    return result.rows[0].owner_id;
}