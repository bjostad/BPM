var express    = require('express'),
    app        = express(),
	bodyParser = require('body-parser'),
	path = require('path'),
	uniqid = require('uniqid'),
	spotAPI	   = require('spotify-web-api-node'),
	request    = require('request'),
	cookieParser = require('cookie-parser')
	spotifyConfig = require('./spotifyConfig.js');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.set("view engine", "ejs");

//Spotify BPM App config
var clientId = spotifyConfig.CLIENT_ID,
	clientSecret = spotifyConfig.CLIENT_SECRET,
	appPort = spotifyConfig.PORT,
	redirectUri = spotifyConfig.REDIRECT_URI;

//ROUTES

 /** 
 * Landing page for app
 */
app.get("/", function( req, res){
   res.render("landing"); 
});

/**
 * Redirect user to spotify for AuthN
 */
app.get('/login', function(req, res) {
	var spotifyApi = new spotAPI({
		clientId: clientId,
		clientSecret: clientSecret,
		redirectUri: redirectUri
  	});

	var scopes = 'user-read-private user-read-email playlist-modify-public playlist-modify-private user-library-read user-top-read';
	res.redirect('https://accounts.spotify.com/authorize' +
	  	'?response_type=code' +
	  	'&client_id=' + spotifyApi._credentials.clientId +
	  	(scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
	  	'&redirect_uri=' + spotifyApi._credentials.redirectUri +
	  	'&state=' + '13131313131313131313131313131313'
	);
});



/**
 * AuthN return from Spotify
 */
app.get("/callback", function( req, res){
	var spotifyApi = new spotAPI({
		clientId: clientId,
		clientSecret: clientSecret,
		redirectUri: redirectUri
  	});
	var code = req.query.code || null,
		state = req.query.state || null;

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
		console.log("Redeemed code for token: "+ body.access_token);

		//Set cookie with access token
		res.cookie('access_token', body.access_token);
		console.log("Set access-token on cookie");

		//Redirect to /playlistCreator
		res.redirect("./playlistCreator");

		//TODO: add error handling

	});


});

/**
 * Render playlist creation page
 */
app.get("/playlistCreator", function (req, res){
	res.render("playlistCreator");
});

/**
 * Get recommendations from the spotify API
 */
app.get("/recommendations", function (req, res){
	var spotifyApi = new spotAPI({
		clientId: clientId,
		clientSecret: clientSecret,
		redirectUri: redirectUri,
		accessToken: req.cookies.access_token
  	});
	var searchOptions = {
		target_tempo: req.query.bpmRequested,
		seed_genres: req.query.genre,
		limit: 100
	};
	spotifyApi.getRecommendations(searchOptions)
		.then(function(results) {
			res.json(results);
			console.log("Recommendations collected and returned");
		});	
});

/**
 * Get genres using spotAPI
 */
app.get("/genres", function (req, res){

	var spotifyApi = new spotAPI({
		clientId: clientId,
		clientSecret: clientSecret,
		redirectUri: redirectUri,
		accessToken: req.cookies.access_token
  	});

	spotifyApi.getAvailableGenreSeeds()
		.then(function(results) {
			res.json(results);
			console.log("Genres collected");
		});	
});

/**
 * Get user info (User ID necessary for playlist creation)
 */
app.get("/userInfo", function (req, res){
	var spotifyApi = new spotAPI({
		clientId: clientId,
		clientSecret: clientSecret,
		redirectUri: redirectUri,
		accessToken: req.cookies.access_token
  	});

	spotifyApi.getMe()
		.then(function(results) {
			res.cookie('userID', results.body.id);
			res.json(results);
			console.log("User info collected for "+results.body.id);
		});	
});

/**
 * Post created playlist to spotify
 */
app.post("/createPlaylist", function (req, res){
	var spotifyApi = new spotAPI({
		clientId: clientId,
		clientSecret: clientSecret,
		redirectUri: redirectUri,
		accessToken: req.cookies.access_token
	  });

	var userID = req.cookies.userID;
	var tracks = JSON.parse(req.body.selectedTracks);

	  
	// Create playlist
	spotifyApi.createPlaylist(
		userID, 
		req.body.playlistName, 
		{ public : false }
	)
	.then(function(results) {
		console.log('Playlist created!');
		console.log('user: '+ userID)
		console.log('Playlist ID: '+results.body.id) 
		console.log('Tracks: '+tracks)
		
		// Add tracks to the playlist
		spotifyApi.addTracksToPlaylist(
			userID, 
			results.body.id, 
			tracks
		)
		.catch(function(results) {
			console.log(results); //TODO: actual error handling
	  	});
	})
	.catch(function(results) {
		console.log(results); //TODO: actual error handling
	});
});


/**
 * Test function to make sure all spotify API requirements are avaialble.
 */
function getSpotProperties(){
	console.log('The access token is ' + spotifyApi.getAccessToken());
	console.log('The refresh token is ' + spotifyApi.getRefreshToken());
	console.log('The redirectURI is ' + spotifyApi.getRedirectURI());
	console.log('The client ID is ' + spotifyApi.getClientId());
	console.log('The client secret is ' + spotifyApi.getClientSecret());
}


/**
 * START EXPRESS SERVER
 * Configure ROOT_URL and PORT in spotifyConfig.js ex: ROOT_URL:PORT/callback)
 */
app.listen(appPort, function(){
    console.log("Pacemakr running.");
});