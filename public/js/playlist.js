console.log("Connected and working");

/**
 * Setup event listener for Seach button
 */
$(document).ready(function() {
    var genres = getGenres();

    $("#btnSearch").click(getRecommendations); 



});

/**
 * Get avialble genres from spotify
 */
function getGenres(){
    var accessToken = $("#dontdothis").text();

    $.ajax({
        type: "GET",
        url: "genres",
        data: {
          accessToken: accessToken
        },
        success: function(result) {
            populateGenreSelection(result.body.genres);
        },
        failure: function(){
            alert("Unable to retrieve genres. Please refresh page and try again!"); // TODO: refresh access token as this is most likely the cause of error.
        }
    });

}

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
}


/**
 * Collect input from text fields and retrieve recommendations from SpotifyAPI
 * with jQuery, $("#genre").val(); is the same as document.getElementById("genre").value;
 */
function getRecommendations(){

    var accessToken = $("#dontdothis").text(),
        bpmRequested = $("#bpmRequested").val(),
        genre = $("#genres").val();

    console.log(bpmRequested);
    console.log(genre);

    $.ajax({
        type: "GET",
        url: "recommendations",
        data: {
          accessToken: accessToken,
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
 * Create unordered list of results 
 * TODO: Rework this into tile layout for each track.
 * @param {*} tracks 
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
        
        resultChild.className = "card";
        img.src = tracks[index].album.images["1"].url
        img.className = "card-img-top";
        second.className = "card-body";
        text.className = "card-text";
        resultChild.appendChild(img);
        resultChild.appendChild(second);
        second.appendChild(text);
        text.appendChild(document.createTextNode(tracks[index].artists[0].name + " - "+ tracks[index].name + ""));
        resultParent.appendChild(resultChild);

    }
    var playlist = [];
    $(".card").on('click', function () {
        console.log("card clicked!");
        $(this).toggleClass('selectedTrack');
        if(this.className != "card"){
            playlist.push(this);
            console.log("adding" + this)
        }else{
            var index = playlist.indexOf(this);
            if(index > -1){
                playlist.splice(index,1);
                console.log("removing" + this)
            }
        }
        console.log(playlist);
    });
};
