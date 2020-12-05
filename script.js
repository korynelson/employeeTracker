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
        addDepartmentQuestions(anotherOne);
      } else if (answer.intitial === 'Add Role') {
        addRoleQuestions(anotherOne);
      } else if (answer.intitial === 'Add Employee') {
        addEmployeeQuestions(anotherOne);
      } else if (answer.intitial === 'View Department') {
        viewDepartment(anotherOne);
      } else if (answer.intitial === 'View Roles') {
        viewRoles(anotherOne);
      } else if (answer.intitial === 'View Employees') {
        viewEmployees(anotherOne);
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

function addDepartmentQuestions(callback) {
  connection.query('SELECT * FROM department', (err, res) =>{
    console.log('Here are the departments already created\n');
    console.table(res);
    inquirer
      .prompt([{
        type: 'input',
        name: 'dept',
        message: 'What department do you want to add?',
      }])
      .then((answer) => {
        addDepartment(answer.dept, callback);
      });
  });
}

function addDepartment(dept, callback) {
  connection.query('INSERT INTO department SET ?', { name: dept }, (err, res) => {
    if (err) throw err;
    connection.query('SELECT * FROM department', (err, res) =>{
      console.log('Here is the updated department list\n');
      console.table(res);
      callback();
    });
  });
}

function addRoleQuestions(callback) {
  connection.query('SELECT name FROM department', (err1, res1) => {
    if (err1) throw err1;
    console.log('Here are the current departments\n');
    console.table(res1);

    connection.query('SELECT * FROM role', (err, res) => {
      if (err) throw err;
      console.log('Here are the current roles\n');
      console.table(res);
      inquirer
        .prompt([{
          type: 'input',
          name: 'name',
          message: 'What is the roles title?',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'What is the roles salary?',
        },
        {
          type: 'list',
          name: 'department',
          message: 'What department does this role belong to?',
          choices: res1,
        },
        ])
        .then((answer) => {
          connection.query(`SELECT id FROM department WHERE name="${answer.department}"`, (errDept, resID) => {
            if (errDept) throw errDept;
            console.log('Here is the updated roles list\n');
            console.log(resID[0].id);
            addRole(answer.name.toLowerCase(), answer.salary, resID[0].id, callback);
          });
        });
    });
  });
}

function addRole(name, money, deptid, callback) {
  connection.query('INSERT INTO role SET ?', { name: name, salary: money, department_id: deptid }, (err2) => {
    if (err2) throw err2;
    callback();
  });
}

function addEmployeeQuestions() {
  connection.query('SELECT name FROM role', (errRole, resRole) => {
    if (errRole) throw errRole;
    console.table(resRole);

    connection.query('SELECT * FROM employee', (errEmp, resEmp) => {
      if (errEmp) throw errEmp;
      console.log('Here are the current employees\n');
      console.table(resEmp);
      inquirer
        .prompt([{
          type: 'input',
          name: 'firstname',
          message: 'What is the employees first name?',
        },
        {
          type: 'input',
          name: 'lastname',
          message: 'What is the employees last name?',
        },
        {
          type: 'list',
          name: 'role',
          message: 'What is the employees role id?',
          choices: resRole,
        },
        {
          type: 'input',
          name: 'manager',
          message: 'What is this employees manager ID?',
        },
        ]).then((answer) => {
          connection.query(`SELECT id FROM role WHERE name="${answer.role}"`, (err, resID) => {
            if (err) throw err;
            console.log('Here is the updated roles list\n');
            console.log(resID[0].id);
            addEmployee(
              answer.firstname.toLowerCase(),
              answer.lastname.toLowerCase(),
              resID[0].id,
              answer.manager,
            );
          });
        });
    });
  });
}

function addEmployee(firstname, lastname, roleID, manager) {
  connection.query('INSERT INTO employee SET ?', { first_name: firstname, last_name: lastname, role_id: roleID, manager_id: manager}, (err2) => {
    if (err2) throw err2;
  });
}

function viewDepartment(callback) {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.log('Here are the current departments\n');
    console.log(res);
    callback();
  });
}

function viewRoles(callback) {
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
    console.log('Here are the current roles\n');
    console.table(res);
    callback();
  });
}

function viewEmployees(callback) {
  connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;
    console.log('Here are the current employees\n');
    console.table(res);
    callback();
  });
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
