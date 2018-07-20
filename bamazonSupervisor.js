var mysql=require("mysql");
var inquirer=require("inquirer");
var asTable=require("as-table");
const chalk=require('chalk');
const log=console.log;


// export desgin from http://patorjk.com/software/taag/#p=display&h=1&v=1&c=bash&f=Doh&t=Bamazon

const logo=`
#  BBBBB                                                    
#  BB   B    aa aa mm mm mmmm    aa aa zzzzz  oooo  nn nnn  
#  BBBBBB   aa aaa mmm  mm  mm  aa aaa   zz  oo  oo nnn  nn 
#  BB   BB aa  aaa mmm  mm  mm aa  aaa  zz   oo  oo nn   nn 
#  BBBBBB   aaa aa mmm  mm  mm  aaa aa zzzzz  oooo  nn   nn 
#                                                                                                                                  
`
const menu=[" 1- View Departments Table"," 2- View Products for Sale by Department"," 3- Create New Department"," 4- Delete existing Department"," q- Exit "];

// create the connection information for the sql Database
var connection=mysql.createConnection({
    host:"localhost",
    port: 3306,
    user:"root",
    password:"root",
    database:"bamazon_db"
});

start();

function start()
{  // connect to the mysql server and sql database
   // end of Mysql Connection
    console.log(logo);
    log(chalk.yellow("\t*** Welcome to the Supervisor View *** "));
    log(chalk.yellow("\t====================================== \n"));

   for (var i in menu)  console.log("\t"+menu[i]);
   console.log("\n\n")

   inquirer.prompt([
    {
        name:"choice_menu",
        type:"input",
        message:"What do you want to do?"},
    {
        type: "confirm",
        message: "Are you sure:",
        name: "confirm",
        default: true
      
    }],

).then(function(answer) {
    if(answer.confirm)
    {
        switch (answer.choice_menu){

        case "1":
        ViewDepartment();
        break;

        case "2":
        ViewSalebyDepartment();
        break;

        case "3":
        CreateNewDepartment();
        break;

        case "4":
        DeleteDepartment();
        break;
        
        case "q":
        connection.end();
        log(chalk.green("\nYou exited Bamazon !!!"));
        break;

        default:
        log(chalk.red("\nincorrect command or not a valid option - try again !!"))   
        start(); 
        break;
        } // end Switch case 
    } //end if
   else
    {
        log(chalk.red("\n\tok you are not sure. retry again !"));
        start();
    }
  });  // end of the inquirer "then"
} //end of function Start() 


function ViewDepartment(){
    log(chalk.green("\n================== View all Table Department ===============\n")); 
    connection.query("select * from departments",
    function(err,results){
        if(err) throw err;
    console.log("\n\n");
    console.log(asTable.configure({delimiter:'|'})(results));
    start();
    }
);
}


function ViewSalebyDepartment(){
    log(chalk.green("\n================== View Sale by Department ===============\n")); 
    connection.query(`select department_id,department_name, ProductSales-costs as total_profit,costs,ProductSales from(
        select department_id, departments.department_name,over_head_costs  as costs,round (sum(product_sales),2) as ProductSales
        from departments 
        inner join products on departments.department_name=products.department_name
        group by departments.department_name
        ) as x`,
        function(err,results){
            if(err) throw err;
        console.log("\n\n");
        console.log(asTable.configure({delimiter:'|'})(results));
        start();
        }
    );
}

function CreateNewDepartment(){    
        log(chalk.green("\n================== Create New Department ===============\n"));
        inquirer.prompt([
            {
                type: "input",
                message: "Enter Department name?:",
                name: "departmentName",                   
            },
            
            {
                type: "input",
                message: "Enter over head costs?:",
                name: "overHcost",
                        
            },             
            {
                type: "confirm",
                message: "Are you sure?:",
                name: "confirm",
                default: true          
            },
        ],
    
    ).then(function(answer) {
       
        if(answer.confirm){
            connection.query("INSERT INTO departments SET?",
        {
            department_name:    answer.departmentName,
            over_head_costs:    answer.overHcost,           
        },
        function(err){
        if(err) throw err;
        log(chalk.cyan("new Department added successfully!!"));
        
        start();   
        }  //end function err
            
        ); //end connection query
            
        } // end if
        else
        log(chalk.red("something wrong"));
    }); // end inquirer
}//end function

function DeleteDepartment(){
    log(chalk.green("\n================== Delete Department View ===============\n"));
    inquirer.prompt([
        {
            type: "input",
            message: "Enter product Id to delete department?:",
            name: "id",                   
        },        
        {
            type: "confirm",
            message: "Are you sure?:",
            name: "confirm", 
            default: true                     
        },
    ],
    
    ).then(function(answer) {  
        if (answer.confirm) {
        connection.query(
            "DELETE FROM departments WHERE ?",
            {
              department_id: answer.id
            },
            function(err, res) {
              console.log(res.affectedRows + " products deleted!\n");
              // Call readProducts AFTER the DELETE completes
              start();
            } //end function Err,res
        ); //end funtion connection.query
    } // end if
    else console.log("something wrong");
    } // end inquirer
    );
    
}

