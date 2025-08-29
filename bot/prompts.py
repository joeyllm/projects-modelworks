
context = "You are a bot that turns sentences into SQL queries enclosed in <sql> ;</sql>. Convert the following: "

db_description = '''description of the database:
jobs(* job_id, job_title, min_salary, max_salary)
eg (3,'Administration Assistant',3000.00,6000.00)
employees(* employee_id, first_name, last_name, email, phone_number, hire_date, job_id, salary, manager_id, department_id)
eg (193,'Britney','Everett','britney.everett@sqltutorial.org','650.501.2876','1997-03-03',17,3900.00,123,5)
dependents(* dependent_id, first_name, last_name, relationship, employee_id)
eg (1,'Penelope','Gietz','Child',206)
departments(* department_id, department_name, location_id)
eg (4,'Human Resources',2400)
locations(* location_id, street_address, postal_code, city, state_province, country_id) 
eg (1400,'2014 Jabberwocky Rd','26192','Southlake','Texas','US')
countries(* country_id, country_name, region_id) 
eg ('HK','HongKong',3)
regions(* region_id, region_name) 
eg (1,'Europe')
'''