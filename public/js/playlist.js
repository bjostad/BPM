console.log("Connected and working");
var playlist = [];
var playlistDuration = 0;

function convertMillisToTime(time){
    let delim = " ";
    let hours = Math.floor(time / (1000 * 60 * 60) % 60);
    let minutes = Math.floor(time / (1000 * 60) % 60);
    let seconds = Math.floor(time / 1000 % 60);

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    if(hours === "00"){
        return minutes + 'm' + delim + seconds + 's';
    }
    if (hours === "00" && minutes === "00"){
        return seconds + 's';
    }
    else {
        return hours + 'h'+ delim + minutes + 'm' + delim + seconds + 's';
    }
}

$(document).ready(function() {
    getGenres();
    getUserInfo();

    //Setup event listener for Seach button
    $("#btnSearch").click(getRecommendations);
    
    //Event listener for playlist button
    $("#btnCreatePlaylist").click(function(){
        postSelectedTracks(playlist);
    });
});

/**
 * Get avialble genres from spotify
 */
function getGenres(){

    $.ajax({
        type: "GET",
        url: "genres",
        data: {
        },
        success: function(result) {
            populateGenreSelection(result.body.genres);
        },
        failure: function(){
            alert("Unable to retrieve genres. Please refresh page and try again!"); // TODO: refresh access token as this is most likely the cause of error.
        }
    });

};

/**
 * Get username and display welcome message
 */
function getUserInfo(){
    
    $.ajax({
        type: "GET",
        url: "userInfo",
        data: {
        },
        success: function(result) {
            $("#userName").text("Welcome, " + result.body.id);
        },
        failure: function(){
            alert("Unable to retrieve user info. Please refresh page and try again!"); // TODO: refresh access token as this is most likely the cause of error.
        }
    });
};

/**
 * Add genres to genre selection dropdown
 * @param {*} genres 
 */
function populateGenreSelection(genres){
    console.log(genres);
    var selectGenres = document.getElementById("genres");
    for(index in genres) {
        selectGenres.options[selectGenres.options.length] = new Option(genres[index], genres[index]);
    }
};


/**
 * Collect input from text fields and retrieve recommendations from SpotifyAPI
 * with jQuery, $("#genre").val(); is the same as document.getElementById("genre").value;
 */
function getRecommendations(){

    var bpmRequested = $("#bpmRequested").val(),
        genre = $("#genres").val();

    console.log(bpmRequested);
    console.log(genre);

    $.ajax({
        type: "GET",
        url: "recommendations",
        data: {
          genre: genre,
          bpmRequested: bpmRequested
        },
        success: function(result) {
            populateResults(result.body.tracks);
        },
        failure: function(){
            alert("Unable to retrieve tracks. Please refresh page and try again!"); // TODO: refresh access token as this is most likely the cause of error.
        }
    });
};

/**
 * Post tracks array and playlist name to playlist creation endpoint
 * @param {Object[]} tracks 
 */
function postSelectedTracks(tracks){
    console.log("tracks passed to server side function:");
    console.log(tracks);
    $.ajax({
        type: "POST",
        url: "createPlaylist",
        data: { 
            selectedTracks: JSON.stringify(tracks),
            playlistName: $("#playlistName").val()
        },
        success: function(result) {
        },
        failure: function(){
            alert("Unable to post playlist."); // TODO: Handle error properly
        }
    });
};

/**
 * Create unordered list of results 
 * TODO: Rework this into tile layout for each track.
 * @param {Object[]} tracks 
 */
function populateResults(tracks){
    console.log(tracks);
    
    $("#resultParent").empty();

    for(index in tracks) {
        var resultParent = document.getElementById("resultParent");
        var resultChild = document.createElement("div");
        var img = document.createElement("img");
        var second = document.createElement("div");
        var text = document.createElement("p");
        var br = document.createElement("br");
        
        resultChild.className = "card";
        resultChild.id = tracks[index].uri;
        resultChild.dataTrackTime = tracks[index].duration_ms;
        img.src = tracks[index].album.images["1"].url;
        img.className = "card-img-top";
        second.className = "card-body";
        text.className = "card-text";
        resultChild.appendChild(img);
        resultChild.appendChild(second);
        second.appendChild(text);
        text.appendChild(document.createTextNode(tracks[index].artists[0].name + " - "+ tracks[index].name));
        text.appendChild(br);
        var time = convertMillisToTime(tracks[index].duration_ms);
        console.log(time);
        text.appendChild(document.createTextNode("Track Length: " + time));
        
        resultParent.appendChild(resultChild);

    }

    //create playlist array from selected cards
    
    $(".card").on('click', function () {
        console.log("card clicked!");
        $(this).toggleClass('selectedTrack');
        if(this.className != "card"){
            playlist.push(this.id);
            console.log("adding " + this.id);
            playlistDuration += this.dataTrackTime;
            console.log(convertMillisToTime(playlistDuration));
        }else{
            var index = playlist.indexOf(this.id);
            if(index > -1){
                playlist.splice(index,1);
                playlistDuration -= this.dataTrackTime;
                console.log("removing " + this.id);
                console.log(convertMillisToTime(playlistDuration));
            }
        }
        console.log("Current playlist: " + playlist);
        // getPlaylistDuration()
        updatePlaylistDuration();
    });
};
//the below function inserts time into html without jquery but needs to uncommented on line 198 to work
// function getPlaylistDuration(){
//     document.getElementById("playlistDuration").innerHTML = convertMillisToTime(playlistDuration);
//     console.log("here!!!!")
// };

function updatePlaylistDuration(){
    var total = convertMillisToTime(playlistDuration);
    $("#playlistDuration").text("  Total Playtime: "+total);
    console.log("Playlist Total updated to: "+total);
};


