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
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY(department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    FOREIGN KEY(role_id) REFERENCES role(id)
    -- manager_id INT,
    -- FOREIGN KEY(manager_id) REFERENCES -- THIS REFERS TO THE MANAGER OF THIS EMPLOYEE --
);
INSERT INTO department(name)
VALUES ("Sales");
INSERT INTO role (title,salary)
VALUES ("Lead",25.99);
INSERT INTO employee (first_name,last_name)
VALUES ("Matt","Boggs");