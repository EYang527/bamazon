var mysql=require("mysql");
var inquirer=require("inquirer");
var asTable=require("as-table");
const chalk=require('chalk');
const log=console.log;

// export desgin from http://patorjk.com/software/taag/#p=display&h=1&v=1&c=bash&f=Doh&t=Bamazon

const logo=`
                                                                                                                                      
#  BBBBBBBBBBBBBBBBB                                                                                                                   
#  B::::::::::::::::B                                                                                                                  
#  B::::::BBBBBB:::::B                                                                                                                 
#  BB:::::B     B:::::B                                                                                                                
#    B::::B     B:::::B  aaaaaaaaaaaaa      mmmmmmm    mmmmmmm     aaaaaaaaaaaaa   zzzzzzzzzzzzzzzzz   ooooooooooo   nnnn  nnnnnnnn    
#    B::::B     B:::::B  a::::::::::::a   mm:::::::m  m:::::::mm   a::::::::::::a  z:::::::::::::::z oo:::::::::::oo n:::nn::::::::nn  
#    B::::BBBBBB:::::B   aaaaaaaaa:::::a m::::::::::mm::::::::::m  aaaaaaaaa:::::a z::::::::::::::z o:::::::::::::::on::::::::::::::nn 
#    B:::::::::::::BB             a::::a m::::::::::::::::::::::m           a::::a zzzzzzzz::::::z  o:::::ooooo:::::onn:::::::::::::::n
#    B::::BBBBBB:::::B     aaaaaaa:::::a m:::::mmm::::::mmm:::::m    aaaaaaa:::::a       z::::::z   o::::o     o::::o  n:::::nnnn:::::n
#    B::::B     B:::::B  aa::::::::::::a m::::m   m::::m   m::::m  aa::::::::::::a      z::::::z    o::::o     o::::o  n::::n    n::::n
#    B::::B     B:::::B a::::aaaa::::::a m::::m   m::::m   m::::m a::::aaaa::::::a     z::::::z     o::::o     o::::o  n::::n    n::::n
#    B::::B     B:::::Ba::::a    a:::::a m::::m   m::::m   m::::ma::::a    a:::::a    z::::::z      o::::o     o::::o  n::::n    n::::n
#  BB:::::BBBBBB::::::Ba::::a    a:::::a m::::m   m::::m   m::::ma::::a    a:::::a   z::::::zzzzzzzzo:::::ooooo:::::o  n::::n    n::::n
#  B:::::::::::::::::B a:::::aaaa::::::a m::::m   m::::m   m::::ma:::::aaaa::::::a  z::::::::::::::zo:::::::::::::::o  n::::n    n::::n
#  B::::::::::::::::B   a::::::::::aa:::am::::m   m::::m   m::::m a::::::::::aa:::az:::::::::::::::z oo:::::::::::oo   n::::n    n::::n
#  BBBBBBBBBBBBBBBBB     aaaaaaaaaa  aaaammmmmm   mmmmmm   mmmmmm  aaaaaaaaaa  aaaazzzzzzzzzzzzzzzzz   ooooooooooo     nnnnnn    nnnnnn
#                                                                                                                                      
                                                                                                                                      
`

var priceItem=0;

// create the connection information for the sql Database
var connection=mysql.createConnection({
    host:"localhost",
    port: 3306,
    user:"root",
    password:"root",
    database:"bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });
  
  // function which prompts the user for what action they should take
  function start() {
    showItemsforSale();  
  }

  
  function showItemsforSale() {
    // query the database for all items being auctioned
  
   
    connection.query("SELECT item_id,product_name,price FROM products", function(err, results) {
      if (err) throw err; 
     
     console.log(logo);   

     log(chalk.yellow("===========Items for Sale========\n"));
     console.log("Id    Products    \t\t\tprice\n");

    for (var i in results)
    {
      
      

        log(chalk.white(parseInt(i)+1,results[i].product_name.padEnd(30)+chalk.magenta("\t\ $"+results[i].price.toFixed(2))));       
     
    }
    
    console.log("\t\nPress 'q' to quit the store!");
    console.log("\n");

    inquirer.prompt([
        {
            name:"item",
            type:"input",
            message:"Select the Id of the wanted item to buy?"},
        {
            type: "confirm",
            message: "Are you sure:",
            name: "confirm",
            default: true
          
        }],

).then(function(answer) {
    var choiceItem=parseInt(answer.item);    
    
    if (answer.confirm && answer.item=="q")
    {
        log(chalk.green("you have left the Bamazon Website!"));
        connection.end();
    }
    else if (answer.confirm && !isNaN(choiceItem) && choiceItem<results.length+1 ) { 
     
        priceItem=parseFloat(results[choiceItem-1].price);
       
        log(chalk.cyan("\t\n you have chosen : ",answer.item," - ",results[parseInt(answer.item)-1].product_name+"\n"));
                
        var choice_id=results[parseInt(answer.item)-1].item_id;
        update_db(parseInt(choice_id));
      }
   
      else {
        log(chalk.red("\n wrong item id or itemid is NaN, re-choose your item id"));
        showItemsforSale();
      }

}
)
    
    });
}

function update_db(choice_id){
    
    var sql="SELECT stock_quantity FROM products where item_id="+mysql.escape(choice_id);
    connection.query(sql, function(err, results) {
    if (err) throw err;    
   
    var storeQty =results[0].stock_quantity;

    inquirer.prompt([
        {
            name:"quantity",
            type:"input",
            message:"how many do you want to buy?"},
            {
                type: "confirm",
                message: "Are you sure:",
                name: "confirm",
                default: true
            }],

        ).then(function(answer) {
        if (answer.confirm){
            log(chalk.cyan(" quantity selected",answer.quantity));
            if(storeQty >= answer.quantity)
            {  connection.query("update products set? where?",
            [
                {
                    stock_quantity: storeQty-answer.quantity
                },
                {
                    item_id:choice_id
                }
            ],
                function (error){
                    if (error)throw err;
                        var total=answer.quantity*priceItem;

                        log(chalk.yellow("Amout due for the purchase : $"+total.toFixed(2)));
                        updateProducts_sale(total,choice_id);
                        log(chalk.green("purchase completed successfully!"));
                        showItemsforSale();
                }
            );
        }
        else
        
            
            {   log(chalk.red("\n\tInsufficient quantity => qty for your item is : ",storeQty));
                showItemsforSale();
            }
    
        }
        
        else 
        {console.log("re-enter your choice and quantity?");
        showItemsforSale();}
        })
    
});
}


function updateProducts_sale(total,id){
    connection.query(
        "update products set ? where ?",
        [
            {
               product_sales: total,     
            },
            {
               item_id : id,
            }
        ],
        function(err){
            if (err) throw err;
            log(chalk.green("Update Products_Sale successfully!!!"));
                    
        } // end function err
    ) // end connection query
}