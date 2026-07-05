interface Task {
    id: number;
    title: string,
    status: string;
}

const tasks: Task[] = [];
let nextId = 1;

export function getTasks(): Task[] {
    return tasks;
}

export function createTask(data: {
    title: string;
    status?: string;
}): Task {
    const task: Task = {
        id: nextId++,
        title: data.title,
        status: data.status ?? "todo"
    };

    tasks.push(task);
    return task;
}