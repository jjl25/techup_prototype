// Initialize myLocation variable to store selected coordinates
var myLocation = [];

// Array of hospital data
var hospitals = [
        
        {name: "Alexandra Hospital Urgent Care Centre (AH UCC)", location: [1.2870473851672064, 103.80169283762326], calculated_distance: null, wait_time_doc: null, no_of_patients: null, wait_time_ward: "up to 2.2 hrs", url: "https://www.ah.com.sg/Pages/OurServices/Urgent-Care-Centre.aspx", paediatric: null},
        {name: "Changi General Hospital (CGH)", location: [1.3402507222916804, 103.94957278340561], calculated_distance: null, wait_time_doc: null, no_of_patients: null, wait_time_ward: "up to 29 hrs", url: "https://www.cgh.com.sg/patient-care/your-clinic-visit/visiting-the-emergency-department", paediatric: null},
        {name: "KK Women's and Children's Hospital (KKH)", location: [1.3106824308350944, 103.8468155281571], calculated_distance: null, wait_time_doc: null, no_of_patients: null, wait_time_ward: "(data not available)", url: "https://www.kkh.com.sg/patient-care/areas-of-care/childrens-services/Pages/children-emergency.aspx", paediatric: "Children's Emergency available"},
        {name: "Khoo Teck Puat Hospital (KTPH)", location: [1.4243504773028133, 103.83858952387206], calculated_distance: null, wait_time_doc: null, no_of_patients: null, wait_time_ward: "up to 23 hrs", url: "https://www.ktph.com.sg/i-want-to/visit-A-and-E", paediatric: "Does not have paediatric facilities. Young patients will be stabilised and transferred to KKH."},
        {name: "National University Hospital (NUH)", location: [1.2951804107887588, 103.78293825874638], calculated_distance: null, wait_time_doc: null, no_of_patients: null, wait_time_ward: "up to 7.1 hrs", url: "https://www.nuh.com.sg/our-services/Specialties/Emergency-Medicine/Pages/Visit-Emergency-Department.aspx", paediatric: "Children's Emergency available"},
        {name: "Ng Teng Fong General Hospital (NTFGH)", location: [1.3335141468299205, 103.74597459082267], calculated_distance: null, wait_time_doc: null, no_of_patients: null, wait_time_ward: "up to 5.8 hrs", url: "https://www.ntfgh.com.sg/for-patients-and-visitors/Pages/Visit-Emergency-Department.aspx", paediatric: "Does not have paediatric facilities. Young patients will be stabilised and transferred to NUH."},
        {name: "Sengkang General Hospital (SKH)", location: [1.3958986576429515, 103.89394476726933], calculated_distance: null, wait_time_doc: null, no_of_patients: null, wait_time_ward: "up to 18.7 hrs", url: "https://www.skh.com.sg/patient-care/when-do-i-visit-the-ed", paediatric: "Does not have paediatric facilities. Young patients will be stabilised and transferred to KKH."},
        {name: "Singapore General Hospital (SGH)", location: [1.2783872348331307, 103.83413697237597], calculated_distance: null, wait_time_doc: null, no_of_patients: null, wait_time_ward: "up to 12.6 hrs", url: "https://www.sgh.com.sg/patient-care/visiting-specialist/emergency-care-singapore-general-hospital?fireglass_rsn=true", paediatric: "Does not have paediatric facilities. Young patients will be stabilised and transferred to KKH."},
        {name: "Tan Tock Seng Hospital (TTSH)", location: [1.321316768983475, 103.8463984667227], calculated_distance: null, wait_time_doc: null, no_of_patients: null, wait_time_ward: "up to 9.7 hrs", url: "https://www.ttsh.com.sg/Patients-and-Visitors/Medical-Services/Emergency/Pages/Emergency%20Medicine.aspx", paediatric: null},
        {name: "Woodlands Health (WH)", location: [1.4256883456702252, 103.79493011026004], calculated_distance: null, wait_time_doc: null, no_of_patients: null, wait_time_ward: "(data not available)", url: "https://www.wh.com.sg/for-patients-visitors/your-emergency-visit", paediatric: null}

];

