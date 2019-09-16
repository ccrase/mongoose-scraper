var express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var cheerio = require('cheerio');
var axios = require('axios');

var db = require('./models');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static('public'));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongoscraper", { useNewUrlParser: true })

//list routes or require routes folder here
app.get("/", function(req, res) {
      res.render("index");
  });

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://juxtapoz.com").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("h2 a").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this).text();
        result.link = $(this).attr("href");
        
        console.log(result);
        // Create a new Article using the `result` object built from scraping
    //     db.Article.create(result)
    //       .then(function(dbArticle) {
    //         // View the added result in the console
    //         console.log(dbArticle);
    //       })
    //       .catch(function(err) {
    //         // If an error occurred, log it
    //         console.log(err);
    //       });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });


app.listen(PORT, function(){
    console.log("app listening on port http://localhost:" + PORT);
});