# CS 453 Task Tracker API  
Description: A small multi user express API for managing tasks and projects. It allows user registration and login, protects API routes using JSON Web Tokens, and enforces basic authorization rules. It allows users to view, update, create and delete tasks and projects using a PostgreSQL database.  

Development: This project was developed in VS code on Windows 11  

This project covers Milestone 4, 5, and 6  
Previous milestones covered are 1, 2, and 3
---  

# Install  
In the `apps/api` folder install npm:  
```bash  
npm install  
```  

This project uses:  
- Express for the API  
- PostgreSQL for database  
- Typescript  
- Vitest  

---  

# Database Setup  
The API uses PostgreSQL, start PostgreSQL using Docker:  

```bash  
docker compose up -d  
```  

The database tables can be created with:  

```bash  
psql -U postgres -d cs453 -f database/schema.sql 
```  

The database contains the `tasks`, `projects`, and `users` tables with:  
- users  
  - id  
  - name  
  - email  
  - password_hash  
  - role  
  - created_at  

- projects  
  - id  
  - name  
  - description  
  - owner_id  
  - created_at  

- tasks   
  - id  
  - title  
  - description  
  - status  
  - project_id  
  - assigned_to  
  - created_at  
  - updated_at  

---  

# Running the server  

In the `apps/api` run:  
```bash  
npm run dev  
```  

The server runs on:  
```  
http://localhost:3000  
```  

---  

# Testing  

Command to run test file after starting server/database:  

```bash  
npm test  
```  

To run the test client file start the server, go to apps/client and run:  

```bash  
node client.ts  
```  

Response:  

```bash  
Checking health...
{ status: 'ok', service: 'cs453-api' }

Registering test user...
{ id: 1, name: 'Client User', email: 'client@test.com', role: 'user' }

Testing invalid login...
{ error: 'Invalid email or password' }

Logging in...
{
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiY2xpZW50QHRlc3QuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3ODUzMzc5ODIsImV4cCI6MTc4NTM0MTU4Mn0.5OMdxIBz1gCLm6UBelm7msrfncMhzE4qdy7M9O2zAtc'
}

Testing protected route without token.. 
401
{ error: 'Authentication required' }

Getting current user...
{ user: { userId: 1, email: 'client@test.com', role: 'user' } }

Testing admin route for normal user...
403
{ error: 'You do not have permission to perform this action' }

Creating project...
{
  id: 3,
  name: 'Client Project',
  description: 'Created from client.ts',
  owner_id: 1
}

Getting project by ID...
{
  id: 3,
  name: 'Client Project',
  description: 'Created from client.ts',
  owner_id: 1
}

Updating project...
{
  id: 3,
  name: 'Updated Client Project',
  description: 'Created from client.ts',
  owner_id: 1
}

Getting all projects...
[
  {
    id: 1,
    name: 'Client Project',
    description: 'Created from client.ts',
    owner_id: 1
  },
  {
    id: 3,
    name: 'Updated Client Project',
    description: 'Created from client.ts',
    owner_id: 1
  }
]

Creating test task
{
  id: 3,
  title: 'Temporary API Client Test',
  description: null,
  status: 'todo',
  project_id: 3,
  assigned_to: null
}

Getting all tasks...
[
  {
    id: 3,
    title: 'Temporary API Client Test',
    description: null,
    status: 'todo',
    project_id: 3,
    assigned_to: null
  }
]

Getting task by ID...
{
  id: 3,
  title: 'Temporary API Client Test',
  description: null,
  status: 'todo',
  project_id: 3,
  assigned_to: null
}

Updating task...
{
  id: 3,
  title: 'Temporary API Client Test',
  description: null,
  status: 'done',
  project_id: 3,
  assigned_to: null
}

Deleting test task...
Delete status: 204

Getting tasks after delete...
[]

Deleting project...
Delete status: 204

Getting deleted project...
404
{ error: 'Project not found' }

Client test complete
```
---  
# Authentication  

Most endpoints reuire a JWT  

To Register a User:  
```bash  
POST /auth/register  
```  

Login:  
```bash  
POST /auth/login  
```  

The login return a JWT. Then include the token in future requests:  
```bash  
Authorization: Bearer <token>  
```
---  

# Routes Table  

| Method | Route | Description |  
|---|---|---|  
| GET | `/health` | Checks if server is running  |  
| POST | `/auth/register` | Register a new user |  
| POST | `/auth/login` | Login and receive JWT |  
| GET | `auth/me ` | Return the authenticated user |  
| GET | `/users` | List users (admin only) |  
| GET | `/projects` | list user's projects |  
| POST | `/projects` | create a project |  
| GET | `/projects/:id` | Get a project |  
| PATCH | `/project/:id` | Update a project |  
| DELETE | `/projects/:id` | Delete a project |    
| GET | `/tasks` | Returns all tasks |  
| POST | `/tasks` | Creates a new task |  
| GET | `/tasks/:id` | returns one task |  
| PATCH | `/tasks/:id` | Updates a task |  
| DELETE | `/tasks/:id` | Deletes a task |  

---  

