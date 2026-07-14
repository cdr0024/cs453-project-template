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