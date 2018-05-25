console.log("Connected and working");


//Setup event listener for Seach button
$(document).ready(function() {
    $("#btnSearch").click(getRecommendations); 
});


//collect input from text fields and retrieve recommendations from SpotifyAPI
//With jQuery $("#genre").val(); is the same as document.getElementById("genre").value;
function getRecommendations(){

    var bpmRequested = $("#bpmRequested").val();
    var genre = $("#genre").val();

    console.log(bpmRequested);
    console.log(genre);

    $.ajax({
        type: "GET",
        url: "Recommendations",
        data: {
          genre: genre,
          bpmRequested: bpmRequested
        },
        success: function(result) {
            console.log(result.body.tracks[0].artists[0].name)
          $("#results").html("<strong>Track 1 Artist: </strong>" + result.body.tracks[0].artists[0].name + "<strong>Track 1 Album: </strong>" + result.body.tracks[0].album.name);
        },
        failure: function(){
            alert("Unable to retrieve tracks. Please refresh page and try again!");
        }
    });

};