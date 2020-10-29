const inquirer = require("inquirer");
const mysql = require("mysql");
const config = require("./config.json")
const Department = require("./lib/Department")
const Role = require("./lib/Role")
const Employee = require("./lib/Employee")
var connection = mysql.createConnection(config)
var figlet = require('figlet');



let employeeArr = []
let roleArr = []

// -- Dep id: sales,1/legal,2/accounting,3  ||  role id: manager,1-3/salesperson,4/lawyer,5/accountant,6

grabEmpArr = () => {
    connection.query(
        "SELECT * FROM employee",
        (err,res)=>{
            if (err) throw err;
            res.forEach(emp => {
                currEmp = (emp.first_name + " " + emp.last_name)
                employeeArr.push(currEmp)
            });
        }
    )
    grabRoleArr()
}

grabRoleArr = () => {
    connection.query(
        "SELECT * FROM role",
        (err,res)=>{
            if (err) throw err;
            res.forEach(role => {roleArr.push(role.title)});
        }
    )
}

openItUp = () => {
    figlet('SOMEHOW-I-MANAGE', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log("\n============================")
        console.log(data)
        console.log("\n============================\n\n\n\n\n\n")
    });
}
endConnection = () => connection.end()

starter = () => {
    grabEmpArr();
    inquirer.prompt({
        type: "list",
        message: "What would you like to do?",
        name: "choice",
        choices: ["Add department","Add role","Add employee","View a table","Update an employees role","Exit application"]
    }).then((response) => {
        switch(response.choice){
            case "Add department":
                addDep()
                break;
            case "Add role":
                addRole()
                break;
            case "Add employee":
                addEmp()
                break;
            case "View a table":
                viewTable()
                break;
            case "Update an employees role":
                updateRole()
                break;
            default:
                endConnection()
        }
    })
}

addDep = () => {
    inquirer.prompt({
        type: "input",
        message: "What's the name of this department?",
        name: "name"
    }).then((res)=>{
        let newDep = new Department(res.name)
        let ask = connection.query(
            "INSERT INTO department SET ?",
            newDep,
            (err,res)=>{if(err) throw err;}
        )
        starter()
    })
}

addRole = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the title of this role?",
            name: "title"
        },
        {
            type: "input",
            message: "What is the salary for this role?",
            name: "salary"
        }
    ]).then((res)=>{
        let newRole = new Role(res.title,res.salary)
        connection.query(
            "INSERT INTO role SET ?",
            newRole,
            (err,res)=>{if (err) throw err}
        )
        starter()
    })
}

addEmp = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "Employee's first name?",
            name: "firstName"
        },
        {
            type: "input",
            message: "And last name?",
            name: "lastName"
        }
    ]).then((res)=>{
        let newEmp = new Employee(res.firstName,res.lastName)
        connection.query(
            "INSERT INTO employee SET ?",
            newEmp,
            (err, res)=>{if (err) throw err;}
        )
        starter()
    })
}

viewTable = () => {
    inquirer.prompt(
        {
            type: "list",
            message: "What would you like to view?",
            name: "tbltype",
            choices: ["department","role","employee","All"]
        }
    ).then((res)=>{
        switch(res.tbltype){
            case "All":
                connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, manager.first_name AS manager_first, manager.last_name AS manager_last, role.salary, department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id",
                (err,res)=>{
                    if (err) throw err
                    console.log("\n=========================================\n")
                    console.table(res)
                    console.log("\n=========================================\n\n\n\n\n")
                })
                break;
            default:
                connection.query("SELECT * FROM " + res.tbltype,(err,res)=>{
                    if (err) throw err;
                    console.log("\n=========================================\n")
                    console.table(res)
                    console.log("\n=========================================\n\n\n\n\n")
                })
                break;
        }
        starter()
    })
}

updateRole = () => {
    inquirer.prompt([
        {
        type: "list",
        message: "Which employee are you updating?",
        name: "empUp",
        choices: employeeArr
        },
        {
            type: "list",
            message: "what will their new role be?",
            name: "newRole",
            choices: roleArr
        }
    ]).then((res)=>{
        empToChange = res.empUp
        ETCsplit = empToChange.split(" ")
        changeToRole = res.newRole
        roleChangeId = 0
        switch(changeToRole){
            case "Sales manager":
                roleChangeId = 1
                break;
            case "Legal manager":
                roleChangeId = 2
                break;
            case "Accounting manager":
                roleChangeId = 3
                break;
            case "Salesperson":
                roleChangeId = 4
                break;
            case "Lawyer":
                roleChangeId = 5
                break;
            case "Accountant":
                roleChangeId = 6
                break;
        }
        connection.query(
        'UPDATE employee SET ? WHERE ? AND ?',
        [{role_id: roleChangeId},{first_name: ETCsplit[0]},{last_name: ETCsplit[1]}],
        (err,res)=>{
            if (err) throw err;
            starter()
        }            
        )
    })
}
openItUp();
starter();