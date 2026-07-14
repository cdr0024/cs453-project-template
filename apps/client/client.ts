const API_BASE_URL = "http://localhost:3000";

interface Task {
    id: number;
    title: string;
    status: string;

}

async function runClient(): Promise<void> {

    console.log("Checking health...");
    let response = await fetch(`${API_BASE_URL}/health`);
    let data = await response.json();
    console.log(data);

    console.log("\nCreating test task");
    response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: "Temporary API Client Test",
            status: "todo"
        })
    });

    const newTask: Task = await response.json();
    console.log(newTask);
    const taskId = newTask.id;

    console.log("\nGetting all tasks...");

    response = await fetch(`${API_BASE_URL}/tasks`);
    data = await response.json();
    console.log(data);

    console.log("\nGetting task by ID...");
    response = await fetch(`${API_BASE_URL}/tasks/${taskId}`);
    data = await response.json();
    console.log(data);

    console.log("\nUpdating task...");

    response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: "done"
        })
    });

    data = await response.json();
    console.log(data);

    console.log("\nDeleting test task...");
    response = await fetch(`${API_BASE_URL}/tasks/${taskId}`);
    console.log("Before delete:", response.status);

    response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "DELETE"
    });

    console.log("Delete status:", response.status);
    console.log("\nClient test complete");

    
}

runClient().catch((error: Error) => {
    console.error("Client error:", error.message);
});