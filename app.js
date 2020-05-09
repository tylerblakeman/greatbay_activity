var mysql = require("mysql");
var inquirer = require("inquirer");
var auctionItems;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "Great_BayDB",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id" + connection.threadId);
});

inquirer
  .prompt([
    {
      type: "list",
      name: "buySell",
      message: "Are you looking to buy or sell?",
      choices: ["Sell", "Buy"],
    },
  ])
  .then(function (user) {
    console.log("fuck it");
    switch (user.buySell) {
      case "Buy":
        buyItem();
        break;
      case "Sell":
        postItem();
    }
  });

function postItem() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What are you calling this piece of junk?",
      },
      {
        type: "input",
        name: "descrip",
        message: "What is the description of this item?",
      },
      {
        type: "number",
        name: "reserve",
        message: "Where do you want to start the bidding?",
      },
    ])
    .then(function (user) {
      var title = user.title;
      var descrip = user.descrip;
      var reserve = user.reserve;
      console.log(title, descrip, reserve);
      itemToDB(title, descrip, reserve);
    });
  //   connection.end();
}

function buyItem() {
  console.log("buyitem");
  readAuctions();
  console.log(auctionItems);
  // call the auctionItem function to get all items from auction table
}

function itemToDB(title, descrip, reserve) {
  console.log("Inserting a new auction item...\n");
  var query = connection.query(
    "INSERT INTO auction SET ?",
    {
      title: title,
      descrip: descrip,
      reserve: reserve,
    },
    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " item inserted!\n");
      // Call updateProduct AFTER the INSERT completes
    }
  );

  // logs the actual query being run
  console.log(query.sql);
  connection.end();
}

function readAuctions() {
  console.log("Selecting all auction items...\n");
  connection.query("SELECT * FROM auction", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    // console.log("response!", res.title);
    auctionItems = [];
    res.forEach((element) => {
      // console.log(element)
      tempobject = {
          id: element.id,
          title: element.title
        };
        auctionItems.push(tempobject);
    });
    // auctionItems.push(res);
    console.log(auctionItems);
    // connection.end();
    //     inquirer.prompt {
    //         type: "list",
    //         name: "buying",
    //         message: "what are you looking to buy?",
    //         choices: [res.forEach(element => {

    //         });]
    //     }
  });
}

// get title and id of all items in DB and put them in an array - use this array to populate the options inquirer
//when option is selected - create a var that is set to that item
//call DB using the var as the selector - pull title, description, reserve, and current price
//user inputs their bid - compared against current price -- if > update db with new price
