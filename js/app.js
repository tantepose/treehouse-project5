/*****************************************
Treehouse Fullstack Javascript Techdegree,
project #5: "Employee Directory v1"
by Ole Petter Baugerød Stokke
www.olepetterstokke.no/treehouse/project5
*****************************************/

/*
Plugins used:
    * Fancybox3 - for lightboxes
        http://fancyapps.com/fancybox/3/
    * jquery-dateFormat - for displaying readable birthdays
        https://github.com/phstc/jquery-dateFormat

Features, as instructed for the "exceeds" rating:
    * Emloyees gathered from the randomUser API
    * Constructing a responsive grid of them, using my own flexbox CSS
    * Displaying them, including additional details, in a lightbox when clicked
    * Searching for employees by name or username
    * Navigating employees in lightbox by pressing left/right on keyboard (on desktop)
*/

/////////////////////////////
//declaring the variables //
///////////////////////////

var fancyIndex = 0;                                 //for navigating the lightbox
var randomUserAPI = "https://randomuser.me/api/";   //the randomUser API URL
var randomUserOptions = {                           //the randomUser options
    results: 12,            //Get 12 profiles...
    nat: 'DK',              //from Denmark...
    dataType: 'json'        //in JSON format.
};

//////////////////////
//the JSON request //
////////////////////

//callback function for constructing the HTML, when all users are gathered from the API
function displayRandomUser (randomUser) {

    var outputHTML = "";
    
    // loop thru all profiles, adding them to the grid one by one
    $.each(randomUser.results, function (i, user) {
        outputHTML += 
            "<div class='grid-item'>" +
                
                "<div class='profile-image'>" +
                    "<img src='" + user.picture.large + "'>" + 
                "</div>" +    

                "<div class='profile-info'>" + 
                    "<h1 class='capitalize name'>" + user.name.first + " " + user.name.last + "</h1>" +
                    "<h2>" + user.email + "</h2>" +
                    "<h2 class='capitalize'>" + user.location.city + "</h2>" + 
                "</div>" +
                
                "<div class='hidden'>" +
                    "<hr>" +
                    "<h2>" + user.cell + "</h2>" + 
                    "<h2 class='capitalize'>" + user.location.street + ", " + user.location.postcode + " " + user.location.city + ", " + user.location.state + "</h2>" +
                    "<h2 class='username'>Username: " + user.login.username + "</h2>" +
                    "<h2>Birthday: " + $.format.date(user.dob,"d/M/yyyy") + "</h2>" + //using the dateformat-plugin
                "</div>" +
            
            "</div>";
    });   
    $(".grid-container").html(outputHTML); //output the HTML to the empty container
}

//sending the JSON-request
$.getJSON(randomUserAPI, randomUserOptions, displayRandomUser);

////////////////////////////////////////////
//displaying and navigating the lightbox //
//////////////////////////////////////////

//function for opening fancybox lightbox with desired employee, from it's index in the grid
function openFancy () {
    $.fancybox.close(true); //close open lightbox, if any
    var fancyItem = $(".grid-item")[fancyIndex]; //select the requested item to show in lightbox
    $.fancybox.open("<div class='lightbox'>" + $(fancyItem).html() + "</div>"); //open lightbox, construct HTML to show
}

//open lightbox when clicking a grid item
$(document).on("click", ".grid-item", function () {
    fancyIndex = $(".grid-item").index(this); //get the index of the clicked item
    openFancy(); //open fancybox (which will show the clicked item)
});

//left and right keypress, for navigating employees within the lightbox
$("body").keydown(function(e) {
    if (e.keyCode == 39) {                              //RIGHT key pressed
        if (fancyIndex < $(".grid-item").length-1) {    //still more items to show?
            fancyIndex++;                               //increase index of item to show by one
            openFancy();                                //open the fancybox
        } 
    }

    else if (e.keyCode == 37) {                         //LEFT key pressed
        if (fancyIndex > 0) {                           //still more items to show?
            fancyIndex--;                               //decrease index of item to show
            openFancy();                                //open the fancybox
        }
    }
});

/////////////////////////////
//searching for employees //
///////////////////////////

//search when pressing "OK" or enter (submitting the form)
$("#search-form").submit (function (e) {
    e.preventDefault(); //avoid default form submit
    $("#no-match").show(); //show the no match-message, will be hidden if any matches

    const searchTerm = $("#search-input").val().toUpperCase(); //get search term
    const allNames = $(".name"); //get all names in an array
    const allUsernames = $(".username"); //get all usernames in an array
    let name; //the name to search for
    let username; //the username to search for

    if (searchTerm != "") { //an actual search?            
        $(allNames).parent().parent().hide(); //hide all items before showing matches if any

        //loop through all users one by one
        for (i = 0; i < allNames.length; i++) { 
            name = $(allNames[i]).text().toUpperCase(); //get a searchable name
            username = $(allUsernames[i]).text().toUpperCase(); //get a searchable username

            //check if search term matches the name or username
            if (name.indexOf(searchTerm) > -1 || username.indexOf(searchTerm) > -1) { //match?
                $(allNames[i]).parent().parent().show(); //show matched item(s)
                $("#no-match").hide(); //hide no match message
            }

        } //if no match, all grid items are hidden, and no match message is visible
    } 

    else { //blank search?
        $(allNames).parent().parent().show(); //show all grid items
        $("#no-match").hide(); //hide no match-message
    }
});