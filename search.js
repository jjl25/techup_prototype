// Function to perform an address search using OneMap's API
function addressSearch(searchVal, returnGeom, getAddrDetails, pageNum) {
  // Initialize a new XMLHttpRequest object
  const xhr = new XMLHttpRequest();

  // Configure the GET request with the search parameters
  xhr.open("GET", `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(searchVal)}&returnGeom=${returnGeom}&getAddrDetails=${getAddrDetails}&pageNum=${pageNum}`, true);

  // Set the expected response format to JSON
  xhr.responseType = 'json';

  // Define the onload event handler
  xhr.onload = function() {
    // Check if the request was successful
    if (xhr.status === 200) {
      // Update the dropdown with the search results
      updateDropdown(xhr.response.results);
    } else {
      // Log any errors from the search
      console.error('Search failed:', xhr.statusText);
    }
  };

  // Define the onerror event handler
  xhr.onerror = function() {
    // Log the request failure
    console.error('Request failed');
  };

  // Send the configured request
  xhr.send();
}

// Initialize the myLocation variable to store selected coordinates
var myLocation = [];

// Function to update the dropdown list with search results
function updateDropdown(results) {
  // Get the search results container element
  var searchResults = document.getElementById('search-results');
  // Clear any previous search results
  searchResults.innerHTML = '';

  // Iterate over each result item
  results.forEach(function(item) {
    // Create a new div element for the result item
    var div = document.createElement('div');
    // Set the text content to the address
    div.textContent = item.ADDRESS;
    // Assign a class for styling
    div.className = 'result-item';
    // Define the onclick event handler for the result item
    div.onclick = function() {
      // Update myLocation with the selected coordinates
      myLocation = [item.LATITUDE, item.LONGITUDE];
      // Log the selected location coordinates to the console
      console.log('Lat1, Lon1: ' + myLocation);

      // Display the selected coordinates on the webpage
      // document.getElementById('latitude').textContent = 'Latitude: ' + item.LATITUDE;
      // document.getElementById('longitude').textContent = 'Longitude: ' + item.LONGITUDE;

      // Update the search input with the selected address
      document.getElementById('search-input').value = item.ADDRESS;
      // Hide the dropdown after selection
      searchResults.style.display = 'none';
    };
    // Append the result item to the search results container
    searchResults.appendChild(div);
  });
}

// Function to handle search input changes and initiate a search
function performSearch() {
  // Retrieve the value from the search input field
  var searchInput = document.getElementById('search-input').value;
  // Perform the address search with the input value
  addressSearch(searchInput, 'Y', 'Y', 1);
  // Display the search results dropdown
  document.getElementById('search-results').style.display = 'block';
}

// Add an event listener to handle changes to the search input
document.getElementById('search-input').addEventListener('input', performSearch);

// -----

// Array of hospital locations
var hospitals = [
    {name: "Singapore General Hospital", location: [1.2783872348331307, 103.83413697237597]},
    {name: "Changi General Hospital", location: [1.3402507222916804, 103.94957278340561]},
    {name: "Sengkang General Hospital", location: [1.3958986576429515, 103.89394476726933]},
    {name: "Khoo Teck Puat Hospital", location: [1.4243504773028133, 103.83858952387206]},
    {name: "Tan Tock Seng Hospital", location: [1.321316768983475, 103.8463984667227]},
    {name: "National University Hospital", location: [1.2951804107887588, 103.78293825874638]},
    {name: "Ng Teng Fong General Hospital", location: [1.3335141468299205, 103.74597459082267]}
];

// Iterate over hospitals and calculate distance
for (var i = 0; i < hospitals.length; i++) {
    var hospital = hospitals[i];
    var distance = calculateDistance(myLocation, hospital.location[0], hospital.location[1]);
    console.log(hospital.name + ": " + distance + " km");
}