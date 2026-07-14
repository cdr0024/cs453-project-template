# CS 453 Task Tracker API  
Description: An express API for managing tasks. It allows you to view, update, create and delete task using a PostgreSQL database  
Development: This project was developed in VS code on Windows 11  

This project covers Milestone 1, 2, and 3
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

The database contains the `tasks` table with:  
- id  
- title  
- description  
- status  
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

Creating test task
{ id: 4, title: 'Temporary API Client Test', status: 'todo' }

Getting all tasks...
[ { id: 4, title: 'Temporary API Client Test', status: 'todo' } ]

Getting task by ID...
{ id: 4, title: 'Temporary API Client Test', status: 'todo' }

Updating task...
{ id: 4, title: 'Temporary API Client Test', status: 'done' }

Deleting test task...
Before delete: 200
Delete status: 204

Client test complete  
```

---  

# Routes Table  

| Method | Route | Description |  
|---|---|---|  
| GET | `/health` | Checks if server is running  |  
| GET | `/tasks` | Returns all tasks |  
| POST | `/tasks` | Creates a new task |  
| GET | `/tasks/:id` | returns one task |  
| PATCH | `/tasks/:id` | Updates a task |  
| DELETE | `/tasks` | Deletes a task |  

---  

# Example task  

a task json looks like this:  
```json  
{
    "id": 1, 
    "title": "Complete CS 453 project", 
    "status": "todo"
}  
```  

# Example curl commands  

Ensure database setup has been completed and server is running before testing curl commands

## GET health  

```bash  
curl.exe http://localhost:3000/health  
```  

Response:  

```json  
{"status":"ok","service":"cs453-api"}  
```  

## Get all tasks  

this will return with empty brackets `[]` if running the database for the first time without creating tasks.

```bash  
curl.exe http://localhost:3000/tasks  
```  

Response:  

```json  
[{"id":1,"title":"Complete CS 453 Homework","status":"todo"}]  
```  

## Get task by id  

```bash  
curl.exe http://localhost:3000/tasks/1  
```  

Response:  

```json  
{"id":1,"title":"Complete CS 453 Homework","status":"todo"}  
```  

## Create a task  

The curl example below use Powershell syntax. I had to use --% to prevent powershell from modifying the JSON body

```bash  
curl.exe --% -X POST http://localhost:3000/tasks -H "Content-Type: application/json" --data-raw "{\"title\":\"Complete CS 453 Homework\",\"status\":\"todo\"}"  
```  

Response:  

```json  
{"id":1,"title":"Complete CS 453 Homework","status":"todo"}  
```  

## Update a task  

The curl example below use Powershell syntax. I had to use --% to prevent powershell from modifying the JSON body

```bash  
curl.exe --% -X PATCH http://localhost:3000/tasks/1 -H "Content-Type: application/json" --data-raw "{\"status\":\"done\"}"  
```  

Response:  

```json  
{"id":1,"title":"Complete CS 453 Homework","status":"done"}  
```  

## Delete a task  

```bash  
curl.exe -X DELETE http://localhost:3000/tasks/1  
```  

Response:  

```  
204 no content  
```
