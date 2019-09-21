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
mongoose.connect("mongodb://localhost/eyeondesignscraper", { useNewUrlParser: true });

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://eyeondesign.aiga.org/category/design/magazines/#2").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("div .grid-post").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this).children(".grid-item-text").children(".grid-item-title").children("a").text();
        result.link = $(this).children("a").attr("href"); 
        result.category = $(this).children(".grid-item-text").children('.grid-item-label').children("a").text().replace(/(\r\n|\n|\r)/gm, "").trim();
        result.text = $(this).children(".grid-item-text").children('.grid-item-lede').children("a").children("p").text();
        // Create a new Article using the `result` object built from scraping
        console.log(result);
        
        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });

app.get("/", function(req, res) {
  db.Article.find({}).then(function(data){
    var hdbojb = {
      articles: data
    }
    res.render("index", hdbojb);
  }).catch(function(err){
    res.json(err);
  })
});

//retreiving individual article from DB
app.get("/articles/:id", function(req, res){
  let specificArticle = req.params.id;

  db.Article.findOne({_id: specificArticle}).populate("note").then(function(article){
    res.json(article);
  }).catch(function(err){
    res.json(err);
  });
});

//posting not to indivi article in db
app.post("/articles/:id", function(req, res){
  
  db.Note.create(req.body).then(function(dbNote){
    return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true});
  }).then(function(dbArticle){
    res.json(dbArticle)
  }).catch(function(err){
    res.json(err);
  });
});

app.listen(PORT, function(){
    console.log("app listening on port http://localhost:" + PORT);
});