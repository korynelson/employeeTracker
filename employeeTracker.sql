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
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER,
    PRIMARY KEY (id)
);

CREATE TABLE employee(
    id INTEGER NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    PRIMARY KEY (id)
);


--test data --
INSERT INTO department (name) values ('Human');
INSERT INTO department (name) values ('Brainstorming');
INSERT INTO role (title, salary) values ('Thinker', 5 );  
INSERT INTO role (title, salary) values ('brain', 7 );  
