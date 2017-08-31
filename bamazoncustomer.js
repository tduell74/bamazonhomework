//Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");

//mySQL connection code
var connection = mysql.createConnection({
    host: "localhost",

    // Your username
    user: "root",

    // Your password
    password: "DallasCowboys22$"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});

//Displays all products for sale in the store from mySQL bamazon database
var displayProducts = function() {
    connection.query("SELECT * FROM bamazon.products", function(err, res) {
        console.log(`
        Products Available for Sale
        -------------------------------------------`);
        console.table(res);
    });
};

var start = function() {
    console.log('\n  ');
    inquirer.prompt({
        name: "purchaseOrExit",
        type: "rawlist",
        message: "Would you like to [PURCHASE] an item or [EXIT] the store?",
        choices: ["PURCHASE", "EXIT"]
    }).then(function(answer) {
        if (answer.purchaseOrExit.toUpperCase() === "PURCHASE") {
            makePurchase();
        } else {
            console.log(`
          Thank you for shopping with Bamazon.
          Come back and shop again soon!`);
            connection.end();
        }
    });
};

// Prompt user to enter item_id and stock_quantity they wish to purchase
var makePurchase = function() {
    console.log('\n  ');
    inquirer.prompt([{
        name: "id",
        type: "input",
        message: " Enter the item_id of the product you want to purchase",

    }, {
        name: "quantity",
        type: "input",
        message: " Enter how much stock you want to purchase",

    }]).then(function(answer) {
        // Query the bamazon database for info about the item including the quantity currently in stock. 
        connection.query('SELECT product_name, price, stock FROM bamazon.products WHERE ?', { item_id: answer.id }, function(err, res) {

            console.log('\n  You would like to buy ' + answer.quantity + ' ' + res[0].product_name + ' at $' + res[0].price + ' each');
            if (res[0].stock >= answer.quantity) {
                //If enough stock_quantity to complete order, process order by updating database stock_quantity and notifying customer that order is complete. 
                var itemQuantity = res[0].stock - answer.quantity;
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock: itemQuantity
                }, {
                    item_id: answer.id
                }], function(err, res) {});
                var cost = res[0].price * answer.quantity;
                console.log('\n  Order fulfilled! Your cost is $' + cost.toFixed(2) + '\n');
                // Order completed
                displayProducts();
                start();

            } else {
                //If not enough stock notify customer and prompt customer to keep shopping
                console.log('\n  Sorry, Insufficient stock_quantity to fulfill your order!\n');
                // Order not completed
                start();
            }
        })
    });
}

displayProducts();
start();

//tested connection to view the products table
// connection.query("SELECT * FROM products", function(err, res) {
//     for (var i = 0; i < res.length; i++) {
//         console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price +
//             " | " + res[i].stock_quantity);
//     }
//     console.log("-----------------------------------");
// });