# Example task  

a task json looks like this:  
```json  
{
    "id": 1, 
    "title": "Complete CS 453 project",
    "description": "Finish milestone 3", 
    "status": "todo",
    "project_id": 1,
    "assigned_to": null
}  
```  

---  

# Example Project  

a project json looks like this:  
```json  
{
    "id": 1,
    "name": "CS453 Project",
    "description": "Task API",
    "owner_id": 1
}  
```  

---  

# Example user  

a user json looks like this:  
```json  
{
    "id": 1,  
    "name": "John Smith",  
    "email": "john@example.com",  
    "role": "user"
}  
```  

---

# Example curl commands  

Ensure database setup has been completed and server is running before testing curl commands  
The curl examples below use Powershell syntax. 

## GET health  

Command:

```bash  
curl.exe http://localhost:3000/health  
```  

Response:  

```json  
{"status":"ok","service":"cs453-api"}  
```  

## Register a User  

Command:

```bash  
curl.exe --% -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" --data-raw "{\"name\":\"John Smith\",\"email\":\"john@test.com\",\"password\":\"password123\"}" 
```  

Response:  

```json 
{
  "id": 1,
  "name": "John Smith",
  "email": "john@test.com",
  "role": "user"
}
```  

## Login  

Command:

```bash  
curl.exe --% -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" --data-raw "{\"email\":\"john@test.com\",\"password\":\"password123\"}"
```  

Response:  

```json  
{"token":"<jwt token>"}
```   

## Get current user  

Command:

```bash  
curl.exe http://localhost:3000/auth/me -H "Authorization: Bearer <jwt token>"
```  

Response:  

```json  
{
  "user": {
    "userId": 1,
    "email": "john@test.com",
    "role": "user"
  }
}
```  

## Create a Project  

Command:

```bash  
curl.exe --% -X POST http://localhost:3000/projects -H "Authorization: Bearer <jwt token>" -H "Content-Type: application/json" --data-raw "{\"name\":\"CS453 Project\",\"description\":\"Semester project\"}"
```  

Response:  

```json  
{
  "id": 1,
  "name": "CS453 Project",
  "description": "Semester project",
  "owner_id": 1
}
```  

## Get all projects  

Command:

```bash  
curl.exe http://localhost:3000/projects -H "Authorization: Bearer <jwt token>"
```  

Response:  
```json  
[{"id": 1,"name": "CS453 Project","description": "Semester project","owner_id": 1}]
```  

## Get project by ID  

Command:

```bash  
curl.exe http://localhost:3000/projects/1 -H "Authorization: Bearer <jwt token>"
```  

Response:  

```json  
{
  "id": 1,
  "name": "CS453 Project",
  "description": "Semester project",
  "owner_id": 1
}
```  

## Update a project  

Command:

```bash  
curl.exe --% -X PATCH http://localhost:3000/projects/1 -H "Authorization: Bearer <jwt token>" -H "Content-Type: application/json" --data-raw "{\"name\":\"Updated Project\"}"
```  

Response:  
```json  
{
  "id": 1,
  "name": "Updated Project",
  "description": "Semester project",
  "owner_id": 1
}
```

## Get all tasks  

Command:

```bash  
curl.exe http://localhost:3000/tasks -H "Authorization: Bearer <jwt token>"
```  

Response:  

```json  
[
  {
    "id": 1,
    "title": "Complete README",
    "description": null,
    "status": "todo",
    "project_id": 1,
    "assigned_to": null
  }
] 
```  

## Get task by id  

Command:

```bash  
curl.exe http://localhost:3000/tasks/1 -H "Authorization: Bearer <jwt token>"
```  

Response:  

```json  
{
  "id": 1,
  "title": "Complete README",
  "description": null,
  "status": "todo",
  "project_id": 1,
  "assigned_to": null
}
```  

## Create a task  

Command:

```bash  
curl.exe --% -X POST http://localhost:3000/tasks -H "Authorization: Bearer <jwt token>" -H "Content-Type: application/json" --data-raw "{\"title\":\"Complete README\",\"project_id\":1}"
```  

Response:  

```json  
{
  "id": 1,
  "title": "Complete README",
  "description": null,
  "status": "todo",
  "project_id": 1,
  "assigned_to": null
}
```  

## Update a task  

Command:

```bash  
curl.exe --% -X PATCH http://localhost:3000/tasks/1 -H "Authorization: Bearer <jwt token>" -H "Content-Type: application/json" --data-raw "{\"status\":\"done\"}"
```  

Response:  

```json  
{
  "id": 1,
  "title": "Complete README",
  "description": null,
  "status": "done",
  "project_id": 1,
  "assigned_to": null
} 
```  

## Delete a task  

Command:

```bash  
curl.exe -X DELETE http://localhost:3000/tasks/1 -H "Authorization: Bearer <jwt token>"
```  

Response:  

```  
204 no content  
```  

## Delete a project  

Command:

```bash 
curl.exe -X DELETE http://localhost:3000/projects/1 -H "Authorization: Bearer <jwt token>" 
```  

Response:  

```  
204 No content  
```