// Function to render cards
function renderCards() {
    var container = document.getElementById('hospitals-container');
    container.innerHTML = ''; // Clear the container
    hospitals.forEach(function(hospital) {
        var card = document.createElement('div');
        card.className = 'card';
        var distanceDisplay = hospital.calculated_distance ? hospital.calculated_distance + ' km away' : 'Please enter location';
        var waitTimeDocDisplay = hospital.wait_time_doc ? '<p><i class="fa-regular fa-hourglass-half"></i> <strong>' + hospital.wait_time_doc + '</strong> wait time to see doctor</p>' : '';
        var noOfPatientsDisplay = hospital.no_of_patients ? '<p><i class="fa-solid fa-user-group"></i> <strong>' + hospital.no_of_patients + ' patient(s)</strong> in queue</p>' : '';
        var waitTimeWardDisplay = hospital.wait_time_ward ? hospital.wait_time_ward : 'data not available';     
        var urlDisplay = hospital.url ? '<a href="' + hospital.url + '" target="_blank">Go to website</a>' : 'Link not available';
        var paediatricDisplay = hospital.paediatric ? '<p><i class="fa-solid fa-baby-carriage"></i> ' + hospital.paediatric + '</p>' : '';
        card.innerHTML = '<h3>' + hospital.name + '</h3>' +
                         '<p><i class="fa-solid fa-location-dot"></i> <strong>' + distanceDisplay + '</strong></p>' +
                         noOfPatientsDisplay +
                         waitTimeDocDisplay +
                         '<p><i class="fa-regular fa-hourglass-half"></i> Median ward admission wait time* is <strong>' + waitTimeWardDisplay + '</strong></p>' +
                         paediatricDisplay +
                         '<p><i class="fa-solid fa-up-right-from-square"></i> ' + urlDisplay + '</p>';
        container.appendChild(card);
    });
}

// Function to get data from the server
async function getDataFromServer() {

  await fetch('/data') // Makes a network request to the server for the resource at '/data'
    .then(response => { // Receives the response
      if (!response.ok) { // Checks if the response status is not successful
        throw new Error('Network response was not ok'); // Throws an error if the response is not ok
      }
      return response.json(); // Parses the response body as JSON
    })
    .then(data => {
      // Assign data[0] to wait_time_doc and no_of_patients variables
      var waitTimeDoc_KTPH = data[0].x1;
      var noOfPatients_KTPH = data[0].x2;
      var waitTimeDoc_TTSH = data[0].y1;
      var noOfPatients_TTSH = data[0].y2;
      var waitTimeDoc_WH = data[0].z1;
      var noOfPatients_WH = data[0].z2;
      var timestampGetData = data[0].timestamp;
      // console.log('KTPH Waiting time to see doctor: ' + waitTimeDoc_KTPH + ', KTPH Total number of patients: ' + noOfPatients_KTPH + ', TTSH Waiting time to see doctor: ' + waitTimeDoc_TTSH + ', TTSH Total number of patients: ' + noOfPatients_TTSH, ', WH Waiting time to see doctor: ' + waitTimeDoc_WH + ', WH Total number of patients: ' + noOfPatients_WH + ', Timestamp: ' + timestampGetData);
      console.log('Database timestamp: ' + timestampGetData);

      // Find KTPH, TTSH, and WH in the hospitals array
      var KTPH = hospitals.find(hospital => hospital.name === "Khoo Teck Puat Hospital (KTPH)");
      var TTSH = hospitals.find(hospital => hospital.name === "Tan Tock Seng Hospital (TTSH)");
      var WH = hospitals.find(hospital => hospital.name === "Woodlands Health (WH)");

      // Update the wait_time_doc and no_of_patients for Khoo Teck Puat Hospital
      if (KTPH) {
        KTPH.wait_time_doc = waitTimeDoc_KTPH + ' mins';
        KTPH.no_of_patients = noOfPatients_KTPH;
      }
      // Update the wait_time_doc and no_of_patients for Tan Tock Seng Hospital
      if (TTSH) {
        TTSH.wait_time_doc = waitTimeDoc_TTSH + ' mins';
        TTSH.no_of_patients = noOfPatients_TTSH;
      }
      // Update the wait_time_doc and no_of_patients for Woodlands Health
      if (WH) {
        WH.wait_time_doc = waitTimeDoc_WH + ' mins';
        WH.no_of_patients = noOfPatients_WH;
      }
    })

    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error); // Catches and logs any errors that occur during the fetch operation
    });

    console.log(hospitals);

}

(async function() {

    await getDataFromServer(); // Call the function to get data when needed
    renderCards(); // Then call renderCards function to show the sorted cards

})();

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
      console.log('Latitude = ' + item.LATITUDE +', ' + 'Longitude = ' + item.LONGITUDE);

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

// Add an event listener to handle changes to the search input
// document.getElementById('search-input').addEventListener('input', performSearch);

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

// Function to update distances and sort the array
function updateDistancesAndSort() {
    hospitals.sort((a, b) => parseFloat(a.calculated_distance) - parseFloat(b.calculated_distance));
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

// Update the sort order text
var sortDiv = document.querySelector('.sort');
sortDiv.innerHTML = '<p>Hospitals are listed in alphabetical order</p>';

// Function to handle search button click and calculate distances
function onSubmit(event) {
    event.preventDefault();
    if (myLocation.length === 0) {
        alert('Please enter location'); // Alert if no location is selected
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
    sortDiv.innerHTML = '<p>Hospitals are listed by distance</p>';
}







