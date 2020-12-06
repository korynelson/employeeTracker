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
        updateEmployee(anotherOne);
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
      callback();
    });
  });
}

function addRoleQuestions(callback) {
  connection.query('SELECT name FROM department', (err1, res1) => {
    if (err1) throw err1;

    connection.query('SELECT * FROM role', (err, res) => {
      if (err) throw err;
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

function addEmployeeQuestions(callback) {
  connection.query('SELECT name FROM role', (errRole, resRole) => {
    if (errRole) throw errRole;
    connection.query('SELECT * FROM employee', (errEmp, resEmp) => {
      if (errEmp) throw errEmp;
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
            addEmployee(
              answer.firstname.toLowerCase(),
              answer.lastname.toLowerCase(),
              resID[0].id,
              answer.manager,
              callback,
            );
          });
        });
    });
  });
}

function addEmployee(firstname, lastname, roleID, manager, callback) {
  connection.query('INSERT INTO employee SET ?', { firstname: firstname, lastname: lastname, role_id: roleID, manager_id: manager}, (err2) => {
    if (err2) throw err2;
  });
  callback();
}

function viewDepartment(callback) {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.log('Here are the current departments\n');
    console.table(res);
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

function updateEmployee(callback) {
  console.log("update");
  connection.query('SELECT firstname FROM employee', (err, res) => {
    if (err) {
      console.log(err);
    }else {
      const names = [];
      const RES = JSON.parse(JSON.stringify(res));
      RES.forEach((name) => {
        names.push(name.firstname);
      });
      connection.query('SELECT * FROM employee', (errEmp, resEmp) => {
        if (errEmp) throw errEmp;
        console.table(resEmp)
        connection.query('SELECT name FROM role', (errRol, resRol) => {
          if (errRol) throw errRol;
          const roles = [];
          const RESROL = JSON.parse(JSON.stringify(resRol));
          RESROL.forEach((role) => {
            roles.push(role.name);
          });
          inquirer
            .prompt([
              {
                type: 'list',
                name: 'employeenames',
                message: 'What employee would you like to update?',
                choices: names,
              },
              {
                type: 'list',
                name: 'employeerole',
                message: 'What is their new role?',
                choices: roles,
              },
            ])
            .then((answer) => {
              connection.query(`SELECT id FROM role WHERE name = "${answer.employeerole}" `, (errRol2, resRol2) => {
                if (errRol2) throw errRol2;
                connection.query(`UPDATE employee SET role_id= "${resRol2[0].id}" WHERE firstname = "${answer.employeenames}" `, (errSet, resSet) => {
                  if (errSet) throw errSet;
                });
              });
              callback();
            });
        });
      });
    }
  });
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
