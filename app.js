var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
    spotAPI	   = require('spotify-web-api-node'),
    request    = require('request');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
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

//redirect user to spotify for AuthN
app.get('/login', function(req, res) {
	var scopes = 'user-read-private user-read-email playlist-modify-public playlist-modify-private user-library-read user-top-read';
	res.redirect('https://accounts.spotify.com/authorize' +
	  	'?response_type=code' +
	  	'&client_id=' + spotifyApi._credentials.clientId +
	  	(scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
	  	'&redirect_uri=' + spotifyApi._credentials.redirectUri +
	  	'&state=' + '13131313131313131313131313131313'
	);
});


//AuthN return from Spotify
app.get("/callback", function( req, res){

	var code = req.query.code || null;
	var state = req.query.state || null;


	//Prepare to redeem code for token
    var authOptions = {
      	url: 'https://accounts.spotify.com/api/token',
      	form: {
        	code: code,
        	redirect_uri: spotifyApi._credentials.redirectUri,
        	grant_type: 'authorization_code'
      	},
      	headers: {
        	'Authorization': 'Basic ' + (new Buffer(spotifyApi._credentials.clientId + ':' + spotifyApi._credentials.clientSecret).toString('base64'))
      	},
      	json: true
    };



    //Redeem Code for Token AuthZ-ish
	request.post(authOptions, function(error, response, body) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

      	console.log(access_token);

      	res.redirect("./playlistCreator"+
			'?access_token=' + access_token
		);
    });
});


app.get("/playlistCreator", function (req, res){

	res.render("playlistCreator")
});


//START EXPRESS SERVER
//Server must run on port 3000 to for redirect UI (localhost:3000/callback)
app.listen(3000, function(){
    console.log("BPM Server Started.");
});