// Import the express module to create an Express application
const express = require('express');

// Create an instance of an Express application
const app = express();

// Define the port number on which the server will listen
const port = 3000;

// Import the Pool object from the pg (node-postgres) module to connect to the PostgreSQL database
const { Pool } = require('pg');

// Serve static files (like HTML, CSS, and JavaScript files) from the 'public' directory
app.use(express.static('public'));

// Create a new pool (a set of connections) to the PostgreSQL database using the provided connection string
const pool = new Pool({
  connectionString: 'postgres://techup_database_z5tu_user:Dgd71BtvtoNtLcZtVmhfHWX1ubZQMwlj@dpg-cp5g1t0l5elc73e4dob0-a/techup_database_z5tu',
});

// Define a route handler for GET requests to the '/data' path
app.get('/data', (req, res) => {
  // Query the database and get all rows from the data_table where id is '1'
  pool.query("SELECT * FROM data_table WHERE id = '1'", (err, result) => {
    if (err) {
      // If there's an error executing the query, send a 500 Internal Server Error response with an error message
      res.status(500).send('Error fetching data from database');
    } else {
      // If the query is successful, send the rows fetched from the database as the response
      res.send(result.rows);
    }
  });
});

// Start the server and make it listen for connections on the specified port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});