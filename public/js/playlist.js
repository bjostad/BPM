console.log("Connected and working");


//Setup event listener for Seach button
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
            alert("Unable to retrieve tracks. Please refresh page and try again!");
        }
    });

}

/**
 * Add Genres to select list
 */
function populateGenreSelection(genres){
    console.log(genres);
    var selectGenres = document.getElementById("genres");
    for(index in genres) {
        selectGenres.options[selectGenres.options.length] = new Option(genres[index], genres[index]);
    }
}



//collect input from text fields and retrieve recommendations from SpotifyAPI
//With jQuery, $("#genre").val(); is the same as document.getElementById("genre").value;
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
            alert("Unable to retrieve tracks. Please refresh page and try again!");
        }
    });
};


function populateResults(tracks){
    console.log(tracks);
    
    $(resultList).empty();

    for(index in tracks) {
        var div = document.getElementById("resultList");
        var li = document.createElement("div");
        var img = document.createElement("img");
        img.src = tracks[index].album.images["2"].url

        li.className = "card";
        li.appendChild(document.createTextNode(tracks[index].artists[0].name + " - "+ tracks[index].name + ""));
        li.appendChild(img);
        div.appendChild(li);
    }
};