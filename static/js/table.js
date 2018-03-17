// Get references to the tbody element and button for loading additional results
var $tbody = document.querySelector("tbody");
var $loadMoreBtn = document.querySelector("#load-btn");

/*
//Not going to use any of the filters for now...
var $categoryInput = document.querySelector("#category");
var $cityInput = document.querySelector("#city");
var $stateInput = document.querySelector("#state");
var $ratingInput = document.querySelector("#rating");
var $reviewCountInput = document.querySelector("#reviewCount");
var $sentimentInput = document.querySelector("#sentiment");
var $searchBtn = document.querySelector("#statebtn");
*/

// Add an event listener to the $statebtn, call handleSearchButtonClick when clicked
// statebtn.addEventListener("click", handleSearchButtonClick);

// Load data using d3
Plotly.d3.json("tableJson", function(tableJson) {
  buildTable(tableJson);
});

function buildTable(data) {
  console.log("---------- TABLE CODE ----------");

  // set filteredData to the existing table
  var filteredData = data;

  // renderTable renders the filteredData to the tbody
  function renderTable() {
    $tbody.innerHTML = "";
    for (var i = 0; i < filteredData.length; i++) {
      // Get current data and its field
      var business = filteredData[i];
      var fields = Object.keys(business);

      // Create a new row in the tbody, set the index to be i + startingIndex
      var $row = $tbody.insertRow(i);
      for (var j = 0; j < fields.length; j++) {
        // For every field in the object, create a new cell and set its inner text to be the current value at the current object's field
        var field = fields[j];
        var $cell = $row.insertCell(j);
        $cell.innerText = business[field];
      }
    }
  }

  /* Might come back to adding a search button, or rather, tying that in to the map selection button...
    function handleSearchButtonClick() {
    var filterState = stateAbv
  }
  */

  // Set a startingIndex and resultsPerPage variable
  var startingIndex = 0;
  var resultsPerPage = 20;

  function renderTableSection() {
    // Set the value of endingIndex to startingIndex + resultsPerPage
    var endingIndex = startingIndex + resultsPerPage;
    // Get a section of the data array to render
    var dataSubset = data.slice(startingIndex, endingIndex);
    for (var i = 0; i < dataSubset.length; i++) {
      // Get the current business object and its fields
      var business = dataSubset[i];
      var fields = Object.keys(business);
      // Create a new row in the tbody, set the index to be i + startingIndex
      var $row = $tbody.insertRow(i + startingIndex);
      for (var j = 0; j < fields.length; j++) {
        // For every field in the business object, create a new cell and set its inner text to be the current value at the current business's field
        var field = fields[j];
        var $cell = $row.insertCell(j);
        $cell.innerText = business[field];
      }
    }
  }

  // Add an event listener to the button, call handleButtonClick when clicked
  $loadMoreBtn.addEventListener("click", handleButtonClick);

  function handleButtonClick() {
    // Increase startingIndex by 100 and render the next section of the table
    startingIndex += resultsPerPage;
    renderTableSection();
    // Check to see if there are any more results to render
    if (startingIndex + resultsPerPage >= data.length) {
      $loadMoreBtn.classList.add("disabled");
      $loadMoreBtn.innerText = "All Data Loaded";
      $loadMoreBtn.removeEventListener("click", handleButtonClick);
    }
  }

  // Render the table for the first time on page load
  renderTableSection();

};

/*
function handleSearchButtonClick() {
  // Format the user's search by removing leading and trailing whitespace, lowercase the string
  var filterCategory = $categoryInput.value.trim().toLowerCase();
  var filterCity = $cityInput.value.trim().toLowerCase();
  var filterState = $stateInput.value.trim().toLowerCase();
  var filterRating = $ratingInput.value.trim().toLowerCase();
  var filterReviewCount = $reviewCountInput.value.trim().toLowerCase();
  var filterSentiment = $sentimentInput.value.trim().toLowerCase();

  // Set filteredData to an array of all businesss who's field value matches the filter
  filteredData = data.filter(function(business) {
    var businessCategory = business.category.substring(0, filterCategory.length).toLowerCase();
    var businessCity = business.city.substring(0, filterCity.length).toLowerCase();    
    var businessState = business.state.substring(0, filterState.length).toLowerCase();
    var businessRating = business.rating.substring(0, filterRating.length).toLowerCase();
    var businessReviewCount = business.reviewCount.substring(0, filterReviewCount.length).toLowerCase();
    var businessSentiment = business.sentiment.substring(0,filterSentiment.length).toLowerCase();

    if (businessCategory === filterCategory && businessCity === filterCity && businessState === filterState && businessRating >= filterRating && businessReviewCount >= filterReviewCount && businessSentiment >= filterSentiment) {
      return true;
    }
    return false;
  });
  renderTable();
}

*/