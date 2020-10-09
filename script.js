const inquirer = require ('inquirer');

initialize();

//initial prompt
function initialize(){
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
            return;

        }
        else if (answer.intitial === "Add Role"){
            addRole();
            return;

        }
        else if (answer.intitial === "Add Employee"){
            addEmployee();
            return;

        }
        else if (answer.intitial === "View Department"){
            viewDepartment();
            return;

        }
        else if (answer.intitial === "View Roles"){
            viewRoles();
            return;

        }
        else if (answer.intitial === "View Employees"){
            viewEmployees();
            return;

        }
        else if (answer.intitial === "Update Employee Roles"){
            updateEmployee();
            return;

        }
        else{
            console.log(`You need to pick`);
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
    console.log(`4`);
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