// Initialize myLocation variable to store selected coordinates
var myLocation = [];

// Array of hospital data
var hospitals = [
        
        {name: "Alexandra Hospital Urgent Care Centre (UCC)", location: [1.2870473851672064, 103.80169283762326], calculated_distance: null, wait_time_doc: null, no_of_patients: null, wait_time_ward: "1.1 to 2.2 hrs", link: "https://www.ah.com.sg/Pages/OurServices/Urgent-Care-Centre.aspx"},
        {name: "Changi General Hospital", location: [1.3402507222916804, 103.94957278340561], calculated_distance: null, wait_time_doc: null, no_of_patients: null, wait_time_ward: "3.9 to 29 hrs", link: "https://www.cgh.com.sg/patient-care/your-clinic-visit/visiting-the-emergency-department"},
        {name: "KK Women's and Children's Hospital", location: [1.3106824308350944, 103.8468155281571], calculated_distance: null, wait_time_doc: null, no_of_patients: null, wait_time_ward: "Data not available", link: "https://www.kkh.com.sg/patient-care/areas-of-care/childrens-services/Pages/children-emergency.aspx"},
        {name: "Khoo Teck Puat Hospital", location: [1.4243504773028133, 103.83858952387206], calculated_distance: null, wait_time_doc: null, no_of_patients: null, wait_time_ward: "3.9 to 23 hrs", link: "https://www.ktph.com.sg/i-want-to/visit-A-and-E"},
        {name: "National University Hospital", location: [1.2951804107887588, 103.78293825874638], calculated_distance: null, wait_time_doc: null, no_of_patients: null, wait_time_ward: "3.9 to 7.1 hrs", link: "https://www.nuh.com.sg/our-services/Specialties/Emergency-Medicine/Pages/Visit-Emergency-Department.aspx"},
        {name: "Ng Teng Fong General Hospital", location: [1.3335141468299205, 103.74597459082267], calculated_distance: null, wait_time_doc: null, no_of_patients: null, wait_time_ward: "1.7 to 5.8 hrs", link: "https://www.ntfgh.com.sg/for-patients-and-visitors/Pages/Visit-Emergency-Department.aspx"},
        {name: "Sengkang General Hospital", location: [1.3958986576429515, 103.89394476726933], calculated_distance: null, wait_time_doc: null, no_of_patients: null, wait_time_ward: "4.1 to 18.7 hrs", link: "https://www.skh.com.sg/patient-care/specialties-services/emergency-medicine"},
        {name: "Singapore General Hospital", location: [1.2783872348331307, 103.83413697237597], calculated_distance: null, wait_time_doc: null, no_of_patients: null, wait_time_ward: "4.2 to 12.6 hrs", link: "https://www.sgh.com.sg/patient-care/visiting-specialist/emergency-care-singapore-general-hospital?fireglass_rsn=true"},
        {name: "Tan Tock Seng Hospital", location: [1.321316768983475, 103.8463984667227], calculated_distance: null, wait_time_doc: null, no_of_patients: null, wait_time_ward: "4.6 to 9.7 hrs", link: "https://www.ttsh.com.sg/Patients-and-Visitors/Medical-Services/Emergency/Pages/Emergency%20Medicine.aspx"},
        {name: "Woodlands Health", location: [1.4256883456702252, 103.79493011026004], calculated_distance: null, wait_time_doc: null, no_of_patients: null, wait_time_ward: "Data not available", link: "https://www.wh.com.sg/for-patients-visitors/your-emergency-visit"}

];

// Function to render cards
function renderCards() {
    var container = document.getElementById('hospitals-container');
    container.innerHTML = ''; // Clear the container
    hospitals.forEach(function(hospital) {
        var card = document.createElement('div');
        card.className = 'card';
        var distanceDisplay = hospital.calculated_distance ? hospital.calculated_distance + ' km' : 'Please enter location';
        var waitTimeDocDisplay = hospital.wait_time_doc ? '<p><strong>Waiting time to see doctor:</strong> ' + hospital.wait_time_doc + '</p>' : '';
        var noOfPatientsDisplay = hospital.no_of_patients ? '<p><strong>Total number of patients:</strong> ' + hospital.no_of_patients + '</p>' : '';
        var waitTimeWardDisplay = hospital.wait_time_ward ? hospital.wait_time_ward : 'Data not available';     
        var linkDisplay = hospital.link ? '<a href="' + hospital.link + '" target="_blank">Go to website</a>' : 'Link not available';
        card.innerHTML = '<h3>' + hospital.name + '</h3>' +
                         '<p><strong>Distance:</strong> ' + distanceDisplay + '</p>' +
                         waitTimeDocDisplay +
                         noOfPatientsDisplay +
                         '<p><strong>Median waiting time for admission to ward*:</strong> ' + waitTimeWardDisplay + '</p>' +
                         '<p>' + linkDisplay + '</p>'; // Add link display
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
      console.log('KTPH Waiting time to see doctor: ' + waitTimeDoc_KTPH + ', KTPH Total number of patients: ' + noOfPatients_KTPH + ', TTSH Waiting time to see doctor: ' + waitTimeDoc_TTSH + ', TTSH Total number of patients: ' + noOfPatients_TTSH, ', WH Waiting time to see doctor: ' + waitTimeDoc_WH + ', WH Total number of patients: ' + noOfPatients_WH + ', Timestamp: ' + timestampGetData);

      // Find KTPH, TTSH, and WH in the hospitals array
      var KTPH = hospitals.find(hospital => hospital.name === "Khoo Teck Puat Hospital");
      var TTSH = hospitals.find(hospital => hospital.name === "Tan Tock Seng Hospital");
      var WH = hospitals.find(hospital => hospital.name === "Woodlands Health");

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







