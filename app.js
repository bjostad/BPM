var express    = require("express"),
    app        = express(),
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


//ROUTES
app.get("/", function( req, res){
   res.render("landing"); 
});


//START EXPRESS SERVER
app.listen(3000, function(){
    console.log("BPM Server Started.");
});