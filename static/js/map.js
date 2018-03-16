		// Get Data ///////////////////////////////////////////////
		
		Plotly.d3.json("/geoJson", function(data) {
			//return data;
			buildMap(data);
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

		}	;
		
		///////////////////////////////////////////////////////////

		
		// Choropleth for Sentiment Analysis //////////////////////

/*		function choroYelp() {

			// Get data for choropleth map...
			Plotly.d3.json("/geoJsonBoundary", function(choroData) { 
				choroLayer(data);
			});

			// Creating a new choropleth layer
			geojson = L.choropleth(choroData, {
				valueProperty: "Average_Sentiment",
				scale: ["rgb(220,0,0)", "rgb(0,220,0)"],
				steps: 10,
				mode: "q",
				style: {
					// Border color
					color: "rgb(255, 255, 255)", // White
					weight: 1,
					fillOpacity: 0.33
				} /*,
				// Binding a pop-up to each layer
				onEachFeature: function(feature, layer) {
					layer.bindPopup(feature.properties.address.state + "<br>Average Sentiment: " + feature.properties.Sentiment);
				} */
/*			}).addTo(myMap1);

			// Setting up the legend
			var choroLegend = L.control({position: "bottomright"});
			choroLegend.onAdd = function() {
				var div = L.DomUtil.create("div", "info legend");
				var limits = geojson.options.limits;
				// var limits = [-1, 1];
				var colors = geojson.options.colors;
				var labels =[];
			
			    // Add min & max
			    var legendInfo = "<h1>Average Sentiment</h1>" +
			      "<div class=\"labels\">" +
			        "<div class=\"min\">" + limits[0] + "</div>" +
			        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
			      "</div>";

			    div.innerHTML = legendInfo;

			    limits.forEach(function(limit, index) {
			      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
			    });

			    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
			    return div;
			};

		  	// Adding legend to the map
		  	choroLegend.addTo(myMap);
			
		}

		/////////////////////////////////////////////////////////
*/