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
            "Update Employee Roles"
        ]
    }])
    .then(answer => {        
        console.log(`Hello Friend`)
        if (answer.intitial === "Add Department"){
            addDepartment();
            connection.end();
            return;

        }
        else if (answer.intitial === "Add Role"){
            addRole();
            connection.end();
            return;

        }
        else if (answer.intitial === "Add Employee"){
            addEmployee();
            connection.end();
            return;

        }
        else if (answer.intitial === "View Department"){
            viewDepartment();
            connection.end();
            return;

        }
        else if (answer.intitial === "View Roles"){
            viewRoles();
            connection.end();
            return;

        }
        else if (answer.intitial === "View Employees"){
            viewEmployees();
            connection.end();
            return;

        }
        else if (answer.intitial === "Update Employee Roles"){
            updateEmployee();
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
    console.log(`1`);
};
function addRole(){
    console.log(`2`);
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
        console.log("-----------------------------------");
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