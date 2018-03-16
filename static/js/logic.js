
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

// Create Map ///////////////////////////////////////////////

Plotly.d3.json("/geoJson", function(data) {
    myMap1 = buildMap(data);    
});

////////////////////////////////////////////////////////////

// Style Functions ////////////////////////////////////////

function styleInfo(data){
    return {
        fillOpacity: 0.5,
        color: getColor(data.properties.Stars),
        radius: getRadius(data.properties.Review_Count),
        stroke: true,
        weight: 0.25
    };
};

function getColor(Stars) {
    if (Stars <= 1) {
        return "rgb(255, 255, 255)"; // White
    } else if (Stars <= 2) {
        return "rgb(255, 240, 183)";
    } else if (Stars <= 3) {
        return "rgb(255, 220, 122)";
    } else if (Stars <= 4) {
        return "rgb(255, 200, 61)";
    } else if (Stars > 4) {
        return "rgb(255, 200, 0)"; // Gold
    } else {
        return "rgb(0, 0, 0)"; // Black, if error
    }
};

function getRadius(Review_Count) {
    if (Review_Count <= 10) {
        return 5; 
    } else if (Review_Count <= 25) {
        return 10;
    } else if (Review_Count <= 100) {
        return 15;
    } else if (Review_Count > 100) {
        return 20;
    } else {
        return 0; // in case there is an error
    }
};

///////////////////////////////////////////////////////////

// Function to build map //////////////////////////////////

function buildMap(data) {
    console.log(data[1]);
    console.log(data[1].geometry.coord);
    console.log(data[1].properties.Name);
    console.log(data[1].properties.Stars);
    console.log(data[1].properties.address);

    // Create Markers for each business ////////////////////

    var yelpMarkers = [];

    // Loop through locations and create yelp markers
    for (var i = 0; i < data.length; i++) {
        yelpMarkers.push(
        L.circleMarker(data[i].geometry.coord, {
            stroke: true,
            weight: 1,
            fillOpacity: 0.75,
            color: "rgb(0, 0, 0)",
            fillColor: getColor(data[i].properties.Stars),
            radius: getRadius(data[i].properties.Review_Count)
            })
            .bindPopup("<h3>" + data[i].properties.Name + "</h3> <p> City: " + data[i].properties.address.City + "</p> <hr> <p> Category: " + data[i].properties.Bucket + "</p>\
                <p> Rating: " + data[i].properties.Stars + "</p>\
                    <p># Reviews: " + data[i].properties.Review_Count + "</p>"))
    }

    console.log("Yelp Markers: ")
    console.log(yelpMarkers); //looks like it works...
    console.log("-------------------------")

    // Map Layers ///////////////////////////////////////////

    // Access Token
    var token = "access_token=pk.eyJ1IjoiY2pnYXJnYW5vIiwiYSI6ImNqZTZod2NqazAwaXIyeGxnZXlqYTFkaTMifQ.-LYkZQludov5zH6v7oy-Ww";

    // Outdoor Map
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" + token, 
    {id: 'map'});

    // Satellite Map
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" + token,
    {id: 'map'});

    // Light (aka greyscale) Map
    var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" + token,
    {id: 'map'});

    // Create layer group for yelp data
    var yelp = L.layerGroup(yelpMarkers);
    console.log("Yelp Layer: ");
    console.log(yelp);
    console.log("-------------------------")

    // Create layer group for sentiment coropleth
    // choroYelp();         

    // Create baseMaps object
    var baseMaps = {
        "Outdoors": outdoors,
        "Satellite": satellite,
        "Grayscale": grayscale
    };

    // Create overlay object
    var overlayMaps = {
        "Yelp Data": yelp/*,
        "Sentiment Data": sentiment*/
    };
    console.log("overlayMaps: ");
    console.log(overlayMaps);
    console.log("-------------------------")            


    /////////////////////////////////////////////////////////

    // Create map object
    var myMap1 = L.map("map-1", {
        center: [37.0902, -95.7129],
        zoom: 4,
        layers: [outdoors, yelp]
    });

    // Add Control Layers
    L.control.layers(baseMaps, overlayMaps, { 
        collapsed: false }).addTo(myMap1);

    // Add legend for the circle colors
    var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function (myMap1) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [1, 2, 3, 4, 5],
            labels = [];

        var legendInfo = "<h3>Rating</h3>"
        div.innerHTML = legendInfo;

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i]-0.1) + '"></i> ' + "< " + grades[i] + '<br>';
        }   
        return div;
    };

    legend.addTo(myMap1);

    // Toggle mouse wheel zoom on click
    myMap1.scrollWheelZoom.disable();

    myMap1.on('click', function() {
      if (myMap1.scrollWheelZoom.enabled()) {
        myMap1.scrollWheelZoom.disable();
        }
        else {
        myMap1.scrollWheelZoom.enable();
        }
      });

    /////////////////////////////////////////////////////////

    return myMap1;

};

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