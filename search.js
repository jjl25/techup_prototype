// Initialize myLocation variable to store selected coordinates

var myLocation = [];

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
      // Print response on console
      console.log(item);
      console.log('Latitude: ' + item.LATITUDE +', ' + 'Longitude: ' + item.LONGITUDE);

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
// document.getElementById('search-input').addEventListener('input', performSearch);

// Function to handle search button click and calculate distances

function onSubmit(event) {
    event.preventDefault();
    if (myLocation.length === 0) {
        alert('Please select a location first.'); // Alert if no location is selected
        return;
    }
    var lat = parseFloat(myLocation[0]);
    var lon = parseFloat(myLocation[1]);
    hospitals.forEach(function(hospital) {
        var distance = calculateDistance(lat, lon, hospital.location[0], hospital.location[1]);
        hospital.calculated_distance = distance; // Store distance in the hospital object
    });
    updateDistancesAndSort(); // Sort hospitals by distance
    renderCards(); // Render the hospital cards
}

// Function to calculate distance between two coordinates

function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var distance = R * c; // Distance in km
    return distance.toFixed(2); // Fix the distance to 2 decimal places
}

// Function to convert degrees to radians

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

// Array of hospital locations

var hospitals = [
        
        {name: "Changi General Hospital", location: [1.3402507222916804, 103.94957278340561], calculated_distance: null, wait_time_doc: "Data not available", no_of_patients: "Data not Available", wait_time_atw: "3.9 to 29 hrs"},
        {name: "Khoo Teck Puat Hospital", location: [1.4243504773028133, 103.83858952387206], calculated_distance: null, wait_time_doc: "In development", no_of_patients: "In development", wait_time_atw: "3.9 to 23 hrs"},
        {name: "National University Hospital", location: [1.2951804107887588, 103.78293825874638], calculated_distance: null, wait_time_doc: "Data not available", no_of_patients: "Data not Available", wait_time_atw: "3.9 to 7.1 hrs"},
        {name: "Ng Teng Fong General Hospital", location: [1.3335141468299205, 103.74597459082267], calculated_distance: null, wait_time_doc: "Data not available", no_of_patients: "Data not Available", wait_time_atw: "1.7 to 5.8 hrs"},
        {name: "Sengkang General Hospital", location: [1.3958986576429515, 103.89394476726933], calculated_distance: null, wait_time_doc: "Data not available", no_of_patients: "Data not Available", wait_time_atw: "4.1 to 18.7 hrs"},
        {name: "Singapore General Hospital", location: [1.2783872348331307, 103.83413697237597], calculated_distance: null, wait_time_doc: "Data not available", no_of_patients: "Data not Available", wait_time_atw: "4.2 to 12.6 hrs"},
        {name: "Tan Tock Seng Hospital", location: [1.321316768983475, 103.8463984667227], calculated_distance: null, wait_time_doc: "In development", no_of_patients: "In development", wait_time_atw: "4.6 to 9.7 hrs"}

];

// Function to update distances and sort the array
function updateDistancesAndSort() {
    hospitals.sort((a, b) => parseFloat(a.calculated_distance) - parseFloat(b.calculated_distance));
}

// Function to render cards

function renderCards() {
    var container = document.getElementById('hospitals-container');
    container.innerHTML = ''; // Clear the container
    hospitals.forEach(function(hospital) {
        var card = document.createElement('div');
        card.className = 'card';
        var distanceDisplay = hospital.calculated_distance ? hospital.calculated_distance + ' km' : 'Please enter location';
        var waitTimeDocDisplay = hospital.wait_time_doc ? hospital.wait_time_doc : 'Wait time data not available';
        var noOfPatientsDisplay = hospital.no_of_patients ? hospital.no_of_patients : 'Number of patients data not available';
        var waitTimeAtwDisplay = hospital.wait_time_atw ? hospital.wait_time_atw : 'Average wait time data not available';
        card.innerHTML = '<h3>' + hospital.name + '</h3>' +
                         '<p><strong>Distance:</strong> ' + distanceDisplay + '</p>' +
                         '<p><strong>Waiting time to see doctor:</strong> ' + waitTimeDocDisplay + '</p>' +
                         '<p><strong>Total number of patients:</strong> ' + noOfPatientsDisplay + '</p>' +
                         '<p><strong>Median waiting time for admission to ward:</strong> ' + waitTimeAtwDisplay + '</p>';
        container.appendChild(card);
    });
}

// Function to extract the minimum wait time from the wait_time_atw string

function getMinWaitTime(waitTimeStr) {
    var times = waitTimeStr.split(' to ');
    return parseFloat(times[0]);
}

// Function to sort the array by minimum wait time for admission

function waitTimeSort() {
    hospitals.sort((a, b) => getMinWaitTime(a.wait_time_atw) - getMinWaitTime(b.wait_time_atw));
}

// Call waitTimeSort function to sort the hospitals by wait time for admission when the page loads
waitTimeSort();

// Then call renderCards function to show the sorted cards
renderCards();