interface Task {
    id: number;
    title: string,
    status: string;
}

const tasks: Task[] = [];
let nextId = 1;

export function resetTasks(): void {
    tasks.length =0;
    nextId = 1;
}

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

export function getTaskById(id: number) {
    return tasks.find(task => task.id === id);

}

export function updateTask(
    id: number,
    updates: {
        title?: string;
        status?: string;
    }
) {
    const task = tasks.find(task => task.id === id);
    if (!task) {
        return undefined;
    }

    if (updates.title != undefined){
        task.title = updates.title;

    }
    if (updates.status !== undefined) {
        task.status = updates.status;
    }

    return task;
}


export function deleteTask(id: number) {
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
        return false;
    }

    tasks.splice(index, 1);
    return true;
}