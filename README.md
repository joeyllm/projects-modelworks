Text to SQL microservice

current implimentation uses a mock database

![image info](sql_database_setup\SQL-Sample-Database-Schema.png)

this repository requires you to add an .env file to the root directory containing an OpenAI API key in the following format

```API_KEY="XXX-XXX"```

in the root directory run the following commands:

```$ py -m venv .venv```

```$ .venv/Scipts/activate```

```$ pip install requirements.txt ```

```$ py -m api_handler```

inorder to launch an API end point at the address http://127.0.0.1:8000

to experiment with the ai: 
- visit http://127.0.0.1:8000/docs 
- open the dropdown section under post
- click "try it out" next to parameters
- set the "string" part of the response body to your message
- click execute

Example Queries:
- "people who are programmers"
- "Canadian programmers"
- "people with salaries over 10000"