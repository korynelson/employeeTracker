const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'employeetracker',
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  afterConnection();
});
// Define functions

// initial prompt
function afterConnection() {
  inquirer.prompt([{
    type: 'list',
    name: 'intitial',
    message: 'What would you like to do?',
    choices: [
      'Add Department',
      'Add Role',
      'Add Employee',
      'View Department',
      'View Roles',
      'View Employees',
      'Update Employee Roles',
      'LEAVE!!!!!!',
    ],
  }])
    .then(answer => {
      if (answer.intitial === 'Add Department') {
        addDepartmentQuestions();
      } else if (answer.intitial === 'Add Role') {
        addRoleQuestions();
      } else if (answer.intitial === 'Add Employee') {
        addEmployee();
      } else if (answer.intitial === 'View Department') {
        viewDepartment();
      } else if (answer.intitial === 'View Roles') {
        viewRoles();
      } else if (answer.intitial === 'View Employees') {
        viewEmployees();
      } else if (answer.intitial === 'Update Employee Roles') {
        updateEmployee();
      } else if (answer.intitial === 'LEAVE!!!!!!') {
        connection.end();
      } else{
        console.log('You need to pick');
        connection.end();
      }
    });
}

function addDepartmentQuestions() {
  inquirer
    .prompt([{
      type: 'input',
      name: 'dept',
      message: 'What department do you want to add?',
    }])
    .then((answer) => {
      addDepartment(answer.dept);
    });
}

function addDepartment(dept) {
  connection.query(`SELECT * FROM department WHERE name = "${dept}"`, (err, res) => {
    if (err) throw err;
    else if (res.length === 0){
      connection.query('INSERT INTO department SET ?', { name: dept }, (err, res) => {
        if (err) throw err;
        return res.insertId;
      });
    }
    else if (res.length > 0){
      console.log('That department already exists.');
      anotherOne();
    }else{
      console.log('Something went wrong');
      anotherOne();
    }
  });
}

function addRoleQuestions() {
  inquirer
    .prompt([{
      type: 'input',
      name: 'title',
      message: 'What is the roles title?',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the roles salary?',
    },
    {
      type: 'input',
      name: 'deptid',
      message: 'What department does the role belong to?',
    },
    ])
    .then((answer) => {
    // Search for any exisiting department with the same name
      connection.query(`SELECT * FROM department WHERE name = "${answer.deptid}"`, (err, res) => {
        if (err) throw err;
        // if department "undefined" then we should make a new one!!!!
        if (res.length === 0) {
          console.log('That department doesnt exist yet - creating it now...');
          let index = addDepartment(answer.deptid.toLowerCase());
          addRole(answer.title.toLowerCase(), answer.salary, index);
          anotherOne();
          // if department is already defined then we create the role with response id
        } else if (res.length > 0) {
          const resId = res[0].id;
          console.log('made it');
          addRole(answer.title.toLowerCase(), answer.salary, resId);
          anotherOne();
          // Handle other cases
        } else{
          console.log('error - enter a correct department')
          anotherOne();
        }
      });
    });
}

function addRole(name, money, deptid) {
  connection.query('INSERT INTO role SET ?', { title: name, salary: money, department_id: deptid }, (err2) => {
    if (err2) throw err2;
  });
}

function addEmployee() {
}

function viewDepartment() {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.table(res);
    anotherOne();
  });
}

function viewRoles() {
}

function viewEmployees() {
}

function updateEmployee() {
}

function anotherOne() {
  inquirer
    .prompt([{
      type: 'list',
      name: 'anotherone',
      message: 'Would you like to do something else?',
      choices: [
        'Yes',
        'No, Im done',
      ],
    }])
    .then((answer) => {
      if (answer.anotherone === 'Yes') {
        afterConnection();
      }
      if (answer.anotherone === 'No, Im done') {
        connection.end();
      }
    });
}
