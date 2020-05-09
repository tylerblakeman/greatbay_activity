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
  initial();
});

function initial() {
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
      switch (user.buySell) {
        case "Buy":
          buyItem();
          break;
        case "Sell":
          postItem();
      }
    })
};

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
        type: "input",
        name: "category",
        message: "What is the category of this item?",
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
      var category = user.category
      var highestBid = user.reserve
      console.log(title, descrip, reserve);
      itemToDB(title, category, descrip, reserve, highestBid);
    });

}

function buyItem() {
  console.log("buyitem");
  readAuctions();
  // call the auctionItem function to get all items from auction table
}

function itemToDB(title, category, descrip, reserve, highestBid) {
  console.log("Inserting a new auction item...\n");
  var query = connection.query(
    "INSERT INTO auction SET ?",
    {
      title: title,
      category: category,
      descrip: descrip,
      reserve: reserve,
      highestBid: highestBid
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
        title: element.title,
        descrip: element.descrip,
        category: element.category,
        reserve: element.reserve,
        highestBid: element.highestBid
      };
      auctionItems.push(tempobject);
    });
    // auctionItems.push(res);
    // connection.end();
    inquirer
      .prompt([
        {
          type: "list",
          name: "buy",
          message: "What are you looking to buy?",
          choices: function () {
            var choiceArray = [];
            res.forEach((element) => {
              choiceArray.push(element.title);
            })
            return choiceArray;
          }
        },
      ]).then(function (user) {
        for (var i = 0; i < res.length; i++) {
          if (user.buy === res[i].title) {
            var chosenItem = res[i]
          }
        }
        console.log(`${chosenItem.title}\nDescription: ${chosenItem.descrip}\nCategory: ${chosenItem.category}\nHighest Bid: ${chosenItem.highestBid}`)
        inquirer.prompt({
          name: "bid",
          type: "input",
          message: "how much would you like to bid?",
          validate: function (value) {
            if (isNaN(value) == false) {
              return true;
            } else {
              return false;
            }
          }
        }).then(function (user) {
          if (chosenItem.highestBid < parseInt(user.bid)) {
            connection.query("UPDATE auction SET ? WHERE ?", [{
              highestBid: user.bid
            }, {
              id: chosenItem.id
            }], function (err, res) {
              if (err) throw err;
              console.log(res.affectedRows + " products updated!\n");
              console.log('Bid placed!')
              initial()
            })
          } else {
            console.log('Bid was too low! Try again.')
            initial()
          }
        })
      })

  });
}


// get title and id of all items in DB and put them in an array - use this array to populate the options inquirer
//when option is selected - create a var that is set to that item
//call DB using the var as the selector - pull title, description, reserve, and current price
//user inputs their bid - compared against current price -- if > update db with new price
