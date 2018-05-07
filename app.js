var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser')
    spotAPI	   = require('spotify-web-api-node');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


//Spotify BPM App config
var spotifyApi = new spotAPI({
  clientId: 'e3f3bf9192fe4f608f8774bbd45ea912',
  clientSecret: 'ba12b9cb4f7c4071b492a8ceffc8ac7b',
  redirectUri: 'http://localhost:3000/callback'
});



//ROUTES
//Landing page for app
app.get("/", function( req, res){
   res.render("landing"); 
});

//redirect user to spotify for auth
app.get('/login', function(req, res) {
var scopes = 'user-read-private user-read-email';
res.redirect('https://accounts.spotify.com/authorize' +
  '?response_type=code' +
  '&client_id=' + 'e3f3bf9192fe4f608f8774bbd45ea912' +
  (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
  '&redirect_uri=' + 'http://localhost:3000/callback');
});


//Auth return from Spotify
app.get("/callback", function( req, res){
   res.render("playlist"); 
});


//START EXPRESS SERVER
app.listen(3000, function(){
    console.log("BPM Server Started.");
});