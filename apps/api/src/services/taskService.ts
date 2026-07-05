import { pool } from "../db/pool"

interface Task {
    id: number;
    title: string,
    status: string;
}
 
export async function getTasks(): Promise<Task[]> {
    const result = await pool.query(
        `SELECT id, title, status
        FROM tasks
        ORDER BY id`
    );
    return result.rows;
}

export async function createTask(data: {
    title: string;
    status?: string;
}): Promise<Task> {
    const result = await pool.query(
        `INSERT INTO tasks (title, status)
        VALUES ($1, $2)
        RETURNING id, title, status`,
        [
            data.title,
            data.status ?? "todo"
        ]
    );

    return result.rows[0];
}

export async function getTaskById(id: number): Promise<Task | undefined> {
    const results = await pool.query(
        `SELECT id, title, status
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
        status?: string;
    }
): Promise<Task | undefined> {
    const existing = await getTaskById(id);
    if (!existing) {
        return undefined;
    }

    const result = await pool.query(
        `UPDATE tasks
        SET title = $1,
            status = $2
        WHERE id = $3
        RETURNING id, title, status`,
        [
            updates.title ?? existing.title,
            updates.status ?? existing.status,
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

    return result.rowCount == 1;
}