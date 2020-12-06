-- Drops the videolist if it exists currently --
DROP DATABASE IF EXISTS employeeTracker;
-- Creates the "videolist" database --
CREATE DATABASE employeeTracker;

USE employeeTracker;

CREATE TABLE department(
	id INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
) ;

CREATE TABLE role(
	id INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER,
    PRIMARY KEY (id)
);

CREATE TABLE employee(
    id INTEGER NOT NULL AUTO_INCREMENT,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    PRIMARY KEY (id) 
);


INSERT INTO department (name) values ('Human Resources');
INSERT INTO department (name) values ('Engineering');
INSERT INTO role (name, salary, department_id) values ('Engineer', 75000, 1);  
INSERT INTO role (name, salary, department_id) values ('Manager', 90000, 1 ); 
INSERT INTO employee (firstname, lastname, role_id, manager_id) values ('Kory', 'Nelson', 1, 1 );  

