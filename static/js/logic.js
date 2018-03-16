
//Jquery animate to execute on button click
$("#statebtn,#categorybtn").click(function(){
    $(".logo-header")
    .animate({
        opacity:.10,
        duration: '100'
    },"linear")
    .animate({
        opacity:1
    });
});

//establishing the categories for dropdown
var states = ["Alaska",
    "Alabama",
    "Arkansas",
    "Arizona",
    "California",
    "Colorado",
    "Delaware",
    "Georgia",
    "Illinois",
    "Indiana",
    "Kentucky",
    "Minnesota",
    "Montana",
    "North Carolina",
    "Nebraska",
    "Nevada",
    "New York",
    "Ohio",
    "Pennsylvania",
    "South Carolina",
    "Virginia",
    "Vermont",
    "Washington",
    "Wisconsin"];

//establishing the categories for dropdown
var categories = ["Automotive",
    "Bars & Restaurants",
    "Business & Tech Services",
    "Education",
    "Entertainment & Leisure",
    "Food & Grocery Stores",
    "Health & Wellness",
    "Misc Retail",
    "Other",
    "Service Industry"];


//Populating the State dropdown
for (var i = 0; i < states.length; i++){
    var state = states[i];
    var dropStateList = document.createElement("li");
    var anchorList = document.createElement("a");
    anchorList.setAttribute('href','#');
    anchorList.setAttribute('onclick','stateSelect(this.id)');
    anchorList.setAttribute('id',state);
    console.log(state);
    var textS = document.createTextNode(state);
    
    anchorList.appendChild(textS)
    dropStateList.appendChild(anchorList);
    document.getElementById("stateList").appendChild(dropStateList);
}

//Populating the Category dropdown
for (var i = 0; i < categories.length; i++){
    var category = categories[i];
    var dropCategoryList = document.createElement("li");
    var anchorList2 = document.createElement("a");
    anchorList2.setAttribute('href','#');
    anchorList2.setAttribute('onclick','categorySelect(this.id)');
    anchorList2.setAttribute('id',category);
    console.log(category);
    var textC = document.createTextNode(category);

    anchorList2.appendChild(textC)
    dropCategoryList.appendChild(anchorList2);
    document.getElementById("categoryList").appendChild(dropCategoryList);
}

/*
//Setting Leaflet maps
var mapbox = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ.T6YbdDixkOBWH_k9GbS8JQ'

var myMap1 = L.map('map-1',{
    center: [37.0902, -95.7129],
    zoom: 4
});


L.tileLayer(mapbox).addTo(myMap1);
*/

