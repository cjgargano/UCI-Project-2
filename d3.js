// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 700;

// Define the chart's margins as an object
var chartMargin = {
  top: 60,
  right: 60,
  bottom: 150,
  left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("body")
  .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)
  // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
  .append("g")
    .attr("transform", "translate(" + chartMargin.right + ", " + chartMargin.top + ")");
    

// Configure a band scale, with a range between 0 and the chartWidth and a padding of 0.1 (10%)
var xBandScale = d3.scaleBand().range([0, chartWidth]).padding(0.1);

// Create a linear scale, with a range between the chartHeight and 0.
var yLinearScale = d3.scaleLinear().range([chartHeight, 0]);

// Load data from yelp_business_cleaned.csv.csv
d3.csv("yelp_cleaned.csv", function(error, yelp) {

  // Throw an error if one exists
  if (error) throw error;

  // Print the yelp
  console.log(yelp);

  // Cast the review_count value to a number for each piece of yelp
  yelp.forEach(function(data) {
    data.review_count = +data.review_count;
  });

  // Set the domain of the band scale to the names of students in review_count-of-tv-watched.csv
  xBandScale.domain(yelp.map(function(data) {
    return data.bucket;
  }));

  // Set the domain of the linear scale to 0 and the largest number of review_count watched in yelp
  yLinearScale.domain([0, d3.max(yelp, function(data) {
    return data.review_count;
  })]);

  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xBandScale);
  var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

  // Create one SVG rectangle per piece of yelp
  // Use the linear and band scales to position each rectangle within the chart
  svg
    .selectAll(".bar")
    .data(yelp)
    .enter()
    .append("rect")
        .attr("class", "bar")
        .attr("x", function(data) {
            return xBandScale(data.bucket);
        })
        .attr("y", function(data) {
            return yLinearScale(data.review_count);
        })
        .attr("width", xBandScale.bandwidth())
        .attr("height", function(data) {
            return chartHeight - yLinearScale(data.review_count);
        });

  // Append two SVG group elements to the SVG area, create the bottom and left axes inside of them
  svg.append("g").call(leftAxis);
  svg.append("g")
    .attr("transform", "translate(0, " + chartHeight + ")")
    .call(bottomAxis)
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)" );
  svg.append("text")
    .attr("x", (chartWidth)/2)             
    .attr("y", -20)
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "bold")  
    .text("Yelp Reviews Per Category");
      
});