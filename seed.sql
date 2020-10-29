DROP DATABASE IF EXISTS teamDB;
CREATE DATABASE teamDB;
USE teamDB;

CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30)
);

CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL(10,2),
    department_id INT NOT NULL,
    FOREIGN KEY(department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NULL,
    FOREIGN KEY(role_id) REFERENCES role(id),
    manager_id INT,
    FOREIGN KEY(manager_id) REFERENCES employee(id)
);
INSERT INTO department(name)
VALUES ("Sales"),("Legal"),("Accounting");
INSERT INTO role (title,salary,department_id)
VALUES ("Sales manager",25.99,1),("Legal manager",25.99,2),("Accounting manager",25.99,3),
("Salesperson",18.50,1),("lawyer",28.00,2),("Accountant",23.50,3);
INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Matt","Boggs",1,NULL),("Jim","West",2,NULL),("Rose","Dawson",3,NULL),
("Sally","Field",4,1),("Mike","Soft",5,2),("Tony","Danza",6,3);

-- Dep id: sales,1/legal,2/accounting,3  ||  role id: manager,1-3/salesperson,4/lawyer,5/accountant,6

SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title, 
    manager.first_name AS manager_first, 
    manager.last_name AS manager_last, 
    role.salary, 
    department.name AS department 
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id 
    LEFT JOIN employee manager ON manager.id = employee.manager_id