//Grabbing the user selection for state from dropdown
function stateSelect(clickedId){
    //printing selection to console for debugging
    console.log(clickedId);
    //setting the map title to the state selection
    document.getElementById("map-1-title").innerHTML = clickedId;

    //changing the table titles to reflect the selected state
    var x = document.getElementsByClassName("stateInsert");
    var i;
    for (i=0; i < x.length; i++){
        x[i].innerHTML = " In " + clickedId;
    }

    //setting the State Abbreviations & Lat/Lng for map layer and data retrieval
    switch(clickedId){
        case "Alaska":
            var stateAbv = "AK";
            var stateLoc = [61.370716,-152.404419];
            //passing state Abbreviation & Loc to function to set Map View
            stateRetrival(stateAbv, stateLoc);
            break
        case "Alabama":
            var stateAbv = "AL";
            var stateLoc = [32.806671,-86.791130];
            stateRetrival(stateAbv, stateLoc);
            break
        case "Arkansas":
            var stateAbv = "AR";
            var stateLoc = [34.969704,-92.373123];
            stateRetrival(stateAbv, stateLoc);
            break
        case "Arizona":
            var stateAbv = "AZ";
            var stateLoc = [33.729759,-111.431221];
            stateRetrival(stateAbv, stateLoc);
            break
        case "California":
            var stateAbv = "CA";
            var stateLoc = [36.116203,-119.681564];
            stateRetrival(stateAbv, stateLoc);
            break
        case "Colorado":
            var stateAbv = "CO";
            var stateLoc = [39.059811,-105.311104];
            stateRetrival(stateAbv, stateLoc);
            break
        case "Delaware":
            var stateAbv = "DE";
            var stateLoc = [39.318523,-75.507141];
            stateRetrival(stateAbv, stateLoc);
            break
        case "Georgia":
            var stateAbv = "GA";
            var stateLoc = [33.040619,-83.643074];
            stateRetrival(stateAbv, stateLoc);
            break
        case "Illinois":
            var stateAbv = "IL";
            var stateLoc = [40.349457,-88.986137];
            stateRetrival(stateAbv, stateLoc);
            break
        case "Indiana":
            var stateAbv = "IN";
            var stateLoc = [39.849426,-86.258278];
            stateRetrival(stateAbv, stateLoc);
            break
        case "Kentucky":
            var stateAbv = "KY";
            var stateLoc = [37.668140,-84.670067];
            stateRetrival(stateAbv, stateLoc);
            break
        case "Minnesota":
            var stateAbv = "MN";
            var stateLoc = [45.694454,-93.900192];
            stateRetrival(stateAbv, stateLoc);
            break
        case "Montana":
            var stateAbv = "MT";
            var stateLoc = [46.921925,-110.454353];
            stateRetrival(stateAbv, stateLoc);
            break
        case "North Carolina":
            var stateAbv = "NC";
            var stateLoc = [35.630066,-79.806419];
            stateRetrival(stateAbv, stateLoc);
            break
        case "Nebraska":
            var stateAbv = "NE";
            var stateLoc = [41.125370,-98.268082];
            stateRetrival(stateAbv, stateLoc);
            break
        case "Nevada":
            var stateAbv = "NV";
            var stateLoc = [38.313515,-117.055374];
            stateRetrival(stateAbv, stateLoc);
            break
        case "New York":
            var stateAbv = "NY";
            var stateLoc = [42.165726,-74.948051];
            stateRetrival(stateAbv, stateLoc);
            break
        case "Ohio":
            var stateAbv = "OH";
            var stateLoc = [40.388783,-82.764915];
            stateRetrival(stateAbv, stateLoc);
            break
        case "Pennsylvania":
            var stateAbv = "PA";
            var stateLoc = [40.590752,-77.209755];
            stateRetrival(stateAbv, stateLoc);
            break
        case "South Carolina":
            var stateAbv = "SC";
            var stateLoc = [33.856892,-80.945007];
            stateRetrival(stateAbv, stateLoc);
            break
        case "Virginia":
            var stateAbv = "VA";
            var stateLoc = [37.769337,-78.169968];
            stateRetrival(stateAbv, stateLoc);
            break
        case "Vermont":
            var stateAbv = "VT";
            var stateLoc = [44.045876,-72.710686];
            stateRetrival(stateAbv, stateLoc);
            break
        case "Washington":
            var stateAbv = "WA";
            var stateLoc = [47.400902,-121.490494];
            stateRetrival(stateAbv, stateLoc);
            break
        case "Wisconsin":
            var stateAbv = "WI";
            var stateLoc = [44.268543,-89.616508];
            stateRetrival(stateAbv, stateLoc);
            break
            
        }
        
    };

//Function is used to retrieve the state data from Database
//and to set the center on the map based upon user selection
function stateRetrival(stateAbv, stateLoc){
        console.log(stateAbv,stateLoc[0],stateLoc[1]);
        myMap1.flyTo([stateLoc[0],stateLoc[1]],7);
        
        
        //Call function to alter tables
        cityTablePop(stateAbv);

        
};

//Function to populate the tables with data
function cityTablePop(stateAbv){
        //write query to populate tables
        //Each table has an ID assigned

};


//Grabbing the user selection for category
function categorySelect(clickedId){
    console.log(clickedId);
    document.getElementById("map-1-title").innerHTML = clickedId;
    myMap1.flyTo([37.0902, -95.7129],4.5);
};