 # Answers to reflection questions  

 ---  

 ## Checkpoint 1 questions  

 ### 1.) What is the difference between an in-memory API and a database-backed API?  

 An in-memory API only stores information temporarily, so the data will restart to whatever it was originally set to everytime the server is restarted. A database-backed API saves data, aloowing it to persist even when the server is restarted.

 ### 2.) Why is it useful to separate routes, services, and database logic?  

 It is useful to seperate routes, services and database logic because it makes the code more organized and easier to read. It also makes it easier to update and improve the code. Lastly, it makes it easier for a group to work on seperate parts of the same project without interferring with others code.

 ### 3.) What HTTP status codes did you use, and why?  

 I used 200 for successful requests, 201 for creating a task successfully, 204 for deleting a task successfully, 400 for bad input , 404 for when something was not found and 500 for internal server errors. 

 ### 4.) What happens when a client requests a task ID that does not exist?  
 The API will check for the ID that was provied and when it does not find it, it ill return a 404 status code and a message saying the task was not found.

 ### 5.) What was the hardest part of connecting the API to PostgreSQL?  

 The hardest part was setting up the database connection and tables. It took sometime getting use to the workflow of it all and making sure everything was correctly initialized so that I was able to test my code.  

 ---  

 ## Checkpoint 2 questions  

### 1.) What is the difference between authentication and authorization?  

Authentication verifies who the user is while authorization checks what a user is allowed to do based on their role.  

### 2.) Why should passwords be hashed instead of stored directly?  

Passwords should be hashed instead of stored directly in the database so that if it gets exposed, attackers cannot easily get the users' real passwords. It improves the security hashing them.  

### 3.) What information did you include in your JWT, and why?  
  
The JWT includes details to identify the user including id and email, and then the role for authorization checks.  

### 4.) What is the difference between a 401 response and a 403 response?  

A 401 response indicates that there was no token providede or that it was invalid. A 403 response signals that a logged in user is trying to perform a action they are not authorized for.  

### 5.) Where does your application perform role or ownership checks?  

Authorization middleware checks for roles while ownership checks happen within routes to prevent users from editing other users resources.  

### 6.) How are users, projects, and tasks related in your database?  

Users own projects and tasks. Projects can contain multiple tasks. Projects and tasks have ids in their tables to tie them to the appropiate owners/connections.  

### 7.) What was the hardest part of adding authentication or authorization?  

I think the hardest part of adding authentication and authorization was connecting it all and keeping track of where to add it in or where it may be missing. I felt a lot of back and forth of feeling like I had covered what I needed to just to realize through testing I was still missing covering a route. So it was tough ensuring the routes and tests had all the needed tokens and that they handled permissions correctly.  

---