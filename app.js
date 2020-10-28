const inquirer = require("inquirer");
const mysql = require("mysql");
const config = require("./config.json")
const Department = require("./lib/Department")
const Role = require("./lib/Role")
const Employee = require("./lib/Employee")
var connection = mysql.createConnection(config)

grabEmpArr = () => {
    connection.query(
        "SELECT * FROM employee",
        (err,res)=>{
            if (err) throw err;
            res.forEach(emp => {
                currEmp = (emp.first_name + " " + emp.last_name)
                employeeArr.push(currEmp)
            });
            connection.end()
        }
    )
    grabRoleArr()
}
grabRoleArr = () => {
    connection.query(
        "SELECT * FROM role",
        (err,res)=>{
            if (err) throw err;
            res.forEach(role => {
                currRole = role.title
                roleArr.push(currRole)
            })
        }
    )
}
let employeeArr = []
let roleArr = []
grabEmpArr()


starter = () => {
    
    inquirer.prompt({
        type: "list",
        message: "What would you like to do?",
        name: "choice",
        choices: ["Add department","Add role","Add employee","View a table","Update an employees role"]
    }).then((response) => {
        choice = response.choice
        switch(choice){
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
                starter()
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
            (err,res)=>{
                if(err) throw err;
            }
        )
        connection.end();
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
        let ask = connection.query(
            "INSERT INTO role SET ?",
            newRole,
            (err, res)=>{
                if (err) throw err;
            }
        )
        connection.end()
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
        console.log(res)
        let newEmp = new Employee(res.firstName,res.lastName)
        let ask = connection.query(
            "INSERT INTO employee SET ?",
            newEmp,
            (err, res)=>{
                if (err) throw err;
            }
        )
        connection.end()
        starter()
    })
}

viewTable = () => {
    inquirer.prompt(
        {
            type: "list",
            message: "What would you like to view?",
            name: "tbltype",
            choices: ["department","role","employee"]
        }
    ).then((res)=>{
        let ask = connection.query("SELECT * FROM " + res.tbltype,(err,res)=>{
            if (err) throw err;
            console.log("\n=========================================\n")
            console.table(res)
            // console.log(res)
            console.log("\n=========================================\n")
            connection.end();
        })
        // starter()
    })
}


// THIS CAN BE MADE INTO UPDATETABLE LATER ON
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
        console.log(res)
        empToChange = res.empUp
        changeToRole = res.newRole
        console.log(empToChange)
        console.log(changeToRole)

        
        // let ask = connection.query(
        // "UPDATE role SET ? WHERE ?",

        // )
    })

}
starter();