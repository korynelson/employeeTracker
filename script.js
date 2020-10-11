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
        addDepartment();
      } else if (answer.intitial === 'Add Role') {
        addRole();
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

function addDepartment() {
  inquirer
    .prompt([{
      type: 'input',
      name: 'dept',
      message: 'What department do you want to add?',
    }])
    .then((answer) => {
      connection.query('INSERT INTO department SET ?', { name: answer.dept }, (err, res) => {
        if (err) throw err;
        anotherOne();
      });
    });
}

function addRole() {
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
    // query of departments
      connection.query('SELECT name FROM department', (err, res) => {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
        console.log(res[i].name);
        }
    });

    console.log()
    //answer.deptid string matching ==
    // if (answer.deptid == ) {
        
    // }
    //does answer.deptid exist in department table
    //if so, what is it's id# in department table
    //if not, create department in department table and record it's ID
    //whichever rusult you get should output the ID from department table
    
        connection.query("INSERT INTO role SET ?", {title:answer.title, salary:answer.salary, department_id:answer.deptid }, function(err, res) {
            if (err) throw err;
            anotherOne();
        }); 
    });
};
function addEmployee(){
  console.log(`3`);
};
function viewDepartment() {   
  connection.query("SELECT * FROM department",function (err, res) {
        if (err) throw err;
        console.table(res);
        anotherOne();
    });    
};
function viewRoles(){
    console.log(`5`);
};
function viewEmployees(){
    console.log(`6`);
};
function updateEmployee(){
    console.log(`7`);
};

function anotherOne(){
    inquirer
    .prompt([{
        type: "list",
        name: "anotherone",
        message:"Would you like to do something else?",
        choices: [
            "Yes",
            "No, I'm done",
        ]
    }])
    .then(answer => { 
        if (answer.anotherone === "Yes"){
            afterConnection();
        }
        if (answer.anotherone === "No, I'm done"){
            connection.end();
            return;
        }
    })
}