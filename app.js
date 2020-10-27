const inquirer = require("inquirer");
const mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    PORT: 3306,
    user: "root",
    password: "Funhaus3121!",
    database: "teamDB"
})

class Department{
    constructor(name){
        this.name = name
    }
}

class Role{
    constructor(title,salary){
        this.title = title
        this.salary = salary
    }
}

class Employee{
    constructor(firstName,lastName){
        this.first_name = firstName
        this.last_name = lastName
    }
}

starter = () => {
    inquirer.prompt({
        type: "list",
        message: "What would you like to do?",
        name: "choice",
        choices: ["Add department","Add role","Add employee","View a table"]
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

viewTable =() => {
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
            console.log("=========================================")
            console.table(res)
            console.log("======================================")
            connection.end();
        })
        // starter()
    })
}
starter();