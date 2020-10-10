const inquirer = require ('inquirer');
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "employeetracker"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
  });



//initial prompt
function afterConnection(){
    inquirer
    .prompt([{
        type: "list",
        name: "intitial",
        message:"What would you like to do?",
        choices: [
            "Add Department",
            "Add Role",
            "Add Employee",
            "View Department",
            "View Roles",
            "View Employees",
            "Update Employee Roles",
            "LEAVE!!!!!!"
        ]
    }])
    .then(answer => {        
        if (answer.intitial === "Add Department"){
            addDepartment();
        }
        else if (answer.intitial === "Add Role"){
            addRole();
        }
        else if (answer.intitial === "Add Employee"){
            addEmployee();
        }
        else if (answer.intitial === "View Department"){
            viewDepartment();
        }
        else if (answer.intitial === "View Roles"){
            viewRoles();
        }
        else if (answer.intitial === "View Employees"){
            viewEmployees();
        }
        else if (answer.intitial === "Update Employee Roles"){
            updateEmployee();
        }
        else if (answer.intitial === "LEAVE!!!!!!"){
            connection.end();
            return;
        }
        else{
            console.log(`You need to pick`);
            connection.end();
            return;
        }
    })
}

function addDepartment(){
    inquirer
    .prompt([{
        type: "input",
        name: "dept",
        message:"What department do you want to add?",
    }])
    .then(answer => {        
            connection.query("INSERT INTO department SET ?", {name:answer.dept}, function(err, res) {
                if (err) throw err;
                anotherOne();
            }); 
        });
};

function addRole(){
    inquirer
    .prompt([{
        type: "input",
        name: "title",
        message:"What is the role's title?",
    },
    {
        type: "input",
        name: "salary",
        message:"What is the role's salary?",
    },
    {
        type: "input",
        name: "deptid",
        message:"What department does the role belong to?",
    },
])
    .then(answer => { 
        //query of departments
        localDept = connection.query("SELECT * FROM department")
        console.log(localDept)
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
function viewDepartment(){   
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
        console.log(res[i].id + " | " + res[i].name);
        }
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