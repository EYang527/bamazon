var mysql=require("mysql");
var inquirer=require("inquirer");
var asTable=require("as-table");
const chalk=require('chalk');
const log=console.log;


// export desgin from http://patorjk.com/software/taag/#p=display&h=1&v=1&c=bash&f=Doh&t=Bamazon

const logo=`

#  ██████╗  █████╗ ███╗   ███╗ █████╗ ███████╗ ██████╗ ███╗   ██╗
#  ██╔══██╗██╔══██╗████╗ ████║██╔══██╗╚══███╔╝██╔═══██╗████╗  ██║
#  ██████╔╝███████║██╔████╔██║███████║  ███╔╝ ██║   ██║██╔██╗ ██║
#  ██╔══██╗██╔══██║██║╚██╔╝██║██╔══██║ ███╔╝  ██║   ██║██║╚██╗██║
#  ██████╔╝██║  ██║██║ ╚═╝ ██║██║  ██║███████╗╚██████╔╝██║ ╚████║
#  ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝
#                                                                
                                                                                                                                   
`
const menu=[" 1- View Products for Sale"," 2- View Low Inventory"," 3- Add to Inventory"," 4- Add new Product",
            " 5- Delete Products (recall, defective)"," q- Exit "];

// create the connection information for the sql Database
var connection=mysql.createConnection({
    host:"localhost",
    port: 3306,
    user:"root",
    password:"root",
    database:"bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    });

start();

function start()
{  // connect to the mysql server and sql database
   // end of Mysql Connection
    console.log(logo);
    log(chalk.yellow("\t*** Welcome to the Manager View *** "));
    log(chalk.yellow("\t====================================== \n"));

   for (var i in menu)  console.log(menu[i]);

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
    productsView();
    break;

    case "2":
    lowInventory();
    break;

    case "3":
    addInventory();
    break;

    case "4":
    addNewProduct();
    break;

    case "5":
    deleteProduct();
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
   else{
            log(chalk.red("\n\tok you are not sure. retry again !"));
            start();
        }
  });  // end of the inquirer "then"
} //end of function Start() 


function productsView() {
 

    log(chalk.green("\n================== Products View ===============\n"));
    connection.query("SELECT item_id,product_name,price,stock_quantity FROM products", function(err, results) {
        if (err) throw err;       
       console.log("Id    Products  qty   price\n");
  
      for (var i in results)
      {
          log(chalk.white(results[i].item_id,results[i].product_name.padEnd(40))+"  "+chalk.yellow(results[i].stock_quantity)+chalk.magenta("   $"+results[i].price));
          
      }
      dbContent=results;
    }); //end connection query 
    //connection.end(); // close the connection  
    confirmReturnMenu("\n\n Exiting Products view ...");
} // end function ProductsView

function lowInventory() {
    log(chalk.green("\n================== Low Inventory View ===============\n"));
    connection.query("SELECT item_id,product_name,price,stock_quantity FROM products where stock_quantity<5", function(err, results) {
        if (err) throw err;       
       console.log("Id    Products  qty \n");
  
      for (var i in results)
      {
          log(chalk.white(results[i].item_id,results[i].product_name.padEnd(40))+"  "+chalk.yellow(results[i].stock_quantity));
          
      }
    }); // end connection query    
    confirmReturnMenu("\n\n Exiting low Inventory ...");
}

function addInventory() {
    log(chalk.green("\n================== Add Inventory ===============\n"));
    inquirer.prompt([
        {
            type: "input",
            message: "Enter product Id?:",
            name: "product_id",                   
        },
        {
            type: "confirm",
            message: "Are you sure?:",
            name: "confirm",
            default: true          
        },
        {
            type: "input",
            message: "Enter quantity?:",
            name: "qtyProduct",                   
        },
        {
            type: "confirm",
            message: "Are you sure?:",
            name: "confirm2",
            default: true          
        },
    ],

).then(function(answer) {

    if (answer.confirm && answer.confirm2) {
        log(chalk.cyan("you want to add +" +answer.qtyProduct+ " of product id: "+answer.product_id ));  

        {  connection.query("update products set stock_quantity=stock_quantity+ " +parseInt(answer.qtyProduct)+" where ?",
        [
          
            {
                item_id:parseInt(answer.product_id)
            }
        ],
            function (error){
                if (error)throw error;                    

                console.log(" product added successfully...");
                confirmReturnMenu("\n\n Exiting add product to inventory ...");
            }
        )};
    }

    
    else{
        log(chalk.cyan("try again !!! "));
    }
});

}

function addNewProduct() {
    log(chalk.green("\n================== Add new Product ===============\n"));
    inquirer.prompt([
        {
            type: "input",
            message: "Enter product name?:",
            name: "productName",                   
        },
        
        {
            type: "input",
            message: "Enter department?:",
            name: "department",
                    
        },  
        {
            type: "input",
            message: "Enter quantity?:",
            name: "qty",                   
        }, 
        {
            type: "input",
            message: "Enter price?:",
            name: "priceItem",                   
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
        connection.query("INSERT INTO products SET?",
    {
        product_name:       answer.productName,
        department_name:    answer.department,
        price:              answer.priceItem,
        stock_quantity:     answer.qty,
        product_sales:      0,
    },
    function(err){
    if(err) throw err;
    log(chalk.cyan("new product added successfully!!"));
    confirmReturnMenu("\n\n Exiting add new product ...");    
    }  //end function err
        
); //end connection query
    
} // end if
else
console.log("something wrong");
}); // end inquirer
}// end function

function deleteProduct() {
    log(chalk.green("\n================== Delete Product View ===============\n"));
    inquirer.prompt([
        {
            type: "input",
            message: "Enter product Id to delete?:",
            name: "product_id",                   
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
        "DELETE FROM products WHERE ?",
        {
          item_id: answer.product_id
        },
        function(err, res) {
          console.log(res.affectedRows + " products deleted!\n");
          // Call readProducts AFTER the DELETE completes
          confirmReturnMenu("\n\n Exiting delete view ...")
        } //end function Err,res
    ); //end funtion connection.query
} // end if
else console.log("something wrong");
} // end inquirer
);

}

function confirmReturnMenu(message) {
    inquirer.prompt([
        {
            type: "confirm",
            message: "return to menu?:",
            name: "confirm",
            default: true
          
        }],

).then(function(answer) {
    if (answer.confirm) 
    log(chalk.green(message));
    start();
});

}

function lookupQty(id){
    var sql="SELECT * FROM products where item_id="+mysql.escape(id);
    connection.query(sql, function(err, results) {
    if (err) throw err;    
    
    var itemArray=[];

    itemArray.push(results[0].stock_quantity);
    itemArray.push(results[0].product_name);

    console.log("itemArray ",itemArray)

    return (itemArray);
    });
}

