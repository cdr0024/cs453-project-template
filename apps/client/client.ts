const API_BASE_URL = "http://localhost:3000";

interface LoginResponse {
    token: string
}

interface Project {
    id: number;
    name: string;
    description?: string;
}

interface Task {
    id: number;
    title: string;
    status: string;
    project_id: number;

}

async function runClient(): Promise<void> {

    let token = "";

    console.log("Checking health...");
    let response = await fetch(`${API_BASE_URL}/health`);
    let data = await response.json();
    console.log(data);

    console.log("\nRegistering test user...");
    response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: "Client User",
            email: "client@test.com",
            password: "password123"
        })
    });

    data = await response.json();
    console.log(data);

    console.log("\nTesting invalid login...");
    response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: "client@test.com",
            password: "wrongpassword"
        })
    });

    data = await response.json()
    console.log(data)

    console.log("\nLogging in...");
    response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: "client@test.com",
            password: "password123"
        })
    });

    const login: LoginResponse = await response.json();
    console.log(login);

    console.log("\nTesting protected route without token.. ");
    response = await fetch(`${API_BASE_URL}/tasks`);
    console.log(response.status);
    data = await response.json();
    console.log(data);

    token = login.token;

    console.log("\nGetting current user...");
    response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    data = await response.json();
    console.log(data);

    console.log("\nTesting admin route for normal user...");
    response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    console.log(response.status);
    data = await response.json();
    console.log(data);

    console.log("\nCreating project...");
    response = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            name: "Client Project",
            description: "Created from client.ts"
        })
    });

    const project: Project = await response.json();
    console.log(project);

    const projectId = project.id;

    console.log("\nGetting project by ID...");
    response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    data = await response.json();
    console.log(data);

    console.log("\nUpdating project...");
    response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            name: "Updated Client Project"
        })
    });
    data = await response.json();
    console.log(data);

    console.log("\nGetting all projects...");
    response = await fetch(`${API_BASE_URL}/projects`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    data = await response.json();
    console.log(data);

    console.log("\nCreating test task");
    response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            title: "Temporary API Client Test",
            project_id: projectId
        })
    });

    const newTask: Task = await response.json();
    console.log(newTask);
    const taskId = newTask.id;

    console.log("\nGetting all tasks...");

    response = await fetch(`${API_BASE_URL}/tasks`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    data = await response.json();
    console.log(data);

    console.log("\nGetting task by ID...");
    response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    data = await response.json();
    console.log(data);

    console.log("\nUpdating task...");

    response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            status: "done"
        })
    });

    data = await response.json();
    console.log(data);

    console.log("\nDeleting test task...");
    response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    console.log("Delete status:", response.status);

    console.log("\nGetting tasks after delete...");
    response = await fetch(`${API_BASE_URL}/tasks`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    data = await response.json();
    console.log(data);

    console.log("\nDeleting project...");
    response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    console.log("Delete status:", response.status)

    console.log("\nGetting deleted project...");
    response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    console.log(response.status);
    data = await response.json();
    console.log(data);

    console.log("\nClient test complete");
    
}

runClient().catch((error: Error) => {
    console.error("Client error:", error.message);
});